import React, { createContext, useContext, useState, useCallback } from "react";
import {
  SUBSTITUTION_REQUESTS,
  TEACHERS,
  SubstitutionRequest,
  AUDIT_LOGS,
  AuditLog,
  CLASS_TIMETABLE,
  UPLOADED_TIMETABLES,
  UploadedTimetable,
  INITIAL_SETTINGS,
  SystemSettings,
  TimetableSlot,
} from "./mockData";
import { canChangeResponse } from "./substitutionUtils";

interface SubstitutionContextValue {
  requests: SubstitutionRequest[];
  auditLogs: AuditLog[];
  timetableSlots: TimetableSlot[];
  uploads: UploadedTimetable[];
  systemSettings: SystemSettings;
  demoStep: number | null;
  setDemoStep: (step: number | null) => void;
  whatsappSent: boolean;
  setWhatsappSent: (sent: boolean) => void;
  triggerDemoMode: () => void;
  simulateDemoStep: () => void;
  acceptRequest: (requestId: string, teacherId: string) => void;
  declineRequest: (requestId: string, teacherId: string) => void;
  passToNextTeacher: (requestId: string, teacherId: string) => void;
  resolveEscalation: (requestId: string, resolution: { type: "assign"; teacherName: string } | { type: "free_hour" }) => void;
  deleteUploadById: (id: string, classId: string) => void;
  updateSettings: (newSettings: SystemSettings) => void;
  triggerDemoRequest: () => void;
  createSubstitutionRequest: (request: Omit<SubstitutionRequest, "id" | "createdAt" | "updatedAt" | "status" | "declinedBy">) => { success: boolean; error?: string };
  setUploads: React.Dispatch<React.SetStateAction<UploadedTimetable[]>>;
  setTimetableSlots: React.Dispatch<React.SetStateAction<TimetableSlot[]>>;
}

const SubstitutionContext = createContext<SubstitutionContextValue | null>(null);

function getTeacherName(teacherId: string): string {
  return TEACHERS.find(t => t.id === teacherId)?.name ?? teacherId;
}

function nextInChain(chain: string[], currentTeacherId: string): string | undefined {
  const idx = chain.indexOf(currentTeacherId);
  if (idx === -1) return chain[0];
  return chain[idx + 1];
}

export function SubstitutionProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<SubstitutionRequest[]>(SUBSTITUTION_REQUESTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(AUDIT_LOGS);
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>(CLASS_TIMETABLE);
  const [uploads, setUploads] = useState<UploadedTimetable[]>(UPLOADED_TIMETABLES);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  
  // Backend sync states
  const [token, setToken] = useState<string | null>(localStorage.getItem("authToken"));

  // Fetch token silently for Renuka Tantry (admin) to authenticate backend API requests
  React.useEffect(() => {
    async function fetchToken() {
      try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "renuka.tantry@nmit.ac.in", password: "admin123" })
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("authToken", data.token);
          setToken(data.token);
          console.log("Logged into backend successfully as Admin");
        }
      } catch (err) {
        console.warn("Could not log in to backend:", err);
      }
    }
    fetchToken();
  }, []);

  // Sync timetable slots and uploads from MySQL database on load if backend is running
  React.useEffect(() => {
    async function syncWithBackend() {
      const activeToken = token || localStorage.getItem("authToken");
      if (!activeToken) return;
      try {
        const slotsRes = await fetch("http://localhost:5000/api/timetable", {
          headers: { "Authorization": `Bearer ${activeToken}` }
        });
        const uploadsRes = await fetch("http://localhost:5000/api/ocr-upload", {
          headers: { "Authorization": `Bearer ${activeToken}` }
        });
        const requestsRes = await fetch("http://localhost:5000/api/substitution", {
          headers: { "Authorization": `Bearer ${activeToken}` }
        });
        const logsRes = await fetch("http://localhost:5000/api/substitution/audit-logs", {
          headers: { "Authorization": `Bearer ${activeToken}` }
        });

        if (slotsRes.ok && uploadsRes.ok && requestsRes.ok && logsRes.ok) {
          const dbSlots = await slotsRes.json();
          const dbUploads = await uploadsRes.json();
          const dbRequests = await requestsRes.json();
          const dbLogs = await logsRes.json();
          
          setTimetableSlots(dbSlots);
          setUploads(dbUploads);
          setRequests(dbRequests);
          setAuditLogs(dbLogs);
          console.log("Successfully synchronized slots, uploads, requests, and logs with MySQL database");
        }
      } catch (err) {
        console.warn("Failed to sync with MySQL backend, using local mock data:", err);
      }
    }
    syncWithBackend();
  }, [token]);

  // Demo states
  const [demoStep, setDemoStep] = useState<number | null>(null);
  const [whatsappSent, setWhatsappSent] = useState<boolean>(false);

  const addLog = useCallback((log: Omit<AuditLog, "id">) => {
    setAuditLogs(prev => [{ ...log, id: `l${Date.now()}` }, ...prev]);
  }, []);

  const deleteUploadById = useCallback(async (id: string, classId: string) => {
    // 1. Update local UI state
    setUploads(prev => prev.filter(u => u.id !== id));
    
    // Clean up timetable slots only if no other uploads exist for this class
    setUploads(currentUploads => {
      const remainingForClass = currentUploads.filter(u => u.id !== id && u.classId === classId);
      if (remainingForClass.length === 0) {
        setTimetableSlots(prev => prev.filter(s => s.classId !== classId));
      }
      return currentUploads.filter(u => u.id !== id);
    });

    // 2. Perform backend delete query in MySQL
    const activeToken = token || localStorage.getItem("authToken");
    if (activeToken) {
      try {
        const res = await fetch(`http://localhost:5000/api/ocr-upload/${id}?classId=${classId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${activeToken}` }
        });
        if (res.ok) {
          console.log(`Deleted timetable upload ID ${id} and synchronized with MySQL.`);
        } else {
          console.warn("Failed to delete timetable upload from backend database.");
        }
      } catch (err) {
        console.warn("Failed to contact backend to delete timetable upload:", err);
      }
    }
    
    addLog({
      timestamp: new Date().toISOString(),
      action: "Timetable Deleted",
      actor: "Administrator",
      requestId: "",
      details: `Deleted timetable with ID ${id} and updated schedules for class ${classId}.`,
      type: "free_hour",
    });
  }, [addLog, token]);

  const updateSettings = useCallback((newSettings: SystemSettings) => {
    setSystemSettings(newSettings);
    addLog({
      timestamp: new Date().toISOString(),
      action: "Settings Updated",
      actor: "Administrator",
      requestId: "",
      details: `Updated substitution thresholds and alerts configuration.`,
      type: "free_hour",
    });
  }, [addLog]);

  const createSubstitutionRequest = useCallback((reqData: Omit<SubstitutionRequest, "id" | "createdAt" | "updatedAt" | "status" | "declinedBy">) => {
    // Intercept Shruthi's Monday Period 1 FAIML request to match the site's substitution flow
    const isShruthiDemo = reqData.absentTeacherId === "shruthi_patil" && reqData.classId === "AIML5" && reqData.period === 1;

    // Lead time validation: must be at least 12 hours before the class (except for demo request)
    if (!isShruthiDemo && demoStep === null && !canChangeResponse(reqData.day, reqData.period)) {
      return {
        success: false,
        error: "Substitution requests must be submitted at least 12 hours before the scheduled class time.",
      };
    }

    const reqId = isShruthiDemo ? "sr-demo-shruthi" : `sr${Date.now()}`;
    const newRequest: SubstitutionRequest = {
      ...reqData,
      id: reqId,
      status: "pending",
      declinedBy: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Ensure broadcast candidates are set correctly for Shruthi's request
      ...(isShruthiDemo ? {
        requestedTeacherId: "broadcast",
        requestedTeacherName: "Eligible Teachers",
        candidateChain: ["saleena_ts", "pratibha_gaonkar", "devikrishna_ks"]
      } : {})
    };

    setRequests(prev => [newRequest, ...prev.filter(r => r.id !== reqId)]);

    // Call backend API to update MySQL simultaneously
    const activeToken = token || localStorage.getItem("authToken");
    if (activeToken) {
      const payload = {
        absentTeacherId: reqData.absentTeacherId,
        subject: reqData.subject,
        classId: reqData.classId,
        className: reqData.className,
        day: reqData.day,
        period: reqData.period,
        timeRange: reqData.time,
        reason: reqData.reason,
        requestedTeacherId: isShruthiDemo ? "broadcast" : (reqData.requestedTeacherId || null),
        candidateChain: isShruthiDemo 
          ? ["saleena_ts", "pratibha_gaonkar", "devikrishna_ks"] 
          : (reqData.candidateChain || [])
      };

      fetch("http://localhost:5000/api/substitution", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${activeToken}`
        },
        body: JSON.stringify(payload)
      })
      .then(async res => {
        if (res.ok) {
          console.log("Successfully created substitution request in MySQL.");
          const requestsRes = await fetch("http://localhost:5000/api/substitution", {
            headers: { "Authorization": `Bearer ${activeToken}` }
          });
          const logsRes = await fetch("http://localhost:5000/api/substitution/audit-logs", {
            headers: { "Authorization": `Bearer ${activeToken}` }
          });
          if (requestsRes.ok && logsRes.ok) {
            setRequests(await requestsRes.json());
            setAuditLogs(await logsRes.json());
          }
        }
      })
      .catch(err => console.warn("Failed to create request in MySQL:", err));
    }

    addLog({
      timestamp: new Date().toISOString(),
      action: "Substitution Request Created",
      actor: reqData.absentTeacherName,
      requestId: newRequest.id,
      details: `${reqData.absentTeacherName} requested substitution for ${reqData.subject} (${reqData.className}, P${reqData.period}). Sent to eligible teachers.`,
      type: "request",
    });

    if (isShruthiDemo && demoStep === 2) {
      setDemoStep(3);
    }

    return { success: true };
  }, [addLog, demoStep, token]);

  const triggerDemoRequest = useCallback(() => {
    // Legacy demo trigger - kept for safety
    triggerDemoMode();
  }, []);

  const triggerDemoMode = useCallback(() => {
    setDemoStep(2); // Starts at step 2 (Login as Shruthi to create request)
    setWhatsappSent(false);
    setRequests(prev => prev.filter(r => !r.id.startsWith("sr-demo") && r.id !== "sr-demo-shruthi"));
    addLog({
      timestamp: new Date().toISOString(),
      action: "Demo Walkthrough Initialized",
      actor: "System",
      requestId: "",
      details: "Substitution Request Cycle active. Log out and log in as Ms Shruthi Patil to request substitution.",
      type: "request",
    });
  }, [addLog]);

  const acceptRequest = useCallback(async (requestId: string, teacherId: string) => {
    setRequests(prev =>
      prev.map(r => {
        if (r.id !== requestId) return r;
        if (r.status !== "pending") return r;

        const teacherName = getTeacherName(teacherId);
        return {
          ...r,
          status: "accepted" as const,
          requestedTeacherId: teacherId,
          requestedTeacherName: teacherName,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    const teacherName = getTeacherName(teacherId);
    addLog({
      timestamp: new Date().toISOString(),
      action: "Request Accepted",
      actor: teacherName,
      requestId: requestId,
      details: `Accepted cover (Simulated ACID lock).`,
      type: "accept",
    });

    if (requestId === "sr-demo-shruthi" && demoStep === 4) {
      setDemoStep(11);
    }

    const activeToken = token || localStorage.getItem("authToken");
    if (activeToken) {
      try {
        const res = await fetch(`http://localhost:5000/api/substitution/${requestId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${activeToken}`
          },
          body: JSON.stringify({ status: "accepted", teacherId })
        });
        if (res.ok) {
          const slotsRes = await fetch("http://localhost:5000/api/timetable", {
            headers: { "Authorization": `Bearer ${activeToken}` }
          });
          const requestsRes = await fetch("http://localhost:5000/api/substitution", {
            headers: { "Authorization": `Bearer ${activeToken}` }
          });
          const logsRes = await fetch("http://localhost:5000/api/substitution/audit-logs", {
            headers: { "Authorization": `Bearer ${activeToken}` }
          });
          if (slotsRes.ok && requestsRes.ok && logsRes.ok) {
            setTimetableSlots(await slotsRes.json());
            setRequests(await requestsRes.json());
            setAuditLogs(await logsRes.json());
          }
        }
      } catch (err) {
        console.warn("Failed to accept request on backend:", err);
      }
    }
  }, [addLog, demoStep, token]);

  const declineRequest = useCallback(async (requestId: string, teacherId: string) => {
    const teacherName = getTeacherName(teacherId);
    
    // Find the request
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    const activeToken = token || localStorage.getItem("authToken");

    // If the owner declines/cancels their own request, delete it entirely for everyone!
    if (req.absentTeacherId === teacherId) {
      setRequests(prev => prev.filter(r => r.id !== requestId));
      addLog({
        timestamp: new Date().toISOString(),
        action: "Request Canceled & Deleted",
        actor: req.absentTeacherName,
        requestId: requestId,
        details: `${req.absentTeacherName} canceled/declined their own request. Request deleted for all teachers.`,
        type: "decline",
      });
      if (requestId === "sr-demo-shruthi") {
        setDemoStep(11);
      }

      if (activeToken) {
        try {
          const res = await fetch(`http://localhost:5000/api/substitution/${requestId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${activeToken}` }
          });
          if (res.ok) {
            console.log("Deleted request from MySQL database");
            const requestsRes = await fetch("http://localhost:5000/api/substitution", {
              headers: { "Authorization": `Bearer ${activeToken}` }
            });
            const logsRes = await fetch("http://localhost:5000/api/substitution/audit-logs", {
              headers: { "Authorization": `Bearer ${activeToken}` }
            });
            if (requestsRes.ok && logsRes.ok) {
              setRequests(await requestsRes.json());
              setAuditLogs(await logsRes.json());
            }
          }
        } catch (err) {
          console.warn("Failed to delete request on backend:", err);
        }
      }
      return;
    }

    // If assigned specifically to this teacher (e.g. by HOD reassign or direct assignment)
    if (req.requestedTeacherId === teacherId) {
      addLog({
        timestamp: new Date().toISOString(),
        action: "Request Declined",
        actor: teacherName,
        requestId: req.id,
        details: `${teacherName} declined the HOD assignment. Returned to HOD escalations.`,
        type: "decline",
      });

      // Update demo step if needed
      if (requestId === "sr-demo-shruthi") {
        if (teacherId === "sudheer_m") setDemoStep(7);
        else if (teacherId === "shajahan_aboobacker") setDemoStep(9);
      }

      setRequests(prev =>
        prev.map(r => {
          if (r.id !== requestId) return r;
          return {
            ...r,
            status: "escalated" as const,
            requestedTeacherId: undefined,
            requestedTeacherName: undefined,
            declinedBy: [...r.declinedBy, teacherName],
            updatedAt: new Date().toISOString(),
          };
        })
      );

      if (activeToken) {
        try {
          const res = await fetch(`http://localhost:5000/api/substitution/${requestId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${activeToken}`
            },
            body: JSON.stringify({ status: "declined", teacherId })
          });
          if (res.ok) {
            const requestsRes = await fetch("http://localhost:5000/api/substitution", {
              headers: { "Authorization": `Bearer ${activeToken}` }
            });
            const logsRes = await fetch("http://localhost:5000/api/substitution/audit-logs", {
              headers: { "Authorization": `Bearer ${activeToken}` }
            });
            if (requestsRes.ok && logsRes.ok) {
              setRequests(await requestsRes.json());
              setAuditLogs(await logsRes.json());
            }
          }
        } catch (err) {
          console.warn("Failed to decline request on backend:", err);
        }
      }
      return;
    }

    // Otherwise, normal eligible teacher decline from the candidate chain
    const newDeclinedBy = req.declinedBy.includes(teacherName) ? req.declinedBy : [...req.declinedBy, teacherName];
    
    // Check if everyone in candidateChain has declined
    const allDeclined = req.candidateChain?.every(candId => {
      const candName = getTeacherName(candId);
      return newDeclinedBy.includes(candName);
    }) ?? false;

    addLog({
      timestamp: new Date().toISOString(),
      action: "Request Declined",
      actor: teacherName,
      requestId: req.id,
      details: `${teacherName} declined ${req.subject} substitution.`,
      type: "decline",
    });

    if (allDeclined) {
      if (requestId === "sr-demo-shruthi") {
        setDemoStep(5); // Escalate to HOD
      }
      setRequests(prev =>
        prev.map(r => {
          if (r.id !== requestId) return r;
          return {
            ...r,
            status: "escalated" as const,
            requestedTeacherId: undefined,
            requestedTeacherName: undefined,
            declinedBy: newDeclinedBy,
            updatedAt: new Date().toISOString(),
          };
        })
      );
    } else {
      setRequests(prev =>
        prev.map(r => {
          if (r.id !== requestId) return r;
          return {
            ...r,
            declinedBy: newDeclinedBy,
            updatedAt: new Date().toISOString(),
          };
        })
      );
    }

    if (activeToken) {
      try {
        const res = await fetch(`http://localhost:5000/api/substitution/${requestId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${activeToken}`
          },
          body: JSON.stringify({ status: "declined", teacherId })
        });
        if (res.ok) {
          const requestsRes = await fetch("http://localhost:5000/api/substitution", {
            headers: { "Authorization": `Bearer ${activeToken}` }
          });
          const logsRes = await fetch("http://localhost:5000/api/substitution/audit-logs", {
            headers: { "Authorization": `Bearer ${activeToken}` }
          });
          if (requestsRes.ok && logsRes.ok) {
            setRequests(await requestsRes.json());
            setAuditLogs(await logsRes.json());
          }
        }
      } catch (err) {
        console.warn("Failed to decline request on backend:", err);
      }
    }
  }, [addLog, requests, demoStep, token]);

  const passToNextTeacher = useCallback((requestId: string, teacherId: string) => {
    // Normal pass chain logic
    setRequests(prev =>
      prev.map(r => {
        if (r.id !== requestId) return r;
        if (r.requestedTeacherId !== teacherId) return r;

        const teacherName = getTeacherName(teacherId);
        const chain = r.candidateChain ?? [];
        const newDeclinedBy = r.declinedBy.includes(teacherName)
          ? r.declinedBy
          : [...r.declinedBy, teacherName];

        const nextTeacherId = nextInChain(chain, teacherId);
        if (nextTeacherId && !newDeclinedBy.includes(getTeacherName(nextTeacherId))) {
          const nextName = getTeacherName(nextTeacherId);
          addLog({
            timestamp: new Date().toISOString(),
            action: "Request Reassigned",
            actor: "System",
            requestId: r.id,
            details: `${teacherName} declined. Request sent to ${nextName}.`,
            type: "request",
          });
          return {
            ...r,
            status: "pending" as const,
            requestedTeacherId: nextTeacherId,
            requestedTeacherName: nextName,
            declinedBy: newDeclinedBy,
            updatedAt: new Date().toISOString(),
          };
        }

        addLog({
          timestamp: new Date().toISOString(),
          action: "Escalated to HOD",
          actor: "System",
          requestId: r.id,
          details: `${newDeclinedBy.length} teacher(s) declined. Escalated to HOD.`,
          type: "escalate",
        });
        return {
          ...r,
          status: "escalated" as const,
          requestedTeacherId: undefined,
          requestedTeacherName: undefined,
          declinedBy: newDeclinedBy,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, [addLog]);

  const resolveEscalation = useCallback((
    requestId: string,
    resolution: { type: "assign"; teacherName: string } | { type: "free_hour" }
  ) => {
    setRequests(prev =>
      prev.map(r => {
        if (r.id !== requestId) return r;
        
        if (resolution.type === "assign") {
          addLog({
            timestamp: new Date().toISOString(),
            action: "HOD Assigned Substitute",
            actor: "Dr Harivinod N",
            requestId: r.id,
            details: `Assigned ${resolution.teacherName} for ${r.subject}, ${r.className}, P${r.period}.`,
            type: "assign",
          });

          // Handle Demo steps
          if (requestId === "sr-demo-shruthi") {
            if (resolution.teacherName === "Dr Sudheer M") {
              setDemoStep(6); // Go to Sudheer action
              return {
                ...r,
                status: "pending" as const,
                requestedTeacherId: "sudheer_m",
                requestedTeacherName: "Dr Sudheer M",
                updatedAt: new Date().toISOString(),
              };
            }
            if (resolution.teacherName === "Dr Shajahan Aboobacker") {
              setDemoStep(8); // Go to Shahjahan action
              return {
                ...r,
                status: "pending" as const,
                requestedTeacherId: "shajahan_aboobacker",
                requestedTeacherName: "Dr Shajahan Aboobacker",
                updatedAt: new Date().toISOString(),
              };
            }
          }

          return {
            ...r,
            status: "accepted" as const,
            requestedTeacherName: resolution.teacherName,
            updatedAt: new Date().toISOString(),
          };
        }

        // Free Hour declared
        addLog({
          timestamp: new Date().toISOString(),
          action: "Free Hour Declared",
          actor: "Dr Harivinod N",
          requestId: r.id,
          details: `Declared free hour for ${r.className}, P${r.period}.`,
          type: "free_hour",
        });

        if (requestId === "sr-demo-shruthi") {
          setDemoStep(10); // Go to Advisor WhatsApp
        }

        return { ...r, status: "free_hour" as const, updatedAt: new Date().toISOString() };
      })
    );
  }, [addLog, demoStep]);

  const simulateDemoStep = useCallback(() => {
    if (demoStep === null) return;
    
    if (demoStep === 2) {
      // Create request on behalf of Shruthi
      createSubstitutionRequest({
        absentTeacherId: "shruthi_patil",
        absentTeacherName: "Ms Shruthi Patil",
        subject: "FAIML",
        classId: "AIML5",
        className: "V Sem BE AIML",
        day: "Monday",
        period: 1,
        time: "9:00 – 9:55",
        reason: "Attending research conference (Demo)",
        requestedTeacherId: "broadcast",
        requestedTeacherName: "Eligible Teachers",
        candidateChain: ["saleena_ts", "pratibha_gaonkar", "devikrishna_ks"],
      });
    } else if (demoStep === 3) {
      // Proceed to Teacher Action (do not decline Shruthi's request)
      setDemoStep(4);
    } else if (demoStep === 4) {
      // Simulate all declining
      setRequests(prev =>
        prev.map(r => {
          if (r.id !== "sr-demo-shruthi") return r;
          addLog({
            timestamp: new Date().toISOString(),
            action: "System Escalation",
            actor: "System",
            requestId: r.id,
            details: "Saleena, Devikrishna, and Pratibha declined. Escalated to HOD Dr Harivinod N.",
            type: "escalate",
          });
          return {
            ...r,
            status: "escalated" as const,
            requestedTeacherId: undefined,
            requestedTeacherName: undefined,
            declinedBy: ["Dr Saleena T S", "Ms Devikrishna K S", "Ms Pratibha Ganapati Gaonkar"],
            updatedAt: new Date().toISOString(),
          };
        })
      );
      setDemoStep(5); // Go to HOD Assign Sudheer
    } else if (demoStep === 5) {
      // Simulate assigning Sudheer
      resolveEscalation("sr-demo-shruthi", { type: "assign", teacherName: "Dr Sudheer M" });
    } else if (demoStep === 6) {
      // Simulate Sudheer declining
      declineRequest("sr-demo-shruthi", "sudheer_m");
    } else if (demoStep === 7) {
      // Simulate HOD assigning Shahjahan
      resolveEscalation("sr-demo-shruthi", { type: "assign", teacherName: "Dr Shajahan Aboobacker" });
    } else if (demoStep === 8) {
      // Simulate Shahjahan declining
      declineRequest("sr-demo-shruthi", "shajahan_aboobacker");
    } else if (demoStep === 9) {
      // Simulate HOD declaring free class
      resolveEscalation("sr-demo-shruthi", { type: "free_hour" });
    } else if (demoStep === 10) {
      // Simulate WhatsApp message sent
      setWhatsappSent(true);
      addLog({
        timestamp: new Date().toISOString(),
        action: "Broadcast Shared",
        actor: "Ms Shruthi Patil",
        requestId: "sr-demo-shruthi",
        details: "Shared free class notification with Vth Sem AIML student group via WhatsApp.",
        type: "free_hour",
      });
      setDemoStep(11); // Demo Completed
    } else if (demoStep === 11) {
      // Reset demo
      setDemoStep(null);
    }
  }, [demoStep, createSubstitutionRequest, resolveEscalation, declineRequest, addLog]);

  return (
    <SubstitutionContext.Provider value={{
      requests,
      auditLogs,
      timetableSlots,
      uploads,
      systemSettings,
      demoStep,
      setDemoStep,
      whatsappSent,
      setWhatsappSent,
      triggerDemoMode,
      simulateDemoStep,
      acceptRequest,
      declineRequest,
      passToNextTeacher,
      resolveEscalation,
      deleteUploadById,
      updateSettings,
      triggerDemoRequest,
      createSubstitutionRequest,
      setUploads,
      setTimetableSlots
    }}>
      {children}
    </SubstitutionContext.Provider>
  );
}

export function useSubstitution() {
  const ctx = useContext(SubstitutionContext);
  if (!ctx) throw new Error("useSubstitution must be used within SubstitutionProvider");
  return ctx;
}
