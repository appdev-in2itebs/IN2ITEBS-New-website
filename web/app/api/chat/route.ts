import { z } from "zod";
import { reply } from "@/lib/chatbot/engine";
import { ASSISTANT_LANGUAGES } from "@/lib/cms/settings";
import { hashIp, saveChatTurn } from "@/lib/cms/store";
import { badOrigin, clientAddress, json, rateLimited, readJson } from "@/lib/api-guard";
import { llmConfigured } from "@/lib/assistant/llm";
import { systemPrompt } from "@/lib/assistant/knowledge";
import { runAgent } from "@/lib/assistant/agent";
import { chatContext } from "@/lib/assistant/context";
import { loadConversation, saveTurn } from "@/lib/assistant/conversation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const body = z.object({
  message: z.string().trim().min(1).max(2000),
  conversationId: z.string().max(40).nullish(),
  pageUrl: z.string().max(300).optional(),
  language: z.string().max(10).optional(),
  /** "voice" when the reply will be spoken in voice conversation: short and plain. */
  channel: z.enum(["text", "voice"]).optional(),
  /** Stream the reply as it is written (newline-delimited JSON events). */
  stream: z.boolean().optional(),
});

/** Most messages one conversation may have before the visitor is pointed to email instead. */
const MAX_MESSAGES = 120;

type Event =
  | { t: "start"; conversationId: string | null }
  | { t: "delta"; text: string }
  | { t: "replace"; text: string }
  | { t: "done"; conversationId: string | null; reply: unknown }
  | { t: "error"; error: string };

/**
 * One chat turn. With the AI assistant on (/admin/assistant) and NVIDIA_API_KEY set, the agent
 * answers and can save enquiries and job applications; otherwise the rule-based FAQ answers do.
 * With `stream: true` the answer arrives word by word: {"t":"delta"} events, then {"t":"done"}.
 */
export async function POST(request: Request) {
  if (badOrigin(request)) return json(403, { ok: false, error: "Invalid origin." });
  const ip = clientAddress(request);
  const ipHash = hashIp(ip);
  if (rateLimited(`chat:${ipHash ?? "anon"}`, 20))
    return json(429, { ok: false, error: "Too many messages. Please wait a minute." });
  const raw = await readJson(request, 8_000);
  if (raw instanceof Response) return raw;
  const parsed = body.safeParse(raw);
  if (!parsed.success) return json(400, { ok: false, error: "Message is empty or too long." });
  const input = parsed.data;
  const language = input.language && input.language in ASSISTANT_LANGUAGES ? input.language : "en-IN";
  const userAgent = request.headers.get("user-agent")?.slice(0, 300) ?? null;

  const turn = async (emit: (e: Event) => void) => {
    const [ctx, convoOrNull] = await Promise.all([
      chatContext(),
      // The conversation is loaded alongside the context; only the AI path needs it.
      llmConfigured()
        ? loadConversation({ conversationId: input.conversationId, pageUrl: input.pageUrl, ipHash, language })
        : Promise.resolve(null),
    ]);
    const { settings, faqs, openings, cms, index } = ctx;
    if (!settings.chatbot.enabled) return emit({ t: "error", error: "The assistant is not available right now." });

    if (settings.assistant.aiEnabled && convoOrNull) {
      const convo = convoOrNull;
      if (convo.count > MAX_MESSAGES)
        return emit({
          t: "error",
          error: `This conversation is very long. Please email ${settings.contact.email} and our team will help.`,
        });
      emit({ t: "start", conversationId: convo.id });
      try {
        const result = await runAgent({
          settings,
          system: (s) =>
            systemPrompt({
              settings,
              cms,
              faqs,
              openings,
              language,
              state: s,
              pageUrl: input.pageUrl,
              channel: input.channel,
            }),
          history: convo.history,
          message: input.message,
          ctx: {
            conversationId: convo.id,
            language,
            state: convo.state,
            index,
            faqs,
            openings,
            ipHash,
            userAgent,
          },
          channel: input.channel,
          onText: (text) => emit({ t: "delta", text }),
          onReplace: (text) => emit({ t: "replace", text }),
        });
        await saveTurn(
          convo,
          {
            user: input.message,
            assistant: result.text,
            model: result.model,
            tokensIn: result.tokensIn,
            tokensOut: result.tokensOut,
          },
          { language, purpose: convo.state.purpose ?? null },
        );
        return emit({
          t: "done",
          conversationId: convo.id,
          reply: { text: result.text, actions: result.actions, ai: true },
        });
      } catch (e) {
        console.error(JSON.stringify({ event: "assistant_failed", error: e instanceof Error ? e.message : "unknown" }));
        // The model is unreachable: answer from the FAQs instead of failing the visitor.
      }
    }

    const answer = reply(input.message, {
      faqs,
      site: index,
      openings: openings.map(({ id, title, location, employment_type }) => ({ id, title, location, employment_type })),
      quickReplies: settings.chatbot.quickReplies,
      contactEmail: settings.contact.email,
    });
    const conversationId = await saveChatTurn({
      conversationId: convoOrNull?.id ?? input.conversationId,
      pageUrl: input.pageUrl,
      ipHash,
      userText: input.message,
      botText: answer.text,
      intent: answer.intent,
    }).catch(() => input.conversationId ?? null);
    emit({ t: "done", conversationId, reply: answer });
  };

  if (input.stream) {
    const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();
    const emit = (e: Event) => void writer.write(encoder.encode(`${JSON.stringify(e)}\n`)).catch(() => {});
    void turn(emit)
      .catch(() => emit({ t: "error", error: "Sorry, something went wrong. Please try again." }))
      .finally(() => void writer.close().catch(() => {}));
    return new Response(readable, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Accel-Buffering": "no",
      },
    });
  }

  // Without streaming: the same turn, answered in one piece.
  let done: Extract<Event, { t: "done" }> | null = null;
  let error: string | null = null;
  await turn((e) => {
    if (e.t === "done") done = e;
    if (e.t === "error") error = e.error;
  });
  if (error || !done) return json(503, { ok: false, error: error ?? "Sorry, something went wrong." });
  const d = done as Extract<Event, { t: "done" }>;
  return json(200, { ok: true, conversationId: d.conversationId, reply: d.reply });
}
