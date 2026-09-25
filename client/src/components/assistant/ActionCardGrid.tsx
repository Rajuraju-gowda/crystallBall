import React from "react";
import { useAssistantStore } from "../../store/useAssistantStore";

export const ActionCardGrid: React.FC = () => {
  const { openView, fetchSummary, askHelp, advanceTeach } = useAssistantStore();

  const handleAction = (view: "summary" | "talk" | "help" | "teach") => {
    if (view === "summary") {
      fetchSummary();
    } else if (view === "help") {
      askHelp("What are the Level 2 drone patrol flight and safety rules?");
    } else if (view === "teach") {
      advanceTeach(1);
    } else {
      openView("talk");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      <button
        onClick={() => handleAction("summary")}
        className="group relative flex flex-col items-center justify-between p-3.5 bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-purple-300 rounded-xl transition-all shadow-xs hover:shadow-md text-center cursor-pointer"
      >
        <div className="w-16 h-16 my-1 relative flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-14 h-14 transition-transform group-hover:scale-105 duration-200">
            <circle cx="50" cy="30" r="14" fill="#1e293b" />
            <circle cx="50" cy="32" r="11" fill="#fbb040" />
            <path d="M40 28 C42 22 58 22 60 28 C58 24 44 24 40 28 Z" fill="#0f172a" />
            <path d="M32 75 C32 50 68 50 68 75 Z" fill="#fbbf24" />
            <rect x="52" y="44" width="22" height="30" rx="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
            <line x1="56" y1="52" x2="68" y2="52" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
            <line x1="56" y1="58" x2="68" y2="58" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
            <line x1="56" y1="64" x2="64" y2="64" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
            <circle cx="68" cy="46" r="2" fill="#7c3aed" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-slate-800 group-hover:text-purple-700 transition-colors">
          Present me Summary
        </span>
      </button>

      <button
        onClick={() => handleAction("talk")}
        className="group relative flex flex-col items-center justify-between p-3.5 bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-purple-300 rounded-xl transition-all shadow-xs hover:shadow-md text-center cursor-pointer"
      >
        <div className="w-16 h-16 my-1 relative flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-14 h-14 transition-transform group-hover:scale-105 duration-200">
            <circle cx="42" cy="30" r="13" fill="#1e293b" />
            <circle cx="42" cy="32" r="10" fill="#fbb040" />
            <path d="M26 75 C26 52 58 52 58 75 Z" fill="#38bdf8" />
            <path d="M34 32 C34 22 50 22 50 32" stroke="#0f172a" strokeWidth="2.5" fill="none" />
            <circle cx="50" cy="36" r="3" fill="#0f172a" />
            <path d="M64 36 Q70 42 64 48" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M72 30 Q82 42 72 54" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <rect x="44" y="60" width="22" height="15" rx="2" fill="#334155" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-slate-800 group-hover:text-purple-700 transition-colors">
          Talk to me
        </span>
      </button>

      <button
        onClick={() => handleAction("help")}
        className="group relative flex flex-col items-center justify-between p-3.5 bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-purple-300 rounded-xl transition-all shadow-xs hover:shadow-md text-center cursor-pointer"
      >
        <div className="w-16 h-16 my-1 relative flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-14 h-14 transition-transform group-hover:scale-105 duration-200">
            <circle cx="50" cy="36" r="13" fill="#1e293b" />
            <circle cx="50" cy="38" r="10" fill="#fbb040" />
            <path d="M34 80 C34 56 66 56 66 80 Z" fill="#fb923c" />
            <path d="M60 60 L68 40 L74 42 L66 65" stroke="#fbb040" strokeWidth="4" strokeLinecap="round" fill="none" />
            <text x="68" y="28" fontSize="22" fontWeight="bold" fill="#7c3aed" fontFamily="sans-serif">?</text>
            <line x1="20" y1="80" x2="80" y2="80" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-slate-800 group-hover:text-purple-700 transition-colors">
          Help me
        </span>
      </button>

      <button
        onClick={() => handleAction("teach")}
        className="group relative flex flex-col items-center justify-between p-3.5 bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-purple-300 rounded-xl transition-all shadow-xs hover:shadow-md text-center cursor-pointer"
      >
        <div className="w-16 h-16 my-1 relative flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-14 h-14 transition-transform group-hover:scale-105 duration-200">
            <circle cx="38" cy="38" r="11" fill="#fbb040" />
            <path d="M25 80 C25 60 51 60 51 80 Z" fill="#10b981" />
            <circle cx="64" cy="34" r="12" fill="#fbb040" />
            <path d="M52 80 C52 58 78 58 78 80 Z" fill="#6366f1" />
            <polygon points="38,20 22,26 38,32 54,26" fill="#1e293b" />
            <line x1="22" y1="26" x2="22" y2="34" stroke="#f59e0b" strokeWidth="2" />
            <rect x="36" y="68" width="28" height="12" rx="2" fill="#334155" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-slate-800 group-hover:text-purple-700 transition-colors">
          Teach me
        </span>
      </button>
    </div>
  );
};
