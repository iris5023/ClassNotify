import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_substitution_key_2026";

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  const { email, password, role, teacherId } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "Missing required registration parameters" });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (email, password_hash, role, teacher_id) VALUES (?, ?, ?, ?)",
      [email, passwordHash, role, teacherId || null]
    );

    res.status(201).json({ message: "User created successfully", userId: result.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already exists in system" });
    }
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Retrieve teacher name if linked
    let teacherName = "";
    if (user.teacher_id) {
      const [teachers] = await pool.query("SELECT name FROM teachers WHERE id = ?", [user.teacher_id]);
      if (teachers.length > 0) {
        teacherName = teachers[0].name;
      }
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, teacherId: user.teacher_id },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      role: user.role,
      email: user.email,
      teacherId: user.teacher_id,
      teacherName,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
