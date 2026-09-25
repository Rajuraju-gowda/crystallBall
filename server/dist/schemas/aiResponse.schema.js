import { z } from "zod";
export const SummaryItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    priority: z.enum(["P1", "P2", "P3", "P4"]),
    urgencyReason: z.string(),
    recommendedAction: z.enum(["APPROVE", "REJECT", "REQUEST_CHANGES", "ESCALATE"])
});
export const SummaryOutputSchema = z.object({
    greeting: z.string(),
    overallUrgency: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
    totalPending: z.number().int(),
    briefingText: z.string(),
    items: z.array(SummaryItemSchema),
    suggestedFocus: z.string(),
    isFallback: z.boolean().default(false),
    reason: z.string().optional()
});
export const CitationSchema = z.object({
    chunkId: z.string(),
    section: z.string(),
    title: z.string(),
    quote: z.string().optional()
});
export const HelpOutputSchema = z.object({
    answer: z.string(),
    citations: z.array(CitationSchema),
    confidence: z.enum(["HIGH", "MEDIUM", "LOW"]),
    matchedKeywords: z.array(z.string()).optional(),
    isFallback: z.boolean().default(false),
    reason: z.string().optional()
});
export const TeachOutputSchema = z.object({
    step: z.number().int(),
    totalSteps: z.number().int(),
    stepTitle: z.string(),
    instruction: z.string(),
    tips: z.array(z.string()),
    nextPrompt: z.string(),
    quickOptions: z.array(z.string()).optional(),
    isFallback: z.boolean().default(false),
    reason: z.string().optional()
});
export const GreetingOutputSchema = z.object({
    greeting: z.string(),
    pendingCount: z.number().int(),
    priorityHighlight: z.string(),
    isFallback: z.boolean().default(false),
    reason: z.string().optional()
});
