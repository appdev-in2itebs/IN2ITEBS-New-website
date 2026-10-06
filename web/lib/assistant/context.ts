import { getCms, type Cms } from "@/lib/cms/content";
import { getActiveFaqs, getOpenOpenings, getSettings, type OpeningRow } from "@/lib/cms/store";
import type { Settings } from "@/lib/cms/settings";
import type { Faq, SiteEntry } from "@/lib/chatbot/engine";
import { siteIndex } from "@/lib/chatbot/site-index";

/**
 * What every chat message needs (settings, FAQs, open roles, the website's content and its search
 * index), kept in memory for a few seconds so a conversation does not reload it from the database on
 * every message. Edits in /admin reach the chat within CONTEXT_TTL_MS.
 */
export const CONTEXT_TTL_MS = 15_000;

export type ChatContext = { settings: Settings; faqs: Faq[]; openings: OpeningRow[]; cms: Cms; index: SiteEntry[] };

let cached: { at: number; value: Promise<ChatContext> } | null = null;

export function chatContext(): Promise<ChatContext> {
  if (cached && Date.now() - cached.at < CONTEXT_TTL_MS) return cached.value;
  const value = Promise.all([getSettings(), getActiveFaqs(), getOpenOpenings(), getCms()]).then(
    ([settings, faqs, openings, cms]) => ({ settings, faqs, openings, cms, index: siteIndex(cms) }),
  );
  cached = { at: Date.now(), value };
  // A failed load is not kept: the next message tries again.
  value.catch(() => {
    if (cached?.value === value) cached = null;
  });
  return value;
}
