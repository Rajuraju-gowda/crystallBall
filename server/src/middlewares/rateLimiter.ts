import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    const sessionId = (req.headers["x-session-id"] as string) || req.body?.sessionId || req.ip;
    return sessionId;
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too Many Requests",
      message: "AI endpoint rate limit exceeded (30 requests/minute). Please slow down.",
      retryAfter: "60s"
    });
  }
});
