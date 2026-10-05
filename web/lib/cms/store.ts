import { createHash } from "node:crypto";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";
import { defaultSettings, readSetting, type SettingKey, type Settings } from "./settings";
import type { Faq, Opening } from "@/lib/chatbot/engine";

/**
 * Server-only reads and writes for the public site: settings, FAQs, openings, chat turns, leads and
 * applications. Every function degrades to a safe default when Supabase is not configured, so the
 * marketing site keeps working on a machine without the database keys.
 */

export const hashIp = (ip?: string | null) => (ip ? createHash("sha256").update(ip).digest("hex").slice(0, 32) : null);

export async function getSettings(): Promise<Settings> {
  if (!supabaseConfigured()) return defaultSettings;
  const { data, error } = await supabaseAdmin().from("site_settings").select("key, value");
  if (error || !data) return defaultSettings;
  const raw = Object.fromEntries(data.map((row) => [row.key, row.value]));
  return {
    announcement: readSetting("announcement", raw.announcement),
    contact: readSetting("contact", raw.contact),
    chatbot: readSetting("chatbot", raw.chatbot),
  };
}

export async function saveSetting(key: SettingKey, value: unknown, by: string) {
  const { error } = await supabaseAdmin()
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString(), updated_by: by });
  if (error) throw new Error(error.message);
}

export async function getActiveFaqs(): Promise<Faq[]> {
  if (!supabaseConfigured()) return [];
  const { data } = await supabaseAdmin()
    .from("chatbot_faqs")
    .select("id, question, answer, keywords, link_url, link_label")
    .eq("active", true)
    .order("sort_order");
  return data ?? [];
}

export type OpeningRow = Opening & { description: string; requirements: string; department: string | null };

export async function getOpenOpenings(): Promise<OpeningRow[]> {
  if (!supabaseConfigured()) return [];
  const { data } = await supabaseAdmin()
    .from("job_openings")
    .select("id, title, location, employment_type, description, requirements, department")
    .eq("status", "open")
    .order("sort_order")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getOpening(id: string): Promise<OpeningRow | null> {
  if (!supabaseConfigured() || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data } = await supabaseAdmin()
    .from("job_openings")
    .select("id, title, location, employment_type, description, requirements, department, status")
    .eq("id", id)
    .maybeSingle();
  return data && data.status === "open" ? data : null;
}

/** Store one visitor message and the assistant's reply; starts the conversation on the first turn. */
export async function saveChatTurn(input: {
  conversationId?: string | null;
  pageUrl?: string;
  ipHash: string | null;
  userText: string;
  botText: string;
  intent: string;
}): Promise<string | null> {
  if (!supabaseConfigured()) return input.conversationId ?? null;
  const db = supabaseAdmin();
  let id = input.conversationId && /^[0-9a-f-]{36}$/i.test(input.conversationId) ? input.conversationId : null;
  if (id) {
    const { data } = await db.from("chat_conversations").select("id, message_count").eq("id", id).maybeSingle();
    if (!data) id = null;
    else
      await db
        .from("chat_conversations")
        .update({ last_message_at: new Date().toISOString(), message_count: (data.message_count ?? 0) + 2 })
        .eq("id", id);
  }
  if (!id) {
    const { data, error } = await db
      .from("chat_conversations")
      .insert({ channel: "text", page_url: input.pageUrl?.slice(0, 300), ip_hash: input.ipHash, message_count: 2 })
      .select("id")
      .single();
    if (error || !data) return null;
    id = data.id as string;
  }
  await db.from("chat_messages").insert([
    { conversation_id: id, role: "user", content: input.userText.slice(0, 2000) },
    { conversation_id: id, role: "assistant", content: input.botText.slice(0, 4000), model: `rules:${input.intent}` },
  ]);
  return id;
}

export type LeadInsert = {
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  message: string;
  source: "website" | "chatbot" | "voice";
  region?: string | null;
  interest?: string | null;
  offer?: string | null;
  assessment?: string | null;
  conversation_id?: string | null;
  request_id?: string | null;
  ip_hash?: string | null;
  user_agent?: string | null;
};

export async function insertLead(lead: LeadInsert): Promise<string> {
  const { data, error } = await supabaseAdmin().from("leads").insert(lead).select("id").single();
  if (error || !data) throw new Error(error?.message ?? "lead not saved");
  if (lead.conversation_id)
    await supabaseAdmin()
      .from("chat_conversations")
      .update({ lead_id: data.id, visitor_name: lead.name, visitor_email: lead.email })
      .eq("id", lead.conversation_id);
  return data.id as string;
}
