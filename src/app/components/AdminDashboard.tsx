import React, { useState } from "react";
import {
  BarChart3, Users, Calendar, ClipboardList, Activity,
  CheckCircle, XCircle, Clock, ArrowUpCircle, Edit2, Trash2
} from "lucide-react";
import { TEACHERS, CLASSES } from "./mockData";
import { StatusBadge } from "./StatusBadge";
import { ClassTimetableView } from "./ClassTimetableView";
import { TimetableUpload } from "./TimetableUpload";
import { useSubstitution } from "./SubstitutionContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface AdminDashboardProps {
  activeTab: string;
}

export function AdminDashboard({ activeTab }: AdminDashboardProps) {
  const [selectedClass, setSelectedClass] = useState("AIML3");
  const { requests, auditLogs, systemSettings, updateSettings, triggerDemoMode } = useSubstitution();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  if (activeTab === "overview") {
    const stats = [
      { label: "Total Faculty", value: String(TEACHERS.length), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Classes", value: String(CLASSES.length), icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
      { label: "Active Requests", value: String(requests.filter(r => r.status === "pending" || r.status === "escalated").length), icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Escalations Today", value: String(requests.filter(r => r.status === "escalated").length), icon: ArrowUpCircle, color: "text-red-600", bg: "bg-red-50" },
    ];
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Admin Overview</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            NMIT — AI/ML, CS & BS, CS Data Science · Odd Semester 2025-26 · June 10, 2026
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {stats.map(stat => {
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

        {/* Classes list */}
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Active Classes</p>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "var(--muted)" }}>
                {["Class", "Department", "Advisor", "Room", "Status"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {CLASSES.map(cls => {
                const hasPending = requests.some(r => r.classId === cls.id && (r.status === "pending" || r.status === "escalated"));
                return (
                  <tr key={cls.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{cls.id}</p>
                      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{cls.name}</p>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)", maxWidth: 200 }}>{cls.dept}</td>
                    <td className="px-4 py-3 text-xs font-medium" style={{ color: "var(--foreground)" }}>{cls.advisorName}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{cls.room}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${hasPending ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                        {hasPending ? "Action needed" : "All clear"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Recent requests */}
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
            <Activity className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Recent Substitution Requests</p>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {requests.map(req => {
              const cls = CLASSES.find(c => c.id === req.classId);
              return (
                <div key={req.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{req.subject} · {cls?.name}</p>
                      <StatusBadge status={req.status} size="sm" />
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                      {req.day} P{req.period} · Absent: {req.absentTeacherName}
                      {req.declinedBy.length > 0 && ` · ${req.declinedBy.length} declined`}
                    </p>
                  </div>
                  <p className="text-xs shrink-0" style={{ color: "var(--muted-foreground)" }}>
                    {new Date(req.updatedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "timetables") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Class Timetables</h1>
            <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>Browse all imported class timetables</p>
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

  if (activeTab === "upload") {
    return <TimetableUpload />;
  }

  if (activeTab === "teachers") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Faculty Directory</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>{TEACHERS.length} faculty members</p>
        </div>
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "var(--muted)" }}>
                {["Name", "Code", "Subject", "Designation", "Email", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {TEACHERS.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">{t.shortName.slice(0, 2)}</div>
                      <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{t.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>{t.shortName}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{t.primarySubject}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{t.designation}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{t.email}</td>
                  <td className="px-4 py-3">
                    <button className="p-1.5 rounded hover:bg-slate-100"><Edit2 className="w-3.5 h-3.5" style={{ color: "var(--muted-foreground)" }} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeTab === "logs") {
    const logIcons: Record<string, React.ReactNode> = {
      request: <Clock className="w-3.5 h-3.5 text-amber-600" />,
      accept: <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />,
      decline: <XCircle className="w-3.5 h-3.5 text-red-600" />,
      escalate: <ArrowUpCircle className="w-3.5 h-3.5 text-blue-600" />,
      assign: <Users className="w-3.5 h-3.5 text-emerald-600" />,
      free_hour: <Calendar className="w-3.5 h-3.5 text-purple-600" />,
    };
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Audit Logs</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>Chronological record of all substitution events</p>
        </div>
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "var(--muted)" }}>
                {["Timestamp", "Event", "Actor", "Details"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {[...auditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(log => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-xs font-mono whitespace-nowrap" style={{ color: "var(--muted-foreground)" }}>
                    {new Date(log.timestamp).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {logIcons[log.type]}
                      <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{log.action}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--foreground)" }}>{log.actor}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)", maxWidth: 320 }}>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeTab === "analytics") {
    const absenceData = [
      { name: "Archana P", v: 3 },
      { name: "Pratibha G.", v: 2 },
      { name: "Namitha S.", v: 2 },
      { name: "Devikrishna", v: 2 },
      { name: "Harivinod N.", v: 1 },
    ];
    const loadData = [
      { name: "Shruthi Patil", v: 4 },
      { name: "Saleena T S", v: 3 },
      { name: "Manjula K", v: 2 },
      { name: "Sudheer M", v: 2 },
      { name: "Aishwarya A.", v: 1 },
    ];
    const statusData = [
      { name: "Accepted", value: requests.filter(r => r.status === "accepted").length, color: "#16A34A" },
      { name: "Declined", value: requests.filter(r => r.status === "declined").length, color: "#DC2626" },
      { name: "Pending", value: requests.filter(r => r.status === "pending").length, color: "#D97706" },
      { name: "Escalated", value: requests.filter(r => r.status === "escalated").length, color: "#2563EB" },
    ];
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Analytics</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>Absence frequency, substitution load, resolution metrics</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <p className="text-sm font-semibold mb-4" style={{ color: "var(--foreground)" }}>Absence Frequency (This Month)</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={absenceData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={45} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="v" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <p className="text-sm font-semibold mb-4" style={{ color: "var(--foreground)" }}>Substitution Load</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={loadData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={45} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="v" fill="#16A34A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <p className="text-sm font-semibold mb-4" style={{ color: "var(--foreground)" }}>Request Status Breakdown</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <p className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>Key Metrics</p>
            <div className="space-y-3">
              {[
                { label: "Avg. response time", value: "18 min" },
                { label: "Escalation rate", value: "20%" },
                { label: "Auto-resolved", value: "60%" },
                { label: "Total faculty", value: String(TEACHERS.length) },
                { label: "Total classes", value: String(CLASSES.length) },
              ].map(m => (
                <div key={m.label} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "var(--border)" }}>
                  <p className="text-sm" style={{ color: "var(--foreground)" }}>{m.label}</p>
                  <p className="text-sm font-semibold" style={{ color: "var(--primary)" }}>{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // settings
  function handleSave(field: keyof typeof systemSettings) {
    const val = parseInt(editValue, 10);
    if (isNaN(val)) return;
    updateSettings({
      ...systemSettings,
      [field]: val,
    });
    setEditingField(null);
  }

  function handleToggle(field: "emailAlerts" | "smsAlerts") {
    updateSettings({
      ...systemSettings,
      [field]: !systemSettings[field],
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Settings</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>Configure substitution rules and notification preferences</p>
        </div>
        <button
          onClick={triggerDemoMode}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
        >
          Substitution Request Cycle
        </button>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Substitution Rules</p>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {/* Max declines */}
          <div className="px-5 py-3.5 flex items-center justify-between">
            <p className="text-sm" style={{ color: "var(--foreground)" }}>Max declines before escalation</p>
            <div className="flex items-center gap-2">
              {editingField === "maxDeclinesBeforeEscalation" ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    className="w-16 px-2 py-1 text-xs border rounded"
                  />
                  <button onClick={() => handleSave("maxDeclinesBeforeEscalation")} className="px-2 py-1 text-xs bg-emerald-600 text-white rounded">Save</button>
                  <button onClick={() => setEditingField(null)} className="px-2 py-1 text-xs bg-slate-200 rounded">Cancel</button>
                </div>
              ) : (
                <>
                  <span className="text-sm font-medium" style={{ color: "var(--primary)" }}>{systemSettings.maxDeclinesBeforeEscalation}</span>
                  <button
                    onClick={() => { setEditingField("maxDeclinesBeforeEscalation"); setEditValue(String(systemSettings.maxDeclinesBeforeEscalation)); }}
                    className="p-1.5 rounded hover:bg-slate-100"
                  >
                    <Edit2 className="w-3.5 h-3.5" style={{ color: "var(--muted-foreground)" }} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Escalation timeout */}
          <div className="px-5 py-3.5 flex items-center justify-between">
            <p className="text-sm" style={{ color: "var(--foreground)" }}>Escalation timeout (minutes)</p>
            <div className="flex items-center gap-2">
              {editingField === "escalationTimeout" ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    className="w-16 px-2 py-1 text-xs border rounded"
                  />
                  <button onClick={() => handleSave("escalationTimeout")} className="px-2 py-1 text-xs bg-emerald-600 text-white rounded">Save</button>
                  <button onClick={() => setEditingField(null)} className="px-2 py-1 text-xs bg-slate-200 rounded">Cancel</button>
                </div>
              ) : (
                <>
                  <span className="text-sm font-medium" style={{ color: "var(--primary)" }}>{systemSettings.escalationTimeout} min</span>
                  <button
                    onClick={() => { setEditingField("escalationTimeout"); setEditValue(String(systemSettings.escalationTimeout)); }}
                    className="p-1.5 rounded hover:bg-slate-100"
                  >
                    <Edit2 className="w-3.5 h-3.5" style={{ color: "var(--muted-foreground)" }} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Max subs per week */}
          <div className="px-5 py-3.5 flex items-center justify-between">
            <p className="text-sm" style={{ color: "var(--foreground)" }}>Max subs per teacher per week</p>
            <div className="flex items-center gap-2">
              {editingField === "maxSubsPerTeacherPerWeek" ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    className="w-16 px-2 py-1 text-xs border rounded"
                  />
                  <button onClick={() => handleSave("maxSubsPerTeacherPerWeek")} className="px-2 py-1 text-xs bg-emerald-600 text-white rounded">Save</button>
                  <button onClick={() => setEditingField(null)} className="px-2 py-1 text-xs bg-slate-200 rounded">Cancel</button>
                </div>
              ) : (
                <>
                  <span className="text-sm font-medium" style={{ color: "var(--primary)" }}>{systemSettings.maxSubsPerTeacherPerWeek}</span>
                  <button
                    onClick={() => { setEditingField("maxSubsPerTeacherPerWeek"); setEditValue(String(systemSettings.maxSubsPerTeacherPerWeek)); }}
                    className="p-1.5 rounded hover:bg-slate-100"
                  >
                    <Edit2 className="w-3.5 h-3.5" style={{ color: "var(--muted-foreground)" }} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Notifications</p>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {/* Email Alerts */}
          <div className="px-5 py-3.5 flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "var(--foreground)" }}>Email alerts</p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Send instant updates to teachers</p>
            </div>
            <button
              onClick={() => handleToggle("emailAlerts")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                systemSettings.emailAlerts ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {systemSettings.emailAlerts ? "Enabled" : "Disabled"}
            </button>
          </div>

          {/* SMS Alerts */}
          <div className="px-5 py-3.5 flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "var(--foreground)" }}>SMS for HOD escalations</p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Instant SMS notifications for urgent escalations</p>
            </div>
            <button
              onClick={() => handleToggle("smsAlerts")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                systemSettings.smsAlerts ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {systemSettings.smsAlerts ? "Enabled" : "Disabled"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
