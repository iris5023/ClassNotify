import React, { useState, useRef } from "react";
import { BookOpen, ArrowRight, GraduationCap, UserCog, Users, Shield } from "lucide-react";
import { Role, TEACHER_DEMOS, CLASSES } from "./mockData";

interface LoginScreenProps {
  onLogin: (role: Role, name: string, teacherId?: string, classId?: string) => void;
}

const roles: {
  id: Role;
  label: string;
  desc: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  border: string;
}[] = [
  {
    id: "teacher",
    label: "Teacher",
    desc: "View your timetable and manage substitution requests (includes class advisor dashboards)",
    name: "Select a demo teacher below",
    icon: GraduationCap,
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    id: "hod",
    label: "Head of Department",
    desc: "Make final decisions on escalated substitution requests",
    name: "Dr Harivinod N",
    icon: Shield,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    id: "admin",
    label: "Administrator",
    desc: "Manage all timetables, teachers, and view analytics",
    name: "Ms Renuka Tantry",
    icon: UserCog,
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
];

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selected, setSelected] = useState<Role | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);

  function handleLogin() {
    if (!selected) return;
    const role = roles.find(r => r.id === selected)!;

    if (selected === "teacher") {
      if (!selectedTeacherId) return;
      const demo = TEACHER_DEMOS.find(t => t.id === selectedTeacherId)!;
      const advisedClass = CLASSES.find(c => c.advisorId === demo.id);
      onLogin("teacher", demo.name, demo.id, advisedClass?.id);
      return;
    }

    if (selected === "hod") {
      onLogin("hod", role.name, "harivinod_n");
      return;
    }

    onLogin("admin", role.name, "renuka_tantry");
  }

  const canContinue =
    selected === "teacher" ? !!selectedTeacherId :
    !!selected;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--background)" }}>
      <div className="hidden lg:flex w-2/5 flex-col justify-between p-12" style={{ backgroundColor: "var(--primary)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold">ClassNotify</p>
            <p className="text-xs text-blue-200">Management Portal</p>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white leading-tight mb-4">
            Smarter substitution management for your school
          </h1>
          <p className="text-blue-200 leading-relaxed">
            Auto-generate teacher timetables, handle substitution requests with structured escalation, and keep every class covered — all in one place.
          </p>

          <div className="mt-8 space-y-3">
            {[
              "Auto-generated teacher timetables from class data",
              "Structured escalation: Teachers → Advisor → HOD",
              "Real-time notifications for all stakeholders",
              "Full audit trail and analytics dashboard",
            ].map(item => (
              <div key={item} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                  <ArrowRight className="w-3 h-3 text-white" />
                </div>
                <p className="text-sm text-blue-100">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-blue-300">NMIT · AI/ML, CS & BS, CS Data Science · 2025–26</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>Sign in to ClassNotify</h2>
            <p className="text-sm mt-2" style={{ color: "var(--muted-foreground)" }}>Select your role to continue</p>
          </div>

          <div className="space-y-3">
            {roles.map(role => {
              const Icon = role.icon;
              const isSelected = selected === role.id;
              return (
                <div key={role.id}>
                  <button
                    onClick={() => {
                      setSelected(role.id);
                      setSelectedTeacherId(null);
                    }}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150 ${
                      isSelected ? `${role.border} ${role.bg}` : "border-transparent hover:border-slate-200"
                    }`}
                    style={!isSelected ? { backgroundColor: "var(--card)", borderColor: "var(--border)" } : {}}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${role.bg}`}>
                      <Icon className={`w-5 h-5 ${role.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{role.label}</p>
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{role.desc}</p>
                    </div>
                    {isSelected && (
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${role.bg} border-2 ${role.border}`}>
                        <div className={`w-2.5 h-2.5 rounded-full ${role.color.replace("text-", "bg-")}`} />
                      </div>
                    )}
                  </button>

                  {isSelected && role.id === "teacher" && (
                    <div className="mt-2 ml-2 space-y-1.5 max-h-48 overflow-y-auto">
                      {TEACHER_DEMOS.map(demo => (
                        <button
                          key={demo.id}
                          onClick={() => setSelectedTeacherId(demo.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs border transition-all ${
                            selectedTeacherId === demo.id ? "border-blue-400 bg-blue-50" : ""
                          }`}
                          style={selectedTeacherId !== demo.id ? { borderColor: "var(--border)", backgroundColor: "var(--card)" } : {}}
                        >
                          <p className="font-semibold" style={{ color: "var(--foreground)" }}>{demo.name}</p>
                          <p style={{ color: "var(--muted-foreground)" }}>{demo.desc}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={handleLogin}
            disabled={!canContinue}
            className="w-full mt-6 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
            style={{ backgroundColor: "var(--primary)" }}
          >
            Continue to Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
