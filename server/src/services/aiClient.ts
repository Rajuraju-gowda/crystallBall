import dotenv from "dotenv";
dotenv.config();

export interface StreamChunk {
  token: string;
  isComplete: boolean;
}

export class AIClient {
  private hasLiveKey: boolean;
  private provider: "anthropic" | "openai" | "mock";

  constructor() {
    if (process.env.ANTHROPIC_API_KEY) {
      this.hasLiveKey = true;
      this.provider = "anthropic";
    } else if (process.env.OPENAI_API_KEY) {
      this.hasLiveKey = true;
      this.provider = "openai";
    } else {
      this.hasLiveKey = false;
      this.provider = "mock";
    }
  }

  public getProvider(): string {
    return this.provider;
  }

  public async generateText(
    systemPrompt: string,
    userPrompt: string,
    signal?: AbortSignal
  ): Promise<string> {
    if (signal?.aborted) {
      const err = new Error("Aborted");
      err.name = "AbortError";
      throw err;
    }

    if (this.provider === "openai" && process.env.OPENAI_API_KEY) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.2
        }),
        signal
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const json = (await response.json()) as any;
      return json.choices?.[0]?.message?.content || "";
    }

    if (this.provider === "anthropic" && process.env.ANTHROPIC_API_KEY) {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 1024,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }]
        }),
        signal
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
      }

      const json = (await response.json()) as any;
      return json.content?.[0]?.text || "";
    }

    await new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, 200);
      signal?.addEventListener("abort", () => {
        clearTimeout(timer);
        const err = new Error("Aborted");
        err.name = "AbortError";
        reject(err);
      });
    });

    throw new Error("No live LLM API key configured (ANTHROPIC_API_KEY or OPENAI_API_KEY missing).");
  }

  public async *streamTokens(
    systemPrompt: string,
    userPrompt: string,
    signal?: AbortSignal
  ): AsyncGenerator<string, void, unknown> {
    if (signal?.aborted) {
      const err = new Error("Aborted");
      err.name = "AbortError";
      throw err;
    }

    const simulatedResponse =
      "Priority analysis: The 'Level 2 Drone Patrol Video Demo' submitted by Alex HelpAdmin requires immediate review. Perimeter drone flights along high-voltage Sector B carry operational hazard risks. Please check thermal telemetry before issuing clearance.";

    const words = simulatedResponse.split(" ");
    for (let i = 0; i < words.length; i++) {
      if (signal?.aborted) {
        const err = new Error("Aborted");
        err.name = "AbortError";
        throw err;
      }
      await new Promise((r) => setTimeout(r, 40));
      yield words[i] + (i < words.length - 1 ? " " : "");
    }
  }
}

export const aiClient = new AIClient();
