import express from "express";
import cors from "cors";
import { approvalsRouter } from "./routes/approvals.routes.js";
import { aiRouter } from "./routes/ai.routes.js";

export const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"]
  })
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Crystal Ball Command Centre API",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/approvals", approvalsRouter);
app.use("/api/ai", aiRouter);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("[ServerError]", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "An unexpected error occurred"
  });
});
