import React from "react";
import { DAYS, PERIODS, TimetableSlot } from "./mockData";

interface TimetableGridProps {
  slots: TimetableSlot[];
  highlightTeacher?: string;
  showTeacher?: boolean;
}

const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Mathematics: { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  Physics: { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
  Chemistry: { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA" },
  English: { bg: "#FAF5FF", text: "#7C3AED", border: "#E9D5FF" },
  Biology: { bg: "#F0FDFA", text: "#0F766E", border: "#99F6E4" },
  History: { bg: "#FFF1F2", text: "#BE123C", border: "#FECDD3" },
  Geography: { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" },
  "Computer Science": { bg: "#F0F9FF", text: "#0369A1", border: "#BAE6FD" },
};

function getSubjectColor(subject: string) {
  return SUBJECT_COLORS[subject] ?? { bg: "#F8FAFC", text: "#475569", border: "#E2E8F0" };
}

export function TimetableGrid({ slots, showTeacher = false }: TimetableGridProps) {
  const slotMap: Record<string, Record<number, TimetableSlot>> = {};
  for (const day of DAYS) slotMap[day] = {};
  for (const slot of slots) {
    slotMap[slot.day][slot.period] = slot;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse" style={{ minWidth: 680 }}>
        <thead>
          <tr>
            <th className="w-28 text-left px-3 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)", backgroundColor: "var(--muted)", borderRadius: "0.5rem 0 0 0" }}>
              Period
            </th>
            {DAYS.map((day) => (
              <th key={day} className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-center" style={{ color: "var(--muted-foreground)", backgroundColor: "var(--muted)" }}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERIODS.map((p, idx) => (
            <tr key={p.period} className={idx % 2 === 0 ? "" : ""}>
              <td className="px-3 py-2 border-b" style={{ borderColor: "var(--border)" }}>
                <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>P{p.period}</p>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{p.time}</p>
              </td>
              {DAYS.map((day) => {
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
                const colors = getSubjectColor(slot.subject);
                return (
                  <td key={day} className="px-2 py-2 border-b" style={{ borderColor: "var(--border)" }}>
                    <div
                      className="rounded-lg px-2 py-1.5 border h-full min-h-12 flex flex-col justify-center"
                      style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                    >
                      <p className="text-xs font-semibold leading-tight" style={{ color: colors.text }}>
                        {slot.subject}
                      </p>
                      <p className="text-xs leading-tight mt-0.5" style={{ color: colors.text, opacity: 0.75 }}>
                        {slot.className}
                      </p>
                      {showTeacher && (
                        <p className="text-xs leading-tight mt-0.5 truncate" style={{ color: colors.text, opacity: 0.6 }}>
                          {slot.teacherId}
                        </p>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
