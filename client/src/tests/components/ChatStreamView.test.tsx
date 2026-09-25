import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChatStreamView } from "../../components/assistant/ChatStreamView";
import { useAssistantStore } from "../../store/useAssistantStore";

describe("ChatStreamView Component Tests (Streaming & States)", () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    useAssistantStore.setState({
      talk: {
        messages: [
          {
            id: "msg-1",
            role: "assistant",
            content: "Hello Operator, which item requires review?",
            timestamp: "10:00 AM"
          }
        ],
        isStreaming: false,
        error: null
      }
    });
  });

  it("should render conversation messages correctly", () => {
    render(<ChatStreamView />);

    expect(screen.getByText("Hello Operator, which item requires review?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ask co-pilot about queue items...")).toBeInTheDocument();
  });

  it("should render streaming state when isStreaming is true", () => {
    useAssistantStore.setState({
      talk: {
        messages: [
          {
            id: "msg-stream",
            role: "assistant",
            content: "Analyzing drone telemetry...",
            isStreaming: true,
            timestamp: "10:01 AM"
          }
        ],
        isStreaming: true,
        error: null
      }
    });

    render(<ChatStreamView />);

    expect(screen.getByText("Analyzing drone telemetry...")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Streaming response...")).toBeDisabled();
  });

  it("should disable submit button when input is empty", () => {
    render(<ChatStreamView />);

    const submitBtn = screen.getByRole("button", { name: "" });
    expect(submitBtn).toBeDisabled();
  });
});
