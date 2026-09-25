import React, { useState } from "react";
import { ArrowLeft, Search, BookOpen, Quote, ShieldCheck } from "lucide-react";
import { useAssistantStore } from "../../store/useAssistantStore";

export const HelpRAGView: React.FC = () => {
  const { help, openView, askHelp } = useAssistantStore();
  const [question, setQuestion] = useState("");

  const sampleQuestions = [
    "What are the Level 2 drone patrol flight rules?",
    "How long is a sensor calibration certificate valid?",
    "What overlap is required for 360 camera zones?",
    "When should an unreviewed approval ticket escalate?"
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || help.loading) return;
    askHelp(question.trim());
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

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <BookOpen className="w-3.5 h-3.5 text-purple-600" />
          <span className="font-semibold text-slate-700">Grounded SOP RAG</span>
        </div>
      </div>

      <div className="p-3 bg-white border-b border-slate-100">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Search policy rules (e.g. drone altitude, sensor ISO)..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-800"
            />
          </div>
          <button
            type="submit"
            disabled={!question.trim() || help.loading}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 text-white disabled:text-slate-400 text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            {help.loading ? "Searching..." : "Ask SOP"}
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
            Frequent Compliance Queries
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuestion(q);
                  askHelp(q);
                }}
                className="text-[11px] text-left font-medium bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {help.loading && (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mb-2" />
            <span className="text-xs font-semibold text-slate-700">
              Retrieving grounded policy sections...
            </span>
          </div>
        )}

        {help.data && !help.loading && (
          <div className="space-y-3">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  Grounded Operational Policy Answer
                </span>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Confidence: {help.data.confidence}
                </span>
              </div>

              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {help.data.answer}
              </p>
            </div>

            {help.data.citations && help.data.citations.length > 0 && (
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  Source Document Citations (OomniEye SOP v2.4)
                </div>

                {help.data.citations.map((cite, i) => (
                  <div
                    key={i}
                    className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                      <span>{cite.section}: {cite.title}</span>
                      <span className="text-[10px] font-mono text-purple-500">{cite.chunkId}</span>
                    </div>

                    {cite.quote && (
                      <div className="text-[11px] text-purple-800/80 italic flex items-start gap-1">
                        <Quote className="w-3 h-3 text-purple-400 shrink-0 mt-0.5" />
                        <span>"{cite.quote}"</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
