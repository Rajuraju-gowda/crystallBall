import React from "react";
import { Eye, Layers, Camera, MapPin, Sparkles } from "lucide-react";
import { useAssistantStore } from "../../store/useAssistantStore";

export const DetailPreview: React.FC = () => {
  const { activeItem, openView } = useAssistantStore();

  if (!activeItem) return null;

  return (
    <div className="w-80 lg:w-96 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col p-4 shrink-0">
      <div className="text-[11px] font-medium text-slate-400 truncate mb-1">
        {activeItem.path} &gt; {activeItem.title.slice(0, 16)}...
      </div>

      <div className="mb-3">
        <h2 className="text-sm font-bold text-slate-900 leading-tight mb-1">
          {activeItem.title}
        </h2>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {activeItem.description}
        </p>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-3 text-xs">
        <button className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 font-semibold rounded-lg shadow-xs">
          <Eye className="w-3.5 h-3.5 text-purple-600" />
          Snapshot & Control
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1 text-slate-500 hover:text-slate-800 rounded-lg transition-colors">
          <Layers className="w-3.5 h-3.5" />
          Media / Content
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between text-[11px] font-bold text-purple-700 mb-1.5">
          <div className="flex items-center gap-1">
            <Camera className="w-3.5 h-3.5" />
            Screen Snapshot Target
          </div>
          <span className="text-[10px] font-medium text-slate-400">ID: {activeItem.id}</span>
        </div>

        <div className="relative flex-1 min-h-[220px] rounded-lg border border-slate-200 bg-slate-900/90 overflow-hidden flex flex-col justify-between p-3 group">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-300 font-mono bg-slate-950/60 px-2 py-1 rounded-md backdrop-blur-xs border border-white/5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE TELEMETRY</span>
            </div>
            <span className="text-amber-400 font-bold">{activeItem.urgency} RISK</span>
          </div>

          <div className="relative z-10 my-auto self-center w-48 border-2 border-purple-500/80 rounded-lg bg-purple-950/40 p-2.5 backdrop-blur-xs shadow-lg shadow-purple-950/50">
            <div className="text-[11px] font-bold text-purple-200 truncate">
              {activeItem.title}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-purple-300/80 mt-0.5">
              <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
              <span className="truncate">{activeItem.location || "Central Site Sector"}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[9px] text-slate-300 font-mono">
              <span>SLA: {activeItem.priorityTag === "P1" ? "4 hrs" : "24 hrs"}</span>
              <span className="text-emerald-400">ACTIVE TARGET</span>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 font-mono bg-slate-950/60 px-2 py-1 rounded-md border border-white/5">
            <span>By: {activeItem.submittedBy}</span>
            <span>TAG: {activeItem.priorityTag}</span>
          </div>
        </div>

        <button
          onClick={() => openView("teach")}
          className="mt-3 w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg border border-purple-200 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          Review with AI Assistant Guidance
        </button>

        <div className="mt-2 text-[10px] text-slate-400 text-center leading-normal">
          Help Admin View — Approvals and rejections are signed and recorded in the audit trail.
        </div>
      </div>
    </div>
  );
};
