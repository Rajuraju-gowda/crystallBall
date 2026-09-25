import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, User, Bot } from "lucide-react";
import { useAssistantStore } from "../../store/useAssistantStore";

export const ChatStreamView: React.FC = () => {
  const { talk, openView, sendTalkMessage } = useAssistantStore();
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "Which item needs attention first and why?",
    "Who submitted the drone video demo?",
    "Are there any sensor calibration issues?",
    "Summarize Sam HelpAdmin's submissions."
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [talk.messages, talk.isStreaming]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || talk.isStreaming) return;
    const msg = inputText.trim();
    setInputText("");
    sendTalkMessage(msg);
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
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-semibold text-slate-700">AI Co-pilot Active</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {talk.messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? "bg-purple-600 text-white"
                    : "bg-slate-900 text-amber-400"
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  isUser
                    ? "bg-purple-600 text-white rounded-tr-xs"
                    : "bg-white text-slate-800 border border-slate-200/80 shadow-xs rounded-tl-xs"
                }`}
              >
                <div>{msg.content}</div>

                {msg.isStreaming && (
                  <span className="inline-block w-1.5 h-3 bg-purple-600 animate-pulse ml-1 align-middle" />
                )}

                {msg.isFallback && (
                  <div className="mt-1 text-[10px] text-amber-600 font-mono">
                    (Deterministic Fallback)
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {talk.messages.length <= 2 && (
        <div className="px-3 py-2 bg-slate-100/60 border-t border-slate-100 flex flex-wrap gap-1.5">
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => sendTalkMessage(prompt)}
              disabled={talk.isStreaming}
              className="text-[11px] font-medium bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 px-2.5 py-1 rounded-full border border-slate-200 transition-colors shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={talk.isStreaming ? "Streaming response..." : "Ask co-pilot about queue items..."}
          disabled={talk.isStreaming}
          className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-800 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || talk.isStreaming}
          className="p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-lg transition-colors shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
