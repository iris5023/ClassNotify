import React, { useState } from "react";
import { Calendar, Bell, CheckCircle, Clock, AlertTriangle, ArrowRight, Share2, Send, X } from "lucide-react";
import { TEACHERS, CLASSES, getTeacherSlots, DAYS, PERIODS, TimetableSlot } from "./mockData";
import { SubstitutionRequestCard } from "./SubstitutionRequestCard";
import { ClassTimetableView } from "./ClassTimetableView";
import { StatusBadge } from "./StatusBadge";
import { useSubstitution } from "./SubstitutionContext";
import { canChangeResponse, getClassDateTime } from "./substitutionUtils";

interface TeacherDashboardProps {
  activeTab: string;
  teacherId: string;
  classId?: string;
  isAdvisor?: boolean;
}

export function TeacherDashboard({ activeTab, teacherId, classId, isAdvisor = false }: TeacherDashboardProps) {
  const teacher = TEACHERS.find(t => t.id === teacherId)!;
  const {
    requests,
    auditLogs,
    acceptRequest,
    declineRequest,
    passToNextTeacher,
    timetableSlots,
    createSubstitutionRequest,
    whatsappSent,
    setWhatsappSent,
    setDemoStep,
    demoStep
  } = useSubstitution();

  // Teacher specific slots
  const mySlots = timetableSlots.filter(s => s.teacherId === teacherId);

  // States
  const [timetableToggle, setTimetableToggle] = useState<"me" | "class">("me");
  const [requestingSlot, setRequestingSlot] = useState<TimetableSlot | null>(null);
  const [leaveReason, setLeaveReason] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  
  // WhatsApp Share Modal state
  const [whatsappModalReq, setWhatsappModalReq] = useState<any | null>(null);
  const [mockMessage, setMockMessage] = useState("");

  // Substitution queries
  const pendingForMe = requests.filter(r => {
    if (r.status !== "pending") return false;
    if (r.declinedBy.includes(teacher.name)) return false;
    // Demo request exception
    if (r.id === "sr-demo-shruthi") {
      return ["shruthi_patil", "saleena_ts", "pratibha_gaonkar", "devikrishna_ks"].includes(teacherId);
    }
    if (r.requestedTeacherId === teacherId) return true;
    if (r.requestedTeacherId === "broadcast") {
      const teachesClass = timetableSlots.some(s => s.teacherId === teacherId && s.classId === r.classId);
      const isFree = !timetableSlots.some(s => s.teacherId === teacherId && s.day === r.day && s.period === r.period);
      return teachesClass && isFree;
    }
    return false;
  });

  const activeForMe = requests.filter(r => {
    if (r.declinedBy.includes(teacher.name)) return false;
    if (r.id === "sr-demo-shruthi") {
      if (teacherId === "shruthi_patil" && r.status === "pending") return true;
      if (["saleena_ts", "pratibha_gaonkar", "devikrishna_ks"].includes(teacherId)) {
        return r.status === "pending" || r.status === "accepted";
      }
      return r.requestedTeacherId === teacherId;
    }
    if (r.requestedTeacherId === teacherId) return true;
    if (r.requestedTeacherId === "broadcast") {
      const teachesClass = timetableSlots.some(s => s.teacherId === teacherId && s.classId === r.classId);
      const isFree = !timetableSlots.some(s => s.teacherId === teacherId && s.day === r.day && s.period === r.period);
      return teachesClass && isFree;
    }
    return false;
  });

  const historyForMe = requests.filter(
    r => (r.requestedTeacherId === teacherId || (r.id === "sr-demo-shruthi" && ["saleena_ts", "pratibha_gaonkar", "devikrishna_ks"].includes(teacherId))) && 
         (r.status === "escalated" || r.status === "free_hour" || r.status === "accepted" || r.status === "declined")
  );

  const respondedByMe = requests.filter(
    r => r.declinedBy.includes(teacher.name)
  );

  // Class Advisor specific requests
  const classRequests = isAdvisor ? requests.filter(r => r.classId === classId || (classId === "AIML5" && r.id === "sr-demo-shruthi")) : [];

  // Notifications
  let notifications: { id: string; type: "accepted" | "pending" | "info" | "free_class"; message: string; time: string; link?: string }[] = [];

  if (isAdvisor) {
    // Requirement 7: Remove all substitution activity from notifications in Class Advisor dashboard.
    // Requirement 8: Add notification if HOD declares a free class + WhatsApp share option.
    const freeClasses = requests.filter(r => r.classId === classId && r.status === "free_hour");
    notifications = freeClasses.map(r => ({
      id: `free-${r.id}`,
      type: "free_class" as const,
      message: `HOD declared Period ${r.period} (${r.time}) on ${r.day} as a FREE CLASS for ${r.className}.`,
      time: new Date(r.updatedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      link: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Dear Students, Period ${r.period} (${r.time}) on ${r.day} is a Free Hour. Please utilize it for self-study.`)}`
    }));
  } else {
    // For standard teachers, show normal substitution updates
    const myNotifications = requests
      .filter(r => {
        if (r.requestedTeacherId === teacherId && r.status === "pending") return true;
        if (r.declinedBy.includes(teacher.name)) return false;
        return r.requestedTeacherId === teacherId;
      })
      .map(r => ({
        id: r.id,
        type: r.status === "pending" ? "pending" as const : "info" as const,
        message:
          r.status === "pending"
            ? `New substitution request: ${r.subject} for ${r.className}, ${r.day} P${r.period} (${r.time}). Absent: ${r.absentTeacherName}.`
            : `${r.subject} update for ${r.className}.`,
        time: new Date(r.updatedAt).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" }),
      }));
    notifications = [...myNotifications];
  }

  // Generic meetings notifications
  notifications.push({
    id: "n-staff",
    type: "info" as const,
    message: "Staff meeting: Wednesday 4:00 PM, Seminar Hall.",
    time: "Today 7:00 AM"
  });

  function handleRequestCover(slot: TimetableSlot) {
    setSubmitError("");
    setSubmitSuccess("");
    // Check 12 hours lead time
    if (demoStep === null && !canChangeResponse(slot.day, slot.period)) {
      setSubmitError("Cannot request substitution: class is less than 12 hours away.");
      setRequestingSlot(null);
      return;
    }
    setRequestingSlot(slot);
  }

  function submitCoverRequest() {
    if (!requestingSlot) return;
    const periodInfo = PERIODS.find(p => p.period === requestingSlot.period);
    const cls = CLASSES.find(c => c.id === requestingSlot.classId);

    const res = createSubstitutionRequest({
      absentTeacherId: teacherId,
      absentTeacherName: teacher.name,
      subject: requestingSlot.subject,
      classId: requestingSlot.classId,
      className: cls?.name ?? requestingSlot.classId,
      day: requestingSlot.day,
      period: requestingSlot.period,
      time: periodInfo?.time ?? "9:00",
      reason: leaveReason,
      // Default to first advisor/free teacher in chain (or simple lookup chain)
      requestedTeacherId: cls?.advisorId ?? "shruthi_patil",
      requestedTeacherName: cls?.advisorName ?? "Ms Shruthi Patil",
      candidateChain: [cls?.advisorId ?? "shruthi_patil", "saleena_ts", "devikrishna_ks"]
    });

    if (res.success) {
      setSubmitSuccess("Substitution request submitted successfully! Alerts dispatched.");
      setLeaveReason("");
      setRequestingSlot(null);
    } else {
      setSubmitError(res.error ?? "Failed to submit request.");
    }
  }

  if (activeTab === "timetable") {
    const slotMap: Record<string, Record<number, typeof mySlots[0]>> = {};
    for (const d of DAYS) slotMap[d] = {};
    for (const s of mySlots) slotMap[s.day][s.period] = s;
    const activeDays = DAYS.filter(d => mySlots.some(s => s.day === d));
    const classIds = [...new Set(mySlots.map(s => s.classId))];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>
              {isAdvisor ? "Faculty & Class Schedules" : "My Weekly Timetable"}
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
              {teacher.name} · {teacher.primarySubject}
            </p>
          </div>
          {isAdvisor && (
            <div className="flex bg-slate-100 p-1 rounded-lg border">
              <button
                onClick={() => setTimetableToggle("me")}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                  timetableToggle === "me" ? "bg-white shadow text-blue-600" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                My Timetable
              </button>
              <button
                onClick={() => setTimetableToggle("class")}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                  timetableToggle === "class" ? "bg-white shadow text-blue-600" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Class Timetable ({classId})
              </button>
            </div>
          )}
        </div>

        {submitError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" /> {submitError}
          </div>
        )}
        {submitSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" /> {submitSuccess}
          </div>
        )}

        {/* Request Substitution Modal overlay */}
        {requestingSlot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <div className="bg-white rounded-xl border p-6 max-w-md w-full space-y-4">
              <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>Request Substitution Cover</h2>
              <div className="p-3 bg-slate-50 border rounded-lg text-xs space-y-1">
                <p><strong>Subject:</strong> {requestingSlot.subjectFull}</p>
                <p><strong>Class:</strong> {requestingSlot.classId}</p>
                <p><strong>Day & Period:</strong> {requestingSlot.day}, Period {requestingSlot.period}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Reason for Absence</label>
                <textarea
                  rows={3}
                  value={leaveReason}
                  onChange={e => setLeaveReason(e.target.value)}
                  placeholder="Medical leave, research work, workshop, etc..."
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <div className="flex items-center justify-end gap-2 text-xs">
                <button
                  onClick={() => setRequestingSlot(null)}
                  className="px-4 py-2 border rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitCoverRequest}
                  disabled={!leaveReason.trim()}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        )}

        {timetableToggle === "me" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Periods/week", value: String(mySlots.length), color: "text-blue-600", bg: "bg-blue-50", icon: Calendar },
                { label: "Classes taught", value: String(classIds.length), color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle },
                { label: "Pending requests", value: String(pendingForMe.length), color: "text-amber-600", bg: "bg-amber-50", icon: Clock },
                { label: "Lab sessions", value: String(mySlots.filter(s => s.isLab).length), color: "text-purple-600", bg: "bg-purple-50", icon: Bell },
              ].map(stat => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="rounded-xl p-4 border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${stat.bg}`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{stat.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{stat.label}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2">
              {classIds.map(cid => {
                const cls = CLASSES.find(c => c.id === cid);
                const count = mySlots.filter(s => s.classId === cid).length;
                return (
                  <span key={cid} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}>
                    <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                    {cls?.name} ({count}p)
                  </span>
                );
              })}
            </div>

            <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
              <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Weekly Schedule (Click class card to request cover)</h2>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full border-collapse" style={{ minWidth: 700 }}>
                  <thead>
                    <tr>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider w-28" style={{ backgroundColor: "var(--primary)", color: "rgba(255,255,255,0.7)" }}>
                        Period
                      </th>
                      {activeDays.map(day => (
                        <th key={day} className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-center" style={{ backgroundColor: "var(--primary)", color: "rgba(255,255,255,0.85)" }}>
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
                            if (!slot) return (
                              <td key={day} className="px-2 py-2 border-b text-center" style={{ borderColor: "var(--border)" }}>
                                <div className="h-12 flex items-center justify-center">
                                  <span className="text-xs" style={{ color: "var(--border)" }}>—</span>
                                </div>
                              </td>
                            );
                            const cls = CLASSES.find(c => c.id === slot.classId);
                            return (
                              <td key={day} className="px-1.5 py-1.5 border-b" style={{ borderColor: "var(--border)" }}>
                                <button
                                  onClick={() => handleRequestCover(slot)}
                                  className="w-full text-left rounded-lg px-2 py-1.5 border min-h-12 flex flex-col justify-center bg-blue-50 border-blue-200 transition-all hover:shadow hover:border-blue-400 group"
                                >
                                  <p className="text-xs font-semibold leading-tight text-blue-700 truncate flex items-center justify-between">
                                    <span>{slot.subject}{slot.isLab ? " 🧪" : ""}</span>
                                    <span className="opacity-0 group-hover:opacity-100 text-[10px] bg-blue-600 text-white px-1 rounded transition-opacity">Cover</span>
                                  </p>
                                  <p className="text-xs leading-tight mt-0.5 text-blue-600 truncate">{cls?.name}</p>
                                  <p className="text-xs leading-tight text-blue-500">Rm {cls?.room}</p>
                                </button>
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
          </div>
        ) : (
          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Weekly Class Timetable</h2>
            </div>
            <div className="p-4">
              <ClassTimetableView classId={classId!} showTeacherName />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === "substitutions") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Substitution Requests</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            Accept or decline substitution requests. You can edit your response until 12 hours before the class.
          </p>
        </div>

        {activeForMe.length > 0 && (
          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "#FECACA" }}>
            <div className="px-5 py-3.5 border-b flex items-center gap-2" style={{ borderColor: "#FECACA", backgroundColor: "#FEF2F2" }}>
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <p className="text-sm font-semibold text-red-700">
                Action Required (Assigned to Me: {activeForMe.length})
              </p>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {activeForMe.map(req => (
                <SubstitutionRequestCard
                  key={req.id}
                  req={req}
                  teacherId={teacherId}
                  onAccept={() => acceptRequest(req.id, teacherId)}
                  onDecline={() => {
                    declineRequest(req.id, teacherId);
                  }}
                  onPassToNext={() => passToNextTeacher(req.id, teacherId)}
                />
              ))}
            </div>
          </div>
        )}

        {pendingForMe.length === 0 && activeForMe.length === 0 && (
          <div className="flex items-start gap-3 p-4 rounded-xl border" style={{ backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" }}>
            <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <p className="text-sm text-emerald-700">No requests currently assigned to you.</p>
          </div>
        )}

        {/* Live Class-specific requests if HOD/Advisor */}
        {isAdvisor && (
          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <div className="px-5 py-3.5 border-b" style={{ borderColor: "var(--border)" }}>
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>All Class Substitution Activity — {classId}</p>
            </div>
            {classRequests.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>No substitution requests for class {classId} yet.</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                {classRequests.map(r => (
                  <div key={r.id} className="px-5 py-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                          {r.subject} · {r.className}
                        </p>
                        <StatusBadge status={r.status} size="sm" />
                      </div>
                      <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                        {r.day}, Period {r.period} ({r.time}) · Absent: {r.absentTeacherName}
                      </p>
                      {r.requestedTeacherName && (
                        <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                          Assigned to: {r.requestedTeacherName}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          <div className="px-5 py-3.5 border-b" style={{ borderColor: "var(--border)" }}>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>My Past substitution Responses</p>
          </div>
          {respondedByMe.length === 0 && historyForMe.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>No past responses logged.</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {[...respondedByMe, ...historyForMe]
                .filter((req, i, arr) => arr.findIndex(r => r.id === req.id) === i)
                .map(req => (
                  <SubstitutionRequestCard
                    key={req.id}
                    req={req}
                    teacherId={teacherId}
                    onAccept={() => acceptRequest(req.id, teacherId)}
                    onDecline={() => {
                      declineRequest(req.id, teacherId);
                    }}
                    onPassToNext={() => passToNextTeacher(req.id, teacherId)}
                    showActions={req.requestedTeacherId === teacherId && req.status === "pending"}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === "notifications") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Notifications</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>Substitution and department alerts</p>
        </div>
        <div className="space-y-3">
          {notifications.map(n => {
            const isFreeClass = n.type === "free_class";
            const s = n.type === "accepted"
              ? { bg: "#DCFCE7", border: "#BBF7D0", icon: <CheckCircle className="w-4 h-4 text-green-600" /> }
              : n.type === "pending"
              ? { bg: "#FEF3C7", border: "#FDE68A", icon: <Clock className="w-4 h-4 text-amber-600" /> }
              : isFreeClass
              ? { bg: "#F3E8FF", border: "#E9D5FF", icon: <AlertTriangle className="w-4 h-4 text-purple-600" /> }
              : { bg: "#F0F9FF", border: "#BAE6FD", icon: <Bell className="w-4 h-4 text-blue-600" /> };
            return (
              <div key={n.id} className="flex items-start justify-between gap-3 p-4 rounded-xl border transition-all" style={{ backgroundColor: s.bg, borderColor: s.border }}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{s.icon}</div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{n.message}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>{n.time}</p>
                  </div>
                </div>
                {isFreeClass && n.link && (
                  <a
                    href={n.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-green-600 hover:bg-green-700 shadow-sm transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" /> Share WhatsApp
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (activeTab === "settings") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>My Settings</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>Manage your account preferences and notification settings</p>
        </div>

        <div className="rounded-xl border overflow-hidden animate-fade-in" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Notification Channels</p>
          </div>
          <div className="p-5 space-y-4 divide-y divide-slate-100">
            <div className="flex items-center justify-between pb-4">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Email Notifications</p>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Receive updates about substitution requests via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>SMS/WhatsApp Alerts</p>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Get direct mobile alerts for urgent coverage requests</p>
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
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Profile Information</p>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--muted-foreground)" }}>Full Name</label>
                <input type="text" readOnly value={teacher.name} className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 focus:outline-none" style={{ borderColor: "var(--border)" }} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--muted-foreground)" }}>Designation</label>
                <input type="text" readOnly value={teacher.designation} className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 focus:outline-none" style={{ borderColor: "var(--border)" }} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--muted-foreground)" }}>Email Address</label>
                <input type="text" readOnly value={teacher.email} className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 focus:outline-none" style={{ borderColor: "var(--border)" }} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--muted-foreground)" }}>Phone Number</label>
                <input type="text" readOnly value={teacher.phone} className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 focus:outline-none" style={{ borderColor: "var(--border)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function triggerWhatsAppModal(req: any) {
    setWhatsappModalReq(req);
    setMockMessage(`Dear Students, Period ${req.period} (${req.time}) on ${req.day} is a Free Hour. Please utilize it for self-study. - Class Advisor`);
  }

  function handleSendMockWhatsApp() {
    setWhatsappSent(true);
    setWhatsappModalReq(null);
    if (demoStep === 10) {
      setDemoStep(11); // Advance demo walkthrough to complete state
    }
  }

  // Escalation log for Class Advisor
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Escalation Log — Class {classId}</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>Track escalation flow from subject teachers to HOD</p>
      </div>

      <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--muted-foreground)" }}>Escalation Sequence</p>
        <div className="flex items-center gap-4 flex-wrap">
          {[
            { n: "1", label: "Teacher Absent", sub: "Absence recorded in system", color: "#1D4ED8", bg: "#DBEAFE" },
            { n: "2", label: "Subject Teachers", sub: "Accept / Decline requests", color: "#B45309", bg: "#FEF3C7" },
            { n: "3", label: "Class Advisor", sub: "Also accepts / declines", color: "#6D28D9", bg: "#EDE9FE" },
            { n: "4", label: "HOD Decision", sub: "Assign or Free Hour", color: "#065F46", bg: "#D1FAE5" },
          ].map((step, i, arr) => (
            <React.Fragment key={step.n}>
              <div className="flex flex-col items-center text-center min-w-[80px]">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 text-sm font-bold" style={{ backgroundColor: step.bg, color: step.color }}>
                  {step.n}
                </div>
                <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{step.label}</p>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{step.sub}</p>
              </div>
              {i < arr.length - 1 && <ArrowRight className="w-4 h-4 shrink-0" style={{ color: "var(--muted-foreground)" }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
        <div className="px-5 py-3.5 border-b" style={{ borderColor: "var(--border)" }}>
          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Substitution & Escalation Log — Class {classId}</p>
        </div>
        {classRequests.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>No requests logged for this class.</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {classRequests.map(r => {
              const isFreeHour = r.status === "free_hour";
              const matchingLogs = auditLogs
                .filter(log => log.requestId === r.id)
                .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

              return (
                <div key={r.id} className="px-5 py-5 flex justify-between items-start hover:bg-slate-50/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                        {r.subject} · {r.className}
                      </p>
                      <StatusBadge status={r.status} size="sm" />
                    </div>
                    <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                      {r.day}, Period {r.period} ({r.time}) · Absent: {r.absentTeacherName} ({r.reason})
                    </p>
                    {r.declinedBy.length > 0 && (
                      <p className="text-xs mt-0.5 text-red-600 font-medium">
                        Declined by: {r.declinedBy.join(", ")}
                      </p>
                    )}
                    {r.status === "accepted" && r.requestedTeacherName && (
                      <p className="text-xs mt-0.5 text-emerald-600 font-bold">
                        Substitute: {r.requestedTeacherName}
                      </p>
                    )}

                    {/* Traveling Event Timeline */}
                    {matchingLogs.length > 0 && (
                      <div className="mt-4 border-l border-slate-200 pl-4 space-y-3.5 relative">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                          Escalation Log & Audit Trail
                        </p>
                        {matchingLogs.map(log => (
                          <div key={log.id} className="relative pl-1">
                            {/* Bullet Dot */}
                            <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-slate-300 border border-white" />
                            <div className="text-xs">
                              <span className="font-semibold text-slate-700">{log.action}</span>
                              <span className="text-slate-400 mx-1">by</span>
                              <span className="font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 text-[10px]">
                                {log.actor}
                              </span>
                              <span className="text-[10px] text-slate-400 ml-2 font-mono">
                                {new Date(log.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                              </span>
                              <p className="text-slate-500 mt-0.5 text-[11px] leading-relaxed">{log.details}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {isFreeHour && (
                    <div className="flex items-center gap-2 shrink-0 ml-4 mt-0.5">
                      {whatsappSent && r.id === "sr-demo-shruthi" ? (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 shadow-sm animate-fade-in">
                          ✓ Sent to WhatsApp
                        </span>
                      ) : (
                        <button
                          onClick={() => triggerWhatsAppModal(r)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-green-600 hover:bg-green-700 active:bg-green-800 shadow-sm transition-colors cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5 fill-current mr-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.012 2C6.48 2 2 6.48 2 12.012c0 1.766.457 3.486 1.332 5.006L2 22l5.12-1.31c1.47.8 3.12 1.22 4.89 1.22h.01c5.52 0 10-4.48 10-10.012C22.02 6.48 17.54 2 12.012 2zm6.36 13.91c-.26.73-1.49 1.4-2.05 1.48-.48.07-.97.08-3.08-.79-2.7-1.11-4.41-3.85-4.55-4.04-.13-.19-1.09-1.45-1.09-2.76 0-1.31.68-1.96.93-2.22.25-.26.54-.33.72-.33.18 0 .36.01.52.02.17.01.39-.06.62.49.24.58.81 1.98.88 2.13.07.15.12.33.02.53-.1.2-.15.33-.3.51-.15.18-.32.41-.45.55-.15.15-.31.32-.13.63.18.3.8 1.31 1.71 2.12.91.81 1.68 1.06 1.99 1.18.31.12.49.1.68-.12.19-.22.81-.94 1.03-1.26.22-.32.44-.27.74-.16.3.11 1.91.9 2.24 1.07.33.16.55.24.63.38.08.14.08.82-.18 1.55z" />
                          </svg>
                          Share WhatsApp
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mock WhatsApp Share Modal */}
      {whatsappModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border w-full max-w-md overflow-hidden animate-zoom-in">
            {/* Header resembling WhatsApp green header */}
            <div className="bg-emerald-700 text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">WhatsApp Web (Mock Share)</h3>
                <p className="text-[10px] text-emerald-100 mt-0.5">To: Vth Sem BE AIML Class Group</p>
              </div>
              <button 
                onClick={() => setWhatsappModalReq(null)}
                className="text-white/80 hover:text-white p-1 hover:bg-emerald-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-5 space-y-4" style={{ backgroundColor: "#efeae2" }}>
              <div className="bg-white p-4 rounded-xl shadow-sm text-xs space-y-2 border border-slate-200">
                <p className="font-semibold text-slate-500 uppercase tracking-wider text-[9px]">Broadcast Message Template</p>
                <textarea
                  rows={4}
                  value={mockMessage}
                  onChange={e => setMockMessage(e.target.value)}
                  className="w-full text-slate-800 font-medium text-sm leading-relaxed focus:outline-none border-none p-0 resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 bg-slate-50 border-t flex justify-end gap-2 text-xs">
              <button
                onClick={() => setWhatsappModalReq(null)}
                className="px-4 py-2 border rounded-xl hover:bg-slate-100 font-medium text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMockWhatsApp}
                className="px-5 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold transition-all shadow-md hover:shadow-emerald-500/20"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
