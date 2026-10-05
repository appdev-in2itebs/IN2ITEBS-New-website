import { supabaseConfigured } from "@/lib/supabase";
import { chatLeadSchema } from "@/lib/cms/schemas";
import { hashIp, insertLead } from "@/lib/cms/store";
import { badOrigin, clientAddress, json, rateLimited, readJson } from "@/lib/api-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** A client's details collected step by step in the chat widget, saved as a lead (source: chatbot). */
export async function POST(request: Request) {
  if (badOrigin(request)) return json(403, { ok: false, error: "Invalid origin." });
  const ip = clientAddress(request);
  if (rateLimited(`chatlead:${hashIp(ip) ?? "anon"}`, 5))
    return json(429, { ok: false, error: "Too many requests. Please wait a minute." });
  const raw = await readJson(request, 8_000);
  if (raw instanceof Response) return raw;
  const parsed = chatLeadSchema.safeParse(raw);
  if (!parsed.success) return json(400, { ok: false, error: "Please check your details." });
  if (!supabaseConfigured())
    return json(503, { ok: false, error: "We could not save your details. Please email info@in2itebs.com." });
  const { conversationId, requirement, ...person } = parsed.data;
  try {
    await insertLead({
      ...person,
      company: person.company || null,
      phone: person.phone || null,
      message: requirement,
      source: "chatbot",
      conversation_id: conversationId && /^[0-9a-f-]{36}$/i.test(conversationId) ? conversationId : null,
      ip_hash: hashIp(ip),
      user_agent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
    });
    console.info(JSON.stringify({ event: "chat_lead_saved" }));
    return json(200, { ok: true });
  } catch {
    console.error(JSON.stringify({ event: "chat_lead_failed" }));
    return json(503, { ok: false, error: "We could not save your details. Please email info@in2itebs.com." });
  }
}
