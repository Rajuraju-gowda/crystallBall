import React, { useState } from "react";
import {
  X,
  Maximize2,
  Minimize2,
  Info,
  ExternalLink,
  MessageSquare,
  Bot
} from "lucide-react";
import { useAssistantStore } from "../../store/useAssistantStore";
import { GreetingBar } from "./GreetingBar";
import { ActionCardGrid } from "./ActionCardGrid";
import { SummaryView } from "./SummaryView";
import { ChatStreamView } from "./ChatStreamView";
import { HelpRAGView } from "./HelpRAGView";
import { TeachView } from "./TeachView";

export const AssistantPanel: React.FC = () => {
  const { isOpen, toggleOpen, closePanel, activeView } = useAssistantStore();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {isOpen && (
        <div
          className={`fixed right-6 bottom-20 z-40 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col transition-all duration-200 ease-out ${
            isExpanded
              ? "w-[480px] h-[640px]"
              : "w-[360px] sm:w-[390px] h-[520px]"
          }`}
        >
          <div className="bg-[#0b1329] text-white px-4 py-2.5 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center text-[#0b1329] shadow-xs">
                <Bot className="w-4 h-4 text-slate-950" />
              </div>
              <span className="font-bold text-sm tracking-tight">Approvals</span>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <button
                title="Panel Documentation"
                className="hover:text-white p-1 rounded-md transition-colors"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse View" : "Expand View"}
                className="hover:text-white p-1 rounded-md transition-colors"
              >
                {isExpanded ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={closePanel}
                title="Close Approvals Assistant"
                className="hover:text-white p-1 rounded-md transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {activeView === "menu" && <GreetingBar />}

          <div className="flex-1 overflow-hidden flex flex-col bg-white">
            {activeView === "menu" && <ActionCardGrid />}
            {activeView === "summary" && <SummaryView />}
            {activeView === "talk" && <ChatStreamView />}
            {activeView === "help" && <HelpRAGView />}
            {activeView === "teach" && <TeachView />}
          </div>

          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
            <span className="text-[11px] font-medium text-slate-400">
              26 folders / items
            </span>

            <a
              href="#hms-panel"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-purple-600 transition-colors"
            >
              <span>HMS Panel</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      )}

      <div className="fixed right-6 bottom-5 z-40 flex items-center gap-2">
        <button
          onClick={toggleOpen}
          className={`h-11 px-4 rounded-xl flex items-center gap-2 font-bold text-xs shadow-lg transition-all ${
            isOpen
              ? "bg-[#0b1329] text-white hover:bg-slate-800"
              : "bg-purple-600 text-white hover:bg-purple-700 shadow-purple-500/20"
          }`}
        >
          {isOpen ? (
            <>
              <X className="w-4 h-4" />
              <span className="tracking-wide">ALLCAD</span>
            </>
          ) : (
            <>
              <MessageSquare className="w-4 h-4" />
              <span className="tracking-wide">ALLCAD Approvals</span>
            </>
          )}
        </button>
      </div>
    </>
  );
};
