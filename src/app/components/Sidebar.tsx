import React from "react";
import {
  LayoutDashboard, Calendar, Bell, Users, ClipboardList,
  BarChart3, LogOut, ChevronRight, BookOpen, Settings
} from "lucide-react";
import { Role } from "./mockData";

interface SidebarProps {
  role: Role;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  userName: string;
  isAdvisor?: boolean;
}

const roleConfig: Record<Role, { label: string; color: string; initials: string }> = {
  teacher: { label: "Teacher", color: "bg-blue-500", initials: "AS" },
  hod: { label: "Head of Dept.", color: "bg-amber-500", initials: "PD" },
  admin: { label: "Administrator", color: "bg-purple-500", initials: "AK" },
};

const navItems: Record<Role, { id: string; label: string; icon: React.ComponentType<{className?: string}> }[]> = {
  teacher: [
    { id: "timetable", label: "My Timetable", icon: Calendar },
    { id: "substitutions", label: "Substitution Requests", icon: Bell },
    { id: "notifications", label: "Notifications", icon: ClipboardList },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  hod: [
    { id: "escalations", label: "Escalations", icon: Bell },
    { id: "teachers", label: "Free Teachers", icon: Users },
    { id: "timetable", label: "Department View", icon: Calendar },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  admin: [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "upload", label: "Upload Timetables", icon: Calendar },
    { id: "timetables", label: "View Timetables", icon: Calendar },
    { id: "teachers", label: "Faculty Directory", icon: Users },
    { id: "logs", label: "Audit Logs", icon: ClipboardList },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ],
};

export function Sidebar({ role, activeTab, onTabChange, onLogout, userName, isAdvisor }: SidebarProps) {
  const baseConfig = roleConfig[role];
  const config = {
    ...baseConfig,
    label: role === "teacher" && isAdvisor ? "Class Advisor" : baseConfig.label,
    color: role === "teacher" && isAdvisor ? "bg-emerald-500" : baseConfig.color,
  };
  
  const items = [...navItems[role]];
  if (role === "teacher" && isAdvisor) {
    items.push({ id: "escalations", label: "Escalation Log", icon: ClipboardList });
  }

  return (
    <aside className="w-64 h-screen flex flex-col" style={{ backgroundColor: "var(--sidebar)", color: "var(--sidebar-foreground)" }}>
      {/* Logo */}
      <div className="px-6 py-5 border-b" style={{ borderColor: "var(--sidebar-border)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-none">ClassNotify</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--sidebar-foreground)", opacity: 0.6 }}>Management Portal</p>
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-4 py-3 mx-3 mt-4 rounded-lg" style={{ backgroundColor: "var(--sidebar-accent)" }}>
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--sidebar-foreground)", opacity: 0.6 }}>
          Logged in as
        </p>
        <p className="text-sm font-semibold text-white mt-0.5">{userName}</p>
        <span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium text-white ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--sidebar-foreground)", opacity: 0.4 }}>
          Navigation
        </p>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
              style={!isActive ? { backgroundColor: "transparent" } : {}}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--sidebar-accent)"; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
            >
              <span className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                {item.label}
              </span>
              {isActive && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t" style={{ borderColor: "var(--sidebar-border)" }}>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white transition-all duration-150"
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--sidebar-accent)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
