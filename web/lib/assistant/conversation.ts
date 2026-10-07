import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";
import type { AgentState } from "./knowledge";

/**
 * A chat conversation in Supabase: created on the first message, holding the assistant's working
 * state (what it already saved, an uploaded CV) and every message. The history the model sees is
 * read from here, never from the browser, so a visitor cannot rewrite what the assistant said.
 *
 * Each turn costs two database round trips: one load (the conversation and its recent messages,
 * together) before the reply, and one save (the two messages and the conversation, together) after.
 */

const isId = (v: unknown): v is string => typeof v === "string" && /^[0-9a-f-]{36}$/i.test(v);

export type Turn = { role: "user" | "assistant" | "system"; content: string };

export type Conversation = { id: string | null; state: AgentState; count: number; history: Turn[] };

export async function loadConversation(input: {
  conversationId?: string | null;
  pageUrl?: string;
  ipHash: string | null;
  language: string;
  historyLimit?: number;
}): Promise<Conversation> {
  if (!supabaseConfigured()) return { id: null, state: {}, count: 0, history: [] };
  const db = supabaseAdmin();
  if (isId(input.conversationId)) {
    const [convo, messages] = await Promise.all([
      db.from("chat_conversations").select("id, state, message_count").eq("id", input.conversationId).maybeSingle(),
      db
        .from("chat_messages")
        .select("role, content")
        .eq("conversation_id", input.conversationId)
        .order("created_at", { ascending: false })
        .limit(input.historyLimit ?? 24),
    ]);
    if (convo.data)
      return {
        id: convo.data.id as string,
        state: (convo.data.state ?? {}) as AgentState,
        count: (convo.data.message_count as number) ?? 0,
        history: ((messages.data ?? []) as Turn[]).reverse(),
      };
  }
  const { data } = await db
    .from("chat_conversations")
    .insert({
      channel: "text",
      page_url: input.pageUrl?.slice(0, 300),
      ip_hash: input.ipHash,
      language: input.language,
    })
    .select("id")
    .single();
  return { id: (data?.id as string) ?? null, state: {}, count: 0, history: [] };
}

/** Saves both sides of the turn and the conversation's state at once. */
export async function saveTurn(
  convo: Conversation,
  turn: { user: string; assistant: string; model: string; tokensIn?: number; tokensOut?: number },
  patch: Record<string, unknown> = {},
) {
  if (!convo.id || !supabaseConfigured()) return;
  const db = supabaseAdmin();
  const now = new Date();
  // Per-turn flags are not remembered.
  const {
    offTopic: _offTopic,
    note: _note,
    interrupted: _interrupted,
    languageSwitch: _languageSwitch,
    ...state
  } = convo.state;
  void _offTopic;
  void _note;
  void _interrupted;
  void _languageSwitch;
  await Promise.all([
    db.from("chat_messages").insert([
      { conversation_id: convo.id, role: "user", content: turn.user.slice(0, 4000), created_at: now.toISOString() },
      {
        conversation_id: convo.id,
        role: "assistant",
        content: turn.assistant.slice(0, 8000),
        model: turn.model,
        input_tokens: turn.tokensIn ?? null,
        output_tokens: turn.tokensOut ?? null,
        created_at: new Date(now.getTime() + 1).toISOString(),
      },
    ]),
    db
      .from("chat_conversations")
      .update({ last_message_at: now.toISOString(), message_count: convo.count + 2, state, ...patch })
      .eq("id", convo.id),
  ]);
}

/** A note in the conversation that the model reads as context (for example, "the CV was uploaded"). */
export async function addNote(id: string, content: string) {
  await supabaseAdmin()
    .from("chat_messages")
    .insert({ conversation_id: id, role: "system", content: content.slice(0, 1000) });
}
