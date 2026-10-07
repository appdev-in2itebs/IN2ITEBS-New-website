/**
 * The language a piece of text is written in, judged by its script: Odia letters mean Odia, Tamil
 * letters Tamil, and so on. Used to speak a reply in the language it is actually written in (the
 * assistant may switch mid-conversation, "talk to me in Odia") and to answer typed messages in the
 * visitor's own language. Devanagari is Hindi unless the conversation is in Marathi; Latin script
 * keeps the current language when that one is written in Latin script, otherwise it is English.
 */
const SCRIPTS: [RegExp, string][] = [
  [/[଀-୿]/, "or-IN"],
  [/[ঀ-৿]/, "bn-IN"],
  [/[઀-૿]/, "gu-IN"],
  [/[਀-੿]/, "pa-IN"],
  [/[஀-௿]/, "ta-IN"],
  [/[ఀ-౿]/, "te-IN"],
  [/[ಀ-೿]/, "kn-IN"],
  [/[ഀ-ൿ]/, "ml-IN"],
  [/[؀-ۿ]/, "ar-AE"],
];

/** Languages of the assistant that are written in Latin script. */
const LATIN = new Set(["en-IN", "fr-FR", "de-DE", "es-ES", "sw-KE", "zu-ZA", "af-ZA"]);

export function languageOfText(text: string, current: string): string {
  for (const [script, code] of SCRIPTS) if (script.test(text)) return code;
  if (/[ऀ-ॿ]/.test(text)) return current === "mr-IN" ? "mr-IN" : "hi-IN";
  if (/[A-Za-z]/.test(text)) return LATIN.has(current) ? current : "en-IN";
  return current;
}
