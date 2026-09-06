import express from "express";
import pool from "../db.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const PERIOD_TIMES = {
  1: "09:00",
  2: "09:55",
  3: "11:10",
  4: "12:05",
  5: "14:00",
  6: "15:00",
  7: "16:00"
};

function isAtLeast12HoursAway(dayName, period) {
  const now = new Date();
  const dayIndex = DAYS.indexOf(dayName);
  if (dayIndex === -1) return false;

  const targetDayOfWeek = dayIndex + 1; // Mon=1 ... Sat=6
  const currentDayOfWeek = now.getDay();

  let daysUntil = targetDayOfWeek - currentDayOfWeek;
  if (daysUntil <= 0) daysUntil += 7;

  const timeStr = PERIOD_TIMES[period] || "09:00";
  const [hours, minutes] = timeStr.split(":").map(Number);

  const classDateTime = new Date(now);
  classDateTime.setDate(now.getDate() + daysUntil);
  classDateTime.setHours(hours, minutes, 0, 0);

  const differenceInMs = classDateTime.getTime() - now.getTime();
  const twelveHoursInMs = 12 * 60 * 60 * 1000;

  return differenceInMs >= twelveHoursInMs;
}

// POST /api/substitution -> Teachers request substitution
router.post("/", authenticateToken, authorizeRoles(["teacher", "advisor"]), async (req, res) => {
  const { absentTeacherId, subject, classId, className, day, period, timeRange, reason, requestedTeacherId, candidateChain } = req.body;

  // Enforce 12-hour limit check
  if (!isAtLeast12HoursAway(day, period)) {
    return res.status(400).json({ error: "Substitution requests must be submitted at least 12 hours before the class starts." });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [reqResult] = await conn.query(
      `INSERT INTO substitution_requests (absent_teacher_id, subject, class_id, day, period, time_range, status, requested_teacher_id, reason)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
      [absentTeacherId, subject, classId, day, period, timeRange, requestedTeacherId || null, reason || null]
    );

    const requestId = reqResult.insertId;

    // Insert into candidate chain
    if (candidateChain && Array.isArray(candidateChain)) {
      const insertCandidateQuery = `INSERT INTO substitution_candidates (request_id, teacher_id, chain_order, status) VALUES (?, ?, ?, ?)`;
      for (let i = 0; i < candidateChain.length; i++) {
        await conn.query(insertCandidateQuery, [requestId, candidateChain[i], i + 1, i === 0 ? "notified" : "pending"]);
      }
    }

    // Insert audit log
    await conn.query(
      `INSERT INTO audit_logs (action, actor, request_id, details, type) VALUES (?, ?, ?, ?, 'request')`,
      ["Substitution Request Created", req.user.email, requestId, `Substitution request created for ${subject} (${className}, Period ${period}).`]
    );

    await conn.commit();
    res.status(201).json({ message: "Substitution request submitted successfully", requestId });
  } catch (err) {
    await conn.rollback();
    console.error("Create substitution error:", err);
    res.status(500).json({ error: "Failed to submit request" });
  } finally {
    conn.release();
  }
});

// GET /api/substitution -> Fetch all requests (accessible to all authenticated users)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const [requests] = await pool.query(
      `SELECT r.id, r.absent_teacher_id AS absentTeacherId, t.name AS absentTeacherName,
              r.subject, r.class_id AS classId, c.name AS className, r.day, r.period,
              r.time_range AS time, r.status, r.requested_teacher_id AS requestedTeacherId,
              s.name AS requestedTeacherName, r.reason, r.created_at AS createdAt, r.updated_at AS updatedAt
       FROM substitution_requests r
       JOIN classes c ON r.class_id = c.id
       JOIN teachers t ON r.absent_teacher_id = t.id
       LEFT JOIN teachers s ON r.requested_teacher_id = s.id
       ORDER BY r.created_at DESC`
    );

    const formattedRequests = [];
    for (let reqObj of requests) {
      // Fetch candidate chain
      const [candidates] = await pool.query(
        `SELECT sc.teacher_id, sc.status, t.name AS teacherName
         FROM substitution_candidates sc
         JOIN teachers t ON sc.teacher_id = t.id
         WHERE sc.request_id = ?
         ORDER BY sc.chain_order ASC`,
        [reqObj.id]
      );

      const candidateChain = candidates.map(c => c.teacher_id);
      const declinedBy = candidates
        .filter(c => c.status === "declined")
        .map(c => c.teacherName);

      formattedRequests.push({
        ...reqObj,
        id: `sr${reqObj.id}`,
        candidateChain,
        declinedBy
      });
    }

    res.json(formattedRequests);
  } catch (err) {
    console.error("Fetch requests error:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// GET /api/substitution/audit-logs -> Fetch all audit logs
router.get("/audit-logs", authenticateToken, async (req, res) => {
  try {
    const [logs] = await pool.query(
      `SELECT id, timestamp, action, actor, request_id AS requestId, details, type
       FROM audit_logs
       ORDER BY timestamp DESC`
    );
    const formattedLogs = logs.map(l => ({
      ...l,
      id: `l${l.id}`,
      requestId: l.requestId ? `sr${l.requestId}` : ""
    }));
    res.json(formattedLogs);
  } catch (err) {
    console.error("Fetch audit logs error:", err);
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

// PUT /api/substitution/:id/resolve -> HOD resolves escalated request
router.put("/:id/resolve", authenticateToken, authorizeRoles(["hod", "admin"]), async (req, res) => {
  const { id } = req.params;
  const { resolution } = req.body;

  const numericId = parseInt(id.replace("sr", ""), 10);
  if (isNaN(numericId)) {
    return res.status(400).json({ error: "Invalid substitution request ID format" });
  }

  if (!resolution || !["assign", "free_hour"].includes(resolution.type)) {
    return res.status(400).json({ error: "Invalid resolution parameters" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query("SELECT * FROM substitution_requests WHERE id = ? FOR UPDATE", [numericId]);
    if (rows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: "Substitution request not found" });
    }

    const request = rows[0];

    if (resolution.type === "assign") {
      const { teacherId } = resolution;
      const [teachers] = await conn.query("SELECT name FROM teachers WHERE id = ?", [teacherId]);
      if (teachers.length === 0) {
        await conn.rollback();
        return res.status(400).json({ error: "Teacher not found" });
      }
      const teacherName = teachers[0].name;

      await conn.query(
        "UPDATE substitution_requests SET status = 'accepted', requested_teacher_id = ? WHERE id = ?",
        [teacherId, numericId]
      );

      await conn.query(
        "UPDATE timetable_slots SET teacher_id = ? WHERE class_id = ? AND day = ? AND period = ?",
        [teacherId, request.class_id, request.day, request.period]
      );

      await conn.query(
        `INSERT INTO audit_logs (action, actor, request_id, details, type) VALUES (?, ?, ?, ?, 'assign')`,
        ["HOD Assigned Substitute", "Dr Harivinod N", numericId, `Assigned ${teacherName} cover for ${request.subject} (${request.class_id}, Period ${request.period}).`]
      );
    } else {
      await conn.query("UPDATE substitution_requests SET status = 'free_hour', requested_teacher_id = NULL WHERE id = ?", [numericId]);

      await conn.query(
        `INSERT INTO audit_logs (action, actor, request_id, details, type) VALUES (?, ?, ?, ?, 'free_hour')`,
        ["Free Hour Declared", "Dr Harivinod N", numericId, `Declared free hour for ${request.class_id}, Period ${request.period}.`]
      );
    }

    await conn.commit();
    res.json({ message: `Escalation resolved successfully as ${resolution.type}` });
  } catch (err) {
    await conn.rollback();
    console.error("Resolve escalation error:", err);
    res.status(500).json({ error: "Failed to resolve escalation" });
  } finally {
    conn.release();
  }
});

// PUT /api/substitution/:id -> Approve/reject requests with ACID concurrency control
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status, teacherId } = req.body;

  const numericId = parseInt(id.replace("sr", ""), 10);
  if (isNaN(numericId)) {
    return res.status(400).json({ error: "Invalid substitution request ID format" });
  }

  if (!status || !["accepted", "declined"].includes(status)) {
    return res.status(400).json({ error: "Invalid status parameters" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query("SELECT * FROM substitution_requests WHERE id = ? FOR UPDATE", [numericId]);
    if (rows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: "Substitution request not found" });
    }

    const request = rows[0];

    if (request.status !== "pending") {
      await conn.rollback();
      return res.status(409).json({ error: "Conflict: This substitution request has already been claimed or resolved." });
    }

    const responderId = teacherId || req.user.teacherId;
    const [teachers] = await conn.query("SELECT name FROM teachers WHERE id = ?", [responderId]);
    const responderName = teachers.length > 0 ? teachers[0].name : "Teacher";

    if (status === "accepted") {
      await conn.query(
        "UPDATE substitution_requests SET status = 'accepted', requested_teacher_id = ? WHERE id = ?",
        [responderId, numericId]
      );

      await conn.query(
        "UPDATE substitution_candidates SET status = 'accepted', responded_at = CURRENT_TIMESTAMP WHERE request_id = ? AND teacher_id = ?",
        [numericId, responderId]
      );

      await conn.query(
        "UPDATE timetable_slots SET teacher_id = ? WHERE class_id = ? AND day = ? AND period = ?",
        [responderId, request.class_id, request.day, request.period]
      );

      await conn.query(
        `INSERT INTO audit_logs (action, actor, request_id, details, type) VALUES (?, ?, ?, ?, 'accept')`,
        ["Request Accepted", responderName, numericId, `Accepted cover for ${request.subject} (${request.class_id}, Period ${request.period}).`]
      );

    } else if (status === "declined") {
      await conn.query(
        "UPDATE substitution_candidates SET status = 'declined', responded_at = CURRENT_TIMESTAMP WHERE request_id = ? AND teacher_id = ?",
        [numericId, responderId]
      );

      await conn.query(
        `INSERT INTO audit_logs (action, actor, request_id, details, type) VALUES (?, ?, ?, ?, 'decline')`,
        ["Request Declined", responderName, numericId, `Declined cover for ${request.subject} (${request.class_id}, Period ${request.period}).`]
      );

      const [candidates] = await conn.query(
        "SELECT * FROM substitution_candidates WHERE request_id = ? ORDER BY chain_order ASC",
        [numericId]
      );

      const currentCandidate = candidates.find(c => c.teacher_id === responderId);
      const nextCandidate = candidates.find(c => c.chain_order === (currentCandidate ? currentCandidate.chain_order + 1 : -1));

      if (nextCandidate) {
        await conn.query(
          "UPDATE substitution_requests SET requested_teacher_id = ? WHERE id = ?",
          [nextCandidate.teacher_id, numericId]
        );
        await conn.query(
          "UPDATE substitution_candidates SET status = 'notified', notified_at = CURRENT_TIMESTAMP WHERE id = ?",
          [nextCandidate.id]
        );

        const [tNames] = await conn.query("SELECT name FROM teachers WHERE id = ?", [nextCandidate.teacher_id]);
        const nextName = tNames.length > 0 ? tNames[0].name : "Next Teacher";

        await conn.query(
          `INSERT INTO audit_logs (action, actor, request_id, details, type) VALUES (?, ?, ?, ?, 'request')`,
          ["Request Reassigned", "System", numericId, `Sent request to next substitute ${nextName}.`]
        );
      } else {
        await conn.query("UPDATE substitution_requests SET status = 'escalated', requested_teacher_id = NULL WHERE id = ?", [numericId]);

        await conn.query(
          `INSERT INTO audit_logs (action, actor, request_id, details, type) VALUES (?, ?, ?, ?, 'escalate')`,
          ["Escalated to HOD", "System", numericId, `All candidates declined. Escalated to HOD for decision.`]
        );
      }
    }

    await conn.commit();
    res.json({ message: `Substitution request response registered as ${status}` });
  } catch (err) {
    await conn.rollback();
    console.error("Resolve substitution error:", err);
    res.status(500).json({ error: "Failed to resolve substitution request" });
  } finally {
    conn.release();
  }
});

export default router;
