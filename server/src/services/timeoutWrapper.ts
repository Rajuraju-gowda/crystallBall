export interface FallbackResult<T> {
  data: T;
  isFallback: boolean;
  reason?: string;
  durationMs: number;
}

export async function withAIFallback<T>(
  aiCallFn: (signal: AbortSignal) => Promise<T>,
  fallbackFn: (reason: string) => T,
  timeoutMs: number = 8000
): Promise<FallbackResult<T>> {
  const startTime = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const result = await aiCallFn(controller.signal);
    clearTimeout(timer);
    return {
      data: result,
      isFallback: false,
      durationMs: Date.now() - startTime
    };
  } catch (error: any) {
    clearTimeout(timer);
    const durationMs = Date.now() - startTime;
    const isTimeout = error.name === "AbortError" || durationMs >= timeoutMs;

    const reason = isTimeout
      ? `AI call exceeded strict 8000ms SLA threshold (aborted at ${durationMs}ms). Triggered deterministic fallback.`
      : `AI service unavailable: ${error.message || "Unknown error"}. Triggered deterministic fallback.`;

    console.warn(`[withAIFallback] ${reason}`);

    return {
      data: fallbackFn(reason),
      isFallback: true,
      reason,
      durationMs
    };
  }
}
