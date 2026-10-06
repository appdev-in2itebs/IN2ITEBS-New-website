import { z } from "zod";
import { getSettings, hashIp } from "@/lib/cms/store";
import { badOrigin, clientAddress, json, rateLimited, readJson } from "@/lib/api-guard";
import { SARVAM_VOICES } from "@/lib/voice/providers";
import { getAdmin } from "@/lib/admin/session";
import { can } from "@/lib/admin/permissions";
import { VoiceError, sarvamConfigured, sarvamSpeak, sarvamSupports } from "@/lib/voice/sarvam";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const body = z.object({
  text: z.string().trim().min(1).max(800),
  language: z.string().max(10),
  /** Admin → AI assistant's "Preview voice" only (a signed-in admin): another voice or speed to try. */
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
  // One voice for the whole website: the one chosen in Admin → AI assistant, for the chat's Listen
  // button and voice conversation alike. Only a signed-in admin previewing may ask for another.
  const wantsOther = parsed.data.voice !== undefined || parsed.data.pace !== undefined;
  const admin = wantsOther ? await getAdmin().catch(() => null) : null;
  const preview = !!admin && can(admin.role, "assistant");
  const voice =
    preview && parsed.data.voice && (SARVAM_VOICES as readonly string[]).includes(parsed.data.voice)
      ? parsed.data.voice
      : assistant.voiceName;
  const pace = preview && parsed.data.pace !== undefined ? parsed.data.pace : assistant.voicePace;
  try {
    const mp3 = await sarvamSpeak({
      text: parsed.data.text,
      language: parsed.data.language,
      voice,
      pace,
    });
    return new Response(new Blob([mp3 as Uint8Array<ArrayBuffer>], { type: "audio/mpeg" }), {
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
    });
  } catch (e) {
    console.error(JSON.stringify({ event: "tts_failed", error: e instanceof VoiceError ? e.message : "error" }));
    return json(502, { ok: false, error: "The voice is not available right now." });
  }
}
