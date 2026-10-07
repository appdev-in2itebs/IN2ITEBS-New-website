import { getSettings } from "@/lib/cms/store";
import { ASSISTANT_LANGUAGES } from "@/lib/cms/settings";
import { badOrigin, json } from "@/lib/api-guard";
import { translate } from "@/lib/assistant/agent";
import { llmConfigured } from "@/lib/assistant/llm";
import { SARVAM_LANGUAGES } from "@/lib/voice/providers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Greetings already translated, by language and wording (a Worker keeps them while it runs). */
const cache = new Map<string, string>();

/** "ଓଡ଼ିଆ (Odia)" → "Odia"; "English" stays "English". */
const englishName = (code: string) => {
  const name = ASSISTANT_LANGUAGES[code] ?? code;
  return name.match(/\(([^)]+)\)$/)?.[1] ?? name;
};

/**
 * What voice conversation says first. In English (the default), it greets the visitor and asks
 * whether to carry on in English or another language the website offers and the voice can speak;
 * in another language the visitor already chose, it greets them in it and says they can switch.
 */
export async function GET(request: Request) {
  if (badOrigin(request)) return json(403, { ok: false, error: "Invalid origin." });
  const url = new URL(request.url);
  const asked = url.searchParams.get("language") ?? "en-IN";
  const language = asked in ASSISTANT_LANGUAGES ? asked : "en-IN";
  const { assistant } = await getSettings();
  // Languages the visitor can be offered by voice: on the website's list, and spoken by the voice.
  const spoken = assistant.languages.filter(
    (c) => c !== "en-IN" && (assistant.voiceProvider !== "sarvam" || c in SARVAM_LANGUAGES),
  );
  const preferred = ["hi-IN", "or-IN", "ta-IN", "te-IN", "bn-IN", "kn-IN", "ml-IN", "mr-IN", "gu-IN", "pa-IN"];
  const named = [...preferred.filter((c) => spoken.includes(c)), ...spoken.filter((c) => !preferred.includes(c))]
    .slice(0, 3)
    .map(englishName);
  // Short, so the visitor can answer within a few seconds: "…or would you prefer Hindi, Odia, Tamil or
  // another language?"
  const choices = named.length ? `, or would you prefer ${named.join(", ")} or another language` : "";

  const english =
    language === "en-IN"
      ? `Hi! Shall we talk in English${choices}?`
      : `Hi! We can talk in ${englishName(language)}. How can I help you today?`;

  const key = `${language}:${english}`;
  let text = cache.get(key);
  if (!text) {
    text = language === "en-IN" || !llmConfigured() ? english : await translate(english, language, assistant);
    if (text !== english || language === "en-IN") cache.set(key, text);
  }
  return json(200, { ok: true, text, language: text === english ? "en-IN" : language });
}
