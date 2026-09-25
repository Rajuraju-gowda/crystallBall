import React from "react";
import { ArrowLeft, CheckCircle2, ChevronRight, GraduationCap, Lightbulb } from "lucide-react";
import { useAssistantStore } from "../../store/useAssistantStore";

export const TeachView: React.FC = () => {
  const { teach, openView, advanceTeach, activeItem } = useAssistantStore();

  const currentStep = teach.data?.step || 1;
  const totalSteps = teach.data?.totalSteps || 4;

  const handleAdvance = (responseOption: string) => {
    if (currentStep < totalSteps) {
      advanceTeach(currentStep + 1, responseOption);
    } else {
      advanceTeach(1, "Restart tutorial");
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

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <GraduationCap className="w-4 h-4 text-purple-600" />
          <span className="font-semibold text-slate-700">Operator Review Training</span>
        </div>
      </div>

      <div className="px-4 py-2.5 bg-white border-b border-slate-100">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1.5">
          <span>Walkthrough Progress</span>
          <span className="text-purple-600">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {teach.loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mb-2" />
            <span className="text-xs font-semibold text-slate-700">
              Loading SOP guidance module...
            </span>
          </div>
        ) : (
          teach.data && (
            <>
              <div className="p-2.5 bg-purple-50/80 border border-purple-100 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-purple-700">
                    Review Target
                  </span>
                  <div className="font-semibold text-purple-900 truncate">
                    {activeItem?.title || "Site Patrol Onboarding & Checklists"}
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-white rounded text-[10px] font-mono text-purple-700 border border-purple-200">
                  {activeItem?.priorityTag || "P2"}
                </span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {currentStep}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900">
                    {teach.data.stepTitle}
                  </h3>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {teach.data.instruction}
                </p>
              </div>

              {teach.data.tips && teach.data.tips.length > 0 && (
                <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    Operator Compliance Checklist
                  </div>

                  <ul className="space-y-1">
                    {teach.data.tips.map((tip, idx) => (
                      <li
                        key={idx}
                        className="text-[11px] text-amber-800 flex items-start gap-1.5"
                      >
                        <CheckCircle2 className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-bold text-slate-700">
                  {teach.data.nextPrompt}
                </div>

                <div className="flex flex-col gap-1.5">
                  {teach.data.quickOptions?.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAdvance(opt)}
                      className="w-full flex items-center justify-between p-2.5 bg-white hover:bg-purple-50 text-slate-800 hover:text-purple-700 text-xs font-semibold rounded-lg border border-slate-200 hover:border-purple-300 transition-all shadow-2xs text-left"
                    >
                      <span>{opt}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};
