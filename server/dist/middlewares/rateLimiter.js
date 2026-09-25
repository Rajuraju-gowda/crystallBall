import rateLimit from "express-rate-limit";
export const aiRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        const sessionId = req.headers["x-session-id"] || req.body?.sessionId || req.ip;
        return sessionId;
    },
    handler: (req, res) => {
        res.status(429).json({
            error: "Too Many Requests",
            message: "AI endpoint rate limit exceeded (30 requests/minute). Please slow down.",
            retryAfter: "60s"
        });
    }
});
