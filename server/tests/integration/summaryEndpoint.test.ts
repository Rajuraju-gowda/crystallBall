import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import { SummaryOutputSchema } from "../../src/schemas/aiResponse.schema.js";

describe("Summary Endpoint & Approvals Integration Tests (Supertest)", () => {
  it("GET /health should return 200 OK", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("GET /api/approvals should return the 4 seed queue items", async () => {
    const res = await request(app).get("/api/approvals");
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(4);
    expect(res.body.items).toHaveLength(4);
    expect(res.body.items[0]).toHaveProperty("title");
    expect(res.body.items[0]).toHaveProperty("status", "Pending Review");
  });

  it("POST /api/ai/summary should return a structured summary matching SummaryOutputSchema", async () => {
    const res = await request(app)
      .post("/api/ai/summary")
      .send({ language: "en", focusArea: "all" })
      .set("x-session-id", "test-session-123");

    expect(res.status).toBe(200);
    const parsed = SummaryOutputSchema.parse(res.body);
    expect(parsed.totalPending).toBe(4);
    expect(parsed.items.length).toBeGreaterThanOrEqual(1);
    expect(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).toContain(parsed.overallUrgency);
    expect(parsed).toHaveProperty("briefingText");
  });

  it("POST /api/ai/summary should degrade gracefully to fallback when AI is unavailable or times out", async () => {
    const res = await request(app)
      .post("/api/ai/summary")
      .send({ language: "en" })
      .set("x-session-id", "test-timeout-session");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("isFallback", true);
    expect(res.body).toHaveProperty("reason");
    expect(res.body.items).toHaveLength(4);
  });

  it("POST /api/ai/greeting should return a valid contextual greeting", async () => {
    const res = await request(app)
      .post("/api/ai/greeting")
      .send({ operatorName: "Alex", timeOfDay: "Afternoon" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("greeting");
    expect(res.body).toHaveProperty("pendingCount", 4);
  });

  it("POST /api/ai/help should return RAG grounded answers with citations", async () => {
    const res = await request(app)
      .post("/api/ai/help")
      .send({ question: "What is the maximum allowed drone altitude?" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("answer");
    expect(res.body).toHaveProperty("citations");
    expect(res.body.citations.length).toBeGreaterThan(0);
    expect(res.body.citations[0].section).toBe("Section 1");
  });

  it("POST /api/ai/teach should return step-by-step onboarding guidance", async () => {
    const res = await request(app)
      .post("/api/ai/teach")
      .send({ currentStep: 1 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("step", 1);
    expect(res.body).toHaveProperty("instruction");
    expect(res.body).toHaveProperty("quickOptions");
  });
});
