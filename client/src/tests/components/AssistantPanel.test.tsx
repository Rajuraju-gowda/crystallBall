import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AssistantPanel } from "../../components/assistant/AssistantPanel";
import { useAssistantStore } from "../../store/useAssistantStore";

describe("AssistantPanel Component Tests", () => {
  beforeEach(() => {
    useAssistantStore.setState({
      isOpen: true,
      activeView: "menu",
      greeting: {
        text: "Welcome back, Operator.",
        pendingCount: 4,
        loading: false
      }
    });
  });

  it("should render the header and all 4 entry point action cards", () => {
    render(<AssistantPanel />);

    expect(screen.getAllByText("Approvals").length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText("Present me Summary")).toBeInTheDocument();
    expect(screen.getByText("Talk to me")).toBeInTheDocument();
    expect(screen.getByText("Help me")).toBeInTheDocument();
    expect(screen.getByText("Teach me")).toBeInTheDocument();
  });

  it("should switch to talk view when 'Talk to me' card is clicked", () => {
    render(<AssistantPanel />);

    const talkCard = screen.getByText("Talk to me");
    fireEvent.click(talkCard);

    expect(useAssistantStore.getState().activeView).toBe("talk");
    expect(screen.getByText("AI Co-pilot Active")).toBeInTheDocument();
  });

  it("should close the panel when close button is clicked", () => {
    render(<AssistantPanel />);

    const closeBtn = screen.getByTitle("Close Approvals Assistant");
    fireEvent.click(closeBtn);

    expect(useAssistantStore.getState().isOpen).toBe(false);
  });
});
