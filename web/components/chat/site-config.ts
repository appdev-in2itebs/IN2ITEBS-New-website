"use client";

/** The public settings from /api/site-config, fetched once per page load and shared. */
export type SiteConfig = {
  announcement: { enabled: boolean; text: string; linkUrl: string; linkLabel: string };
  chatbot: { enabled: boolean; name: string; greeting: string; quickReplies: string[] };
  assistant?: {
    ai: boolean;
    languages: { code: string; label: string }[];
    voiceInput: boolean;
    voiceOutput: boolean;
    voiceMode?: boolean;
    endOfSpeechMs?: number;
    voice?: "server" | "browser";
    serverVoiceLanguages?: string[];
  };
  contact: { email: string; phone: string };
};

let pending: Promise<SiteConfig | null> | null = null;

export function loadSiteConfig(): Promise<SiteConfig | null> {
  pending ??= fetch("/api/site-config/", { headers: { Accept: "application/json" } })
    .then((r) => (r.ok ? (r.json() as Promise<SiteConfig>) : null))
    .catch(() => null);
  return pending;
}
