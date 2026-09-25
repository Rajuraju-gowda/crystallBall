import { describe, it, expect } from "vitest";
import {
  GREETING_PROMPT_V1,
  SUMMARY_PROMPT_V1,
  TALK_PROMPT_V1,
  HELP_PROMPT_V1,
  TEACH_PROMPT_V1
} from "../../src/prompts/index.js";
import { MOCK_APPROVALS_QUEUE } from "../../src/data/approvalsQueue.js";

describe("Prompt Versioning & Formatting Unit Tests", () => {
  it("should have correct version metadata on all prompts", () => {
    expect(GREETING_PROMPT_V1.version).toBe("1.0.0");
    expect(SUMMARY_PROMPT_V1.version).toBe("1.0.0");
    expect(TALK_PROMPT_V1.version).toBe("1.0.0");
    expect(HELP_PROMPT_V1.version).toBe("1.0.0");
    expect(TEACH_PROMPT_V1.version).toBe("1.0.0");
  });

  it("should correctly format Replay Greeting user prompt", () => {
    const userPrompt = GREETING_PROMPT_V1.buildUserPrompt({
      operatorName: "Sarah Connor",
      pendingCount: 4,
      highUrgencyCount: 1,
      timeOfDay: "Morning Shift",
      queueSnapshot: [{ title: "Drone Demo", submittedBy: "Alex", urgency: "HIGH" }]
    });

    expect(userPrompt).toContain("Sarah Connor");
    expect(userPrompt).toContain("Pending Approvals: 4");
    expect(userPrompt).toContain("High Urgency Items: 1");
    expect(userPrompt).toContain("Morning Shift");
  });

  it("should format Summary user prompt with queue items and language parameter", () => {
    const userPrompt = SUMMARY_PROMPT_V1.buildUserPrompt({
      queueItems: MOCK_APPROVALS_QUEUE,
      language: "es",
      focusArea: "perimeter"
    });

    expect(userPrompt).toContain("Language requirement: es");
    expect(userPrompt).toContain("Focus area: perimeter");
    expect(userPrompt).toContain("Level 2 Drone Patrol Video Demo");
  });

  it("should format Talk to me system prompt with active queue state", () => {
    const sysPrompt = TALK_PROMPT_V1.buildSystemPrompt({
      queueItems: MOCK_APPROVALS_QUEUE
    });

    expect(sysPrompt).toContain("OomniEye Command Centre AI Co-pilot");
    expect(sysPrompt).toContain("Level 2 Drone Patrol Video Demo");
    expect(sysPrompt).toContain("Sam HelpAdmin");
  });

  it("should format Help me prompt with retrieved chunks injected", () => {
    const userPrompt = HELP_PROMPT_V1.buildUserPrompt({
      question: "What is the maximum flight altitude?",
      retrievedChunks: [
        {
          id: "sop-sec-1",
          section: "Section 1",
          title: "Drone Video & Autonomous Flight Verification",
          content: "Recorded flight altitude does not exceed 50m AGL."
        }
      ]
    });

    expect(userPrompt).toContain("What is the maximum flight altitude?");
    expect(userPrompt).toContain("[sop-sec-1] Section 1: Drone Video & Autonomous Flight Verification");
    expect(userPrompt).toContain("Recorded flight altitude does not exceed 50m AGL.");
  });

  it("should format Teach me prompt with step numbers and previous user input", () => {
    const userPrompt = TEACH_PROMPT_V1.buildUserPrompt({
      step: 2,
      userResponse: "Metadata verified",
      itemTitle: "Site Patrol Checklists"
    });

    expect(userPrompt).toContain("Current Step: 2 of 4");
    expect(userPrompt).toContain("Site Patrol Checklists");
    expect(userPrompt).toContain("Metadata verified");
  });
});
