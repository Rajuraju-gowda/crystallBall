import React from "react";
import {
  ArrowLeft,
  Volume2,
  Sparkles,
  ShieldAlert
} from "lucide-react";
import { useAssistantStore } from "../../store/useAssistantStore";

export const SummaryView: React.FC = () => {
  const { summary, openView, toggleSpeech, isAudioPlaying, updateItemStatus } = useAssistantStore();

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "CRITICAL":
      case "HIGH":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "MEDIUM":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "P1":
        return "bg-rose-500 text-white";
      case "P2":
        return "bg-amber-500 text-white";
      case "P3":
        return "bg-blue-500 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between">
        <button
          onClick={() => openView("menu")}
          className="flex items-center gap-1 text-xs font-semibold text-purple-700 hover:text-purple-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Actions
        </button>

        <div className="flex items-center gap-2">
          {summary.data && (
            <button
              onClick={() => toggleSpeech(summary.data?.briefingText || "")}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                isAudioPlaying
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {isAudioPlaying ? (
                <>
                  <div className="flex items-center gap-0.5 h-3">
                    <div className="w-0.5 bg-white rounded-full wave-bar-1" />
                    <div className="w-0.5 bg-white rounded-full wave-bar-2" />
                    <div className="w-0.5 bg-white rounded-full wave-bar-3" />
                  </div>
                  <span>Speaking...</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen Briefing</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {summary.loading && (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mb-3" />
            <div className="text-xs font-bold text-slate-800">Generating Urgency Triage...</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Analyzing pending queue via Zod-validated structured reasoning
            </div>
          </div>
        )}

        {summary.data && !summary.loading && (
          <>
            {summary.data.isFallback && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-xs text-amber-800">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[11px]">Resilient Fallback Mode Active</div>
                  <div className="text-[10px] text-amber-700 leading-tight">
                    {summary.data.reason || "Served via deterministic operational rule engine within 8s SLA."}
                  </div>
                </div>
              </div>
            )}

            <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Queue Urgency Level
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${getUrgencyColor(
                    summary.data.overallUrgency
                  )}`}
                >
                  {summary.data.overallUrgency}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed mb-3">
                {summary.data.briefingText}
              </p>

              <div className="p-2.5 bg-purple-50/70 border border-purple-100 rounded-lg flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-bold text-purple-900 uppercase tracking-wide">
                    Suggested Focus
                  </div>
                  <div className="text-xs text-purple-800 font-medium">
                    {summary.data.suggestedFocus}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
                Prioritized Action Items ({summary.data.items.length})
              </div>

              {summary.data.items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-xs hover:border-purple-200 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${getPriorityColor(
                          item.priority
                        )}`}
                      >
                        {item.priority}
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {item.title}
                      </span>
                    </div>

                    <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-semibold text-slate-700 rounded-md">
                      {item.recommendedAction.replace("_", " ")}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {item.urgencyReason}
                  </p>

                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => updateItemStatus(item.id, "Approved")}
                      className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateItemStatus(item.id, "Changes Requested")}
                      className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                    >
                      Request Changes
                    </button>
                    <button
                      onClick={() => updateItemStatus(item.id, "Rejected")}
                      className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
