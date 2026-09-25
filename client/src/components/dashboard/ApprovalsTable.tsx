import React, { useState } from "react";
import {
  Folder,
  Video,
  FileText,
  Image as ImageIcon,
  MoreVertical,
  Search,
  ArrowLeft,
  Info,
  Plus,
  List,
  Network,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useAssistantStore } from "../../store/useAssistantStore";

export const ApprovalsTable: React.FC = () => {
  const { approvals, activeItem, setActiveItem, updateItemStatus } = useAssistantStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"queue" | "hierarchy">("queue");
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  const filtered = approvals.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getItemIcon = (type: string) => {
    switch (type) {
      case "Folder":
        return <Folder className="w-4 h-4 text-amber-500 fill-amber-500/20" />;
      case "Video":
        return <Video className="w-4 h-4 text-rose-500" />;
      case "Pdf":
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "Image":
        return <ImageIcon className="w-4 h-4 text-emerald-500" />;
      default:
        return <Folder className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-bold text-slate-900 tracking-tight">Approvals & Review</h1>
            <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
          </div>
        </div>

        <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors">
          <Plus className="w-3.5 h-3.5" />
          Add help
        </button>
      </div>

      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/40">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search approvals by title, author, folder, or page..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-slate-400 text-slate-800"
          />
        </div>
      </div>

      <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-slate-500">
            <List className="w-4 h-4 text-purple-600" />
            <span className="text-[11px] font-bold tracking-wider text-slate-700 uppercase">
              Pending Approval Requests
            </span>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-full">
            {filtered.length} items
          </span>
        </div>

        <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs">
          <button
            onClick={() => setViewMode("queue")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              viewMode === "queue"
                ? "bg-white text-slate-800 shadow-xs font-semibold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            Queue View
          </button>
          <button
            onClick={() => setViewMode("hierarchy")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              viewMode === "hierarchy"
                ? "bg-white text-slate-800 shadow-xs font-semibold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            Hierarchy View
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
            <tr>
              <th className="py-2.5 px-4">Folder / Content Name</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Submitted By</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((item) => {
              const isSelected = activeItem?.id === item.id;
              return (
                <tr
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className={`cursor-pointer transition-colors group ${
                    isSelected ? "bg-purple-50/60" : "hover:bg-slate-50/80"
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200/60 group-hover:border-purple-200 transition-colors">
                        {getItemIcon(item.type)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-purple-700 transition-colors">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-400">{item.path}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/70">
                      {item.type}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-700">{item.submittedBy}</span>
                  </td>

                  <td className="py-3 px-3 text-slate-500">{item.date}</td>

                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        item.status === "Approved"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : item.status === "Rejected"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : item.status === "Changes Requested"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionId(openActionId === item.id ? null : item.id);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openActionId === item.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-4 top-10 w-44 bg-white rounded-xl shadow-lg border border-slate-200 p-1 z-30 text-left animate-in fade-in zoom-in-95 duration-100"
                      >
                        <button
                          onClick={() => {
                            updateItemStatus(item.id, "Approved");
                            setOpenActionId(null);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve Item
                        </button>
                        <button
                          onClick={() => {
                            updateItemStatus(item.id, "Changes Requested");
                            setOpenActionId(null);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          Request Changes
                        </button>
                        <button
                          onClick={() => {
                            updateItemStatus(item.id, "Rejected");
                            setOpenActionId(null);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject Item
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
