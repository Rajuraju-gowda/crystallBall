import React from "react";
import {
  LayoutDashboard,
  Grid,
  User,
  Users,
  Ticket,
  Store,
  BarChart2,
  FlaskConical
} from "lucide-react";

export const LeftSidebar: React.FC = () => {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: false },
    { icon: Grid, label: "Digital Twin Grid", active: true },
    { icon: User, label: "Operators", active: false },
    { icon: Users, label: "Teams", active: false },
    { icon: Ticket, label: "Approval Tickets", active: false },
    { icon: Store, label: "Asset Marketplace", active: false },
    { icon: BarChart2, label: "Telemetry Analytics", active: false },
    { icon: FlaskConical, label: "AI Simulation Lab", active: false }
  ];

  return (
    <aside className="w-14 bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-4 shrink-0 z-20">
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <button
            key={idx}
            title={item.label}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              item.active
                ? "bg-purple-50 text-purple-600 border border-purple-200 shadow-xs"
                : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Icon className="w-5 h-5" />
          </button>
        );
      })}
    </aside>
  );
};
