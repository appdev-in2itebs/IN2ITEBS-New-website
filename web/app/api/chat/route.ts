import { z } from "zod";
import { reply } from "@/lib/chatbot/engine";
import { siteIndex } from "@/lib/chatbot/site-index";
import { getCms } from "@/lib/cms/content";
import { getActiveFaqs, getOpenOpenings, getSettings, hashIp, saveChatTurn } from "@/lib/cms/store";
import { badOrigin, clientAddress, json, rateLimited, readJson } from "@/lib/api-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const body = z.object({
  message: z.string().trim().min(1).max(500),
  conversationId: z.string().max(40).nullish(),
  pageUrl: z.string().max(300).optional(),
});

/** One chat turn: answer the visitor and store both sides of the exchange. */
export async function POST(request: Request) {
  if (badOrigin(request)) return json(403, { ok: false, error: "Invalid origin." });
  const ip = clientAddress(request);
  if (rateLimited(`chat:${hashIp(ip) ?? "anon"}`, 30))
    return json(429, { ok: false, error: "Too many messages. Please wait a minute." });
  const raw = await readJson(request, 4_000);
  if (raw instanceof Response) return raw;
  const parsed = body.safeParse(raw);
  if (!parsed.success) return json(400, { ok: false, error: "Message is empty or too long." });

  const [settings, faqs, openings] = await Promise.all([getSettings(), getActiveFaqs(), getOpenOpenings()]);
  if (!settings.chatbot.enabled) return json(503, { ok: false, error: "The assistant is not available right now." });
  const answer = reply(parsed.data.message, {
    faqs,
    site: siteIndex(await getCms()),
    openings: openings.map(({ id, title, location, employment_type }) => ({ id, title, location, employment_type })),
    quickReplies: settings.chatbot.quickReplies,
    contactEmail: settings.contact.email,
  });
  const conversationId = await saveChatTurn({
    conversationId: parsed.data.conversationId,
    pageUrl: parsed.data.pageUrl,
    ipHash: hashIp(ip),
    userText: parsed.data.message,
    botText: answer.text,
    intent: answer.intent,
  }).catch(() => parsed.data.conversationId ?? null);
  return json(200, { ok: true, conversationId, reply: answer });
}
