import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const TEACHERS = [
  { id: "archana_p", name: "Ms Archana P", shortName: "ARP", designation: "Assistant Professor", email: "archana.p@nmit.ac.in", phone: "9845001001", primarySubject: "Mathematics-III" },
  { id: "preetha_dsouza", name: "Ms Preetha D'Souza", shortName: "PTD", designation: "Assistant Professor", email: "preetha.dsouza@nmit.ac.in", phone: "9845001002", primarySubject: "Digital Principles & Design" },
  { id: "pratibha_gaonkar", name: "Ms Pratibha Ganapati Gaonkar", shortName: "PGG", designation: "Associate Professor", email: "pratibha.gaonkar@nmit.ac.in", phone: "9845001003", primarySubject: "Data Structures & Applications" },
  { id: "shajahan_aboobacker", name: "Dr Shajahan Aboobacker", shortName: "SJA", designation: "Professor", email: "shajahan.aboobacker@nmit.ac.in", phone: "9845001004", primarySubject: "Computer Organization & Architecture" },
  { id: "shruthi_patil", name: "Ms Shruthi Patil", shortName: "SRP", designation: "Assistant Professor & Class Advisor", email: "shruthi.patil@nmit.ac.in", phone: "9845001005", primarySubject: "Fundamentals of AI & ML" },
  { id: "vijetha_u", name: "Dr Vijetha U", shortName: "VJU", designation: "Professor", email: "vijetha.u@nmit.ac.in", phone: "9845001006", primarySubject: "Computer Vision" },
  { id: "namitha_shetty", name: "Ms Namitha Shetty", shortName: "NNV", designation: "Assistant Professor", email: "namitha.shetty@nmit.ac.in", phone: "9845001007", primarySubject: "Biology for Engineers" },
  { id: "pujari_tejas", name: "Mr Pujari Tejas Raghu", shortName: "PTR", designation: "Assistant Professor", email: "pujari.tejas@nmit.ac.in", phone: "9845001008", primarySubject: "IoT Enabled Prototyping" },
  { id: "ashwin_shetty", name: "Dr Ashwin Shetty", shortName: "ASH", designation: "Associate Professor", email: "ashwin.shetty@nmit.ac.in", phone: "9845001009", primarySubject: "Industry Oriented Training" },
  { id: "jagadeesha_b", name: "Dr Jagadeesha B", shortName: "JGB", designation: "Professor", email: "jagadeesha.b@nmit.ac.in", phone: "9845001010", primarySubject: "Mathematics for Computer Science" },
  { id: "sushma_tantry", name: "Ms Sushma Tantry", shortName: "SMT", designation: "Assistant Professor", email: "sushma.tantry@nmit.ac.in", phone: "9845001011", primarySubject: "Digital Principles & Design" },
  { id: "teena_james", name: "Ms Teena Annamma James", shortName: "TAJ", designation: "Assistant Professor & Class Advisor", email: "teena.james@nmit.ac.in", phone: "9845001012", primarySubject: "Data Structures & Applications" },
  { id: "konanki_surendra", name: "Mr Konanki Surendra", shortName: "KKS", designation: "Assistant Professor", email: "konanki.surendra@nmit.ac.in", phone: "9845001013", primarySubject: "Computer Organization & Architecture" },
  { id: "manjula_k", name: "Ms Manjula K", shortName: "MJK", designation: "Assistant Professor", email: "manjula.k@nmit.ac.in", phone: "9845001014", primarySubject: "Fundamentals of Economics" },
  { id: "aishwarya_acharya", name: "Ms Aishwarya Acharya", shortName: "ASR", designation: "Assistant Professor", email: "aishwarya.acharya@nmit.ac.in", phone: "9845001015", primarySubject: "SEPM / Cloud Computing" },
  { id: "ajeeth_b", name: "Mr Ajeeth B", shortName: "AJB", designation: "Assistant Professor", email: "ajeeth.b@nmit.ac.in", phone: "9845001016", primarySubject: "Industry Oriented Training" },
  { id: "deepthi_dinesh", name: "Ms Deepthi Dinesh", shortName: "DKS", designation: "Assistant Professor", email: "deepthi.dinesh@nmit.ac.in", phone: "9845001017", primarySubject: "Fundamentals of Management" },
  { id: "farha_anjum", name: "Ms Farha Anjum", shortName: "FHA", designation: "Assistant Professor & Class Advisor", email: "farha.anjum@nmit.ac.in", phone: "9845001018", primarySubject: "Database Management Systems" },
  { id: "renuka_tantry", name: "Ms Renuka Tantry", shortName: "RNT", designation: "Assistant Professor", email: "renuka.tantry@nmit.ac.in", phone: "9845001019", primarySubject: "Computer Networks & Security" },
  { id: "shreeranga_bhat", name: "Dr Shreeranga Bhat", shortName: "SHB", designation: "Professor", email: "shreeranga.bhat@nmit.ac.in", phone: "9845001020", primarySubject: "Operation Research" },
  { id: "saleena_ts", name: "Dr Saleena T S", shortName: "STS", designation: "Professor & Class Advisor", email: "saleena.ts@nmit.ac.in", phone: "9845001021", primarySubject: "Computational Statistics / FAIML" },
  { id: "shivaganesh", name: "Mr Shivaganesh", shortName: "SVG", designation: "Assistant Professor", email: "shivaganesh@nmit.ac.in", phone: "9845001022", primarySubject: "Cloud Computing / CCS" },
  { id: "purushothama_chippar", name: "Dr Purushothama Chippar", shortName: "PRC", designation: "Professor", email: "purushothama@nmit.ac.in", phone: "9845001023", primarySubject: "Research Methodology & IPR" },
  { id: "devikrishna_ks", name: "Ms Devikrishna K S", shortName: "DKS2", designation: "Assistant Professor", email: "devikrishna.ks@nmit.ac.in", phone: "9845001024", primarySubject: "Computer Networks" },
  { id: "harivinod_n", name: "Dr Harivinod N", shortName: "HVN", designation: "Professor & HOD", email: "harivinod.n@nmit.ac.in", phone: "9845001025", primarySubject: "Theory of Computation" },
  { id: "sudheer_m", name: "Dr Sudheer M", shortName: "SDM", designation: "Professor", email: "sudheer.m@nmit.ac.in", phone: "9845001026", primarySubject: "Research Methodology & IPR" },
  { id: "susmitha_john", name: "Ms Susmitha John", shortName: "SUJ", designation: "Assistant Professor & Class Advisor", email: "susmitha.john@nmit.ac.in", phone: "9845001027", primarySubject: "Business Intelligence / BIDA" },
  { id: "shruthi_anchan", name: "Ms Shruthi K Anchan", shortName: "SKA", designation: "Assistant Professor", email: "shruthi.anchan@nmit.ac.in", phone: "9845001028", primarySubject: "SEPM / BDA" },
  { id: "davor_dsouza", name: "Mr Davor John D'souza", shortName: "DJD", designation: "Assistant Professor & Class Advisor", email: "davor.dsouza@nmit.ac.in", phone: "9845001029", primarySubject: "Advanced Data Science" },
  { id: "swaraj_lewis", name: "Dr Swaraj D Lewis", shortName: "SDL", designation: "Professor", email: "swaraj.lewis@nmit.ac.in", phone: "9845001030", primarySubject: "Research Methodology & IPR" },
  { id: "oshwin_sequeira", name: "Ms Oshwin Priyanka Sequeira", shortName: "OPS", designation: "Assistant Professor", email: "oshwin.sequeira@nmit.ac.in", phone: "9845001031", primarySubject: "Supply Chain Management" },
  { id: "gayana_mn", name: "Ms Gayana M N", shortName: "GMN", designation: "Assistant Professor", email: "gayana.mn@nmit.ac.in", phone: "9845001032", primarySubject: "BDA / Major Project" },
  { id: "shabina_bhaskar", name: "Dr Shabina Bhaskar", shortName: "SHB2", designation: "Associate Professor", email: "shabina.bhaskar@nmit.ac.in", phone: "9845001033", primarySubject: "Information Retrieval & Applications" },
  { id: "simi_thomas", name: "Ms Simi P Thomas", shortName: "SPT", designation: "Assistant Professor", email: "simi.thomas@nmit.ac.in", phone: "9845001034", primarySubject: "DPD Lab" },
  { id: "nelson", name: "Mr Nelson", shortName: "NLS", designation: "Assistant Professor", email: "nelson@nmit.ac.in", phone: "9845001035", primarySubject: "Financial & Cost Accounting" },
];

const CLASSES = [
  { id: "AIML3", name: "III Sem BE AIML", dept: "Artificial Intelligence & Machine Learning", sem: "III", advisorId: "shajahan_aboobacker", room: "2405" },
  { id: "CSBS3", name: "III Sem BE CSBS", dept: "Computer Science & Business Systems", sem: "III", advisorId: "teena_james", room: "4202" },
  { id: "CSBS5", name: "V Sem BE CSBS", dept: "Computer Science & Business Systems", sem: "V", advisorId: "farha_anjum", room: "3606" },
  { id: "AIML5", name: "V Sem BE AIML", dept: "Artificial Intelligence & Machine Learning", sem: "V", advisorId: "shruthi_patil", room: "3605" },
  { id: "CSDS5", name: "V Sem BE CSDS", dept: "Computer Science & Engineering (Data Science)", sem: "V", advisorId: "saleena_ts", room: "2407" },
  { id: "CSBS7", name: "VII Sem BE CSBS", dept: "Computer Science & Business Systems", sem: "VII", advisorId: "susmitha_john", room: "3604" },
  { id: "CSDS7", name: "VII Sem BE CSDS", dept: "Computer Science & Engineering (Data Science)", sem: "VII", advisorId: "davor_dsouza", room: "3603" },
  { id: "AIML7", name: "VII Sem BE AIML", dept: "Artificial Intelligence & Machine Learning", sem: "VII", advisorId: "vijetha_u", room: "3602" },
];

const SLOTS = [
  // AIML3
  { classId: "AIML3", day: "Monday", period: 1, subject: "DPD Lab", subjectFull: "Digital Principles & Design Lab", teacherId: "preetha_dsouza", isLab: true, note: "Batch B1 (MAG+SMT)" },
  { classId: "AIML3", day: "Monday", period: 2, subject: "DPD Lab", subjectFull: "Digital Principles & Design Lab", teacherId: "preetha_dsouza", isLab: true, note: "OOPJ Lab B2 (VJU+SWT)" },
  { classId: "AIML3", day: "Monday", period: 3, subject: "BFE", subjectFull: "Biology for Engineers", teacherId: "namitha_shetty", isLab: false },
  { classId: "AIML3", day: "Monday", period: 4, subject: "DSA", subjectFull: "Data Structures & Applications", teacherId: "pratibha_gaonkar", isLab: false },
  { classId: "AIML3", day: "Monday", period: 5, subject: "COA", subjectFull: "Computer Organization & Architecture", teacherId: "shajahan_aboobacker", isLab: false },
  { classId: "AIML3", day: "Monday", period: 6, subject: "Maths-III", subjectFull: "Mathematics for Information Technology", teacherId: "archana_p", isLab: false },
  
  // CSBS3
  { classId: "CSBS3", day: "Monday", period: 1, subject: "DPD", subjectFull: "Digital Principles & Design", teacherId: "sushma_tantry", isLab: false },
  { classId: "CSBS3", day: "Monday", period: 2, subject: "Maths-III", subjectFull: "Mathematics for Computer Science", teacherId: "jagadeesha_b", isLab: false },
  { classId: "CSBS3", day: "Monday", period: 3, subject: "BFE-III", subjectFull: "Biology for Engineers", teacherId: "namitha_shetty", isLab: false },
  { classId: "CSBS3", day: "Monday", period: 4, subject: "COA", subjectFull: "Computer Organization & Architecture", teacherId: "konanki_surendra", isLab: false },
  { classId: "CSBS3", day: "Tuesday", period: 2, subject: "DSA", subjectFull: "Data Structures & Applications", teacherId: "teena_james", isLab: false },
  { classId: "CSBS3", day: "Wednesday", period: 1, subject: "DSA", subjectFull: "Data Structures & Applications", teacherId: "teena_james", isLab: false },
  { classId: "CSBS3", day: "Thursday", period: 5, subject: "DSA", subjectFull: "Data Structures & Applications", teacherId: "teena_james", isLab: false }
];

async function setup() {
  const host = process.env.DB_HOST || "localhost";
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASSWORD || "";
  const database = process.env.DB_NAME || "timetable_db";

  console.log(`Connecting to MySQL server at ${host}...`);
  const connection = await mysql.createConnection({ host, user, password });

  console.log(`Creating database ${database} (if not exists)...`);
  await connection.query(`CREATE DATABASE IF NOT EXISTS ${database};`);
  await connection.query(`USE ${database};`);

  console.log("Loading and running schema.sql...");
  const schemaSql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
  // Split statements by semicolon and run them
  const queries = schemaSql
    .split(";")
    .map(q => q.trim())
    .filter(q => q.length > 0);

  for (let query of queries) {
    await connection.query(query);
  }
  console.log("Tables created successfully.");

  // Clear existing records
  console.log("Cleaning existing records...");
  await connection.query("SET FOREIGN_KEY_CHECKS = 0;");
  await connection.query("TRUNCATE TABLE audit_logs;");
  await connection.query("TRUNCATE TABLE uploaded_timetables;");
  await connection.query("TRUNCATE TABLE substitution_candidates;");
  await connection.query("TRUNCATE TABLE substitution_requests;");
  await connection.query("TRUNCATE TABLE timetable_slots;");
  await connection.query("TRUNCATE TABLE classes;");
  await connection.query("TRUNCATE TABLE users;");
  await connection.query("TRUNCATE TABLE teachers;");
  await connection.query("SET FOREIGN_KEY_CHECKS = 1;");

  console.log("Seeding Teachers...");
  const insertTeacherQuery = `INSERT INTO teachers (id, name, short_name, designation, email, phone, primary_subject) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  for (let t of TEACHERS) {
    await connection.query(insertTeacherQuery, [t.id, t.name, t.shortName, t.designation, t.email, t.phone, t.primarySubject]);
  }

  console.log("Seeding Users...");
  const insertUserQuery = `INSERT INTO users (email, password_hash, role, teacher_id) VALUES (?, ?, ?, ?)`;
  
  const teacherHash = await bcrypt.hash("teacher123", 10);
  const advisorHash = await bcrypt.hash("advisor123", 10);
  const hodHash = await bcrypt.hash("hod123", 10);
  const adminHash = await bcrypt.hash("admin123", 10);

  await connection.query(insertUserQuery, ["shruthi.patil@nmit.ac.in", teacherHash, "teacher", "shruthi_patil"]);
  await connection.query(insertUserQuery, ["teena.james@nmit.ac.in", advisorHash, "advisor", "teena_james"]);
  await connection.query(insertUserQuery, ["harivinod.n@nmit.ac.in", hodHash, "hod", "harivinod_n"]);
  await connection.query(insertUserQuery, ["renuka.tantry@nmit.ac.in", adminHash, "admin", "renuka_tantry"]);

  console.log("Seeding Classes...");
  const insertClassQuery = `INSERT INTO classes (id, name, dept, sem, advisor_id, room) VALUES (?, ?, ?, ?, ?, ?)`;
  for (let c of CLASSES) {
    await connection.query(insertClassQuery, [c.id, c.name, c.dept, c.sem, c.advisorId, c.room]);
  }

  console.log("Loading and Seeding Uploaded Timetables...");
  const IMAGE_NAMES = [
    "III_Sem_AIML_Timetable.png",
    "III_Sem_CSBS_Timetable_p1.png",
    "III_Sem_CSBS_Timetable_p2.png",
    "V_Sem_CSBS_Timetable.png",
    "V_Sem_AIML_Timetable.png",
    "V_Sem_CSDS_Timetable.png",
    "VII_Sem_CSBS_Timetable.png",
    "VII_Sem_CSDS_Timetable.png",
    "VII_Sem_AIML_Timetable.png",
  ];
  const uploadsPath = path.join(__dirname, "uploads.json");
  const UPLOADS_JSON = JSON.parse(fs.readFileSync(uploadsPath, "utf8"));
  const insertUploadQuery = `INSERT INTO uploaded_timetables (id, class_id, file_name, status, extracted_slots, extracted_teachers, parsed_at) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  
  for (let u of UPLOADS_JSON) {
    const fileName = u.fileName || (u.imageIndex !== undefined ? IMAGE_NAMES[u.imageIndex] : `upload_${u.id}.png`);
    const numericId = parseInt(u.id.replace("ut", ""), 10);
    const finalId = isNaN(numericId) ? null : numericId;
    await connection.query(insertUploadQuery, [
      finalId,
      u.classId,
      fileName,
      u.status,
      u.extractedSlots,
      u.extractedTeachers,
      u.parsedAt ? new Date(u.parsedAt) : new Date()
    ]);
  }

  console.log("Loading and Seeding Timetable Slots...");
  const slotsPath = path.join(__dirname, "slots.json");
  const SLOTS_JSON = JSON.parse(fs.readFileSync(slotsPath, "utf8"));
  const insertSlotQuery = `INSERT INTO timetable_slots (class_id, day, period, subject, subject_full, teacher_id, is_lab, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
  for (let s of SLOTS_JSON) {
    const [tExists] = await connection.query("SELECT id FROM teachers WHERE id = ?", [s.teacherId]);
    if (tExists.length === 0) {
      continue;
    }
    const [slotExists] = await connection.query(
      "SELECT id FROM timetable_slots WHERE class_id = ? AND day = ? AND period = ?",
      [s.classId, s.day, s.period]
    );
    if (slotExists.length > 0) {
      continue;
    }
    await connection.query(insertSlotQuery, [
      s.classId,
      s.day,
      s.period,
      s.subject,
      s.subjectFull,
      s.teacherId,
      s.isLab ? 1 : 0,
      s.note || null
    ]);
  }

  console.log("Loading and Seeding Substitution Requests...");
  const requestsPath = path.join(__dirname, "requests.json");
  const REQUESTS_JSON = JSON.parse(fs.readFileSync(requestsPath, "utf8"));
  
  for (let r of REQUESTS_JSON) {
    const numericId = parseInt(r.id.replace("sr", ""), 10);
    if (isNaN(numericId)) continue;

    // Insert request
    await connection.query(
      `INSERT INTO substitution_requests (id, absent_teacher_id, subject, class_id, day, period, time_range, status, requested_teacher_id, reason, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        numericId,
        r.absentTeacherId,
        r.subject,
        r.classId,
        r.day,
        r.period,
        r.time,
        r.status,
        (r.requestedTeacherId === "broadcast" || r.requestedTeacherId === "none") ? null : (r.requestedTeacherId || null),
        r.reason || null,
        r.createdAt ? new Date(r.createdAt) : new Date(),
        r.updatedAt ? new Date(r.updatedAt) : new Date()
      ]
    );

    // Insert candidates
    if (r.candidateChain && Array.isArray(r.candidateChain)) {
      for (let i = 0; i < r.candidateChain.length; i++) {
        const candidateId = r.candidateChain[i];
        const teacher = TEACHERS.find(t => t.id === candidateId);
        const candidateName = teacher ? teacher.name : candidateId;
        
        const isDeclined = r.declinedBy.includes(candidateName);
        const isAccepted = r.requestedTeacherId === candidateId && r.status === "accepted";
        const isNotified = r.requestedTeacherId === candidateId && r.status === "pending";
        
        let candidateStatus = "pending";
        if (isDeclined) candidateStatus = "declined";
        else if (isAccepted) candidateStatus = "accepted";
        else if (isNotified) candidateStatus = "notified";
        else if (i === 0 && r.status === "pending" && !r.requestedTeacherId) candidateStatus = "notified";

        await connection.query(
          `INSERT INTO substitution_candidates (request_id, teacher_id, chain_order, status)
           VALUES (?, ?, ?, ?)`,
          [numericId, candidateId, i + 1, candidateStatus]
        );
      }
    }
  }

  console.log("Loading and Seeding Audit Logs...");
  const logsPath = path.join(__dirname, "audit_logs.json");
  const LOGS_JSON = JSON.parse(fs.readFileSync(logsPath, "utf8"));
  const insertLogQuery = `INSERT INTO audit_logs (timestamp, action, actor, request_id, details, type) VALUES (?, ?, ?, ?, ?, ?)`;
  
  for (let l of LOGS_JSON) {
    const reqNumericId = l.requestId ? parseInt(l.requestId.replace("sr", ""), 10) : null;
    const finalReqId = isNaN(reqNumericId) ? null : reqNumericId;

    await connection.query(insertLogQuery, [
      l.timestamp ? new Date(l.timestamp) : new Date(),
      l.action,
      l.actor,
      finalReqId,
      l.details,
      l.type
    ]);
  }

  console.log("Seeding complete! Close connection.");
  await connection.end();
  console.log("Database initialized and populated with demo records!");
}

setup().catch(err => {
  console.error("Setup failed:", err);
  process.exit(1);
});
