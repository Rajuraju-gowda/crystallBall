import { z } from "zod";

export const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1, "Message content cannot be empty")
});

export const SummaryRequestSchema = z.object({
  language: z.string().default("en"),
  focusArea: z.string().optional()
});

export const TalkRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1, "At least one message is required"),
  sessionId: z.string().default("default-session")
});

export const HelpRequestSchema = z.object({
  question: z.string().min(2, "Question must have at least 2 characters"),
  sessionId: z.string().default("default-session")
});

export const TeachRequestSchema = z.object({
  currentStep: z.number().int().min(1).max(5).default(1),
  userResponse: z.string().optional(),
  targetItemId: z.string().optional(),
  sessionId: z.string().default("default-session")
});

export const GreetingRequestSchema = z.object({
  operatorName: z.string().default("Operator"),
  timeOfDay: z.string().optional()
});

export type ChatMessageType = z.infer<typeof ChatMessageSchema>;
export type SummaryRequestType = z.infer<typeof SummaryRequestSchema>;
export type TalkRequestType = z.infer<typeof TalkRequestSchema>;
export type HelpRequestType = z.infer<typeof HelpRequestSchema>;
export type TeachRequestType = z.infer<typeof TeachRequestSchema>;
export type GreetingRequestType = z.infer<typeof GreetingRequestSchema>;
