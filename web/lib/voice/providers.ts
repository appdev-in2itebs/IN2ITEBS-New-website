/**
 * Voice providers for the chat assistant: who turns speech into text and replies into speech.
 *
 * - "browser": the visitor's own browser (Web Speech API). Free, no key, quality varies by device.
 * - "sarvam": Sarvam AI (api.sarvam.ai): natural Indian voices and accurate Indian-language speech
 *   recognition. Needs the SARVAM_API_KEY secret.
 *
 * To add another provider later (ElevenLabs, Azure, NVIDIA Riva through a relay...), add it to
 * VOICE_PROVIDERS, give it a server module like ./sarvam.ts, and route to it in
 * app/api/voice/{stt,tts}. The chat window does not change: it only knows "server voice" or "browser".
 */

export const VOICE_PROVIDERS = {
  browser: { label: "Browser voice (free, built into Chrome, Edge and Safari)", server: false },
  sarvam: { label: "Sarvam AI (natural Indian voices, Indian languages)", server: true },
} as const;
export type VoiceProvider = keyof typeof VOICE_PROVIDERS;

/** Our language codes (lib/cms/settings.ts) → Sarvam's. Languages not listed fall back to the browser. */
export const SARVAM_LANGUAGES: Record<string, string> = {
  "en-IN": "en-IN",
  "hi-IN": "hi-IN",
  "bn-IN": "bn-IN",
  "gu-IN": "gu-IN",
  "kn-IN": "kn-IN",
  "ml-IN": "ml-IN",
  "mr-IN": "mr-IN",
  "or-IN": "od-IN",
  "pa-IN": "pa-IN",
  "ta-IN": "ta-IN",
  "te-IN": "te-IN",
};

/** Sarvam's bulbul:v3 voices, for the admin's voice picker. */
export const SARVAM_VOICES = [
  "priya",
  "ritu",
  "neha",
  "pooja",
  "simran",
  "kavya",
  "ishita",
  "shreya",
  "roopa",
  "tanya",
  "shruti",
  "suhani",
  "kavitha",
  "rupali",
  "aditya",
  "ashutosh",
  "rahul",
  "rohan",
  "amit",
  "dev",
  "ratan",
  "varun",
  "manan",
  "sumit",
  "kabir",
  "aayan",
  "shubh",
  "advait",
  "anand",
  "tarun",
  "sunny",
  "mani",
  "gokul",
  "vijay",
  "mohit",
  "rehan",
  "soham",
] as const;

/** The female voices among them (the rest are male); the website's default is the first, Priya. */
export const SARVAM_FEMALE_VOICES: readonly string[] = SARVAM_VOICES.slice(0, SARVAM_VOICES.indexOf("aditya"));

/**
 * Sarvam's speech recognition models. saaras:v3 is the fastest with the same accuracy (measured
 * 2026-10-07: about 0.15 s quicker in English, Odia and Tamil). saarika:flash was withdrawn by Sarvam.
 */
export const SARVAM_STT_MODELS = ["saaras:v3", "saarika:v2.5"] as const;
