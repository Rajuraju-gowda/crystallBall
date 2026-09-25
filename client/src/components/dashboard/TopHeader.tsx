import React from "react";
import {
  RotateCw,
  Maximize2,
  MessageSquare,
  Settings,
  Bell,
  Radio
} from "lucide-react";

export const TopHeader: React.FC = () => {
  return (
    <header className="h-14 bg-white border-b border-slate-200 px-5 flex items-center justify-between shadow-xs sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <span className="font-extrabold text-base tracking-tight text-slate-900 leading-tight">
            Oomni<span className="text-purple-600">Eye</span>
          </span>
          <span className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase -mt-0.5">
            Digital Twin Solutions
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          title="Digital Twin Stream Live"
          className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1.5"
        >
          <Radio className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-medium text-slate-600 hidden sm:inline">Live Stream</span>
        </button>

        <button
          title="Sync Environment"
          className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <button
          title="Toggle Fullscreen"
          className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-slate-200" />

        <button
          title="Active Discussions"
          className="relative p-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 bg-slate-800 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
            3
          </span>
        </button>

        <button
          title="Command Centre Settings"
          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          title="System Notifications"
          className="relative p-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
        </button>

        <div className="ml-1 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-xs cursor-pointer hover:ring-2 hover:ring-amber-300 transition-all">
          R
        </div>
      </div>
    </header>
  );
};
