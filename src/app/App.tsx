import React, { useState } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { Sidebar } from "./components/Sidebar";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { HODDashboard } from "./components/HODDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { SubstitutionProvider } from "./components/SubstitutionContext";
import { DemoWalkthrough } from "./components/DemoWalkthrough";
import { Role, CLASSES } from "./components/mockData";

const defaultTabs: Record<Role, string> = {
  teacher: "timetable",
  hod: "escalations",
  admin: "upload",
};

export default function App() {
  const [role, setRole] = useState<Role | null>(null);
  const [userName, setUserName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [classId, setClassId] = useState("");
  const [activeTab, setActiveTab] = useState("");

  const advisedClass = CLASSES.find(c => c.advisorId === teacherId);
  const isAdvisor = !!advisedClass;
  const myClassId = advisedClass?.id ?? "";

  function handleLogin(r: Role, name: string, tid?: string, cid?: string) {
    setRole(r);
    setUserName(name);
    setTeacherId(tid ?? "");
    setClassId(cid ?? "");
    setActiveTab(defaultTabs[r]);
  }

  function handleLogout() {
    setRole(null);
    setUserName("");
    setTeacherId("");
    setClassId("");
    setActiveTab("");
  }

  return (
    <SubstitutionProvider>
      {role ? (
        <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--background)" }}>
          <Sidebar
            role={role}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
            userName={userName}
            isAdvisor={isAdvisor}
          />

          <main className="flex-1 overflow-y-auto">
            <div
              className="sticky top-0 z-10 px-8 py-4 border-b flex items-center justify-between"
              style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
                <span>ClassNotify</span>
                <span>/</span>
                <span style={{ color: "var(--foreground)", fontWeight: 500 }}>
                  {role === "hod" ? "HOD" : isAdvisor ? "Class Advisor" : "Teacher"} Dashboard
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{userName}</p>
                  <p className="text-xs capitalize" style={{ color: "var(--muted-foreground)" }}>
                    {role === "hod" ? "Head of Department" : isAdvisor ? "Class Advisor" : "Teacher"}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold uppercase">
                  {role === "hod" ? "ICBS" : userName.split(" ").map(n => n[0]).join("")}
                </div>
              </div>
            </div>

            <div className="px-8 py-6">
              {role === "teacher" && teacherId && (
                <TeacherDashboard activeTab={activeTab} teacherId={teacherId} classId={myClassId} isAdvisor={isAdvisor} />
              )}
              {role === "hod" && <HODDashboard activeTab={activeTab} />}
              {role === "admin" && <AdminDashboard activeTab={activeTab} />}
            </div>
          </main>
        </div>
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
      <DemoWalkthrough />
    </SubstitutionProvider>
  );
}
