import { Router, Request, Response } from "express";
import { aiRateLimiter } from "../middlewares/rateLimiter.js";
import { validateRequestBody } from "../middlewares/validateRequest.js";
import {
  SummaryRequestSchema,
  HelpRequestSchema,
  TeachRequestSchema,
  GreetingRequestSchema,
  TalkRequestSchema
} from "../schemas/aiRequest.schema.js";
import {
  SummaryOutputSchema,
  HelpOutputSchema,
  TeachOutputSchema,
  GreetingOutputSchema
} from "../schemas/aiResponse.schema.js";
import {
  SUMMARY_PROMPT_V1,
  GREETING_PROMPT_V1,
  HELP_PROMPT_V1,
  TEACH_PROMPT_V1,
  TALK_PROMPT_V1
} from "../prompts/index.js";
import { MOCK_APPROVALS_QUEUE } from "../data/approvalsQueue.js";
import { ragService } from "../services/ragService.js";
import { FallbackService } from "../services/fallbackService.js";
import { withAIFallback } from "../services/timeoutWrapper.js";
import { aiClient } from "../services/aiClient.js";

export const aiRouter = Router();

aiRouter.use(aiRateLimiter);

aiRouter.post(
  "/summary",
  validateRequestBody(SummaryRequestSchema),
  async (req: Request, res: Response) => {
    const { language, focusArea } = req.body;

    const result = await withAIFallback(
      async (signal) => {
        const userPrompt = SUMMARY_PROMPT_V1.buildUserPrompt({
          queueItems: MOCK_APPROVALS_QUEUE,
          language,
          focusArea
        });

        const rawOutput = await aiClient.generateText(
          SUMMARY_PROMPT_V1.systemPrompt,
          userPrompt,
          signal
        );

        const cleaned = rawOutput.replace(/```json\n?|\n?```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return SummaryOutputSchema.parse(parsed);
      },
      (fallbackReason) => {
        return FallbackService.generateSummaryFallback(MOCK_APPROVALS_QUEUE, fallbackReason);
      },
      8000
    );

    res.json(result.data);
  }
);

aiRouter.post(
  "/greeting",
  validateRequestBody(GreetingRequestSchema),
  async (req: Request, res: Response) => {
    const { operatorName, timeOfDay } = req.body;

    const result = await withAIFallback(
      async (signal) => {
        const highUrgentCount = MOCK_APPROVALS_QUEUE.filter((i) => i.urgency === "HIGH").length;
        const userPrompt = GREETING_PROMPT_V1.buildUserPrompt({
          operatorName,
          pendingCount: MOCK_APPROVALS_QUEUE.length,
          highUrgencyCount: highUrgentCount,
          timeOfDay,
          queueSnapshot: MOCK_APPROVALS_QUEUE.map((i) => ({
            title: i.title,
            submittedBy: i.submittedBy,
            urgency: i.urgency
          }))
        });

        const rawOutput = await aiClient.generateText(
          GREETING_PROMPT_V1.systemPrompt,
          userPrompt,
          signal
        );

        const cleaned = rawOutput.replace(/```json\n?|\n?```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return GreetingOutputSchema.parse(parsed);
      },
      (fallbackReason) => {
        return FallbackService.generateGreetingFallback(
          operatorName,
          MOCK_APPROVALS_QUEUE,
          fallbackReason
        );
      },
      8000
    );

    res.json(result.data);
  }
);

aiRouter.post(
  "/help",
  validateRequestBody(HelpRequestSchema),
  async (req: Request, res: Response) => {
    const { question } = req.body;

    const matches = ragService.search(question, 2);
    const retrievedChunks = matches.map((m) => ({
      id: m.chunk.id,
      section: m.chunk.section,
      title: m.chunk.title,
      content: m.chunk.content
    }));

    const result = await withAIFallback(
      async (signal) => {
        const userPrompt = HELP_PROMPT_V1.buildUserPrompt({
          question,
          retrievedChunks
        });

        const rawOutput = await aiClient.generateText(
          HELP_PROMPT_V1.systemPrompt,
          userPrompt,
          signal
        );

        const cleaned = rawOutput.replace(/```json\n?|\n?```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return HelpOutputSchema.parse(parsed);
      },
      (fallbackReason) => {
        return FallbackService.generateHelpFallback(question, fallbackReason);
      },
      8000
    );

    res.json(result.data);
  }
);

aiRouter.post(
  "/teach",
  validateRequestBody(TeachRequestSchema),
  async (req: Request, res: Response) => {
    const { currentStep, userResponse, targetItemId } = req.body;
    const targetItem = MOCK_APPROVALS_QUEUE.find((i) => i.id === targetItemId) || MOCK_APPROVALS_QUEUE[0];

    const result = await withAIFallback(
      async (signal) => {
        const userPrompt = TEACH_PROMPT_V1.buildUserPrompt({
          step: currentStep,
          userResponse,
          targetItemId: targetItem.id,
          itemTitle: targetItem.title
        });

        const rawOutput = await aiClient.generateText(
          TEACH_PROMPT_V1.systemPrompt,
          userPrompt,
          signal
        );

        const cleaned = rawOutput.replace(/```json\n?|\n?```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return TeachOutputSchema.parse(parsed);
      },
      (fallbackReason) => {
        return FallbackService.generateTeachFallback(currentStep, targetItem, fallbackReason);
      },
      8000
    );

    res.json(result.data);
  }
);

aiRouter.post(
  "/talk",
  validateRequestBody(TalkRequestSchema),
  async (req: Request, res: Response) => {
    const { messages } = req.body;
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const systemPrompt = TALK_PROMPT_V1.buildSystemPrompt({
      queueItems: MOCK_APPROVALS_QUEUE
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    req.on("close", () => {
      clearTimeout(timeout);
      controller.abort();
    });

    try {
      const stream = aiClient.streamTokens(systemPrompt, lastUserMessage, controller.signal);
      for await (const token of stream) {
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      }
      clearTimeout(timeout);
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (err: any) {
      clearTimeout(timeout);
      const fallbackText = FallbackService.generateTalkResponse(lastUserMessage);
      res.write(
        `data: ${JSON.stringify({
          token: fallbackText,
          isFallback: true,
          reason: err.message
        })}\n\n`
      );
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    }
  }
);
