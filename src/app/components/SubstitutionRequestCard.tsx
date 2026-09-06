import React from "react";
import { CheckCircle, XCircle, Clock, Lock } from "lucide-react";
import { CLASSES, SubstitutionRequest } from "./mockData";
import { StatusBadge } from "./StatusBadge";
import { canChangeResponse, formatChangeDeadline } from "./substitutionUtils";

interface SubstitutionRequestCardProps {
  req: SubstitutionRequest;
  teacherId?: string;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onPassToNext?: (id: string) => void;
  showActions?: boolean;
}

export function SubstitutionRequestCard({
  req,
  teacherId,
  onAccept,
  onDecline,
  onPassToNext,
  showActions = true,
}: SubstitutionRequestCardProps) {
  const cls = CLASSES.find(c => c.id === req.classId);
  const editable = canChangeResponse(req.day, req.period);
  const isAcceptedByOther = req.status === "accepted" && req.requestedTeacherId !== teacherId;
  const canAct =
    showActions &&
    editable &&
    (req.status === "pending" || req.status === "accepted" || req.status === "declined") &&
    !isAcceptedByOther;

  return (
    <div className="px-5 py-4 flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            {req.subject} · {cls?.name ?? req.className}
          </p>
          <StatusBadge status={req.status} size="sm" />
        </div>
        <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
          {req.day}, P{req.period} · {req.time}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          Absent: {req.absentTeacherName} · {req.reason}
        </p>
        {req.declinedBy.length > 0 && (
          <p className="text-xs mt-0.5" style={{ color: "#B91C1C" }}>
            Previously declined by: {req.declinedBy.join(", ")}
          </p>
        )}
        {req.status === "accepted" && req.requestedTeacherId !== teacherId && req.absentTeacherId !== teacherId && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold w-fit animate-fade-in">
            you can’t accept taking the class as the other teacher accepted it
          </div>
        )}
        {showActions && (
          <p className="text-xs mt-1 flex items-center gap-1" style={{ color: editable ? "#B45309" : "var(--muted-foreground)" }}>
            {editable ? (
              <>
                <Clock className="w-3 h-3" />
                You can change your response until {formatChangeDeadline(req.day, req.period)}
              </>
            ) : (
              <>
                <Lock className="w-3 h-3" />
                Response locked — less than 12 hours before class
              </>
            )}
          </p>
        )}
      </div>
      {canAct && (
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-2">
            {req.status !== "accepted" && req.absentTeacherId !== teacherId && (
              <button
                onClick={() => onAccept(req.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: "#16A34A" }}
              >
                <CheckCircle className="w-3.5 h-3.5" /> Accept
              </button>
            )}
            {req.status !== "declined" && (
              <button
                onClick={() => onDecline(req.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: "#DC2626" }}
              >
                <XCircle className="w-3.5 h-3.5" /> Decline
              </button>
            )}
          </div>
          {req.status === "declined" && onPassToNext && (req.candidateChain?.length ?? 0) > 0 && (
            <button
              onClick={() => onPassToNext(req.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border hover:opacity-90"
              style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              Pass to next teacher →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
