import { SARVAM_LANGUAGES } from "./providers";

/**
 * Sarvam AI (api.sarvam.ai), server-side only: the SARVAM_API_KEY never reaches the browser.
 * Speech to text with saarika/saaras, text to speech with bulbul:v3 as MP3.
 */

const BASE = "https://api.sarvam.ai";

export const sarvamConfigured = () => Boolean(process.env.SARVAM_API_KEY);

export const sarvamSupports = (language: string) => language in SARVAM_LANGUAGES;

export class VoiceError extends Error {}

/**
 * A Sarvam request that rides out a busy moment: on 429 (too many requests at once) or a 5xx it
 * waits briefly (Retry-After, or a short backoff with jitter) and tries again, up to twice within
 * about three seconds. `make` builds a fresh request each time, since a body can be sent only once.
 */
async function sarvamFetch(path: string, make: () => RequestInit): Promise<Response> {
  const started = Date.now();
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`${BASE}${path}`, { ...make(), signal: AbortSignal.timeout(20_000) });
    const busy = res.status === 429 || res.status >= 500;
    if (!busy || attempt >= 2) {
      if (busy) console.warn(JSON.stringify({ event: "voice_busy", path, status: res.status, attempts: attempt + 1 }));
      return res;
    }
    const retryAfter = Number(res.headers.get("retry-after"));
    const wait =
      Math.min(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 350 * 2 ** attempt, 1_500) +
      Math.random() * 250;
    if (Date.now() - started + wait > 3_000) return res;
    void res.body?.cancel();
    await new Promise((r) => setTimeout(r, wait));
  }
}

/** Speech (WebM, Ogg, WAV, MP3 or MP4 audio) to text. "unknown" language lets Sarvam detect it. */
export async function sarvamTranscribe(input: {
  audio: Blob;
  filename: string;
  language: string | "unknown";
  model: string;
}): Promise<{ text: string; language: string | null }> {
  // Sarvam wants a plain media type ("audio/webm"), not the browser's "audio/webm;codecs=opus".
  const plainType = (input.audio.type || "audio/webm").split(";")[0].trim();
  const audio = new Blob([await input.audio.arrayBuffer()], { type: plainType });
  const res = await sarvamFetch("/speech-to-text", () => {
    const form = new FormData();
    form.set("file", audio, input.filename);
    form.set("model", input.model);
    form.set(
      "language_code",
      input.language === "unknown" ? "unknown" : (SARVAM_LANGUAGES[input.language] ?? "unknown"),
    );
    return { method: "POST", headers: { "api-subscription-key": process.env.SARVAM_API_KEY ?? "" }, body: form };
  });
  const data = (await res.json().catch(() => ({}))) as {
    transcript?: string;
    language_code?: string | null;
    error?: { message?: string };
  };
  if (!res.ok) throw new VoiceError(`speech-to-text HTTP ${res.status}: ${data.error?.message?.slice(0, 200) ?? ""}`);
  const language = data.language_code
    ? (Object.entries(SARVAM_LANGUAGES).find(([, v]) => v === data.language_code)?.[0] ?? null)
    : null;
  return { text: (data.transcript ?? "").trim(), language };
}

/** Text (up to 2,500 characters) to MP3 speech. */
export async function sarvamSpeak(input: {
  text: string;
  language: string;
  voice: string;
  pace: number;
}): Promise<Uint8Array> {
  const body = JSON.stringify({
    model: "bulbul:v3",
    text: input.text.slice(0, 2500),
    target_language_code: SARVAM_LANGUAGES[input.language] ?? "en-IN",
    speaker: input.voice,
    pace: input.pace,
    output_audio_codec: "mp3",
  });
  const res = await sarvamFetch("/text-to-speech", () => ({
    method: "POST",
    headers: { "api-subscription-key": process.env.SARVAM_API_KEY ?? "", "Content-Type": "application/json" },
    body,
  }));
  const data = (await res.json().catch(() => ({}))) as { audios?: string[]; error?: { message?: string } };
  if (!res.ok || !data.audios?.[0])
    throw new VoiceError(`text-to-speech HTTP ${res.status}: ${data.error?.message?.slice(0, 200) ?? ""}`);
  return Uint8Array.from(atob(data.audios[0]), (c) => c.charCodeAt(0));
}

/**
 * Translation between English and the Indian languages (Sarvam's models are made for them; the chat
 * model's own Odia, Telugu… reads unnaturally). Messages from the visitor go to English with
 * mayura:v1, which also detects the language and understands it typed in English letters ("mote gote
 * application …"); the assistant's English answers go out with sarvam-translate:v1, which writes
 * fluent text and keeps markdown links working. Returns null when it cannot (the caller falls back).
 */
export async function sarvamTranslate(input: {
  text: string;
  /** Our language codes ("or-IN"…), or "auto" to detect the visitor's language. */
  from: string;
  to: string;
}): Promise<{ text: string; from: string | null } | null> {
  const code = (c: string) => (c === "auto" ? "auto" : (SARVAM_LANGUAGES[c] ?? c));
  const toEnglish = input.to === "en-IN";
  const limit = toEnglish ? 1000 : 2000;
  // A long answer goes in paragraphs (each within the model's limit), translated side by side.
  const pieces = input.text.length <= limit ? [input.text] : input.text.split(/\n{2,}/);
  if (pieces.some((p) => p.length > limit)) return null;
  try {
    const out = await Promise.all(
      pieces.map(async (piece) => {
        if (!piece.trim()) return { text: piece, from: null as string | null };
        const body = JSON.stringify({
          input: piece,
          source_language_code: code(input.from),
          target_language_code: code(input.to),
          model: toEnglish ? "mayura:v1" : "sarvam-translate:v1",
          // The website speaks with a female voice: "I can help" takes her forms (सकती, ସହାୟିକା…).
          ...(toEnglish ? {} : { speaker_gender: "Female" }),
        });
        const res = await sarvamFetch("/translate", () => ({
          method: "POST",
          headers: { "api-subscription-key": process.env.SARVAM_API_KEY ?? "", "Content-Type": "application/json" },
          body,
        }));
        const data = (await res.json().catch(() => ({}))) as {
          translated_text?: string;
          source_language_code?: string;
        };
        if (!res.ok || !data.translated_text) throw new VoiceError(`translate HTTP ${res.status}`);
        const from = data.source_language_code
          ? (Object.entries(SARVAM_LANGUAGES).find(([, v]) => v === data.source_language_code)?.[0] ?? null)
          : null;
        return { text: data.translated_text, from };
      }),
    );
    return { text: out.map((o) => o.text).join("\n\n"), from: out.find((o) => o.from)?.from ?? null };
  } catch (e) {
    console.warn(JSON.stringify({ event: "translate_failed", error: e instanceof Error ? e.message : "error" }));
    return null;
  }
}
