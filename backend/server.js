import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import timetableRoutes from "./routes/timetable.js";
import substitutionRoutes from "./routes/substitution.js";
import ocrRoutes from "./routes/ocr.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/substitution", substitutionRoutes);
app.use("/api/ocr-upload", ocrRoutes);

// Base route
app.get("/", (req, res) => {
  res.json({ message: "Timetable Substitution Management system API is active" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
