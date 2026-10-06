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

const ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";

export const llmConfigured = () => Boolean(process.env.NVIDIA_API_KEY);

export class LlmError extends Error {}

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
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          model,
          messages: input.messages,
          tools: input.tools?.length ? input.tools : undefined,
          temperature: input.temperature ?? 0.3,
          max_tokens: input.maxTokens ?? 700,
          stream: false,
          ...reasoningOptions(model, input.thinking ?? false),
        }),
        signal: AbortSignal.timeout(input.timeoutMs ?? 25_000),
      });
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
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({
          model,
          messages: input.messages,
          tools: input.tools?.length ? input.tools : undefined,
          temperature: input.temperature ?? 0.3,
          max_tokens: input.maxTokens ?? 700,
          stream: true,
          stream_options: { include_usage: true },
          ...reasoningOptions(model, input.thinking ?? false),
        }),
        signal: AbortSignal.timeout(input.timeoutMs ?? 30_000),
      });
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
