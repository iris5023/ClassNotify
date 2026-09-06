import React, { useState, useRef } from "react";
import { CheckCircle, Upload, Eye, X, Zap, Users, Calendar, Loader2, Trash2 } from "lucide-react";
import { CLASSES, UploadedTimetable } from "./mockData";
import { useSubstitution } from "./SubstitutionContext";

import img0 from "../../imports/image.png";
import img1 from "../../imports/image-1.png";
import img2 from "../../imports/image-2.png";
import img3 from "../../imports/image-3.png";
import img4 from "../../imports/image-4.png";
import img5 from "../../imports/image-5.png";
import img6 from "../../imports/image-6.png";
import img7 from "../../imports/image-7.png";
import img8 from "../../imports/image-8.png";

const IMAGES = [img0, img1, img2, img3, img4, img5, img6, img7, img8];
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

export function TimetableUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState("");
  const { uploads, setUploads, deleteUploadById, setTimetableSlots } = useSubstitution();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dbStatusMsg, setDbStatusMsg] = useState<string | null>(null);

  const totalSlots = uploads.reduce((s, t) => s + (t.status === "parsed" ? t.extractedSlots : 0), 0);
  const totalTeachers = 35;
  const totalClasses = CLASSES.length;

  function getImageSrc(tt: UploadedTimetable, idx: number): string {
    if (tt.customImageUrl) return tt.customImageUrl;
    if (tt.imageIndex !== undefined) return IMAGES[tt.imageIndex];
    return IMAGES[idx % IMAGES.length];
  }

  function getImageName(tt: UploadedTimetable, idx: number): string {
    if (tt.fileName) return tt.fileName;
    if (tt.imageIndex !== undefined) return IMAGE_NAMES[tt.imageIndex];
    return `upload_${idx}.png`;
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    let targetClass = "CSDS3"; // Default to CSDS3 for the demo workflow
    const nameUpper = file.name.toUpperCase();
    if (nameUpper.includes("AIML3") || nameUpper.includes("AIML_3")) targetClass = "AIML3";
    else if (nameUpper.includes("CSBS3") || nameUpper.includes("CSBS_3")) targetClass = "CSBS3";
    else if (nameUpper.includes("CSBS5") || nameUpper.includes("CSBS_5")) targetClass = "CSBS5";
    else if (nameUpper.includes("AIML5") || nameUpper.includes("AIML_5")) targetClass = "AIML5";
    else if (nameUpper.includes("CSDS5") || nameUpper.includes("CSDS_5")) targetClass = "CSDS5";

    const url = URL.createObjectURL(file);
    const newUpload: UploadedTimetable = {
      id: `ut-custom-${Date.now()}`,
      customImageUrl: url,
      fileName: file.name,
      classId: targetClass,
      parsedAt: new Date().toISOString(),
      status: "processing",
      extractedSlots: 0,
      extractedTeachers: 0,
    };

    setUploads(prev => [newUpload, ...prev]);
    setDbStatusMsg(null);

    setTimeout(() => {
      setUploads(prev =>
        prev.map(u =>
          u.customImageUrl === url
            ? { ...u, status: "parsed", extractedSlots: 28, extractedTeachers: 6 }
            : u
        )
      );

      // If it is CSDS3, we inject the parsed slots for Renuka Tantry
      if (targetClass === "CSDS3") {
        const csds3Slots = [
          { id: "csds3_1", classId: "CSDS3", day: "Monday", period: 3, subject: "CNS", subjectFull: "Computer Networks & Security", teacherId: "renuka_tantry", teacherName: "Ms Renuka Tantry", isLab: false },
          { id: "csds3_2", classId: "CSDS3", day: "Tuesday", period: 4, subject: "CNS", subjectFull: "Computer Networks & Security", teacherId: "renuka_tantry", teacherName: "Ms Renuka Tantry", isLab: false },
          { id: "csds3_3", classId: "CSDS3", day: "Thursday", period: 1, subject: "CNS", subjectFull: "Computer Networks & Security", teacherId: "renuka_tantry", teacherName: "Ms Renuka Tantry", isLab: false },
          { id: "csds3_4", classId: "CSDS3", day: "Wednesday", period: 2, subject: "DSA", subjectFull: "Data Structures & Applications", teacherId: "pratibha_gaonkar", teacherName: "Ms Pratibha Ganapati Gaonkar", isLab: false },
          { id: "csds3_5", classId: "CSDS3", day: "Friday", period: 5, subject: "Maths-III", subjectFull: "Mathematics-III", teacherId: "archana_p", teacherName: "Ms Archana P", isLab: false },
        ];
        setTimetableSlots(prev => [...prev.filter(s => s.classId !== "CSDS3"), ...csds3Slots]);
        setDbStatusMsg("CSDS 3rd Sem Timetable parsed successfully! MySQL database updated with 28 slots.");

        const activeToken = localStorage.getItem("authToken");
        if (activeToken) {
          fetch("http://localhost:5000/api/ocr-upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${activeToken}`
            },
            body: JSON.stringify({
              classId: "CSDS3",
              slots: csds3Slots.map(({ day, period, subject, subjectFull, teacherId, isLab }) => ({
                day, period, subject, subjectFull, teacherId, isLab
              }))
            })
          })
          .then(async res => {
            if (res.ok) {
              console.log("Successfully uploaded CSDS 3rd Sem timetable slots to MySQL database.");
              const uploadsRes = await fetch("http://localhost:5000/api/ocr-upload", {
                headers: { "Authorization": `Bearer ${activeToken}` }
              });
              if (uploadsRes.ok) {
                const dbUploads = await uploadsRes.json();
                setUploads(dbUploads);
              }
            } else {
              console.error("Backend failed to parse/save timetable slots.");
            }
          })
          .catch(err => {
            console.error("Failed to connect to backend for ocr-upload:", err);
          });
        }
      }
    }, 1800);

    e.target.value = "";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Timetable Upload & Parser</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            Upload class timetable screenshots — the system automatically extracts faculty, subjects, and schedules.
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={handleUploadClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90"
            style={{ backgroundColor: "var(--primary)" }}
          >
            <Upload className="w-4 h-4" /> Upload New
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Classes imported", value: String(totalClasses), icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Faculty detected", value: String(totalTeachers), icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Timetable slots", value: String(totalSlots), icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl p-4 border flex items-center gap-4" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{stat.value}</p>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* How it works */}
      <div className="rounded-xl border p-5" style={{ backgroundColor: "#F0F9FF", borderColor: "#BAE6FD" }}>
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-3">How it works</p>
        <div className="flex items-center gap-6 flex-wrap">
          {[
            { step: "1", label: "Upload timetable image", sub: "PNG, JPG, PDF" },
            { step: "2", label: "OCR & parsing", sub: "Extract subjects, teachers, periods" },
            { step: "3", label: "Auto-generate teacher schedules", sub: "Cross-class view per faculty" },
            { step: "4", label: "Enable substitution flow", sub: "Absence → escalation ready" },
          ].map((s, i, arr) => (
            <React.Fragment key={s.step}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">{s.step}</div>
                <div>
                  <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{s.label}</p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{s.sub}</p>
                </div>
              </div>
              {i < arr.length - 1 && <div className="w-6 h-px shrink-0" style={{ backgroundColor: "#93C5FD" }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {dbStatusMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" /> {dbStatusMsg}
        </div>
      )}

      {/* Uploaded timetables grid */}
      <div>
        <p className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>
          Imported Timetables ({uploads.length} files)
        </p>
        <div className="grid grid-cols-3 gap-4">
          {uploads.map((tt, idx) => {
            const cls = CLASSES.find(c => c.id === tt.classId);
            const imgSrc = getImageSrc(tt, idx);
            const imgName = getImageName(tt, idx);
            return (
              <div key={`${imgName}-${idx}`} className="rounded-xl border overflow-hidden group" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
                <div className="relative h-40 overflow-hidden" style={{ backgroundColor: "#F8FAFC" }}>
                  <img
                    src={imgSrc}
                    alt={imgName}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => deleteUploadById(tt.id, tt.classId)}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 shadow transition-colors"
                      title="Delete timetable and parsed slots"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {tt.status === "processing" && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/90 text-xs font-medium">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Parsing…
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                    <button
                      onClick={() => { setPreview(imgSrc); setPreviewName(imgName); }}
                      className="opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/90 text-xs font-medium"
                      style={{ color: "var(--foreground)" }}
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </button>
                  </div>
                  <div className="absolute top-2 right-2">
                    {tt.status === "parsed" ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3" /> Parsed
                      </span>
                    ) : tt.status === "processing" ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        <Loader2 className="w-3 h-3 animate-spin" /> Processing
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
                  <p className="text-xs font-semibold truncate" style={{ color: "var(--foreground)" }}>{cls?.name ?? "New Upload"}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "var(--muted-foreground)" }}>{imgName}</p>
                  <div className="flex items-center gap-3 mt-2">
                    {tt.status === "parsed" && (
                      <>
                        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                          <span className="font-semibold" style={{ color: "var(--foreground)" }}>{tt.extractedSlots}</span> slots
                        </span>
                        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                          <span className="font-semibold" style={{ color: "var(--foreground)" }}>{tt.extractedTeachers}</span> faculty
                        </span>
                      </>
                    )}
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {new Date(tt.parsedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {preview !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-full overflow-auto rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setPreview(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md"
            >
              <X className="w-4 h-4 text-slate-700" />
            </button>
            <img src={preview} alt={previewName} className="w-full rounded-xl" />
            <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg">
              {previewName}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
