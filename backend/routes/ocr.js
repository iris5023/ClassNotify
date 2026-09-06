import express from "express";
import pool from "../db.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// POST /api/ocr-upload -> Accept OCR-parsed JSON data and save slots
router.post("/", authenticateToken, authorizeRoles(["admin"]), async (req, res) => {
  const { classId, slots } = req.body; // slots: Array of { day, period, subject, subjectFull, teacherId, isLab, note }

  if (!classId || !slots || !Array.isArray(slots)) {
    return res.status(400).json({ error: "Missing classId or slots array" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let insertedCount = 0;

    for (let slot of slots) {
      const { day, period, subject, subjectFull, teacherId, isLab, note } = slot;

      // Handle cases where OCR merges multiple subjects in one cell by splitting them
      const subjectTokens = subject.split(/[\/\+&]/).map(s => s.trim());
      const subjectFullTokens = subjectFull ? subjectFull.split(/[\/\+&]/).map(s => s.trim()) : [];

      const primarySubject = subjectTokens[0];
      const primarySubjectFull = subjectFullTokens[0] || primarySubject;
      
      let finalNote = note || "";
      if (subjectTokens.length > 1) {
        const extraSubjects = subjectTokens.slice(1).join(", ");
        finalNote = finalNote ? `${finalNote} (Merged: ${extraSubjects})` : `Merged: ${extraSubjects}`;
      }

      // Check if teacher exists, if not, assign to a default or skip
      const [tExists] = await conn.query("SELECT id FROM teachers WHERE id = ?", [teacherId]);
      const validTeacherId = tExists.length > 0 ? teacherId : "shruthi_patil"; // fallback

      // Upsert to handle OCR duplicates or overwrites
      await conn.query(
        `INSERT INTO timetable_slots (class_id, day, period, subject, subject_full, teacher_id, is_lab, note)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
            subject = VALUES(subject), 
            subject_full = VALUES(subject_full), 
            teacher_id = VALUES(teacher_id), 
            is_lab = VALUES(is_lab), 
            note = VALUES(note)`,
        [classId, day, period, primarySubject, primarySubjectFull, validTeacherId, isLab ? 1 : 0, finalNote || null]
      );

      insertedCount++;
    }

    // Record upload metadata
    await conn.query(
      `INSERT INTO uploaded_timetables (class_id, file_name, status, extracted_slots, extracted_teachers)
       VALUES (?, ?, 'parsed', ?, ?)`,
      [classId, "OCR_Import_Payload.json", insertedCount, 8]
    );

    // Write audit log
    await conn.query(
      `INSERT INTO audit_logs (action, actor, request_id, details, type) VALUES (?, ?, NULL, ?, 'free_hour')`,
      ["OCR Timetable Parsed", req.user.email, `Successfully imported and upserted ${insertedCount} slots for class ${classId} via OCR.`]
    );

    await conn.commit();
    res.json({ message: "OCR timetable data parsed and inserted successfully", insertedSlots: insertedCount });
  } catch (err) {
    await conn.rollback();
    console.error("OCR import error:", err);
    res.status(500).json({ error: "Failed to parse and insert OCR timetable entries" });
  } finally {
    conn.release();
  }
});

// GET /api/ocr-upload -> Fetch all uploaded timetables
router.get("/", authenticateToken, async (req, res) => {
  try {
    const [uploads] = await pool.query(
      `SELECT id, class_id AS classId, image_url AS imageUrl, file_name AS fileName, 
              status, extracted_slots AS extractedSlots, extracted_teachers AS extractedTeachers, 
              parsed_at AS parsedAt
       FROM uploaded_timetables
       ORDER BY parsed_at DESC`
    );
    const formattedUploads = uploads.map(u => ({
      ...u,
      id: u.id ? `ut${u.id}` : `ut-custom-${Date.now()}`
    }));
    res.json(formattedUploads);
  } catch (err) {
    console.error("Fetch uploaded timetables error:", err);
    res.status(500).json({ error: "Failed to fetch uploaded timetables" });
  }
});

// DELETE /api/ocr-upload/:id -> Delete uploaded timetable by ID
router.delete("/:id", authenticateToken, authorizeRoles(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { classId } = req.query;

  // Convert "utX" string ID to numerical ID
  const numericId = parseInt(id.replace("ut", ""), 10);
  if (isNaN(numericId)) {
    return res.status(400).json({ error: "Invalid upload ID format" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let finalClassId = classId;
    if (!finalClassId) {
      const [rows] = await conn.query("SELECT class_id FROM uploaded_timetables WHERE id = ?", [numericId]);
      if (rows.length > 0) {
        finalClassId = rows[0].class_id;
      }
    }

    // Delete from uploaded_timetables
    await conn.query("DELETE FROM uploaded_timetables WHERE id = ?", [numericId]);

    // Check if any other uploads exist for this class
    if (finalClassId) {
      const [remaining] = await conn.query("SELECT id FROM uploaded_timetables WHERE class_id = ?", [finalClassId]);
      if (remaining.length === 0) {
        // Delete all slots for this class
        await conn.query("DELETE FROM timetable_slots WHERE class_id = ?", [finalClassId]);
      }
    }

    // Write audit log
    await conn.query(
      `INSERT INTO audit_logs (action, actor, request_id, details, type) VALUES (?, ?, NULL, ?, 'free_hour')`,
      ["OCR Timetable Deleted", req.user.email, `Successfully deleted upload ID ${id} and updated schedules for class ${finalClassId}.`]
    );

    await conn.commit();
    res.json({ message: "Timetable upload deleted successfully" });
  } catch (err) {
    await conn.rollback();
    console.error("Delete uploaded timetable error:", err);
    res.status(500).json({ error: "Failed to delete uploaded timetable" });
  } finally {
    conn.release();
  }
});

export default router;
