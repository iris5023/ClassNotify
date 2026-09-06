import React from "react";
import { useSubstitution } from "./SubstitutionContext";
import { Play, RotateCcw, X, CheckCircle2 } from "lucide-react";

interface StepDetail {
  title: string;
  user: string;
  instructions: string;
  btnLabel?: string;
}

const STEP_DETAILS: Record<number, StepDetail> = {
  2: {
    title: "Create Request",
    user: "Shruthi (Teacher / Advisor)",
    instructions: "Sign out, log in as Shruthi Patil. Go to 'My Timetable', find the Monday Period 1 'FAIML' slot, click it, enter a reason, and submit a substitution request.",
    btnLabel: "Simulate FAIML Request Creation",
  },
  3: {
    title: "Check Owner Options",
    user: "Shruthi (Request Owner)",
    instructions: "Go to the 'Substitution Requests' panel in the navigation. Shruthi has an active request for her Monday Period 1 FAIML class. Note that she only has a 'Cancel Request' button (Accept is removed).",
    btnLabel: "Let's Proceed (Do Not Cancel)",
  },
  4: {
    title: "Eligible Teachers Action",
    user: "Saleena, Pratibha, or Devikrishna",
    instructions: "Sign out and log in as Saleena TS, Devikrishna KS, or Pratibha Gaonkar. Go to 'Substitution Requests'. They can accept or decline. If one accepts, the others see: 'You cannot accept this class, another teacher has already accepted.' For the demo, we simulate all three declining to escalate to HOD.",
    btnLabel: "Simulate All Three Declining",
  },
  5: {
    title: "HOD Dashboard - Assign Sudheer",
    user: "HOD (Dr Harivinod N)",
    instructions: "Sign out, log in as HOD (Dr Harivinod N). Go to 'Escalations' and click 'Assign Dr Sudheer M'.",
    btnLabel: "Simulate Sudheer Assignment",
  },
  6: {
    title: "Sudheer Pending Action",
    user: "Sudheer (Assigned Teacher)",
    instructions: "Sign out, log in as Sudheer. Go to 'Substitution Requests' and click 'Decline'.",
    btnLabel: "Simulate Sudheer Declining",
  },
  7: {
    title: "HOD Dashboard - Assign Shahjahan",
    user: "HOD (Dr Harivinod N)",
    instructions: "Sign out, log in as HOD. Go to 'Escalations' and click 'Assign Dr Shajahan Aboobacker'.",
    btnLabel: "Simulate Shahjahan Assignment",
  },
  8: {
    title: "Shahjahan Pending Action",
    user: "Shahjahan (Assigned Teacher)",
    instructions: "Sign out, log in as Shahjahan. Go to 'Substitution Requests' and click 'Decline'.",
    btnLabel: "Simulate Shahjahan Declining",
  },
  9: {
    title: "HOD Dashboard - Declare Free Class",
    user: "HOD (Dr Harivinod N)",
    instructions: "Sign out, log in as HOD. Go to 'Escalations' and click 'Declare Free Hour' for AIML5.",
    btnLabel: "Simulate Free Hour Declaration",
  },
  10: {
    title: "Send WhatsApp Notification",
    user: "Shruthi (Class Advisor)",
    instructions: "Sign out, log in as Shruthi. Go to 'Escalation Log' in her sidebar, and click the WhatsApp icon next to the declared free class to mock sending a notification to the Vth Sem BE AIML class group.",
    btnLabel: "Simulate Sharing to WhatsApp Group",
  },
  11: {
    title: "Demo Completed!",
    user: "Walkthrough Finished",
    instructions: "Excellent! The entire substitution request flow (Absent -> Declined -> HOD Escalation -> Declined -> Free Class -> WhatsApp Share) is complete and logged in Shruthi's escalation log.",
    btnLabel: "Close & Reset Demo",
  },
};

export function DemoWalkthrough() {
  const { demoStep, simulateDemoStep, setDemoStep } = useSubstitution();

  if (demoStep === null || !STEP_DETAILS[demoStep]) return null;

  const current = STEP_DETAILS[demoStep];

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 rounded-2xl border shadow-2xl overflow-hidden transition-all duration-300 transform scale-100 hover:shadow-blue-200/50"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(37, 99, 235, 0.2)",
      }}
    >
      {/* Top Gradient Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
      
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600">Substitution Demo Guide</h4>
          </div>
          <button 
            onClick={() => setDemoStep(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Info */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">{current.title}</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
              Step {demoStep - 1} / 10
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[11px] font-semibold text-slate-500">Log In As:</span>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              {current.user}
            </span>
          </div>
        </div>

        {/* Instructions */}
        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
          {current.instructions}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1 text-xs">
          {current.btnLabel && (
            <button
              onClick={simulateDemoStep}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all shadow-md hover:shadow-blue-500/20"
            >
              {demoStep === 11 ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {current.btnLabel}
            </button>
          )}
          
          <button
            onClick={() => setDemoStep(null)}
            className="w-full py-2 px-4 rounded-xl font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
          >
            Exit Demo
          </button>
        </div>
      </div>
    </div>
  );
}
