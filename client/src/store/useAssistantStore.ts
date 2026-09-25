import { create } from "zustand";

export interface ApprovalItem {
  id: string;
  title: string;
  type: "Folder" | "Video" | "Pdf" | "Image";
  submittedBy: string;
  date: string;
  status: "Pending Review" | "Approved" | "Rejected" | "Changes Requested";
  path: string;
  description: string;
  urgency: "HIGH" | "MEDIUM" | "LOW";
  priorityTag: "P1" | "P2" | "P3" | "P4";
  location?: string;
  metadata?: Record<string, string>;
}

export interface SummaryData {
  greeting: string;
  overallUrgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  totalPending: number;
  briefingText: string;
  items: Array<{
    id: string;
    title: string;
    priority: "P1" | "P2" | "P3" | "P4";
    urgencyReason: string;
    recommendedAction: "APPROVE" | "REJECT" | "REQUEST_CHANGES" | "ESCALATE";
  }>;
  suggestedFocus: string;
  isFallback?: boolean;
  reason?: string;
}

export interface HelpData {
  answer: string;
  citations: Array<{
    chunkId: string;
    section: string;
    title: string;
    quote?: string;
  }>;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  matchedKeywords?: string[];
  isFallback?: boolean;
  reason?: string;
}

export interface TeachData {
  step: number;
  totalSteps: number;
  stepTitle: string;
  instruction: string;
  tips: string[];
  nextPrompt: string;
  quickOptions?: string[];
  isFallback?: boolean;
  reason?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  isFallback?: boolean;
  timestamp: string;
}

interface AssistantState {
  isOpen: boolean;
  activeView: "menu" | "summary" | "talk" | "help" | "teach";
  activeItem: ApprovalItem | null;
  approvals: ApprovalItem[];
  approvalsLoading: boolean;

  greeting: {
    text: string;
    pendingCount: number;
    priorityHighlight?: string;
    loading: boolean;
    isFallback?: boolean;
  };
  summary: {
    data: SummaryData | null;
    loading: boolean;
    error: string | null;
  };
  talk: {
    messages: ChatMessage[];
    isStreaming: boolean;
    error: string | null;
  };
  help: {
    data: HelpData | null;
    loading: boolean;
    lastQuery: string;
    error: string | null;
  };
  teach: {
    data: TeachData | null;
    loading: boolean;
    currentStep: number;
    error: string | null;
  };

  isAudioPlaying: boolean;

  toggleOpen: () => void;
  openView: (view: "menu" | "summary" | "talk" | "help" | "teach") => void;
  closePanel: () => void;
  setActiveItem: (item: ApprovalItem) => void;
  fetchApprovals: () => Promise<void>;
  updateItemStatus: (id: string, status: ApprovalItem["status"]) => Promise<void>;

  fetchGreeting: () => Promise<void>;
  fetchSummary: () => Promise<void>;
  sendTalkMessage: (text: string) => Promise<void>;
  askHelp: (question: string) => Promise<void>;
  advanceTeach: (step: number, userResponse?: string) => Promise<void>;
  toggleSpeech: (textToSpeak: string) => void;
  stopSpeech: () => void;
}

const API_BASE = "http://localhost:5002/api";

export const useAssistantStore = create<AssistantState>((set, get) => ({
  isOpen: true,
  activeView: "menu",
  activeItem: null,
  approvals: [],
  approvalsLoading: false,

  greeting: {
    text: "Welcome back, Operator. You have 4 pending approvals awaiting review.",
    pendingCount: 4,
    priorityHighlight: "1 drone inspection pending",
    loading: false
  },

  summary: {
    data: null,
    loading: false,
    error: null
  },

  talk: {
    messages: [
      {
        id: "msg-init",
        role: "assistant",
        content: "Hello! I am your OomniEye Command Centre AI Co-pilot. Ask me anything about the pending approvals queue (e.g. 'Which item requires immediate action?' or 'Who submitted the drone flight video?').",
        timestamp: "Just now"
      }
    ],
    isStreaming: false,
    error: null
  },

  help: {
    data: null,
    loading: false,
    lastQuery: "",
    error: null
  },

  teach: {
    data: null,
    loading: false,
    currentStep: 1,
    error: null
  },

  isAudioPlaying: false,

  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  openView: (view) => set({ activeView: view }),
  closePanel: () => set({ isOpen: false }),
  setActiveItem: (item) => set({ activeItem: item }),

  fetchApprovals: async () => {
    set({ approvalsLoading: true });
    try {
      const res = await fetch(`${API_BASE}/approvals`);
      if (res.ok) {
        const json = await res.json();
        set({
          approvals: json.items,
          activeItem: get().activeItem || json.items[0],
          approvalsLoading: false
        });
      }
    } catch {
      set({ approvalsLoading: false });
    }
  },

  updateItemStatus: async (id, status) => {
    try {
      await fetch(`${API_BASE}/approvals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      set((state) => ({
        approvals: state.approvals.map((i) => (i.id === id ? { ...i, status } : i)),
        activeItem: state.activeItem?.id === id ? { ...state.activeItem, status } : state.activeItem
      }));
    } catch (e) {
      console.error("Status update error", e);
    }
  },

  fetchGreeting: async () => {
    set((state) => ({ greeting: { ...state.greeting, loading: true } }));
    try {
      const res = await fetch(`${API_BASE}/ai/greeting`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operatorName: "Operator", timeOfDay: "Active Shift" })
      });
      const data = await res.json();
      set({
        greeting: {
          text: data.greeting,
          pendingCount: data.pendingCount,
          priorityHighlight: data.priorityHighlight,
          loading: false,
          isFallback: data.isFallback
        }
      });
    } catch {
      set((state) => ({
        greeting: { ...state.greeting, loading: false }
      }));
    }
  },

  fetchSummary: async () => {
    set({ summary: { data: null, loading: true, error: null }, activeView: "summary" });
    try {
      const res = await fetch(`${API_BASE}/ai/summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: "en" })
      });
      const data = await res.json();
      set({ summary: { data, loading: false, error: null } });
    } catch (err: any) {
      set({ summary: { data: null, loading: false, error: err.message } });
    }
  },

  sendTalkMessage: async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const assistantMsgId = `asst-${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      isStreaming: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const updatedMessages = [...get().talk.messages, userMsg, initialAssistantMsg];
    set({
      talk: {
        messages: updatedMessages,
        isStreaming: true,
        error: null
      }
    });

    try {
      const payloadMessages = updatedMessages
        .filter((m) => m.content.length > 0)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch(`${API_BASE}/ai/talk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: payloadMessages,
          sessionId: "browser-session-1"
        })
      });

      if (!response.body) {
        throw new Error("No readable stream received");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulatedText = "";
      let isFallback = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.replace("data: ", "").trim());
              if (data.token) {
                accumulatedText += data.token;
              }
              if (data.isFallback) {
                isFallback = true;
              }

              set((state) => ({
                talk: {
                  ...state.talk,
                  messages: state.talk.messages.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, content: accumulatedText, isFallback }
                      : m
                  )
                }
              }));
            } catch {
            }
          }
        }
      }

      set((state) => ({
        talk: {
          ...state.talk,
          isStreaming: false,
          messages: state.talk.messages.map((m) =>
            m.id === assistantMsgId ? { ...m, isStreaming: false } : m
          )
        }
      }));
    } catch (err: any) {
      set((state) => ({
        talk: {
          ...state.talk,
          isStreaming: false,
          error: err.message,
          messages: state.talk.messages.map((m) =>
            m.id === assistantMsgId
              ? {
                ...m,
                content: "Sorry, I encountered an issue connecting to the AI co-pilot. Please check network connectivity or try again.",
                isStreaming: false
              }
              : m
          )
        }
      }));
    }
  },

  askHelp: async (question: string) => {
    set({ help: { data: null, loading: true, lastQuery: question, error: null }, activeView: "help" });
    try {
      const res = await fetch(`${API_BASE}/ai/help`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      set({ help: { data, loading: false, lastQuery: question, error: null } });
    } catch (err: any) {
      set({ help: { data: null, loading: false, lastQuery: question, error: err.message } });
    }
  },

  advanceTeach: async (step: number, userResponse?: string) => {
    set((state) => ({
      teach: { ...state.teach, loading: true, currentStep: step },
      activeView: "teach"
    }));

    try {
      const res = await fetch(`${API_BASE}/ai/teach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentStep: step,
          userResponse,
          targetItemId: get().activeItem?.id
        })
      });
      const data = await res.json();
      set({
        teach: {
          data,
          loading: false,
          currentStep: step,
          error: null
        }
      });
    } catch (err: any) {
      set((state) => ({
        teach: { ...state.teach, loading: false, error: err.message }
      }));
    }
  },

  toggleSpeech: (textToSpeak: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (get().isAudioPlaying) {
      window.speechSynthesis.cancel();
      set({ isAudioPlaying: false });
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      set({ isAudioPlaying: false });
    };
    utterance.onerror = () => {
      set({ isAudioPlaying: false });
    };

    set({ isAudioPlaying: true });
    window.speechSynthesis.speak(utterance);
  },

  stopSpeech: () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    set({ isAudioPlaying: false });
  }
}));
