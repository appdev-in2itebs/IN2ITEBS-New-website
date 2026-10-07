import { getSettings, hashIp } from "@/lib/cms/store";
import { badOrigin, clientAddress, json, rateLimited } from "@/lib/api-guard";
import { SARVAM_STT_MODELS } from "@/lib/voice/providers";
import { VoiceError, sarvamConfigured, sarvamSupports, sarvamTranscribe } from "@/lib/voice/sarvam";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** About two minutes of compressed speech; a chat message is a few seconds. */
const MAX_BYTES = 4 * 1024 * 1024;

/**
 * Speech to text for the chat's microphone and voice conversation: the recording (WebM, Ogg, MP4
 * or WAV) goes to Sarvam, the words come back. Only when Sarvam is the voice provider.
 */
export async function POST(request: Request) {
  if (badOrigin(request)) return json(403, { ok: false, error: "Invalid origin." });
  if (rateLimited(`stt:${hashIp(clientAddress(request)) ?? "anon"}`, 30))
    return json(429, { ok: false, error: "Too many voice messages. Please wait a minute." });
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BYTES + 32_000)
    return json(413, { ok: false, error: "That recording is too long. Please keep it under a minute." });
  const { assistant } = await getSettings();
  if (assistant.voiceProvider !== "sarvam" || !sarvamConfigured())
    return json(503, { ok: false, error: "Server voice is not switched on." });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(400, { ok: false, error: "Invalid recording." });
  }
  const audio = form.get("audio");
  if (!(audio instanceof Blob) || audio.size < 800) return json(400, { ok: false, error: "I didn't catch that." });
  if (audio.size > MAX_BYTES) return json(413, { ok: false, error: "That recording is too long." });
  if (!/^audio\/|^video\/webm|^application\/octet-stream/.test(audio.type || "audio/webm"))
    return json(415, { ok: false, error: "Unsupported recording." });
  const language = String(form.get("language") ?? "");
  const ext = /ogg/.test(audio.type)
    ? "ogg"
    : /mp4|aac|m4a/.test(audio.type)
      ? "m4a"
      : /wav/.test(audio.type)
        ? "wav"
        : "webm";
  try {
    const model = (SARVAM_STT_MODELS as readonly string[]).includes(assistant.sttModel)
      ? assistant.sttModel
      : "saaras:v3";
    // With "Reply in the visitor's own language" on, Sarvam detects the spoken language itself (Odia,
    // Hindi, Tamil… or English), so a visitor can simply start talking in theirs. Otherwise the chosen
    // language guides recognition, and English still lets Sarvam notice a switch.
    const detect = assistant.autoLanguage || !sarvamSupports(language) || language === "en-IN";
    const result = await sarvamTranscribe({
      audio,
      filename: `speech.${ext}`,
      language: detect ? "unknown" : language,
      model,
    });
    return json(200, { ok: true, text: result.text, language: result.language });
  } catch (e) {
    const message = e instanceof VoiceError ? e.message : "error";
    console.error(JSON.stringify({ event: "stt_failed", error: message }));
    // Too many people talking at once: say so, rather than blaming the visitor's recording.
    if (/HTTP (429|5\d\d)/.test(message))
      return json(503, {
        ok: false,
        busy: true,
        error: "The voice service is busy right now. Please try again in a moment, or type your question.",
      });
    return json(502, { ok: false, error: "I couldn't understand the recording. Please try again or type." });
  }
}
