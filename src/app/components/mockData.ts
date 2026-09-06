export type Role = "teacher" | "hod" | "admin";
export type SubStatus = "pending" | "accepted" | "declined" | "escalated" | "free_hour";

// ─── Time Periods ──────────────────────────────────────────────────────────
export const PERIODS = [
  { period: 1, time: "9:00 – 9:55" },
  { period: 2, time: "9:55 – 10:50" },
  { period: 3, time: "11:10 – 12:05" },
  { period: 4, time: "12:05 – 1:00" },
  { period: 5, time: "2:00 – 3:00" },
  { period: 6, time: "3:00 – 4:00" },
  { period: 7, time: "4:00 – 5:00" },
];
export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// ─── Classes ───────────────────────────────────────────────────────────────
export interface ClassInfo {
  id: string;
  name: string;
  dept: string;
  sem: string;
  advisorId: string;
  advisorName: string;
  room: string;
}
export const CLASSES: ClassInfo[] = [
  { id: "AIML3", name: "III Sem BE AIML", dept: "Artificial Intelligence & Machine Learning", sem: "III", advisorId: "shajahan_aboobacker", advisorName: "Dr Shajahan Aboobacker", room: "2405" },
  { id: "CSBS3", name: "III Sem BE CSBS", dept: "Computer Science & Business Systems", sem: "III", advisorId: "teena_james", advisorName: "Ms Teena Annamma James", room: "4202" },
  { id: "CSDS3", name: "III Sem BE CSDS", dept: "Computer Science & Engineering (Data Science)", sem: "III", advisorId: "renuka_tantry", advisorName: "Ms Renuka Tantry", room: "2406" },
  { id: "CSBS5", name: "V Sem BE CSBS", dept: "Computer Science & Business Systems", sem: "V", advisorId: "farha_anjum", advisorName: "Ms Farha Anjum", room: "3606" },
  { id: "AIML5", name: "V Sem BE AIML", dept: "Artificial Intelligence & Machine Learning", sem: "V", advisorId: "shruthi_patil", advisorName: "Ms Shruthi Patil", room: "3605" },
  { id: "CSDS5", name: "V Sem BE CSDS", dept: "Computer Science & Engineering (Data Science)", sem: "V", advisorId: "saleena_ts", advisorName: "Dr Saleena T S", room: "2407" },
  { id: "CSBS7", name: "VII Sem BE CSBS", dept: "Computer Science & Business Systems", sem: "VII", advisorId: "susmitha_john", advisorName: "Ms Susmitha John", room: "3604" },
  { id: "CSDS7", name: "VII Sem BE CSDS", dept: "Computer Science & Engineering (Data Science)", sem: "VII", advisorId: "davor_dsouza", advisorName: "Mr Davor John D'souza", room: "3603" },
  { id: "AIML7", name: "VII Sem BE AIML", dept: "Artificial Intelligence & Machine Learning", sem: "VII", advisorId: "vijetha_u", advisorName: "Dr Vijetha U", room: "3602" },
];

// ─── Faculty ───────────────────────────────────────────────────────────────
export interface Teacher {
  id: string;
  name: string;
  shortName: string;
  designation: string;
  email: string;
  phone: string;
  primarySubject: string;
}
export const TEACHERS: Teacher[] = [
  { id: "archana_p", name: "Ms Archana P", shortName: "ARP", designation: "Assistant Professor", email: "archana.p@nmit.ac.in", phone: "9845001001", primarySubject: "Mathematics-III" },
  { id: "preetha_dsouza", name: "Ms Preetha D'Souza", shortName: "PTD", designation: "Assistant Professor", email: "preetha.dsouza@nmit.ac.in", phone: "9845001002", primarySubject: "Digital Principles & Design" },
  { id: "pratibha_gaonkar", name: "Ms Pratibha Ganapati Gaonkar", shortName: "PGG", designation: "Associate Professor", email: "pratibha.gaonkar@nmit.ac.in", phone: "9845001003", primarySubject: "Data Structures & Applications" },
  { id: "shajahan_aboobacker", name: "Dr Shajahan Aboobacker", shortName: "SJA", designation: "Professor & Class Advisor", email: "shajahan.aboobacker@nmit.ac.in", phone: "9845001004", primarySubject: "Computer Organization & Architecture" },
  { id: "shruthi_patil", name: "Ms Shruthi Patil", shortName: "SRP", designation: "Assistant Professor & Class Advisor", email: "shruthi.patil@nmit.ac.in", phone: "9845001005", primarySubject: "Fundamentals of AI & ML" },
  { id: "vijetha_u", name: "Dr Vijetha U", shortName: "VJU", designation: "Professor & Class Advisor", email: "vijetha.u@nmit.ac.in", phone: "9845001006", primarySubject: "Computer Vision" },
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
  { id: "harivinod_n", name: "Dr Harivinod N", shortName: "HVN", designation: "Professor", email: "harivinod.n@nmit.ac.in", phone: "9845001025", primarySubject: "Theory of Computation" },
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

// ─── Timetable Slots ───────────────────────────────────────────────────────
export interface TimetableSlot {
  id: string;
  classId: string;
  day: string;
  period: number;
  subject: string;      // abbreviated code shown in timetable
  subjectFull: string;  // full subject name
  teacherId: string;
  teacherName: string;
  isLab: boolean;
  note?: string;        // batch info if any
}

export const CLASS_TIMETABLE: TimetableSlot[] = [
  // ── III Sem BE AIML (AIML3, Room 2405) ────────────────────────────────
  // MONDAY
  { id: "a3m1", classId: "AIML3", day: "Monday", period: 1, subject: "DPD Lab", subjectFull: "Digital Principles & Design Lab", teacherId: "preetha_dsouza", teacherName: "Ms Preetha D'Souza", isLab: true, note: "Batch B1 (MAG+SMT)" },
  { id: "a3m2", classId: "AIML3", day: "Monday", period: 2, subject: "DPD Lab", subjectFull: "Digital Principles & Design Lab", teacherId: "preetha_dsouza", teacherName: "Ms Preetha D'Souza", isLab: true, note: "OOPJ Lab B2 (VJU+SWT)" },
  { id: "a3m3", classId: "AIML3", day: "Monday", period: 3, subject: "BFE", subjectFull: "Biology for Engineers", teacherId: "namitha_shetty", teacherName: "Ms Namitha Shetty", isLab: false },
  { id: "a3m4", classId: "AIML3", day: "Monday", period: 4, subject: "DSA", subjectFull: "Data Structures & Applications", teacherId: "pratibha_gaonkar", teacherName: "Ms Pratibha Ganapati Gaonkar", isLab: false },
  { id: "a3m5", classId: "AIML3", day: "Monday", period: 5, subject: "COA", subjectFull: "Computer Organization & Architecture", teacherId: "shajahan_aboobacker", teacherName: "Dr Shajahan Aboobacker", isLab: false },
  { id: "a3m6", classId: "AIML3", day: "Monday", period: 6, subject: "Maths-III", subjectFull: "Mathematics for Information Technology", teacherId: "archana_p", teacherName: "Ms Archana P", isLab: false },
  { id: "a3m7", classId: "AIML3", day: "Monday", period: 7, subject: "TUTORIAL", subjectFull: "Tutorial", teacherId: "shajahan_aboobacker", teacherName: "Dr Shajahan Aboobacker", isLab: false },
  // TUESDAY
  { id: "a3t1", classId: "AIML3", day: "Tuesday", period: 1, subject: "IRP", subjectFull: "Introduction to R Programming", teacherId: "shruthi_patil", teacherName: "Ms Shruthi Patil", isLab: false },
  { id: "a3t2", classId: "AIML3", day: "Tuesday", period: 2, subject: "Maths-III", subjectFull: "Mathematics for Information Technology", teacherId: "archana_p", teacherName: "Ms Archana P", isLab: false },
  { id: "a3t3", classId: "AIML3", day: "Tuesday", period: 3, subject: "DSA Lab", subjectFull: "Data Structures Lab", teacherId: "pratibha_gaonkar", teacherName: "Ms Pratibha Ganapati Gaonkar", isLab: true, note: "PGG+SRP+NNV" },
  { id: "a3t4", classId: "AIML3", day: "Tuesday", period: 4, subject: "DSA Lab", subjectFull: "Data Structures Lab", teacherId: "pratibha_gaonkar", teacherName: "Ms Pratibha Ganapati Gaonkar", isLab: true },
  { id: "a3t5", classId: "AIML3", day: "Tuesday", period: 5, subject: "DPD", subjectFull: "Digital Principles & Design", teacherId: "preetha_dsouza", teacherName: "Ms Preetha D'Souza", isLab: false },
  { id: "a3t6", classId: "AIML3", day: "Tuesday", period: 6, subject: "IOT-BE", subjectFull: "Industry Oriented Training – Business Etiquettes", teacherId: "ashwin_shetty", teacherName: "Dr Ashwin Shetty", isLab: false },
  // WEDNESDAY
  { id: "a3w1", classId: "AIML3", day: "Wednesday", period: 1, subject: "DPD", subjectFull: "Digital Principles & Design", teacherId: "preetha_dsouza", teacherName: "Ms Preetha D'Souza", isLab: false },
  { id: "a3w2", classId: "AIML3", day: "Wednesday", period: 2, subject: "IRP", subjectFull: "Introduction to R Programming", teacherId: "shruthi_patil", teacherName: "Ms Shruthi Patil", isLab: false },
  { id: "a3w3", classId: "AIML3", day: "Wednesday", period: 3, subject: "COA", subjectFull: "Computer Organization & Architecture", teacherId: "shajahan_aboobacker", teacherName: "Dr Shajahan Aboobacker", isLab: false },
  { id: "a3w4", classId: "AIML3", day: "Wednesday", period: 4, subject: "DSA", subjectFull: "Data Structures & Applications", teacherId: "pratibha_gaonkar", teacherName: "Ms Pratibha Ganapati Gaonkar", isLab: false },
  { id: "a3w5", classId: "AIML3", day: "Wednesday", period: 5, subject: "DPD Lab", subjectFull: "DPD Lab B2 / OOPJ Lab B1", teacherId: "simi_thomas", teacherName: "Ms Simi P Thomas", isLab: true, note: "B2 (SPT+SGA) / B1 (VJU+SWT)" },
  { id: "a3w6", classId: "AIML3", day: "Wednesday", period: 6, subject: "DPD Lab", subjectFull: "DPD Lab B2 / OOPJ Lab B1", teacherId: "simi_thomas", teacherName: "Ms Simi P Thomas", isLab: true },
  // THURSDAY
  { id: "a3th1", classId: "AIML3", day: "Thursday", period: 1, subject: "Maths-III", subjectFull: "Mathematics for Information Technology", teacherId: "archana_p", teacherName: "Ms Archana P", isLab: false },
  { id: "a3th2", classId: "AIML3", day: "Thursday", period: 2, subject: "DSA", subjectFull: "Data Structures & Applications", teacherId: "pratibha_gaonkar", teacherName: "Ms Pratibha Ganapati Gaonkar", isLab: false },
  { id: "a3th3", classId: "AIML3", day: "Thursday", period: 3, subject: "DPD", subjectFull: "Digital Principles & Design", teacherId: "preetha_dsouza", teacherName: "Ms Preetha D'Souza", isLab: false },
  { id: "a3th4", classId: "AIML3", day: "Thursday", period: 4, subject: "COA", subjectFull: "Computer Organization & Architecture", teacherId: "shajahan_aboobacker", teacherName: "Dr Shajahan Aboobacker", isLab: false },
  { id: "a3th5", classId: "AIML3", day: "Thursday", period: 5, subject: "IRP", subjectFull: "Introduction to R Programming", teacherId: "shruthi_patil", teacherName: "Ms Shruthi Patil", isLab: false },
  { id: "a3th6", classId: "AIML3", day: "Thursday", period: 6, subject: "BFE-III", subjectFull: "Biology for Engineers", teacherId: "namitha_shetty", teacherName: "Ms Namitha Shetty", isLab: false },
  // FRIDAY
  { id: "a3f1", classId: "AIML3", day: "Friday", period: 1, subject: "IEP", subjectFull: "IoT Enabled Prototyping", teacherId: "pujari_tejas", teacherName: "Mr Pujari Tejas Raghu", isLab: false },
  { id: "a3f2", classId: "AIML3", day: "Friday", period: 2, subject: "IEP", subjectFull: "IoT Enabled Prototyping", teacherId: "pujari_tejas", teacherName: "Mr Pujari Tejas Raghu", isLab: false },
  { id: "a3f3", classId: "AIML3", day: "Friday", period: 3, subject: "Maths-III", subjectFull: "Mathematics for Information Technology", teacherId: "archana_p", teacherName: "Ms Archana P", isLab: false },
  { id: "a3f4", classId: "AIML3", day: "Friday", period: 4, subject: "DPD", subjectFull: "Digital Principles & Design", teacherId: "preetha_dsouza", teacherName: "Ms Preetha D'Souza", isLab: false },
  { id: "a3f5", classId: "AIML3", day: "Friday", period: 5, subject: "OOP Tutorial", subjectFull: "OOP Tutorial", teacherId: "vijetha_u", teacherName: "Dr Vijetha U", isLab: false },
  { id: "a3f6", classId: "AIML3", day: "Friday", period: 6, subject: "REMEDIAL", subjectFull: "Remedial Class", teacherId: "archana_p", teacherName: "Ms Archana P", isLab: false },
  // SATURDAY
  { id: "a3s1", classId: "AIML3", day: "Saturday", period: 1, subject: "PBL", subjectFull: "Project Based Learning", teacherId: "shajahan_aboobacker", teacherName: "Dr Shajahan Aboobacker", isLab: false, note: "SJA+HVN" },
  { id: "a3s2", classId: "AIML3", day: "Saturday", period: 2, subject: "PBL", subjectFull: "Project Based Learning", teacherId: "shajahan_aboobacker", teacherName: "Dr Shajahan Aboobacker", isLab: false },
  { id: "a3s3", classId: "AIML3", day: "Saturday", period: 3, subject: "Dept. Activities", subjectFull: "Department Activities", teacherId: "shajahan_aboobacker", teacherName: "Dr Shajahan Aboobacker", isLab: false },

  // ── III Sem BE CSBS (CSBS3, Room 4202) ────────────────────────────────
  // MONDAY
  { id: "c3m1", classId: "CSBS3", day: "Monday", period: 1, subject: "DPD", subjectFull: "Digital Principles & Design", teacherId: "sushma_tantry", teacherName: "Ms Sushma Tantry", isLab: false },
  { id: "c3m2", classId: "CSBS3", day: "Monday", period: 2, subject: "Maths-III", subjectFull: "Mathematics for Computer Science", teacherId: "jagadeesha_b", teacherName: "Dr Jagadeesha B", isLab: false },
  { id: "c3m3", classId: "CSBS3", day: "Monday", period: 3, subject: "BFE-III", subjectFull: "Biology for Engineers", teacherId: "namitha_shetty", teacherName: "Ms Namitha Shetty", isLab: false },
  { id: "c3m4", classId: "CSBS3", day: "Monday", period: 4, subject: "COA", subjectFull: "Computer Organization & Architecture", teacherId: "konanki_surendra", teacherName: "Mr Konanki Surendra", isLab: false },
  { id: "c3m5", classId: "CSBS3", day: "Monday", period: 5, subject: "DPD Lab", subjectFull: "DPD Lab B1 / OOPJ Lab B2", teacherId: "simi_thomas", teacherName: "Ms Simi P Thomas", isLab: true, note: "B1(SPT+SHJ) / B2(ASR+FHA)" },
  { id: "c3m6", classId: "CSBS3", day: "Monday", period: 6, subject: "DPD Lab", subjectFull: "DPD Lab / OOPJ Lab", teacherId: "simi_thomas", teacherName: "Ms Simi P Thomas", isLab: true },
  // TUESDAY
  { id: "c3t1", classId: "CSBS3", day: "Tuesday", period: 1, subject: "COA", subjectFull: "Computer Organization & Architecture", teacherId: "konanki_surendra", teacherName: "Mr Konanki Surendra", isLab: false },
  { id: "c3t2", classId: "CSBS3", day: "Tuesday", period: 2, subject: "DSA", subjectFull: "Data Structures & Applications", teacherId: "teena_james", teacherName: "Ms Teena Annamma James", isLab: false },
  { id: "c3t3", classId: "CSBS3", day: "Tuesday", period: 3, subject: "Maths-III", subjectFull: "Mathematics for Computer Science", teacherId: "jagadeesha_b", teacherName: "Dr Jagadeesha B", isLab: false },
  { id: "c3t4", classId: "CSBS3", day: "Tuesday", period: 4, subject: "DPD", subjectFull: "Digital Principles & Design", teacherId: "sushma_tantry", teacherName: "Ms Sushma Tantry", isLab: false },
  { id: "c3t5", classId: "CSBS3", day: "Tuesday", period: 5, subject: "FOE", subjectFull: "Fundamentals of Economics", teacherId: "manjula_k", teacherName: "Ms Manjula K", isLab: false },
  { id: "c3t6", classId: "CSBS3", day: "Tuesday", period: 6, subject: "OOP Tutorial", subjectFull: "OOP Tutorial", teacherId: "aishwarya_acharya", teacherName: "Ms Aishwarya Acharya", isLab: false },
  // WEDNESDAY
  { id: "c3w1", classId: "CSBS3", day: "Wednesday", period: 1, subject: "DSA", subjectFull: "Data Structures & Applications", teacherId: "teena_james", teacherName: "Ms Teena Annamma James", isLab: false },
  { id: "c3w2", classId: "CSBS3", day: "Wednesday", period: 2, subject: "DPD", subjectFull: "Digital Principles & Design", teacherId: "sushma_tantry", teacherName: "Ms Sushma Tantry", isLab: false },
  { id: "c3w3", classId: "CSBS3", day: "Wednesday", period: 3, subject: "DSA Lab", subjectFull: "DSA Lab", teacherId: "teena_james", teacherName: "Ms Teena Annamma James", isLab: true, note: "TAJ+KKS+SGA" },
  { id: "c3w4", classId: "CSBS3", day: "Wednesday", period: 4, subject: "DSA Lab", subjectFull: "DSA Lab", teacherId: "teena_james", teacherName: "Ms Teena Annamma James", isLab: true },
  { id: "c3w5", classId: "CSBS3", day: "Wednesday", period: 5, subject: "COA", subjectFull: "Computer Organization & Architecture", teacherId: "konanki_surendra", teacherName: "Mr Konanki Surendra", isLab: false },
  { id: "c3w6", classId: "CSBS3", day: "Wednesday", period: 6, subject: "BFE-III", subjectFull: "Biology for Engineers", teacherId: "namitha_shetty", teacherName: "Ms Namitha Shetty", isLab: false },
  { id: "c3w7", classId: "CSBS3", day: "Wednesday", period: 7, subject: "TUTORIAL", subjectFull: "Tutorial", teacherId: "teena_james", teacherName: "Ms Teena Annamma James", isLab: false },
  // THURSDAY
  { id: "c3th1", classId: "CSBS3", day: "Thursday", period: 1, subject: "Maths-III", subjectFull: "Mathematics for Computer Science", teacherId: "jagadeesha_b", teacherName: "Dr Jagadeesha B", isLab: false },
  { id: "c3th2", classId: "CSBS3", day: "Thursday", period: 2, subject: "FOE", subjectFull: "Fundamentals of Economics", teacherId: "manjula_k", teacherName: "Ms Manjula K", isLab: false },
  { id: "c3th3", classId: "CSBS3", day: "Thursday", period: 3, subject: "IEP", subjectFull: "IoT Enabled Prototyping", teacherId: "pratibha_gaonkar", teacherName: "Ms Pratibha Ganapati Gaonkar", isLab: false },
  { id: "c3th4", classId: "CSBS3", day: "Thursday", period: 4, subject: "IEP", subjectFull: "IoT Enabled Prototyping", teacherId: "pratibha_gaonkar", teacherName: "Ms Pratibha Ganapati Gaonkar", isLab: false },
  { id: "c3th5", classId: "CSBS3", day: "Thursday", period: 5, subject: "DSA", subjectFull: "Data Structures & Applications", teacherId: "teena_james", teacherName: "Ms Teena Annamma James", isLab: false },
  { id: "c3th6", classId: "CSBS3", day: "Thursday", period: 6, subject: "IOT-BE", subjectFull: "Industry Oriented Training", teacherId: "ajeeth_b", teacherName: "Mr Ajeeth B", isLab: false },
  // FRIDAY
  { id: "c3f1", classId: "CSBS3", day: "Friday", period: 1, subject: "FOE", subjectFull: "Fundamentals of Economics", teacherId: "manjula_k", teacherName: "Ms Manjula K", isLab: false },
  { id: "c3f2", classId: "CSBS3", day: "Friday", period: 2, subject: "DPD", subjectFull: "Digital Principles & Design", teacherId: "sushma_tantry", teacherName: "Ms Sushma Tantry", isLab: false },
  { id: "c3f3", classId: "CSBS3", day: "Friday", period: 3, subject: "DPD Lab", subjectFull: "DPD Lab B2 / OOPJ Lab B1", teacherId: "sushma_tantry", teacherName: "Ms Sushma Tantry", isLab: true, note: "B2(SMT+SGA) / B1(ASR+DJD)" },
  { id: "c3f4", classId: "CSBS3", day: "Friday", period: 4, subject: "DPD Lab", subjectFull: "DPD Lab B2 / OOPJ Lab B1", teacherId: "sushma_tantry", teacherName: "Ms Sushma Tantry", isLab: true },
  { id: "c3f5", classId: "CSBS3", day: "Friday", period: 5, subject: "Maths-III", subjectFull: "Mathematics for Computer Science", teacherId: "jagadeesha_b", teacherName: "Dr Jagadeesha B", isLab: false },
  { id: "c3f6", classId: "CSBS3", day: "Friday", period: 6, subject: "REMEDIAL", subjectFull: "Remedial Class", teacherId: "jagadeesha_b", teacherName: "Dr Jagadeesha B", isLab: false },
  // SATURDAY
  { id: "c3s1", classId: "CSBS3", day: "Saturday", period: 1, subject: "PBL", subjectFull: "Project Based Learning", teacherId: "teena_james", teacherName: "Ms Teena Annamma James", isLab: false, note: "TAJ+FHA" },
  { id: "c3s2", classId: "CSBS3", day: "Saturday", period: 2, subject: "PBL", subjectFull: "Project Based Learning", teacherId: "teena_james", teacherName: "Ms Teena Annamma James", isLab: false },
  { id: "c3s3", classId: "CSBS3", day: "Saturday", period: 3, subject: "Dept. Activities", subjectFull: "Department Activities", teacherId: "teena_james", teacherName: "Ms Teena Annamma James", isLab: false },

  // ── V Sem BE CSBS (CSBS5, Room 3606) ──────────────────────────────────
  // MONDAY
  { id: "c5m1", classId: "CSBS5", day: "Monday", period: 1, subject: "OR", subjectFull: "Operation Research", teacherId: "shreeranga_bhat", teacherName: "Dr Shreeranga Bhat", isLab: false },
  { id: "c5m2", classId: "CSBS5", day: "Monday", period: 2, subject: "FCA/CCS", subjectFull: "Financial & Cost Accounting / Cyber Security", teacherId: "nelson", teacherName: "Mr Nelson", isLab: false },
  { id: "c5m3", classId: "CSBS5", day: "Monday", period: 3, subject: "CNS", subjectFull: "Computer Networks & Security", teacherId: "renuka_tantry", teacherName: "Ms Renuka Tantry", isLab: false },
  { id: "c5m4", classId: "CSBS5", day: "Monday", period: 4, subject: "DBMS", subjectFull: "Database Management Systems", teacherId: "farha_anjum", teacherName: "Ms Farha Anjum", isLab: false },
  { id: "c5m5", classId: "CSBS5", day: "Monday", period: 5, subject: "CS Lab", subjectFull: "Computational Statistics Lab B1", teacherId: "saleena_ts", teacherName: "Dr Saleena T S", isLab: true, note: "STS+SWT" },
  { id: "c5m6", classId: "CSBS5", day: "Monday", period: 6, subject: "CS Lab", subjectFull: "Computational Statistics Lab B1", teacherId: "saleena_ts", teacherName: "Dr Saleena T S", isLab: true },
  // TUESDAY
  { id: "c5t1", classId: "CSBS5", day: "Tuesday", period: 1, subject: "ETP", subjectFull: "Emerging Technologies: A Primer", teacherId: "saleena_ts", teacherName: "Dr Saleena T S", isLab: false, note: "STS+RNT" },
  { id: "c5t2", classId: "CSBS5", day: "Tuesday", period: 2, subject: "ETP", subjectFull: "Emerging Technologies: A Primer", teacherId: "saleena_ts", teacherName: "Dr Saleena T S", isLab: false },
  { id: "c5t3", classId: "CSBS5", day: "Tuesday", period: 3, subject: "DBMS", subjectFull: "Database Management Systems", teacherId: "farha_anjum", teacherName: "Ms Farha Anjum", isLab: false },
  { id: "c5t4", classId: "CSBS5", day: "Tuesday", period: 4, subject: "FCA/CCS", subjectFull: "Financial & Cost Accounting / Cyber Security", teacherId: "nelson", teacherName: "Mr Nelson", isLab: false },
  { id: "c5t5", classId: "CSBS5", day: "Tuesday", period: 5, subject: "FOM", subjectFull: "Fundamentals of Management", teacherId: "deepthi_dinesh", teacherName: "Ms Deepthi Dinesh", isLab: false },
  { id: "c5t6", classId: "CSBS5", day: "Tuesday", period: 6, subject: "OR", subjectFull: "Operation Research", teacherId: "shreeranga_bhat", teacherName: "Dr Shreeranga Bhat", isLab: false },
  { id: "c5t7", classId: "CSBS5", day: "Tuesday", period: 7, subject: "TUTORIAL", subjectFull: "Tutorial", teacherId: "farha_anjum", teacherName: "Ms Farha Anjum", isLab: false },
  // WEDNESDAY
  { id: "c5w1", classId: "CSBS5", day: "Wednesday", period: 1, subject: "CNS", subjectFull: "Computer Networks & Security", teacherId: "renuka_tantry", teacherName: "Ms Renuka Tantry", isLab: false },
  { id: "c5w2", classId: "CSBS5", day: "Wednesday", period: 2, subject: "OR", subjectFull: "Operation Research", teacherId: "shreeranga_bhat", teacherName: "Dr Shreeranga Bhat", isLab: false },
  { id: "c5w3", classId: "CSBS5", day: "Wednesday", period: 3, subject: "FCA/CCS", subjectFull: "Financial & Cost Accounting / Cyber Security", teacherId: "nelson", teacherName: "Mr Nelson", isLab: false },
  { id: "c5w4", classId: "CSBS5", day: "Wednesday", period: 4, subject: "FOM", subjectFull: "Fundamentals of Management", teacherId: "deepthi_dinesh", teacherName: "Ms Deepthi Dinesh", isLab: false },
  { id: "c5w5", classId: "CSBS5", day: "Wednesday", period: 5, subject: "DBMS Lab", subjectFull: "DBMS Lab", teacherId: "farha_anjum", teacherName: "Ms Farha Anjum", isLab: true, note: "FHA+DKS+NNV" },
  { id: "c5w6", classId: "CSBS5", day: "Wednesday", period: 6, subject: "DBMS Lab", subjectFull: "DBMS Lab", teacherId: "farha_anjum", teacherName: "Ms Farha Anjum", isLab: true },
  // THURSDAY
  { id: "c5th1", classId: "CSBS5", day: "Thursday", period: 1, subject: "CNS Lab", subjectFull: "Computer Networks & Security Lab", teacherId: "renuka_tantry", teacherName: "Ms Renuka Tantry", isLab: true, note: "RNT+FHA+SVG" },
  { id: "c5th2", classId: "CSBS5", day: "Thursday", period: 2, subject: "CNS Lab", subjectFull: "Computer Networks & Security Lab", teacherId: "renuka_tantry", teacherName: "Ms Renuka Tantry", isLab: true },
  { id: "c5th3", classId: "CSBS5", day: "Thursday", period: 3, subject: "FOM", subjectFull: "Fundamentals of Management", teacherId: "deepthi_dinesh", teacherName: "Ms Deepthi Dinesh", isLab: false },
  { id: "c5th4", classId: "CSBS5", day: "Thursday", period: 4, subject: "OR", subjectFull: "Operation Research", teacherId: "shreeranga_bhat", teacherName: "Dr Shreeranga Bhat", isLab: false },
  { id: "c5th5", classId: "CSBS5", day: "Thursday", period: 5, subject: "DBMS", subjectFull: "Database Management Systems", teacherId: "farha_anjum", teacherName: "Ms Farha Anjum", isLab: false },
  { id: "c5th6", classId: "CSBS5", day: "Thursday", period: 6, subject: "CNS", subjectFull: "Computer Networks & Security", teacherId: "renuka_tantry", teacherName: "Ms Renuka Tantry", isLab: false },
  // FRIDAY
  { id: "c5f1", classId: "CSBS5", day: "Friday", period: 1, subject: "CS Lab", subjectFull: "CS Lab B2", teacherId: "saleena_ts", teacherName: "Dr Saleena T S", isLab: true, note: "STS+GMN" },
  { id: "c5f2", classId: "CSBS5", day: "Friday", period: 2, subject: "CS Lab", subjectFull: "CS Lab B2", teacherId: "saleena_ts", teacherName: "Dr Saleena T S", isLab: true },
  { id: "c5f3", classId: "CSBS5", day: "Friday", period: 3, subject: "RMIPR", subjectFull: "Research Methodology & Intellectual Property Rights", teacherId: "purushothama_chippar", teacherName: "Dr Purushothama Chippar", isLab: false },
  { id: "c5f4", classId: "CSBS5", day: "Friday", period: 4, subject: "RMIPR", subjectFull: "Research Methodology & Intellectual Property Rights", teacherId: "purushothama_chippar", teacherName: "Dr Purushothama Chippar", isLab: false },
  { id: "c5f5", classId: "CSBS5", day: "Friday", period: 5, subject: "CS Lab Tutorial", subjectFull: "CS Lab Tutorial", teacherId: "saleena_ts", teacherName: "Dr Saleena T S", isLab: false },
  { id: "c5f6", classId: "CSBS5", day: "Friday", period: 6, subject: "REMEDIAL", subjectFull: "Remedial Class", teacherId: "farha_anjum", teacherName: "Ms Farha Anjum", isLab: false },
  // SATURDAY
  { id: "c5s1", classId: "CSBS5", day: "Saturday", period: 1, subject: "PBL", subjectFull: "Project Based Learning", teacherId: "renuka_tantry", teacherName: "Ms Renuka Tantry", isLab: false, note: "RNT+NNV" },
  { id: "c5s2", classId: "CSBS5", day: "Saturday", period: 2, subject: "PBL", subjectFull: "Project Based Learning", teacherId: "renuka_tantry", teacherName: "Ms Renuka Tantry", isLab: false },
  { id: "c5s3", classId: "CSBS5", day: "Saturday", period: 3, subject: "Dept. Activities", subjectFull: "Department Activities", teacherId: "farha_anjum", teacherName: "Ms Farha Anjum", isLab: false },

  // ── V Sem BE AIML (AIML5, Room 3605) ──────────────────────────────────
  // MONDAY
  { id: "a5m1", classId: "AIML5", day: "Monday", period: 1, subject: "FAIML", subjectFull: "Fundamentals of AI & ML", teacherId: "shruthi_patil", teacherName: "Ms Shruthi Patil", isLab: false },
  { id: "a5m2", classId: "AIML5", day: "Monday", period: 2, subject: "CCS/BI", subjectFull: "Cryptography & Cyber Security / Business Intelligence", teacherId: "shivaganesh", teacherName: "Mr Shivaganesh", isLab: false },
  { id: "a5m3", classId: "AIML5", day: "Monday", period: 3, subject: "SEPM", subjectFull: "Software Engineering & Project Management", teacherId: "aishwarya_acharya", teacherName: "Ms Aishwarya Acharya", isLab: false },
  { id: "a5m4", classId: "AIML5", day: "Monday", period: 4, subject: "TOC", subjectFull: "Theory of Computation", teacherId: "harivinod_n", teacherName: "Dr Harivinod N", isLab: false },
  { id: "a5m5", classId: "AIML5", day: "Monday", period: 5, subject: "DV Lab", subjectFull: "Data Visualization Lab B1", teacherId: "pratibha_gaonkar", teacherName: "Ms Pratibha Ganapati Gaonkar", isLab: true, note: "PGG+SUJ" },
  { id: "a5m6", classId: "AIML5", day: "Monday", period: 6, subject: "DV Lab", subjectFull: "Data Visualization Lab B1", teacherId: "pratibha_gaonkar", teacherName: "Ms Pratibha Ganapati Gaonkar", isLab: true },
  { id: "a5m7", classId: "AIML5", day: "Monday", period: 7, subject: "TUTORIAL", subjectFull: "Tutorial", teacherId: "shruthi_patil", teacherName: "Ms Shruthi Patil", isLab: false },
  // TUESDAY
  { id: "a5t1", classId: "AIML5", day: "Tuesday", period: 1, subject: "CN", subjectFull: "Computer Networks", teacherId: "devikrishna_ks", teacherName: "Ms Devikrishna K S", isLab: false },
  { id: "a5t2", classId: "AIML5", day: "Tuesday", period: 2, subject: "RMIPR", subjectFull: "Research Methodology & IPR", teacherId: "sudheer_m", teacherName: "Dr Sudheer M", isLab: false },
  { id: "a5t3", classId: "AIML5", day: "Tuesday", period: 3, subject: "SEPM", subjectFull: "Software Engineering & Project Management", teacherId: "aishwarya_acharya", teacherName: "Ms Aishwarya Acharya", isLab: false },
  { id: "a5t4", classId: "AIML5", day: "Tuesday", period: 4, subject: "CCS/BI", subjectFull: "Cryptography & Cyber Security / Business Intelligence", teacherId: "shivaganesh", teacherName: "Mr Shivaganesh", isLab: false },
  { id: "a5t5", classId: "AIML5", day: "Tuesday", period: 5, subject: "CN Lab", subjectFull: "Computer Networks Lab", teacherId: "devikrishna_ks", teacherName: "Ms Devikrishna K S", isLab: true, note: "DKS+RNT+SUJ" },
  { id: "a5t6", classId: "AIML5", day: "Tuesday", period: 6, subject: "CN Lab", subjectFull: "Computer Networks Lab", teacherId: "devikrishna_ks", teacherName: "Ms Devikrishna K S", isLab: true },
  // WEDNESDAY
  { id: "a5w1", classId: "AIML5", day: "Wednesday", period: 1, subject: "DV Lab", subjectFull: "Data Visualization Lab B2", teacherId: "pratibha_gaonkar", teacherName: "Ms Pratibha Ganapati Gaonkar", isLab: true, note: "PGG+STS" },
  { id: "a5w2", classId: "AIML5", day: "Wednesday", period: 2, subject: "DV Lab", subjectFull: "Data Visualization Lab B2", teacherId: "pratibha_gaonkar", teacherName: "Ms Pratibha Ganapati Gaonkar", isLab: true },
  { id: "a5w3", classId: "AIML5", day: "Wednesday", period: 3, subject: "CCS/BI", subjectFull: "Cryptography & Cyber Security / Business Intelligence", teacherId: "shivaganesh", teacherName: "Mr Shivaganesh", isLab: false },
  { id: "a5w4", classId: "AIML5", day: "Wednesday", period: 4, subject: "CN", subjectFull: "Computer Networks", teacherId: "devikrishna_ks", teacherName: "Ms Devikrishna K S", isLab: false },
  { id: "a5w5", classId: "AIML5", day: "Wednesday", period: 5, subject: "TOC", subjectFull: "Theory of Computation", teacherId: "harivinod_n", teacherName: "Dr Harivinod N", isLab: false },
  { id: "a5w6", classId: "AIML5", day: "Wednesday", period: 6, subject: "FAIML", subjectFull: "Fundamentals of AI & ML", teacherId: "shruthi_patil", teacherName: "Ms Shruthi Patil", isLab: false },
  // THURSDAY
  { id: "a5th1", classId: "AIML5", day: "Thursday", period: 1, subject: "TOC", subjectFull: "Theory of Computation", teacherId: "harivinod_n", teacherName: "Dr Harivinod N", isLab: false },
  { id: "a5th2", classId: "AIML5", day: "Thursday", period: 2, subject: "CN", subjectFull: "Computer Networks", teacherId: "devikrishna_ks", teacherName: "Ms Devikrishna K S", isLab: false },
  { id: "a5th3", classId: "AIML5", day: "Thursday", period: 3, subject: "FAIML Lab", subjectFull: "FAIML Lab", teacherId: "shruthi_patil", teacherName: "Ms Shruthi Patil", isLab: true, note: "SRP+SUJ+PTR" },
  { id: "a5th4", classId: "AIML5", day: "Thursday", period: 4, subject: "FAIML Lab", subjectFull: "FAIML Lab", teacherId: "shruthi_patil", teacherName: "Ms Shruthi Patil", isLab: true },
  { id: "a5th5", classId: "AIML5", day: "Thursday", period: 5, subject: "RMIPR", subjectFull: "Research Methodology & IPR", teacherId: "sudheer_m", teacherName: "Dr Sudheer M", isLab: false },
  { id: "a5th6", classId: "AIML5", day: "Thursday", period: 6, subject: "SEPM", subjectFull: "Software Engineering & Project Management", teacherId: "aishwarya_acharya", teacherName: "Ms Aishwarya Acharya", isLab: false },
  // FRIDAY
  { id: "a5f1", classId: "AIML5", day: "Friday", period: 1, subject: "ETP", subjectFull: "Emerging Technologies: A Primer", teacherId: "shivaganesh", teacherName: "Mr Shivaganesh", isLab: false, note: "SVG+FHA" },
  { id: "a5f2", classId: "AIML5", day: "Friday", period: 2, subject: "ETP", subjectFull: "Emerging Technologies: A Primer", teacherId: "shivaganesh", teacherName: "Mr Shivaganesh", isLab: false },
  { id: "a5f3", classId: "AIML5", day: "Friday", period: 3, subject: "TOC", subjectFull: "Theory of Computation", teacherId: "harivinod_n", teacherName: "Dr Harivinod N", isLab: false },
  { id: "a5f4", classId: "AIML5", day: "Friday", period: 4, subject: "FAIML", subjectFull: "Fundamentals of AI & ML", teacherId: "shruthi_patil", teacherName: "Ms Shruthi Patil", isLab: false },
  { id: "a5f5", classId: "AIML5", day: "Friday", period: 5, subject: "DV Lab Tutorial", subjectFull: "Data Visualization Lab Tutorial", teacherId: "pratibha_gaonkar", teacherName: "Ms Pratibha Ganapati Gaonkar", isLab: false },
  { id: "a5f6", classId: "AIML5", day: "Friday", period: 6, subject: "REMEDIAL", subjectFull: "Remedial Class", teacherId: "shruthi_patil", teacherName: "Ms Shruthi Patil", isLab: false },
  // SATURDAY
  { id: "a5s1", classId: "AIML5", day: "Saturday", period: 1, subject: "PBL", subjectFull: "Project Based Learning", teacherId: "shruthi_patil", teacherName: "Ms Shruthi Patil", isLab: false, note: "SRP+DKS" },
  { id: "a5s2", classId: "AIML5", day: "Saturday", period: 2, subject: "PBL", subjectFull: "Project Based Learning", teacherId: "shruthi_patil", teacherName: "Ms Shruthi Patil", isLab: false },

  // ── V Sem BE CSDS (CSDS5, Room 2407) ──────────────────────────────────
  // MONDAY
  { id: "d5m1", classId: "CSDS5", day: "Monday", period: 1, subject: "PDS", subjectFull: "Principles of Data Science", teacherId: "teena_james", teacherName: "Ms Teena Annamma James", isLab: false },
  { id: "d5m2", classId: "CSDS5", day: "Monday", period: 2, subject: "CN", subjectFull: "Computer Networks", teacherId: "devikrishna_ks", teacherName: "Ms Devikrishna K S", isLab: false },
  { id: "d5m3", classId: "CSDS5", day: "Monday", period: 3, subject: "CN Lab", subjectFull: "Computer Networks Lab", teacherId: "devikrishna_ks", teacherName: "Ms Devikrishna K S", isLab: true, note: "DKS+SVG+ANS" },
  { id: "d5m4", classId: "CSDS5", day: "Monday", period: 4, subject: "CN Lab", subjectFull: "Computer Networks Lab", teacherId: "devikrishna_ks", teacherName: "Ms Devikrishna K S", isLab: true },
  { id: "d5m5", classId: "CSDS5", day: "Monday", period: 5, subject: "RMIPR", subjectFull: "Research Methodology & IPR", teacherId: "swaraj_lewis", teacherName: "Dr Swaraj D Lewis", isLab: false },
  { id: "d5m6", classId: "CSDS5", day: "Monday", period: 6, subject: "ETP", subjectFull: "Emerging Technologies: A Primer", teacherId: "vijetha_u", teacherName: "Dr Vijetha U", isLab: false, note: "VJU+GMN" },
  { id: "d5m7", classId: "CSDS5", day: "Monday", period: 7, subject: "ETP", subjectFull: "Emerging Technologies: A Primer", teacherId: "vijetha_u", teacherName: "Dr Vijetha U", isLab: false },
  // TUESDAY
  { id: "d5t1", classId: "CSDS5", day: "Tuesday", period: 1, subject: "DV Lab", subjectFull: "Data Visualization Lab B1", teacherId: "pujari_tejas", teacherName: "Mr Pujari Tejas Raghu", isLab: true, note: "PTR+SUJ" },
  { id: "d5t2", classId: "CSDS5", day: "Tuesday", period: 2, subject: "DV Lab", subjectFull: "Data Visualization Lab B1", teacherId: "pujari_tejas", teacherName: "Mr Pujari Tejas Raghu", isLab: true },
  { id: "d5t3", classId: "CSDS5", day: "Tuesday", period: 3, subject: "SEPM", subjectFull: "Software Engineering & Project Management", teacherId: "shruthi_anchan", teacherName: "Ms Shruthi K Anchan", isLab: false },
  { id: "d5t4", classId: "CSDS5", day: "Tuesday", period: 4, subject: "PDS", subjectFull: "Principles of Data Science", teacherId: "teena_james", teacherName: "Ms Teena Annamma James", isLab: false },
  { id: "d5t5", classId: "CSDS5", day: "Tuesday", period: 5, subject: "BI", subjectFull: "Business Intelligence", teacherId: "davor_dsouza", teacherName: "Mr Davor John D'souza", isLab: false },
  { id: "d5t6", classId: "CSDS5", day: "Tuesday", period: 6, subject: "TUTORIAL", subjectFull: "Tutorial", teacherId: "saleena_ts", teacherName: "Dr Saleena T S", isLab: false },
  // WEDNESDAY
  { id: "d5w1", classId: "CSDS5", day: "Wednesday", period: 1, subject: "BI", subjectFull: "Business Intelligence", teacherId: "davor_dsouza", teacherName: "Mr Davor John D'souza", isLab: false },
  { id: "d5w2", classId: "CSDS5", day: "Wednesday", period: 2, subject: "RMIPR", subjectFull: "Research Methodology & IPR", teacherId: "swaraj_lewis", teacherName: "Dr Swaraj D Lewis", isLab: false },
  { id: "d5w3", classId: "CSDS5", day: "Wednesday", period: 3, subject: "FAIML", subjectFull: "Fundamentals of AI & ML", teacherId: "saleena_ts", teacherName: "Dr Saleena T S", isLab: false },
  { id: "d5w4", classId: "CSDS5", day: "Wednesday", period: 4, subject: "SEPM", subjectFull: "Software Engineering & Project Management", teacherId: "shruthi_anchan", teacherName: "Ms Shruthi K Anchan", isLab: false },
  { id: "d5w5", classId: "CSDS5", day: "Wednesday", period: 5, subject: "DV Lab", subjectFull: "Data Visualization Lab B2", teacherId: "pujari_tejas", teacherName: "Mr Pujari Tejas Raghu", isLab: true, note: "PTR+PGG" },
  { id: "d5w6", classId: "CSDS5", day: "Wednesday", period: 6, subject: "DV Lab", subjectFull: "Data Visualization Lab B2", teacherId: "pujari_tejas", teacherName: "Mr Pujari Tejas Raghu", isLab: true },
  // THURSDAY
  { id: "d5th1", classId: "CSDS5", day: "Thursday", period: 1, subject: "FAIML", subjectFull: "Fundamentals of AI & ML", teacherId: "saleena_ts", teacherName: "Dr Saleena T S", isLab: false },
  { id: "d5th2", classId: "CSDS5", day: "Thursday", period: 2, subject: "PDS", subjectFull: "Principles of Data Science", teacherId: "teena_james", teacherName: "Ms Teena Annamma James", isLab: false },
  { id: "d5th3", classId: "CSDS5", day: "Thursday", period: 3, subject: "CN", subjectFull: "Computer Networks", teacherId: "devikrishna_ks", teacherName: "Ms Devikrishna K S", isLab: false },
  { id: "d5th4", classId: "CSDS5", day: "Thursday", period: 4, subject: "BI", subjectFull: "Business Intelligence", teacherId: "davor_dsouza", teacherName: "Mr Davor John D'souza", isLab: false },
  { id: "d5th5", classId: "CSDS5", day: "Thursday", period: 5, subject: "FAIML Lab", subjectFull: "FAIML Lab", teacherId: "saleena_ts", teacherName: "Dr Saleena T S", isLab: true, note: "STS+DKS+SJA" },
  { id: "d5th6", classId: "CSDS5", day: "Thursday", period: 6, subject: "FAIML Lab", subjectFull: "FAIML Lab", teacherId: "saleena_ts", teacherName: "Dr Saleena T S", isLab: true },
  // FRIDAY
  { id: "d5f1", classId: "CSDS5", day: "Friday", period: 1, subject: "CN", subjectFull: "Computer Networks", teacherId: "devikrishna_ks", teacherName: "Ms Devikrishna K S", isLab: false },
  { id: "d5f2", classId: "CSDS5", day: "Friday", period: 2, subject: "SEPM", subjectFull: "Software Engineering & Project Management", teacherId: "shruthi_anchan", teacherName: "Ms Shruthi K Anchan", isLab: false },
  { id: "d5f3", classId: "CSDS5", day: "Friday", period: 3, subject: "FAIML", subjectFull: "Fundamentals of AI & ML", teacherId: "saleena_ts", teacherName: "Dr Saleena T S", isLab: false },
  { id: "d5f4", classId: "CSDS5", day: "Friday", period: 4, subject: "PDS", subjectFull: "Principles of Data Science", teacherId: "teena_james", teacherName: "Ms Teena Annamma James", isLab: false },
  { id: "d5f5", classId: "CSDS5", day: "Friday", period: 5, subject: "DV Lab Tutorial", subjectFull: "Data Visualization Lab Tutorial", teacherId: "pujari_tejas", teacherName: "Mr Pujari Tejas Raghu", isLab: false },
  { id: "d5f6", classId: "CSDS5", day: "Friday", period: 6, subject: "REMEDIAL", subjectFull: "Remedial Class", teacherId: "saleena_ts", teacherName: "Dr Saleena T S", isLab: false },
  // SATURDAY
  { id: "d5s1", classId: "CSDS5", day: "Saturday", period: 1, subject: "PBL", subjectFull: "Project Based Learning", teacherId: "davor_dsouza", teacherName: "Mr Davor John D'souza", isLab: false, note: "DKS+SRP" },
  { id: "d5s2", classId: "CSDS5", day: "Saturday", period: 2, subject: "PBL", subjectFull: "Project Based Learning", teacherId: "davor_dsouza", teacherName: "Mr Davor John D'souza", isLab: false },

  // ── VII Sem BE CSBS (CSBS7, Room 3604) ────────────────────────────────
  // MONDAY
  { id: "c7m1", classId: "CSBS7", day: "Monday", period: 1, subject: "SCM", subjectFull: "Supply Chain Management", teacherId: "oshwin_sequeira", teacherName: "Ms Oshwin Priyanka Sequeira", isLab: false },
  { id: "c7m2", classId: "CSBS7", day: "Monday", period: 2, subject: "UDSA", subjectFull: "Usability Design of Software Applications", teacherId: "pujari_tejas", teacherName: "Mr Pujari Tejas Raghu", isLab: false },
  { id: "c7m3", classId: "CSBS7", day: "Monday", period: 3, subject: "BIDA Lab", subjectFull: "BIDA Lab B1 / UDSA Lab B2", teacherId: "susmitha_john", teacherName: "Ms Susmitha John", isLab: true, note: "B1(SUJ+SKA) / B2(PTR+DJD)" },
  { id: "c7m4", classId: "CSBS7", day: "Monday", period: 4, subject: "BIDA Lab", subjectFull: "BIDA Lab B1 / UDSA Lab B2", teacherId: "susmitha_john", teacherName: "Ms Susmitha John", isLab: true },
  { id: "c7m5", classId: "CSBS7", day: "Monday", period: 5, subject: "TUTORIAL", subjectFull: "Tutorial", teacherId: "susmitha_john", teacherName: "Ms Susmitha John", isLab: false },
  // TUESDAY
  { id: "c7t1", classId: "CSBS7", day: "Tuesday", period: 1, subject: "CC", subjectFull: "Cloud Computing", teacherId: "aishwarya_acharya", teacherName: "Ms Aishwarya Acharya", isLab: false },
  { id: "c7t2", classId: "CSBS7", day: "Tuesday", period: 2, subject: "SCM", subjectFull: "Supply Chain Management", teacherId: "oshwin_sequeira", teacherName: "Ms Oshwin Priyanka Sequeira", isLab: false },
  { id: "c7t3", classId: "CSBS7", day: "Tuesday", period: 3, subject: "Project Lab", subjectFull: "Major Project Lab", teacherId: "gayana_mn", teacherName: "Ms Gayana M N", isLab: true, note: "GMN+SJA" },
  { id: "c7t4", classId: "CSBS7", day: "Tuesday", period: 4, subject: "Project Lab", subjectFull: "Major Project Lab", teacherId: "gayana_mn", teacherName: "Ms Gayana M N", isLab: true },
  { id: "c7t5", classId: "CSBS7", day: "Tuesday", period: 5, subject: "Project Work", subjectFull: "Major Project Work", teacherId: "gayana_mn", teacherName: "Ms Gayana M N", isLab: true },
  { id: "c7t6", classId: "CSBS7", day: "Tuesday", period: 6, subject: "Project Work", subjectFull: "Major Project Work", teacherId: "gayana_mn", teacherName: "Ms Gayana M N", isLab: true },
  // WEDNESDAY
  { id: "c7w1", classId: "CSBS7", day: "Wednesday", period: 1, subject: "BIDA", subjectFull: "Business Intelligence & Data Analytics", teacherId: "susmitha_john", teacherName: "Ms Susmitha John", isLab: false },
  { id: "c7w2", classId: "CSBS7", day: "Wednesday", period: 2, subject: "SCM", subjectFull: "Supply Chain Management", teacherId: "oshwin_sequeira", teacherName: "Ms Oshwin Priyanka Sequeira", isLab: false },
  { id: "c7w3", classId: "CSBS7", day: "Wednesday", period: 3, subject: "UDSA", subjectFull: "Usability Design of Software Applications", teacherId: "pujari_tejas", teacherName: "Mr Pujari Tejas Raghu", isLab: false },
  { id: "c7w4", classId: "CSBS7", day: "Wednesday", period: 4, subject: "CC", subjectFull: "Cloud Computing", teacherId: "aishwarya_acharya", teacherName: "Ms Aishwarya Acharya", isLab: false },
  { id: "c7w5", classId: "CSBS7", day: "Wednesday", period: 5, subject: "PBL", subjectFull: "Project Based Learning", teacherId: "susmitha_john", teacherName: "Ms Susmitha John", isLab: false, note: "ASR+KKS" },
  { id: "c7w6", classId: "CSBS7", day: "Wednesday", period: 6, subject: "PBL", subjectFull: "Project Based Learning", teacherId: "susmitha_john", teacherName: "Ms Susmitha John", isLab: false },
  // THURSDAY
  { id: "c7th1", classId: "CSBS7", day: "Thursday", period: 1, subject: "UDSA", subjectFull: "Usability Design of Software Applications", teacherId: "pujari_tejas", teacherName: "Mr Pujari Tejas Raghu", isLab: false },
  { id: "c7th2", classId: "CSBS7", day: "Thursday", period: 2, subject: "BIDA", subjectFull: "Business Intelligence & Data Analytics", teacherId: "susmitha_john", teacherName: "Ms Susmitha John", isLab: false },
  { id: "c7th3", classId: "CSBS7", day: "Thursday", period: 3, subject: "Project Lab", subjectFull: "Major Project Lab", teacherId: "gayana_mn", teacherName: "Ms Gayana M N", isLab: true, note: "GMN+TAJ" },
  { id: "c7th4", classId: "CSBS7", day: "Thursday", period: 4, subject: "Project Lab", subjectFull: "Major Project Lab", teacherId: "gayana_mn", teacherName: "Ms Gayana M N", isLab: true },
  { id: "c7th5", classId: "CSBS7", day: "Thursday", period: 5, subject: "Project Work", subjectFull: "Major Project Work", teacherId: "gayana_mn", teacherName: "Ms Gayana M N", isLab: true },
  { id: "c7th6", classId: "CSBS7", day: "Thursday", period: 6, subject: "Project Work", subjectFull: "Major Project Work", teacherId: "gayana_mn", teacherName: "Ms Gayana M N", isLab: true },
  // FRIDAY
  { id: "c7f1", classId: "CSBS7", day: "Friday", period: 1, subject: "CC", subjectFull: "Cloud Computing", teacherId: "aishwarya_acharya", teacherName: "Ms Aishwarya Acharya", isLab: false },
  { id: "c7f2", classId: "CSBS7", day: "Friday", period: 2, subject: "BIDA", subjectFull: "Business Intelligence & Data Analytics", teacherId: "susmitha_john", teacherName: "Ms Susmitha John", isLab: false },
  { id: "c7f3", classId: "CSBS7", day: "Friday", period: 3, subject: "BIDA Lab", subjectFull: "BIDA Lab B2 / UDSA Lab B1", teacherId: "susmitha_john", teacherName: "Ms Susmitha John", isLab: true, note: "B2(SUJ+DKS) / B1(PTR+KKS)" },
  { id: "c7f4", classId: "CSBS7", day: "Friday", period: 4, subject: "BIDA Lab", subjectFull: "BIDA Lab B2 / UDSA Lab B1", teacherId: "susmitha_john", teacherName: "Ms Susmitha John", isLab: true },
  { id: "c7f5", classId: "CSBS7", day: "Friday", period: 5, subject: "REMEDIAL", subjectFull: "Remedial Class", teacherId: "susmitha_john", teacherName: "Ms Susmitha John", isLab: false },

  // ── VII Sem BE CSDS (CSDS7, Room 3603) ────────────────────────────────
  // MONDAY
  { id: "d7m1", classId: "CSDS7", day: "Monday", period: 1, subject: "ADS", subjectFull: "Advanced Data Science", teacherId: "davor_dsouza", teacherName: "Mr Davor John D'souza", isLab: false },
  { id: "d7m2", classId: "CSDS7", day: "Monday", period: 2, subject: "BDA/SNA", subjectFull: "Big Data Analytics / Social Network Analysis", teacherId: "shruthi_anchan", teacherName: "Ms Shruthi K Anchan", isLab: false },
  { id: "d7m3", classId: "CSDS7", day: "Monday", period: 3, subject: "Project Lab", subjectFull: "Major Project Lab", teacherId: "davor_dsouza", teacherName: "Mr Davor John D'souza", isLab: true, note: "SRP+STS" },
  { id: "d7m4", classId: "CSDS7", day: "Monday", period: 4, subject: "Project Lab", subjectFull: "Major Project Lab", teacherId: "davor_dsouza", teacherName: "Mr Davor John D'souza", isLab: true },
  { id: "d7m5", classId: "CSDS7", day: "Monday", period: 5, subject: "TUTORIAL", subjectFull: "Tutorial", teacherId: "davor_dsouza", teacherName: "Mr Davor John D'souza", isLab: false },
  // TUESDAY
  { id: "d7t1", classId: "CSDS7", day: "Tuesday", period: 1, subject: "ADS Lab", subjectFull: "ADS Lab B1 / IRA Lab B2", teacherId: "davor_dsouza", teacherName: "Mr Davor John D'souza", isLab: true, note: "DJD+SKA / SHB+SVG" },
  { id: "d7t2", classId: "CSDS7", day: "Tuesday", period: 2, subject: "ADS Lab", subjectFull: "ADS Lab B1 / IRA Lab B2", teacherId: "davor_dsouza", teacherName: "Mr Davor John D'souza", isLab: true },
  { id: "d7t3", classId: "CSDS7", day: "Tuesday", period: 3, subject: "IRA", subjectFull: "Information Retrieval & Applications", teacherId: "shabina_bhaskar", teacherName: "Dr Shabina Bhaskar", isLab: false },
  { id: "d7t4", classId: "CSDS7", day: "Tuesday", period: 4, subject: "ADS", subjectFull: "Advanced Data Science", teacherId: "davor_dsouza", teacherName: "Mr Davor John D'souza", isLab: false },
  { id: "d7t5", classId: "CSDS7", day: "Tuesday", period: 5, subject: "Project Work", subjectFull: "Major Project Work", teacherId: "davor_dsouza", teacherName: "Mr Davor John D'souza", isLab: true },
  { id: "d7t6", classId: "CSDS7", day: "Tuesday", period: 6, subject: "Project Work", subjectFull: "Major Project Work", teacherId: "davor_dsouza", teacherName: "Mr Davor John D'souza", isLab: true },
  // WEDNESDAY
  { id: "d7w1", classId: "CSDS7", day: "Wednesday", period: 1, subject: "CC", subjectFull: "Cloud Computing", teacherId: "shivaganesh", teacherName: "Mr Shivaganesh", isLab: false },
  { id: "d7w2", classId: "CSDS7", day: "Wednesday", period: 2, subject: "IRA", subjectFull: "Information Retrieval & Applications", teacherId: "shabina_bhaskar", teacherName: "Dr Shabina Bhaskar", isLab: false },
  { id: "d7w3", classId: "CSDS7", day: "Wednesday", period: 3, subject: "Project Lab", subjectFull: "Major Project Lab", teacherId: "davor_dsouza", teacherName: "Mr Davor John D'souza", isLab: true, note: "SRP+HVN" },
  { id: "d7w4", classId: "CSDS7", day: "Wednesday", period: 4, subject: "Project Lab", subjectFull: "Major Project Lab", teacherId: "davor_dsouza", teacherName: "Mr Davor John D'souza", isLab: true },
  { id: "d7w5", classId: "CSDS7", day: "Wednesday", period: 5, subject: "PBL", subjectFull: "Project Based Learning", teacherId: "davor_dsouza", teacherName: "Mr Davor John D'souza", isLab: false, note: "DJD+STS" },
  { id: "d7w6", classId: "CSDS7", day: "Wednesday", period: 6, subject: "PBL", subjectFull: "Project Based Learning", teacherId: "davor_dsouza", teacherName: "Mr Davor John D'souza", isLab: false },
  // THURSDAY
  { id: "d7th1", classId: "CSDS7", day: "Thursday", period: 1, subject: "ADS Lab", subjectFull: "ADS Lab B2 / IRA Lab B1", teacherId: "davor_dsouza", teacherName: "Mr Davor John D'souza", isLab: true, note: "DJD+KKS / SHB+ASR" },
  { id: "d7th2", classId: "CSDS7", day: "Thursday", period: 2, subject: "ADS Lab", subjectFull: "ADS Lab B2 / IRA Lab B1", teacherId: "davor_dsouza", teacherName: "Mr Davor John D'souza", isLab: true },
  { id: "d7th3", classId: "CSDS7", day: "Thursday", period: 3, subject: "BDA/SNA", subjectFull: "Big Data Analytics / Social Network Analysis", teacherId: "shruthi_anchan", teacherName: "Ms Shruthi K Anchan", isLab: false },
  { id: "d7th4", classId: "CSDS7", day: "Thursday", period: 4, subject: "CC", subjectFull: "Cloud Computing", teacherId: "shivaganesh", teacherName: "Mr Shivaganesh", isLab: false },
  { id: "d7th5", classId: "CSDS7", day: "Thursday", period: 5, subject: "Project Work", subjectFull: "Major Project Work", teacherId: "davor_dsouza", teacherName: "Mr Davor John D'souza", isLab: true },
  { id: "d7th6", classId: "CSDS7", day: "Thursday", period: 6, subject: "Project Work", subjectFull: "Major Project Work", teacherId: "davor_dsouza", teacherName: "Mr Davor John D'souza", isLab: true },
  // FRIDAY
  { id: "d7f1", classId: "CSDS7", day: "Friday", period: 1, subject: "IRA", subjectFull: "Information Retrieval & Applications", teacherId: "shabina_bhaskar", teacherName: "Dr Shabina Bhaskar", isLab: false },
  { id: "d7f2", classId: "CSDS7", day: "Friday", period: 2, subject: "ADS", subjectFull: "Advanced Data Science", teacherId: "davor_dsouza", teacherName: "Mr Davor John D'souza", isLab: false },
  { id: "d7f3", classId: "CSDS7", day: "Friday", period: 3, subject: "CC", subjectFull: "Cloud Computing", teacherId: "shivaganesh", teacherName: "Mr Shivaganesh", isLab: false },
  { id: "d7f4", classId: "CSDS7", day: "Friday", period: 4, subject: "BDA/SNA", subjectFull: "Big Data Analytics / Social Network Analysis", teacherId: "shruthi_anchan", teacherName: "Ms Shruthi K Anchan", isLab: false },
  { id: "d7f5", classId: "CSDS7", day: "Friday", period: 5, subject: "REMEDIAL", subjectFull: "Remedial Class", teacherId: "davor_dsouza", teacherName: "Mr Davor John D'souza", isLab: false },

  // ── VII Sem BE AIML (AIML7, Room 3602) ────────────────────────────────
  // MONDAY
  { id: "a7m1", classId: "AIML7", day: "Monday", period: 1, subject: "CC", subjectFull: "Cloud Computing", teacherId: "shabina_bhaskar", teacherName: "Dr Shabina Bhaskar", isLab: false },
  { id: "a7m2", classId: "AIML7", day: "Monday", period: 2, subject: "BDA/GAI", subjectFull: "Big Data Analytics / Generative AI", teacherId: "shruthi_anchan", teacherName: "Ms Shruthi K Anchan", isLab: false },
  { id: "a7m3", classId: "AIML7", day: "Monday", period: 3, subject: "DL", subjectFull: "Deep Learning", teacherId: "shajahan_aboobacker", teacherName: "Dr Shajahan Aboobacker", isLab: false },
  { id: "a7m4", classId: "AIML7", day: "Monday", period: 4, subject: "CV", subjectFull: "Computer Vision", teacherId: "vijetha_u", teacherName: "Dr Vijetha U", isLab: false },
  { id: "a7m5", classId: "AIML7", day: "Monday", period: 5, subject: "Project Work", subjectFull: "Major Project Work", teacherId: "vijetha_u", teacherName: "Dr Vijetha U", isLab: true },
  { id: "a7m6", classId: "AIML7", day: "Monday", period: 6, subject: "Project Work", subjectFull: "Major Project Work", teacherId: "vijetha_u", teacherName: "Dr Vijetha U", isLab: true },
  // TUESDAY
  { id: "a7t1", classId: "AIML7", day: "Tuesday", period: 1, subject: "CV", subjectFull: "Computer Vision", teacherId: "vijetha_u", teacherName: "Dr Vijetha U", isLab: false },
  { id: "a7t2", classId: "AIML7", day: "Tuesday", period: 2, subject: "DL", subjectFull: "Deep Learning", teacherId: "shajahan_aboobacker", teacherName: "Dr Shajahan Aboobacker", isLab: false },
  { id: "a7t3", classId: "AIML7", day: "Tuesday", period: 3, subject: "Project Lab", subjectFull: "Major Project Lab", teacherId: "vijetha_u", teacherName: "Dr Vijetha U", isLab: true, note: "RNT+HVN" },
  { id: "a7t4", classId: "AIML7", day: "Tuesday", period: 4, subject: "Project Lab", subjectFull: "Major Project Lab", teacherId: "vijetha_u", teacherName: "Dr Vijetha U", isLab: true },
  { id: "a7t5", classId: "AIML7", day: "Tuesday", period: 5, subject: "PBL", subjectFull: "Project Based Learning", teacherId: "vijetha_u", teacherName: "Dr Vijetha U", isLab: false, note: "VJU+SHB" },
  { id: "a7t6", classId: "AIML7", day: "Tuesday", period: 6, subject: "PBL", subjectFull: "Project Based Learning", teacherId: "vijetha_u", teacherName: "Dr Vijetha U", isLab: false },
  // WEDNESDAY
  { id: "a7w1", classId: "AIML7", day: "Wednesday", period: 1, subject: "CV Lab", subjectFull: "CV Lab B1 / DL Lab B2", teacherId: "vijetha_u", teacherName: "Dr Vijetha U", isLab: true, note: "B1(VJU+FHA) / B2(SJA+KKS)" },
  { id: "a7w2", classId: "AIML7", day: "Wednesday", period: 2, subject: "CV Lab", subjectFull: "CV Lab B1 / DL Lab B2", teacherId: "vijetha_u", teacherName: "Dr Vijetha U", isLab: true },
  { id: "a7w3", classId: "AIML7", day: "Wednesday", period: 3, subject: "Project Lab", subjectFull: "Major Project Lab", teacherId: "vijetha_u", teacherName: "Dr Vijetha U", isLab: true, note: "RNT+SHB" },
  { id: "a7w4", classId: "AIML7", day: "Wednesday", period: 4, subject: "Project Lab", subjectFull: "Major Project Lab", teacherId: "vijetha_u", teacherName: "Dr Vijetha U", isLab: true },
  { id: "a7w5", classId: "AIML7", day: "Wednesday", period: 5, subject: "TUTORIAL", subjectFull: "Tutorial", teacherId: "vijetha_u", teacherName: "Dr Vijetha U", isLab: false },
  // THURSDAY
  { id: "a7th1", classId: "AIML7", day: "Thursday", period: 1, subject: "DL", subjectFull: "Deep Learning", teacherId: "shajahan_aboobacker", teacherName: "Dr Shajahan Aboobacker", isLab: false },
  { id: "a7th2", classId: "AIML7", day: "Thursday", period: 2, subject: "CV", subjectFull: "Computer Vision", teacherId: "vijetha_u", teacherName: "Dr Vijetha U", isLab: false },
  { id: "a7th3", classId: "AIML7", day: "Thursday", period: 3, subject: "BDA/GAI", subjectFull: "Big Data Analytics / Generative AI", teacherId: "shruthi_anchan", teacherName: "Ms Shruthi K Anchan", isLab: false },
  { id: "a7th4", classId: "AIML7", day: "Thursday", period: 4, subject: "CC", subjectFull: "Cloud Computing", teacherId: "shabina_bhaskar", teacherName: "Dr Shabina Bhaskar", isLab: false },
  { id: "a7th5", classId: "AIML7", day: "Thursday", period: 5, subject: "Project Work", subjectFull: "Major Project Work", teacherId: "vijetha_u", teacherName: "Dr Vijetha U", isLab: true },
  { id: "a7th6", classId: "AIML7", day: "Thursday", period: 6, subject: "Project Work", subjectFull: "Major Project Work", teacherId: "vijetha_u", teacherName: "Dr Vijetha U", isLab: true },
  // FRIDAY
  { id: "a7f1", classId: "AIML7", day: "Friday", period: 1, subject: "CV Lab", subjectFull: "CV Lab B2 / DL Lab B1", teacherId: "vijetha_u", teacherName: "Dr Vijetha U", isLab: true, note: "B2(VJU+PGG) / B1(DL: SJA+TAJ)" },
  { id: "a7f2", classId: "AIML7", day: "Friday", period: 2, subject: "CV Lab", subjectFull: "CV Lab B2 / DL Lab B1", teacherId: "vijetha_u", teacherName: "Dr Vijetha U", isLab: true },
  { id: "a7f3", classId: "AIML7", day: "Friday", period: 3, subject: "CC", subjectFull: "Cloud Computing", teacherId: "shabina_bhaskar", teacherName: "Dr Shabina Bhaskar", isLab: false },
  { id: "a7f4", classId: "AIML7", day: "Friday", period: 4, subject: "BDA/GAI", subjectFull: "Big Data Analytics / Generative AI", teacherId: "shruthi_anchan", teacherName: "Ms Shruthi K Anchan", isLab: false },
  { id: "a7f5", classId: "AIML7", day: "Friday", period: 5, subject: "REMEDIAL", subjectFull: "Remedial Class", teacherId: "vijetha_u", teacherName: "Dr Vijetha U", isLab: false },
];

// ─── Helper: get teacher timetable ────────────────────────────────────────
export function getTeacherSlots(teacherId: string): TimetableSlot[] {
  return CLASS_TIMETABLE.filter(s => s.teacherId === teacherId);
}

// ─── Demo role → teacher mapping ──────────────────────────────────────────
export interface DemoUser {
  role: Role;
  teacherId: string;
  name: string;
}
export const DEMO_USERS: DemoUser[] = [
  { role: "teacher", teacherId: "shruthi_patil", name: "Ms Shruthi Patil" },
  { role: "hod", teacherId: "harivinod_n", name: "Dr Harivinod N" },
  { role: "admin", teacherId: "renuka_tantry", name: "Ms Renuka Tantry" },
];

export interface SystemSettings {
  maxDeclinesBeforeEscalation: number;
  escalationTimeout: number;
  maxSubsPerTeacherPerWeek: number;
  emailAlerts: boolean;
  smsAlerts: boolean;
}

export const INITIAL_SETTINGS: SystemSettings = {
  maxDeclinesBeforeEscalation: 3,
  escalationTimeout: 30,
  maxSubsPerTeacherPerWeek: 5,
  emailAlerts: true,
  smsAlerts: true,
};

// ─── Uploaded Timetable Images ────────────────────────────────────────────
export interface UploadedTimetable {
  id: string;
  imageIndex?: number;   // 0-8 for built-in imports
  customImageUrl?: string;
  fileName?: string;
  classId: string;
  parsedAt: string;
  status: "parsed" | "processing" | "error";
  extractedSlots: number;
  extractedTeachers: number;
}
export const UPLOADED_TIMETABLES: UploadedTimetable[] = [
  { id: "ut1", imageIndex: 0, classId: "AIML3", parsedAt: "2026-06-10T07:00:00", status: "parsed", extractedSlots: 30, extractedTeachers: 8 },
  { id: "ut2", imageIndex: 1, classId: "CSBS3", parsedAt: "2026-06-10T07:01:00", status: "parsed", extractedSlots: 30, extractedTeachers: 8 },
  { id: "ut3", imageIndex: 2, classId: "CSBS3", parsedAt: "2026-06-10T07:01:05", status: "parsed", extractedSlots: 30, extractedTeachers: 8 },
  { id: "ut4", imageIndex: 3, classId: "CSBS5", parsedAt: "2026-06-10T07:02:00", status: "parsed", extractedSlots: 28, extractedTeachers: 7 },
  { id: "ut5", imageIndex: 4, classId: "AIML5", parsedAt: "2026-06-10T07:03:00", status: "parsed", extractedSlots: 28, extractedTeachers: 7 },
  { id: "ut6", imageIndex: 5, classId: "CSDS5", parsedAt: "2026-06-10T07:04:00", status: "parsed", extractedSlots: 28, extractedTeachers: 7 },
  { id: "ut7", imageIndex: 6, classId: "CSBS7", parsedAt: "2026-06-10T07:05:00", status: "parsed", extractedSlots: 22, extractedTeachers: 4 },
  { id: "ut8", imageIndex: 7, classId: "CSDS7", parsedAt: "2026-06-10T07:06:00", status: "parsed", extractedSlots: 22, extractedTeachers: 4 },
  { id: "ut9", imageIndex: 8, classId: "AIML7", parsedAt: "2026-06-10T07:07:00", status: "parsed", extractedSlots: 22, extractedTeachers: 4 },
];

// ─── Substitution Requests ─────────────────────────────────────────────────
export interface SubstitutionRequest {
  id: string;
  absentTeacherId: string;
  absentTeacherName: string;
  subject: string;
  classId: string;
  className: string;
  day: string;
  period: number;
  time: string;
  status: SubStatus;
  requestedTeacherId?: string;
  requestedTeacherName?: string;
  candidateChain?: string[];
  declinedBy: string[];
  createdAt: string;
  updatedAt: string;
  reason: string;
}

/** Demo teacher personas for login — switch between these to show the cascade flow. */
export interface TeacherDemo {
  id: string;
  name: string;
  desc: string;
}
export const TEACHER_DEMOS: TeacherDemo[] = [
  { id: "shruthi_patil", name: "Ms Shruthi Patil", desc: "Subject Teacher + Class Advisor (V Sem BE AIML)" },
  { id: "saleena_ts", name: "Dr Saleena T S", desc: "Subject Teacher + Class Advisor (V Sem BE CSDS)" },
  { id: "shajahan_aboobacker", name: "Dr Shajahan Aboobacker", desc: "Subject Teacher + Class Advisor (III Sem BE AIML)" },
  { id: "devikrishna_ks", name: "Ms Devikrishna K S", desc: "Subject Teacher" },
  { id: "pratibha_gaonkar", name: "Ms Pratibha Ganapati Gaonkar", desc: "Subject Teacher" },
  { id: "sudheer_m", name: "Dr Sudheer M", desc: "Subject Teacher" },
  { id: "renuka_tantry", name: "Ms Renuka Tantry", desc: "Subject Teacher + Class Advisor (III Sem BE CSDS)" },
  { id: "teena_james", name: "Ms Teena Annamma James", desc: "Subject Teacher + Class Advisor (III Sem BE CSBS)" },
  { id: "farha_anjum", name: "Ms Farha Anjum", desc: "Subject Teacher + Class Advisor (V Sem BE CSBS)" },
  { id: "vijetha_u", name: "Dr Vijetha U", desc: "Subject Teacher + Class Advisor (VII Sem BE AIML)" },
];
export const SUBSTITUTION_REQUESTS: SubstitutionRequest[] = [
  {
    id: "sr1",
    absentTeacherId: "archana_p",
    absentTeacherName: "Ms Archana P",
    subject: "Maths-III",
    classId: "AIML3",
    className: "III Sem BE AIML",
    day: "Monday",
    period: 6,
    time: "3:00 – 4:00",
    status: "pending",
    requestedTeacherId: "shruthi_patil",
    requestedTeacherName: "Ms Shruthi Patil",
    candidateChain: ["shruthi_patil", "saleena_ts", "devikrishna_ks", "teena_james"],
    declinedBy: [],
    createdAt: "2026-06-10T08:00:00",
    updatedAt: "2026-06-10T08:00:00",
    reason: "Medical leave",
  },
  {
    id: "sr2",
    absentTeacherId: "pratibha_gaonkar",
    absentTeacherName: "Ms Pratibha Ganapati Gaonkar",
    subject: "DSA",
    classId: "AIML3",
    className: "III Sem BE AIML",
    day: "Monday",
    period: 4,
    time: "12:05 – 1:00",
    status: "escalated",
    candidateChain: ["shruthi_patil", "saleena_ts", "devikrishna_ks"],
    declinedBy: ["Ms Shruthi Patil", "Dr Saleena T S", "Ms Devikrishna K S"],
    createdAt: "2026-06-10T07:15:00",
    updatedAt: "2026-06-10T09:00:00",
    reason: "Personal emergency",
  },
  {
    id: "sr3",
    absentTeacherId: "namitha_shetty",
    absentTeacherName: "Ms Namitha Shetty",
    subject: "BFE-III",
    classId: "CSBS3",
    className: "III Sem BE CSBS",
    day: "Monday",
    period: 3,
    time: "11:10 – 12:05",
    status: "accepted",
    requestedTeacherId: "manjula_k",
    requestedTeacherName: "Ms Manjula K",
    declinedBy: [],
    createdAt: "2026-06-09T16:00:00",
    updatedAt: "2026-06-09T16:30:00",
    reason: "Training program",
  },
  {
    id: "sr4",
    absentTeacherId: "devikrishna_ks",
    absentTeacherName: "Ms Devikrishna K S",
    subject: "CN",
    classId: "AIML5",
    className: "V Sem BE AIML",
    day: "Tuesday",
    period: 1,
    time: "9:00 – 9:55",
    status: "pending",
    requestedTeacherId: "aishwarya_acharya",
    requestedTeacherName: "Ms Aishwarya Acharya",
    candidateChain: ["shruthi_patil", "aishwarya_acharya", "renuka_tantry"],
    declinedBy: ["Ms Shruthi Patil"],
    createdAt: "2026-06-10T08:30:00",
    updatedAt: "2026-06-10T08:55:00",
    reason: "Sick leave",
  },
  {
    id: "sr5",
    absentTeacherId: "harivinod_n",
    absentTeacherName: "Dr Harivinod N",
    subject: "TOC",
    classId: "AIML5",
    className: "V Sem BE AIML",
    day: "Thursday",
    period: 1,
    time: "9:00 – 9:55",
    status: "pending",
    requestedTeacherId: "sudheer_m",
    requestedTeacherName: "Dr Sudheer M",
    candidateChain: ["sudheer_m", "purushothama_chippar", "swaraj_lewis"],
    declinedBy: [],
    createdAt: "2026-06-10T09:10:00",
    updatedAt: "2026-06-10T09:10:00",
    reason: "Conference",
  },
  {
    id: "sr6",
    absentTeacherId: "jagadeesha_b",
    absentTeacherName: "Dr Jagadeesha B",
    subject: "Maths-III",
    classId: "CSBS3",
    className: "III Sem BE CSBS",
    day: "Tuesday",
    period: 3,
    time: "11:10 – 12:05",
    status: "pending",
    requestedTeacherId: "teena_james",
    requestedTeacherName: "Ms Teena Annamma James",
    candidateChain: ["teena_james", "manjula_k", "konanki_surendra"],
    declinedBy: [],
    createdAt: "2026-06-10T09:30:00",
    updatedAt: "2026-06-10T09:30:00",
    reason: "Workshop attendance",
  },
];

// ─── Audit Logs ────────────────────────────────────────────────────────────
export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  requestId: string;
  details: string;
  type: "request" | "accept" | "decline" | "escalate" | "assign" | "free_hour";
}
export const AUDIT_LOGS: AuditLog[] = [
  { id: "l1", timestamp: "2026-06-10T07:15:00", action: "Substitution Request Created", actor: "System", requestId: "sr2", details: "Ms Pratibha Ganapati Gaonkar absent — DSA, III Sem BE AIML, P4. Request sent to Ms Shruthi Patil.", type: "request" },
  { id: "l2", timestamp: "2026-06-10T07:30:00", action: "Request Declined", actor: "Ms Shruthi Patil", requestId: "sr2", details: "Declined DSA substitution for III Sem BE AIML, P4.", type: "decline" },
  { id: "l3", timestamp: "2026-06-10T07:55:00", action: "Request Declined", actor: "Dr Saleena T S", requestId: "sr2", details: "Declined DSA substitution for III Sem BE AIML, P4.", type: "decline" },
  { id: "l4", timestamp: "2026-06-10T08:20:00", action: "Request Declined", actor: "Ms Devikrishna K S", requestId: "sr2", details: "Declined DSA substitution for III Sem BE AIML, P4.", type: "decline" },
  { id: "l5", timestamp: "2026-06-10T09:00:00", action: "Escalated to HOD", actor: "System", requestId: "sr2", details: "All 3 available teachers declined. Escalated to HOD Dr Shajahan Aboobacker for III Sem BE AIML, P4.", type: "escalate" },
  { id: "l6", timestamp: "2026-06-10T08:00:00", action: "Substitution Request Created", actor: "System", requestId: "sr1", details: "Ms Archana P absent — Maths-III, III Sem BE AIML, P6. Request sent to Ms Shruthi Patil.", type: "request" },
  { id: "l7", timestamp: "2026-06-09T16:30:00", action: "Request Accepted", actor: "Ms Manjula K", requestId: "sr3", details: "Accepted BFE-III substitution for III Sem BE CSBS, P3 on Monday.", type: "accept" },
  { id: "l8", timestamp: "2026-06-10T08:50:00", action: "Request Declined", actor: "Ms Shruthi Patil", requestId: "sr4", details: "Declined CN substitution for V Sem BE AIML, Tuesday P1.", type: "decline" },
  { id: "l9", timestamp: "2026-06-10T09:10:00", action: "Substitution Request Created", actor: "System", requestId: "sr5", details: "Dr Harivinod N absent — TOC, V Sem BE AIML, P1. Request sent to Dr Sudheer M.", type: "request" },
];

// ─── Free Teachers (available now) ────────────────────────────────────────
export const FREE_TEACHERS = TEACHERS.filter(t =>
  ["manjula_k", "ajeeth_b", "purushothama_chippar", "sudheer_m", "nelson"].includes(t.id)
);
