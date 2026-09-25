import { describe, it, expect } from "vitest";
import { ragService } from "../../src/services/ragService.js";

describe("In-Memory RAG Engine Unit Tests", () => {
  it("should match Section 1 (Drone policy) for queries about drone altitude and video", () => {
    const results = ragService.search("What is the allowed drone altitude and telemetry rule?", 2);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].chunk.id).toBe("sop-sec-1");
    expect(results[0].chunk.title).toContain("Drone Video");
    expect(results[0].matchedKeywords).toContain("drone");
    expect(results[0].matchedKeywords).toContain("altitude");
  });

  it("should match Section 2 for questions regarding sensor calibration and ISO compliance", () => {
    const results = ragService.search("How many days is a sensor calibration certificate valid?", 2);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].chunk.id).toBe("sop-sec-2");
    expect(results[0].chunk.title).toContain("Sensor Calibration");
    expect(results[0].chunk.content).toContain("90 days");
  });

  it("should match Section 3 for spatial camera coverage overlap questions", () => {
    const results = ragService.search("What overlap percentage is required between adjacent cameras in a spatial zone?", 2);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].chunk.id).toBe("sop-sec-3");
    expect(results[0].chunk.content).toContain("15% overlap");
  });

  it("should match Section 4 for escalation SLAs", () => {
    const results = ragService.search("When should a ticket escalate to the director?", 2);
    expect(results.length).toBeGreaterThan(0);
    const hasSec4 = results.some((r) => r.chunk.id === "sop-sec-4");
    expect(hasSec4).toBe(true);
  });
});
