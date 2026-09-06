import React from "react";
import { CLASS_TIMETABLE, CLASSES, DAYS, PERIODS, TimetableSlot } from "./mockData";

const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Maths-III": { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  DSA: { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
  "DSA Lab": { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
  COA: { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA" },
  DPD: { bg: "#FDF4FF", text: "#7E22CE", border: "#E9D5FF" },
  "DPD Lab": { bg: "#FDF4FF", text: "#7E22CE", border: "#E9D5FF" },
  IRP: { bg: "#F0FDFA", text: "#0F766E", border: "#99F6E4" },
  BFE: { bg: "#FFF1F2", text: "#BE123C", border: "#FECDD3" },
  "BFE-III": { bg: "#FFF1F2", text: "#BE123C", border: "#FECDD3" },
  IOT: { bg: "#F8FAFC", text: "#475569", border: "#E2E8F0" },
  "IOT-BE": { bg: "#F8FAFC", text: "#475569", border: "#E2E8F0" },
  IEP: { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" },
  FAIML: { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE" },
  "FAIML Lab": { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE" },
  CN: { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" },
  "CN Lab": { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" },
  SEPM: { bg: "#FFF7ED", text: "#9A3412", border: "#FED7AA" },
  TOC: { bg: "#FDF2F8", text: "#9D174D", border: "#FBCFE8" },
  RMIPR: { bg: "#F8FAFC", text: "#334155", border: "#E2E8F0" },
  "DV Lab": { bg: "#F0F9FF", text: "#0369A1", border: "#BAE6FD" },
  "CCS/BI": { bg: "#FDF4FF", text: "#6B21A8", border: "#E9D5FF" },
  DBMS: { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
  "DBMS Lab": { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
  FOM: { bg: "#F0FDFA", text: "#115E59", border: "#99F6E4" },
  CNS: { bg: "#EFF6FF", text: "#1E3A8A", border: "#BFDBFE" },
  "CNS Lab": { bg: "#EFF6FF", text: "#1E3A8A", border: "#BFDBFE" },
  "FCA/CCS": { bg: "#FFF1F2", text: "#9F1239", border: "#FECDD3" },
  OR: { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA" },
  "CS Lab": { bg: "#F0F9FF", text: "#0C4A6E", border: "#BAE6FD" },
  ETP: { bg: "#FFFBEB", text: "#713F12", border: "#FDE68A" },
  PDS: { bg: "#F0FDF4", text: "#14532D", border: "#BBF7D0" },
  BI: { bg: "#FDF4FF", text: "#581C87", border: "#E9D5FF" },
  FOE: { bg: "#F8FAFC", text: "#1E293B", border: "#E2E8F0" },
  BIDA: { bg: "#FDF4FF", text: "#7C3AED", border: "#E9D5FF" },
  "BIDA Lab": { bg: "#FDF4FF", text: "#7C3AED", border: "#E9D5FF" },
  UDSA: { bg: "#F0FDFA", text: "#0F766E", border: "#99F6E4" },
  "UDSA Lab": { bg: "#F0FDFA", text: "#0F766E", border: "#99F6E4" },
  CC: { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  SCM: { bg: "#FFF7ED", text: "#9A3412", border: "#FED7AA" },
  ADS: { bg: "#FDF2F8", text: "#831843", border: "#FBCFE8" },
  IRA: { bg: "#FFFBEB", text: "#78350F", border: "#FDE68A" },
  "BDA/SNA": { bg: "#F0FDF4", text: "#14532D", border: "#BBF7D0" },
  "BDA/GAI": { bg: "#F0FDF4", text: "#14532D", border: "#BBF7D0" },
  CV: { bg: "#FDF4FF", text: "#6B21A8", border: "#E9D5FF" },
  "CV Lab": { bg: "#FDF4FF", text: "#6B21A8", border: "#E9D5FF" },
  DL: { bg: "#F0F9FF", text: "#0C4A6E", border: "#BAE6FD" },
  "ADS Lab": { bg: "#FDF2F8", text: "#831843", border: "#FBCFE8" },
  "IRA Lab": { bg: "#FFFBEB", text: "#78350F", border: "#FDE68A" },
  "Project Lab": { bg: "#F8FAFC", text: "#334155", border: "#E2E8F0" },
  "Project Work": { bg: "#F8FAFC", text: "#334155", border: "#E2E8F0" },
  PBL: { bg: "#FAFAFA", text: "#525252", border: "#E5E5E5" },
  TUTORIAL: { bg: "#FAFAFA", text: "#525252", border: "#E5E5E5" },
  REMEDIAL: { bg: "#FFF1F2", text: "#881337", border: "#FECDD3" },
  "Dept. Activities": { bg: "#FAFAFA", text: "#525252", border: "#E5E5E5" },
  "OOP Tutorial": { bg: "#FAFAFA", text: "#525252", border: "#E5E5E5" },
  "DV Lab Tutorial": { bg: "#F0F9FF", text: "#0369A1", border: "#BAE6FD" },
  "CS Lab Tutorial": { bg: "#F0F9FF", text: "#0C4A6E", border: "#BAE6FD" },
};

function slotColor(subject: string) {
  return SUBJECT_COLORS[subject] ?? { bg: "#F8FAFC", text: "#475569", border: "#E2E8F0" };
}

import { useSubstitution } from "./SubstitutionContext";

interface Props {
  classId: string;
  showTeacherName?: boolean;
}

export function ClassTimetableView({ classId, showTeacherName = true }: Props) {
  const cls = CLASSES.find(c => c.id === classId);
  const { timetableSlots } = useSubstitution();
  const slots = timetableSlots.filter(s => s.classId === classId);

  const slotMap: Record<string, Record<number, TimetableSlot>> = {};
  for (const day of DAYS) slotMap[day] = {};
  for (const slot of slots) slotMap[slot.day][slot.period] = slot;

  const activeDays = DAYS.filter(d => slots.some(s => s.day === d));

  return (
    <div>
      {cls && (
        <div className="mb-4 flex items-center gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Class</p>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{cls.name}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Advisor</p>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{cls.advisorName}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Room</p>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{cls.room}</p>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: 700 }}>
          <thead>
            <tr>
              <th
                className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider w-28"
                style={{ backgroundColor: "var(--primary)", color: "rgba(255,255,255,0.7)" }}
              >
                Period
              </th>
              {activeDays.map(day => (
                <th
                  key={day}
                  className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-center"
                  style={{ backgroundColor: "var(--primary)", color: "rgba(255,255,255,0.85)" }}
                >
                  {day.slice(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERIODS.map((p, idx) => {
              const hasAny = activeDays.some(d => slotMap[d]?.[p.period]);
              if (!hasAny) return null;
              return (
                <tr key={p.period} style={{ backgroundColor: idx % 2 === 0 ? "var(--card)" : "var(--background)" }}>
                  <td className="px-3 py-2 border-b" style={{ borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>P{p.period}</p>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{p.time}</p>
                  </td>
                  {activeDays.map(day => {
                    const slot = slotMap[day]?.[p.period];
                    if (!slot) {
                      return (
                        <td key={day} className="px-2 py-2 border-b text-center" style={{ borderColor: "var(--border)" }}>
                          <div className="h-12 flex items-center justify-center">
                            <span className="text-xs" style={{ color: "var(--border)" }}>—</span>
                          </div>
                        </td>
                      );
                    }
                    const c = slotColor(slot.subject);
                    return (
                      <td key={day} className="px-1.5 py-1.5 border-b" style={{ borderColor: "var(--border)" }}>
                        <div
                          className="rounded-lg px-2 py-1.5 border min-h-12 flex flex-col justify-center"
                          style={{ backgroundColor: c.bg, borderColor: c.border }}
                          title={slot.subjectFull + (slot.note ? ` (${slot.note})` : "")}
                        >
                          <p className="text-xs font-semibold leading-tight truncate" style={{ color: c.text }}>
                            {slot.subject}
                            {slot.isLab && <span className="ml-1 text-xs opacity-60">🧪</span>}
                          </p>
                          {showTeacherName && (
                            <p className="text-xs leading-tight mt-0.5 truncate" style={{ color: c.text, opacity: 0.7 }}>
                              {slot.teacherName.replace("Ms ", "").replace("Mr ", "").replace("Dr ", "").split(" ")[0]}
                            </p>
                          )}
                          {slot.note && (
                            <p className="text-xs leading-none mt-0.5 truncate" style={{ color: c.text, opacity: 0.5 }}>
                              {slot.note}
                            </p>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
