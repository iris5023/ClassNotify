import React from "react";
import { CheckCircle, XCircle, Clock, ArrowUpCircle, CalendarOff } from "lucide-react";
import { SubStatus } from "./mockData";

interface StatusBadgeProps {
  status: SubStatus;
  size?: "sm" | "md";
}

const config: Record<SubStatus, { label: string; bg: string; text: string; icon: React.ComponentType<{className?: string}> }> = {
  accepted: { label: "Accepted", bg: "#DCFCE7", text: "#15803D", icon: CheckCircle },
  declined: { label: "Declined", bg: "#FEE2E2", text: "#B91C1C", icon: XCircle },
  pending: { label: "Pending", bg: "#FEF3C7", text: "#B45309", icon: Clock },
  escalated: { label: "Escalated", bg: "#DBEAFE", text: "#1D4ED8", icon: ArrowUpCircle },
  free_hour: { label: "Free Hour", bg: "#F3E8FF", text: "#7C3AED", icon: CalendarOff },
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const c = config[status];
  const Icon = c.icon;
  const padding = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${padding}`}
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {c.label}
    </span>
  );
}
