import { z } from "zod";
import { getSettings, hashIp } from "@/lib/cms/store";
import { badOrigin, clientAddress, json, rateLimited, readJson } from "@/lib/api-guard";
import { SARVAM_VOICES } from "@/lib/voice/providers";
import { VoiceError, sarvamConfigured, sarvamSpeak, sarvamSupports } from "@/lib/voice/sarvam";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const body = z.object({
  text: z.string().trim().min(1).max(800),
  language: z.string().max(10),
  /** The admin's "Preview voice" may try another voice; visitors get the chosen one. */
  voice: z.string().max(40).optional(),
  pace: z.number().min(0.8).max(1.3).optional(),
});

/**
 * Text to speech for the chat: one sentence or a few at a time (the chat window splits a reply so
 * the first words play at once), returned as MP3 from Sarvam's bulbul:v3.
 */
export async function POST(request: Request) {
  if (badOrigin(request)) return json(403, { ok: false, error: "Invalid origin." });
  if (rateLimited(`tts:${hashIp(clientAddress(request)) ?? "anon"}`, 90))
    return json(429, { ok: false, error: "Too many requests. Please wait a minute." });
  const raw = await readJson(request, 6_000);
  if (raw instanceof Response) return raw;
  const parsed = body.safeParse(raw);
  if (!parsed.success) return json(400, { ok: false, error: "Nothing to say." });
  const { assistant } = await getSettings();
  if (!sarvamConfigured() || !sarvamSupports(parsed.data.language))
    return json(503, { ok: false, error: "Server voice is not available for this language." });
  const voice =
    parsed.data.voice && (SARVAM_VOICES as readonly string[]).includes(parsed.data.voice)
      ? parsed.data.voice
      : assistant.voiceName;
  try {
    const mp3 = await sarvamSpeak({
      text: parsed.data.text,
      language: parsed.data.language,
      voice,
      pace: parsed.data.pace ?? assistant.voicePace,
    });
    return new Response(new Blob([mp3 as Uint8Array<ArrayBuffer>], { type: "audio/mpeg" }), {
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
    });
  } catch (e) {
    console.error(JSON.stringify({ event: "tts_failed", error: e instanceof VoiceError ? e.message : "error" }));
    return json(502, { ok: false, error: "The voice is not available right now." });
  }
}
