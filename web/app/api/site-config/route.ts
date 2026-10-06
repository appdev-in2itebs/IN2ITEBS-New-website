import { getSettings } from "@/lib/cms/store";
import { ASSISTANT_LANGUAGES } from "@/lib/cms/settings";
import { llmConfigured } from "@/lib/assistant/llm";
import { SARVAM_LANGUAGES } from "@/lib/voice/providers";
import { sarvamConfigured } from "@/lib/voice/sarvam";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The public part of the admin settings: the announcement and the chat widget's look. Pages stay
 * static and fetch this once per visit; Cloudflare may cache it for a minute, so an edit in
 * /admin/settings shows up within about 60 seconds.
 */
export async function GET() {
  const { announcement, chatbot, contact, assistant } = await getSettings();
  const ai = assistant.aiEnabled && llmConfigured();
  return Response.json(
    {
      announcement,
      chatbot: {
        enabled: chatbot.enabled,
        name: chatbot.name,
        greeting: chatbot.greeting,
        quickReplies: chatbot.quickReplies,
      },
      assistant: {
        ai,
        languages: assistant.languages
          .filter((code) => code in ASSISTANT_LANGUAGES)
          .map((code) => ({ code, label: ASSISTANT_LANGUAGES[code] })),
        voiceInput: assistant.voiceInput,
        voiceOutput: assistant.voiceOutput,
        voiceMode: assistant.voiceMode,
        endOfSpeechMs: assistant.endOfSpeechMs,
        // "server": Sarvam listens and speaks for these languages; everything else uses the browser.
        voice: assistant.voiceProvider === "sarvam" && sarvamConfigured() ? "server" : "browser",
        serverVoiceLanguages: Object.keys(SARVAM_LANGUAGES),
      },
      contact: { email: contact.email, phone: contact.phone },
    },
    { headers: { "Cache-Control": "public, max-age=30, s-maxage=60" } },
  );
}
