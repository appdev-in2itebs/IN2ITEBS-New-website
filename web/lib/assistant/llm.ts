/**
 * The language model behind the assistant: NVIDIA NIM's OpenAI-compatible chat API
 * (integrate.api.nvidia.com). Server-only; the key is the NVIDIA_API_KEY secret. When the chosen
 * model fails or is slow, the call is retried once on the fallback model, so a busy model never
 * leaves a visitor without an answer.
 */

export type ToolCall = { id: string; type: "function"; function: { name: string; arguments: string } };
export type LlmMessage =
  | { role: "system" | "user"; content: string }
  | { role: "assistant"; content: string | null; tool_calls?: ToolCall[] }
  | { role: "tool"; content: string; tool_call_id: string };
export type ToolSpec = {
  type: "function";
  function: { name: string; description: string; parameters: Record<string, unknown> };
};

/** NVIDIA's hosted API by default; NVIDIA_BASE_URL points it at a dedicated or self-hosted NIM. */
const endpoint = () =>
  `${(process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1").replace(/\/+$/, "")}/chat/completions`;

export const llmConfigured = () => Boolean(process.env.NVIDIA_API_KEY);

export class LlmError extends Error {}

/** How many times a busy answer (429, 5xx) is tried again, and the most it may wait in all. */
const RETRIES = 2;
const RETRY_BUDGET_MS = 4_000;

/**
 * One request to the model API. When many visitors talk at once the API answers 429 (too many
 * requests) or 503 (busy): the call waits a moment (the server's Retry-After, or a short backoff
 * with jitter so concurrent callers spread out) and tries again, within a small time budget, before
 * the caller moves on to the fallback model.
 */
async function post(body: Record<string, unknown>, accept: string, timeoutMs: number): Promise<Response> {
  const started = Date.now();
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(endpoint(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
        "Content-Type": "application/json",
        Accept: accept,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });
    const busy = res.status === 429 || res.status >= 500;
    if (!busy || attempt >= RETRIES) {
      if (busy)
        console.warn(
          JSON.stringify({ event: "llm_busy", status: res.status, model: body.model, attempts: attempt + 1 }),
        );
      return res;
    }
    const retryAfter = Number(res.headers.get("retry-after"));
    const wait =
      Math.min(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 400 * 2 ** attempt, 2_000) +
      Math.random() * 300;
    if (Date.now() - started + wait > RETRY_BUDGET_MS) return res;
    void res.body?.cancel();
    await new Promise((r) => setTimeout(r, wait));
  }
}

export async function complete(input: {
  model: string;
  fallbackModel?: string;
  messages: LlmMessage[];
  tools?: ToolSpec[];
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  /** Let a reasoning model think before answering: smarter, slower, and it can run out of tokens. */
  thinking?: boolean;
}): Promise<{
  message: Extract<LlmMessage, { role: "assistant" }>;
  model: string;
  tokensIn?: number;
  tokensOut?: number;
}> {
  const models = [input.model, input.fallbackModel].filter((m, i, all): m is string => !!m && all.indexOf(m) === i);
  let last: unknown;
  for (const model of models) {
    try {
      const res = await post(
        {
          model,
          messages: input.messages,
          tools: input.tools?.length ? input.tools : undefined,
          temperature: input.temperature ?? 0.3,
          max_tokens: input.maxTokens ?? 700,
          stream: false,
          ...reasoningOptions(model, input.thinking ?? false),
        },
        "application/json",
        input.timeoutMs ?? 25_000,
      );
      if (!res.ok) throw new LlmError(`${model}: HTTP ${res.status}`);
      const data = (await res.json()) as {
        choices?: { message?: { content?: string | null; tool_calls?: ToolCall[] } }[];
        usage?: { prompt_tokens?: number; completion_tokens?: number };
      };
      const msg = data.choices?.[0]?.message;
      if (!msg) throw new LlmError(`${model}: empty response`);
      return {
        message: {
          role: "assistant",
          content: cleanText(msg.content),
          tool_calls: msg.tool_calls?.length ? msg.tool_calls : undefined,
        },
        model,
        tokensIn: data.usage?.prompt_tokens,
        tokensOut: data.usage?.completion_tokens,
      };
    } catch (e) {
      last = e;
    }
  }
  throw last instanceof Error ? last : new LlmError("model unavailable");
}

/** Removes a reasoning model's visible thinking, so only the answer reaches the visitor. */
export function cleanText(text: string | null | undefined): string | null {
  if (!text) return text ?? null;
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/^[\s\S]*?<\/think>/i, "")
    .trim();
}

/** Each model family switches its thinking on and off differently; others get nothing extra. */
function reasoningOptions(model: string, thinking: boolean): Record<string, unknown> {
  if (/^nvidia\/(nemotron|llama-3\.[13]-nemotron)/.test(model))
    return thinking ? {} : { chat_template_kwargs: { enable_thinking: false }, reasoning_budget: 0 };
  if (/^openai\/gpt-oss/.test(model)) return { reasoning_effort: thinking ? "medium" : "low" };
  return {};
}

/**
 * The same call, streamed: `onText` receives the answer's words as the model writes them, so the
 * chat can show them (and start speaking) at once. Tool calls arrive in pieces and are put together
 * here. When the chosen model fails before writing anything, the fallback model is tried.
 */
export async function streamComplete(
  input: Parameters<typeof complete>[0],
  onText: (delta: string) => void,
): Promise<Awaited<ReturnType<typeof complete>>> {
  const models = [input.model, input.fallbackModel].filter((m, i, all): m is string => !!m && all.indexOf(m) === i);
  let last: unknown;
  for (const model of models) {
    let wrote = false;
    try {
      const res = await post(
        {
          model,
          messages: input.messages,
          tools: input.tools?.length ? input.tools : undefined,
          temperature: input.temperature ?? 0.3,
          max_tokens: input.maxTokens ?? 700,
          stream: true,
          stream_options: { include_usage: true },
          ...reasoningOptions(model, input.thinking ?? false),
        },
        "text/event-stream",
        input.timeoutMs ?? 30_000,
      );
      if (!res.ok || !res.body) throw new LlmError(`${model}: HTTP ${res.status}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let content = "";
      const calls: { id: string; name: string; args: string }[] = [];
      let usage: { prompt_tokens?: number; completion_tokens?: number } | undefined;
      // A <think> block some models write into the answer is held back and dropped.
      let thinking = false;
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf("\n")) >= 0) {
          const line = buffer.slice(0, nl).trim();
          buffer = buffer.slice(nl + 1);
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (payload === "[DONE]") continue;
          let chunk: {
            choices?: {
              delta?: {
                content?: string | null;
                tool_calls?: { index?: number; id?: string; function?: { name?: string; arguments?: string } }[];
              };
            }[];
            usage?: { prompt_tokens?: number; completion_tokens?: number };
          };
          try {
            chunk = JSON.parse(payload);
          } catch {
            continue;
          }
          if (chunk.usage) usage = chunk.usage;
          const delta = chunk.choices?.[0]?.delta;
          if (!delta) continue;
          for (const tc of delta.tool_calls ?? []) {
            const i = tc.index ?? 0;
            calls[i] ??= { id: "", name: "", args: "" };
            if (tc.id) calls[i].id = tc.id;
            if (tc.function?.name) calls[i].name += tc.function.name;
            if (tc.function?.arguments) calls[i].args += tc.function.arguments;
          }
          let text = delta.content ?? "";
          if (!text) continue;
          if (text.includes("<think>")) thinking = true;
          if (thinking) {
            content += text;
            if (text.includes("</think>")) thinking = false;
            continue;
          }
          content += text;
          wrote = true;
          onText(text);
          text = "";
        }
      }
      const toolCalls: ToolCall[] = calls
        .filter((c) => c?.name)
        .map((c, i) => ({ id: c.id || `call_${i}`, type: "function", function: { name: c.name, arguments: c.args } }));
      return {
        message: {
          role: "assistant",
          content: cleanText(content),
          tool_calls: toolCalls.length ? toolCalls : undefined,
        },
        model,
        tokensIn: usage?.prompt_tokens,
        tokensOut: usage?.completion_tokens,
      };
    } catch (e) {
      last = e;
      // Words already reached the visitor: do not start again on another model.
      if (wrote) throw e;
    }
  }
  throw last instanceof Error ? last : new LlmError("model unavailable");
}
