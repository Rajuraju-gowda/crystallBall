export interface GreetingPromptContext {
  operatorName: string;
  pendingCount: number;
  highUrgencyCount: number;
  timeOfDay?: string;
  queueSnapshot: Array<{ title: string; submittedBy: string; urgency: string }>;
}

export const GREETING_PROMPT_V1 = {
  version: "1.0.0",
  name: "replay-greeting",
  systemPrompt: `You are the OomniEye Command Centre Approvals Assistant.
Your job is to generate a concise, professional, audio-ready greeting for the control room operator.
Rules:
1. Keep the greeting to 1-2 sentences maximum.
2. Dynamically reference the operator, time of day, and pending approvals queue state.
3. Highlight high-urgency items if present (e.g. drone patrol review).
4. Tone should be alert, authoritative, calm, and operational.
5. Return ONLY a JSON object matching this structure:
{
  "greeting": "string (the spoken text)",
  "pendingCount": number,
  "priorityHighlight": "string (e.g., '1 critical drone inspection pending')"
}`,
  buildUserPrompt: (ctx: GreetingPromptContext): string => {
    return `Generate a greeting for:
- Operator: ${ctx.operatorName}
- Time of Day: ${ctx.timeOfDay || "Current Shift"}
- Pending Approvals: ${ctx.pendingCount}
- High Urgency Items: ${ctx.highUrgencyCount}
- Queue Summary: ${JSON.stringify(ctx.queueSnapshot)}`;
  }
};
