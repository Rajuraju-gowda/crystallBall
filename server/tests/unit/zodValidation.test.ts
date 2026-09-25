import { describe, it, expect } from "vitest";
import {
  SummaryOutputSchema,
  HelpOutputSchema,
  TeachOutputSchema,
  GreetingOutputSchema
} from "../../src/schemas/aiResponse.schema.js";
import { FallbackService } from "../../src/services/fallbackService.js";
import { MOCK_APPROVALS_QUEUE } from "../../src/data/approvalsQueue.js";

describe("Zod Structured Output Validation Unit Tests", () => {
  it("should validate a well-formed structured summary response", () => {
    const validPayload = {
      greeting: "Control Room Briefing",
      overallUrgency: "HIGH",
      totalPending: 4,
      briefingText: "4 items currently require review.",
      items: [
        {
          id: "appr-002",
          title: "Level 2 Drone Patrol Video Demo",
          priority: "P1",
          urgencyReason: "Drone perimeter footage requires verification",
          recommendedAction: "REQUEST_CHANGES"
        }
      ],
      suggestedFocus: "Inspect Drone Demo first",
      isFallback: false
    };

    const parsed = SummaryOutputSchema.parse(validPayload);
    expect(parsed.overallUrgency).toBe("HIGH");
    expect(parsed.items[0].priority).toBe("P1");
  });

  it("should reject a malformed summary with invalid enum values", () => {
    const invalidPayload = {
      greeting: "Bad Briefing",
      overallUrgency: "SUPER_URGENT",
      totalPending: 4,
      briefingText: "Missing items list",
      items: [],
      suggestedFocus: "None"
    };

    expect(() => SummaryOutputSchema.parse(invalidPayload)).toThrow();
  });

  it("should ensure deterministic FallbackService output conforms strictly to Zod schemas", () => {
    const summaryFallback = FallbackService.generateSummaryFallback(MOCK_APPROVALS_QUEUE);
    expect(() => SummaryOutputSchema.parse(summaryFallback)).not.toThrow();

    const greetingFallback = FallbackService.generateGreetingFallback("Operator Sam");
    expect(() => GreetingOutputSchema.parse(greetingFallback)).not.toThrow();

    const helpFallback = FallbackService.generateHelpFallback("drone altitude rule");
    expect(() => HelpOutputSchema.parse(helpFallback)).not.toThrow();

    const teachFallback = FallbackService.generateTeachFallback(1);
    expect(() => TeachOutputSchema.parse(teachFallback)).not.toThrow();
  });
});
