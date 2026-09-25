import React, { useEffect } from "react";
import { TopHeader } from "./components/dashboard/TopHeader";
import { LeftSidebar } from "./components/dashboard/LeftSidebar";
import { ApprovalsTable } from "./components/dashboard/ApprovalsTable";
import { DetailPreview } from "./components/dashboard/DetailPreview";
import { AssistantPanel } from "./components/assistant/AssistantPanel";
import { useAssistantStore } from "./store/useAssistantStore";

export const App: React.FC = () => {
  const { fetchApprovals, fetchGreeting } = useAssistantStore();

  useEffect(() => {
    fetchApprovals();
    fetchGreeting();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col antialiased text-slate-800">
      <TopHeader />

      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar />

        <main className="flex-1 p-5 overflow-y-auto flex gap-5">
          <ApprovalsTable />
          <DetailPreview />
        </main>
      </div>

      <AssistantPanel />

      <footer className="h-7 bg-white border-t border-slate-200 px-5 flex items-center justify-between text-[11px] text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-medium text-slate-600">Ready</span>
        </div>

        <div>&copy; 2026 OomniEye. All rights reserved.</div>

        <div className="font-mono text-[10px] text-slate-400">
          v2.4-command-centre
        </div>
      </footer>
    </div>
  );
};

export default App;
