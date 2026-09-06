import React, { useState } from "react";
import { AlertTriangle, UserCheck, CalendarOff, Check } from "lucide-react";
import { FREE_TEACHERS, TEACHERS, CLASSES } from "./mockData";
import { StatusBadge } from "./StatusBadge";
import { ClassTimetableView } from "./ClassTimetableView";
import { useSubstitution } from "./SubstitutionContext";

interface HODDashboardProps {
  activeTab: string;
}

export function HODDashboard({ activeTab }: HODDashboardProps) {
  const { requests, resolveEscalation } = useSubstitution();
  const [decisions, setDecisions] = useState<Record<string, { type: "assign" | "free_hour"; teacher?: string }>>({});
  const [selectedClass, setSelectedClass] = useState("AIML3");

  const escalated = requests.filter(r => r.status === "escalated");

  function handleAssign(reqId: string, teacherName: string) {
    setDecisions(p => ({ ...p, [reqId]: { type: "assign", teacher: teacherName } }));
    resolveEscalation(reqId, { type: "assign", teacherName });
  }

  function handleFreeHour(reqId: string) {
    setDecisions(p => ({ ...p, [reqId]: { type: "free_hour" } }));
    resolveEscalation(reqId, { type: "free_hour" });
  }

  if (activeTab === "escalations") {
    const pending = escalated.filter(r => !decisions[r.id]);
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Escalations</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>Cases where all teachers declined — assign a substitute or declare free hour.</p>
        </div>

        {pending.length > 0 && (
          <div className="flex items-start gap-3 p-4 rounded-xl border" style={{ backgroundColor: "#FEF2F2", borderColor: "#FECACA" }}>
            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-700">
                {pending.length} case{pending.length !== 1 ? "s" : ""} require your immediate decision
              </p>
              <p className="text-xs text-red-600 mt-0.5">Classes are unattended until resolved.</p>
            </div>
          </div>
        )}

        {escalated.length === 0 ? (
          <div className="rounded-xl border p-12 text-center" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <Check className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--muted-foreground)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>No escalated cases</p>
            <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>All substitution requests are resolving at teacher level.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.filter(r => r.status === "escalated" || r.id === "sr-demo-shruthi").map(req => {
              const cls = CLASSES.find(c => c.id === req.classId);
              
              // Determine status text
              const isEscalated = req.status === "escalated";
              const isDemo = req.id === "sr-demo-shruthi";
              const isAssignedWaiting = req.status === "pending" && (req.requestedTeacherId === "sudheer_m" || req.requestedTeacherId === "shajahan_aboobacker");
              const isResolvedAccept = req.status === "accepted";
              const isResolvedFree = req.status === "free_hour";

              // Show choice options if escalated and not resolved
              const showActions = isEscalated;

              return (
                <div key={req.id} className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: showActions ? "#FECACA" : "var(--border)" }}>
                  <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)", backgroundColor: showActions ? "#FFF5F5" : "var(--card)" }}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`w-4 h-4 ${showActions ? "text-red-500" : "text-emerald-500"}`} />
                          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                            {req.subject} · {cls?.name} · {req.day}, P{req.period}
                          </p>
                        </div>
                        <p className="text-xs mt-1.5 ml-6" style={{ color: "var(--muted-foreground)" }}>
                          {req.time} · Absent: {req.absentTeacherName} ({req.reason})
                        </p>
                        {req.declinedBy.length > 0 && (
                          <p className="text-xs mt-1 ml-6" style={{ color: "#B91C1C" }}>
                            Declined by: {req.declinedBy.join(", ")}
                          </p>
                        )}
                      </div>
                      <StatusBadge status={req.status} size="sm" />
                    </div>
                  </div>

                  {isAssignedWaiting && (
                    <div className="px-5 py-4 flex items-center gap-2 bg-amber-50 border-t" style={{ borderColor: "var(--border)" }}>
                      <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                      <p className="text-sm text-amber-700 font-medium">
                        Assigned to {req.requestedTeacherName} · Awaiting teacher response
                      </p>
                    </div>
                  )}

                  {isResolvedAccept && (
                    <div className="px-5 py-4 flex items-center gap-2" style={{ backgroundColor: "#F0FDF4" }}>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <p className="text-sm text-emerald-700 font-medium">
                        Assigned to and accepted by {req.requestedTeacherName}
                      </p>
                    </div>
                  )}

                  {isResolvedFree && (
                    <div className="px-5 py-4 flex items-center gap-2 bg-purple-50">
                      <Check className="w-4 h-4 text-purple-600" />
                      <p className="text-sm text-purple-700 font-medium">
                        Declared free hour for {cls?.name}
                      </p>
                    </div>
                  )}

                  {showActions && (
                    <div className="px-5 py-4 space-y-3 border-t" style={{ borderColor: "var(--border)" }}>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>HOD Decision Required</p>
                      <div>
                        <p className="text-xs font-medium mb-2" style={{ color: "var(--foreground)" }}>Assign from free teachers:</p>
                        <div className="flex flex-wrap gap-2">
                          {(isDemo
                            ? TEACHERS.filter(t => ["sudheer_m", "shajahan_aboobacker"].includes(t.id) && !req.declinedBy.includes(t.name))
                            : FREE_TEACHERS
                          ).map(t => (
                            <button
                              key={t.id}
                              onClick={() => resolveEscalation(req.id, { type: "assign", teacherName: t.name })}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all hover:border-emerald-400 bg-white hover:bg-slate-50 cursor-pointer"
                              style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                            >
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                              {t.name}
                              <span style={{ color: "var(--muted-foreground)" }}>({t.primarySubject.split("/")[0].split(" ")[0]})</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-px flex-1" style={{ backgroundColor: "var(--border)" }} />
                        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>or</span>
                        <div className="h-px flex-1" style={{ backgroundColor: "var(--border)" }} />
                      </div>
                      <button
                        onClick={() => resolveEscalation(req.id, { type: "free_hour" })}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border w-fit transition-all hover:border-purple-400 cursor-pointer"
                        style={{ backgroundColor: "#F5F3FF", borderColor: "#E9D5FF", color: "#7C3AED" }}
                      >
                        <CalendarOff className="w-4 h-4" /> Declare Free Hour for {cls?.name}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (activeTab === "teachers") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Available Faculty — Current Period</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>System-detected teachers with no class scheduled right now</p>
        </div>
        <div className="space-y-3">
          {FREE_TEACHERS.map(t => (
            <div key={t.id} className="rounded-xl border p-4 flex items-center justify-between" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
                  {t.name.replace("Ms ", "").replace("Mr ", "").replace("Dr ", "").split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{t.primarySubject} · {t.designation}</p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-green-100 text-green-700">Available now</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          <div className="px-5 py-3.5 border-b" style={{ borderColor: "var(--border)" }}>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>All Faculty ({TEACHERS.length})</p>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "var(--muted)" }}>
                {["Faculty", "Subject", "Designation", "Status"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {TEACHERS.slice(0, 12).map(t => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">
                        {t.shortName.slice(0, 2)}
                      </div>
                      <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{t.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{t.primarySubject}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{t.designation}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${FREE_TEACHERS.find(f => f.id === t.id) ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                      {FREE_TEACHERS.find(f => f.id === t.id) ? "Free now" : "In class"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeTab === "settings") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Department Settings</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>Configure HOD preferences and department defaults</p>
        </div>

        <div className="rounded-xl border overflow-hidden animate-fade-in" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Substitution Notifications</p>
          </div>
          <div className="p-5 space-y-4 divide-y divide-slate-100">
            <div className="flex items-center justify-between pb-4">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Instant SMS for HOD Escalations</p>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Send direct SMS alerts immediately when a class escalates to HOD</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Daily Department Summary Report</p>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Email a summary of daily substitutions at 5:00 PM</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-xl border overflow-hidden animate-fade-in" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Department Info</p>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--muted-foreground)" }}>Department Name</label>
                <input type="text" readOnly value="Computer Science & Engineering" className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 focus:outline-none" style={{ borderColor: "var(--border)" }} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--muted-foreground)" }}>Department Code</label>
                <input type="text" readOnly value="CSE / AIML / CSDS" className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 focus:outline-none" style={{ borderColor: "var(--border)" }} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--muted-foreground)" }}>Head of Department</label>
                <input type="text" readOnly value="Dr Harivinod N" className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 focus:outline-none" style={{ borderColor: "var(--border)" }} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--muted-foreground)" }}>Room / Location</label>
                <input type="text" readOnly value="Admin Block, Floor 3" className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 focus:outline-none" style={{ borderColor: "var(--border)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Department view / timetable
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Department Timetable View</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>Browse any class timetable</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {CLASSES.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedClass(c.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
              style={{
                backgroundColor: selectedClass === c.id ? "var(--primary)" : "var(--card)",
                color: selectedClass === c.id ? "white" : "var(--foreground)",
                borderColor: selectedClass === c.id ? "var(--primary)" : "var(--border)",
              }}
            >
              {c.id}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
        <div className="p-5">
          <ClassTimetableView classId={selectedClass} showTeacherName />
        </div>
      </div>
    </div>
  );
}
