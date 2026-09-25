import React from "react";
import { Home, RotateCcw, Volume2, Sparkles } from "lucide-react";
import { useAssistantStore } from "../../store/useAssistantStore";

export const GreetingBar: React.FC = () => {
  const { greeting, fetchGreeting, toggleSpeech, isAudioPlaying } = useAssistantStore();

  return (
    <div className="border-b border-slate-100 bg-white">
      <div className="px-4 py-2 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
          <Home className="w-3.5 h-3.5 text-slate-500" />
          <span>Approvals</span>
        </div>

        <button
          onClick={() => fetchGreeting()}
          disabled={greeting.loading}
          className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition-colors disabled:opacity-50"
        >
          <RotateCcw className={`w-3 h-3 ${greeting.loading ? "animate-spin" : ""}`} />
          <span>Replay Greeting</span>
        </button>
      </div>

      <div className="p-3 bg-gradient-to-r from-amber-50/70 via-purple-50/40 to-slate-50 text-xs text-slate-700 relative">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 bg-amber-500/10 text-amber-700 rounded-lg shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <div className="flex-1">
            <p className="leading-relaxed font-medium">
              {greeting.loading ? (
                <span className="inline-flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                  Generating context-aware greeting...
                </span>
              ) : (
                greeting.text
              )}
            </p>

            {greeting.priorityHighlight && !greeting.loading && (
              <div className="mt-1.5 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-100/80 text-amber-800 text-[10px] font-bold rounded-md uppercase tracking-wider">
                  {greeting.priorityHighlight}
                </span>
                {greeting.isFallback && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    (Deterministic Rule Fallback)
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => toggleSpeech(greeting.text)}
            title={isAudioPlaying ? "Stop audio" : "Play greeting voice"}
            className={`p-1.5 rounded-lg transition-all shrink-0 ${
              isAudioPlaying
                ? "bg-purple-600 text-white shadow-xs"
                : "text-slate-400 hover:text-purple-600 hover:bg-white"
            }`}
          >
            {isAudioPlaying ? (
              <div className="flex items-center gap-0.5 h-4 px-0.5">
                <div className="w-1 bg-white rounded-full wave-bar-1" />
                <div className="w-1 bg-white rounded-full wave-bar-2" />
                <div className="w-1 bg-white rounded-full wave-bar-3" />
              </div>
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
