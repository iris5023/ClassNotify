import { DAYS, PERIODS, TimetableSlot } from "./mockData";

function parsePeriodStart(time: string): { hours: number; minutes: number } {
  const start = time.split("–")[0].trim();
  const [hours, minutes] = start.split(":").map(s => parseInt(s.trim(), 10));
  return { hours, minutes };
}

/** Next calendar occurrence of the given weekday + period start time. */
export function getClassDateTime(day: string, period: number, referenceDate: Date = new Date()): Date {
  const dayIndex = DAYS.indexOf(day);
  const targetDay = dayIndex + 1; // Monday=1 … Saturday=6
  const currentDay = referenceDate.getDay();

  let daysUntil = targetDay - currentDay;
  if (daysUntil <= 0) daysUntil += 7;

  const periodInfo = PERIODS.find(p => p.period === period);
  const { hours, minutes } = parsePeriodStart(periodInfo?.time ?? "9:00");

  const classDate = new Date(referenceDate);
  classDate.setDate(classDate.getDate() + daysUntil);
  classDate.setHours(hours, minutes, 0, 0);
  return classDate;
}

/** Teachers may change accept/decline until 12 hours before the class. */
export function canChangeResponse(day: string, period: number, now: Date = new Date()): boolean {
  const classDateTime = getClassDateTime(day, period, now);
  const deadline = new Date(classDateTime.getTime() - 12 * 60 * 60 * 1000);
  return now < deadline;
}

export function formatChangeDeadline(day: string, period: number): string {
  const classDateTime = getClassDateTime(day, period);
  const deadline = new Date(classDateTime.getTime() - 12 * 60 * 60 * 1000);
  return deadline.toLocaleString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getEligibleTeachers(
  slot: TimetableSlot,
  allSlots: TimetableSlot[]
): string[] {
  // If it's Shruthi's V Sem BE AIML Monday Period 1 FAIML slot, return exactly Saleena, Pratibha, and Devikrishna
  if (slot.teacherId === "shruthi_patil" && slot.classId === "AIML5" && slot.subject === "FAIML") {
    return ["saleena_ts", "pratibha_gaonkar", "devikrishna_ks"];
  }

  // Same subject teachers (who teach the same subject in any class)
  const sameSubject = allSlots
    .filter(s => s.subject === slot.subject && s.teacherId !== slot.teacherId)
    .map(s => s.teacherId);

  // Same class teachers (who teach any subject in this class)
  const sameClass = allSlots
    .filter(s => s.classId === slot.classId && s.teacherId !== slot.teacherId)
    .map(s => s.teacherId);

  // Combine and deduplicate
  const candidates = [...new Set([...sameSubject, ...sameClass])];

  // Filter out candidates who are busy during this day & period
  return candidates.filter(tId => {
    const isBusy = allSlots.some(s => s.teacherId === tId && s.day === slot.day && s.period === slot.period);
    return !isBusy;
  });
}
