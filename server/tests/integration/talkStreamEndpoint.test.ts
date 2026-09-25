import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

describe("Talk SSE Streaming Endpoint Integration Tests", () => {
  it("POST /api/ai/talk should return text/event-stream headers and stream tokens", async () => {
    const res = await request(app)
      .post("/api/ai/talk")
      .send({
        messages: [{ role: "user", content: "Which item should I review first?" }],
        sessionId: "test-stream-session"
      })
      .expect("Content-Type", /text\/event-stream/)
      .expect(200);

    expect(res.text).toContain("data: ");
    expect(res.text).toContain("token");
    expect(res.text).toContain("done");
  });

  it("POST /api/ai/talk should reject requests with empty messages array with 400 Bad Request", async () => {
    const res = await request(app)
      .post("/api/ai/talk")
      .send({
        messages: []
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid Request Payload");
  });
});
