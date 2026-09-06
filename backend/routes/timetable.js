import express from "express";
import pool from "../db.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// GET /api/timetable -> fetch all slots
router.get("/", async (req, res) => {
  try {
    const [slots] = await pool.query(
      `SELECT t.id, t.class_id AS classId, t.day, t.period, t.subject, t.subject_full AS subjectFull, 
              t.teacher_id AS teacherId, f.name AS teacherName, t.is_lab AS isLab, t.note
       FROM timetable_slots t
       JOIN teachers f ON t.teacher_id = f.id
       ORDER BY t.class_id, t.day, t.period`
    );
    res.json(slots);
  } catch (err) {
    console.error("Fetch timetable error:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// POST /api/timetable -> Add entry (Admin only)
router.post("/", authenticateToken, authorizeRoles(["admin"]), async (req, res) => {
  const { classId, day, period, subject, subjectFull, teacherId, isLab, note } = req.body;

  if (!classId || !day || !period || !subject || !subjectFull || !teacherId) {
    return res.status(400).json({ error: "Missing required timetable slot parameters" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO timetable_slots (class_id, day, period, subject, subject_full, teacher_id, is_lab, note) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [classId, day, period, subject, subjectFull, teacherId, isLab ? 1 : 0, note || null]
    );

    res.status(201).json({ message: "Timetable slot added successfully", id: result.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Conflict: This slot is already occupied for this class." });
    }
    console.error("Create timetable slot error:", err);
    res.status(500).json({ error: "Database transaction failed" });
  }
});

// PUT /api/timetable/:id -> Update entry (Admin only)
router.put("/:id", authenticateToken, authorizeRoles(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { classId, day, period, subject, subjectFull, teacherId, isLab, note } = req.body;

  try {
    const [existing] = await pool.query("SELECT * FROM timetable_slots WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Timetable slot not found" });
    }

    await pool.query(
      `UPDATE timetable_slots 
       SET class_id = ?, day = ?, period = ?, subject = ?, subject_full = ?, teacher_id = ?, is_lab = ?, note = ?
       WHERE id = ?`,
      [classId, day, period, subject, subjectFull, teacherId, isLab ? 1 : 0, note || null, id]
    );

    res.json({ message: "Timetable slot updated successfully" });
  } catch (err) {
    console.error("Update timetable slot error:", err);
    res.status(500).json({ error: "Database transaction failed" });
  }
});

// DELETE /api/timetable/:id -> Delete entry (Admin only)
router.delete("/:id", authenticateToken, authorizeRoles(["admin"]), async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await pool.query("SELECT * FROM timetable_slots WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Timetable slot not found" });
    }

    await pool.query("DELETE FROM timetable_slots WHERE id = ?", [id]);
    res.json({ message: "Timetable slot deleted successfully" });
  } catch (err) {
    console.error("Delete timetable slot error:", err);
    res.status(500).json({ error: "Database transaction failed" });
  }
});

export default router;
