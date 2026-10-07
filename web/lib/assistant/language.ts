/**
 * Recognises a visitor asking the assistant to talk in a language, typed or spoken, so the switch
 * happens at once, before the reply is written, instead of depending on the model to notice (it
 * sometimes refused it as off-topic). Three ways of asking are understood:
 *  - in English: "can you talk in Telugu?", "reply in Hindi please", "I want to talk in English";
 *  - in the language itself, its own name in its own script: "తెలుగులో మాట్లాడండి", "ଓଡ଼ିଆରେ କୁହନ୍ତୁ";
 *  - a short mixed phrase: "Hindi mein baat karo", "Telugu lo matladandi", "Odia re kuha".
 * A language named without a request ("what is Odia?", "is Telugu spoken in Hyderabad?", "offices
 * in Odisha", a long enquiry that mentions one) is not one.
 */
const LANGUAGES: { code: string; latin: RegExp; native?: RegExp }[] = [
  { code: "or-IN", latin: /\b(odia|oriya)\b/i, native: /ଓଡ଼ିଆ|ଓଡିଆ/ },
  { code: "hi-IN", latin: /\bhindi\b/i, native: /हिंदी|हिन्दी/ },
  // The stem, without the final virama: "in Tamil" is தமிழில்.
  { code: "ta-IN", latin: /\btamil\b/i, native: /தமிழ/ },
  { code: "te-IN", latin: /\btelugu\b/i, native: /తెలుగు/ },
  { code: "kn-IN", latin: /\bkannada\b/i, native: /ಕನ್ನಡ/ },
  { code: "ml-IN", latin: /\bmalayalam\b/i, native: /മലയാള/ },
  { code: "mr-IN", latin: /\bmarathi\b/i, native: /मराठी/ },
  { code: "bn-IN", latin: /\b(bengali|bangla)\b/i, native: /বাংলা/ },
  { code: "gu-IN", latin: /\bgujarati\b/i, native: /ગુજરાતી/ },
  { code: "pa-IN", latin: /\b(punjabi|panjabi)\b/i, native: /ਪੰਜਾਬੀ/ },
  { code: "en-IN", latin: /\benglish\b/i, native: /अंग्रेज़ी|अंग्रेजी|ଇଂରାଜୀ/ },
  { code: "ar-AE", latin: /\barabic\b/i, native: /العربية/ },
  { code: "fr-FR", latin: /\bfrench\b/i, native: /français/i },
  { code: "de-DE", latin: /\bgerman\b/i, native: /deutsch/i },
  { code: "es-ES", latin: /\bspanish\b/i, native: /español/i },
  { code: "sw-KE", latin: /\b(swahili|kiswahili)\b/i },
  { code: "zu-ZA", latin: /\b(zulu|isizulu)\b/i },
  { code: "af-ZA", latin: /\bafrikaans\b/i },
];

/** Words that make naming a language a request to use it. */
const ASKING =
  /\b(talk|speak|reply|respond|answer|chat|converse|communicate|switch|change|continue|use|write|tell|explain|language|lang|please|pls|want|baat|bolo|bol|boliye|karo|kariye|mein|bhasha)\b|ଭାଷା|କୁହ|କହ|କଥା|भाषा|बात|बोल|में/i;

/** A question about a language rather than a request to use it. */
const ASKING_ABOUT = /^\s*(what|which|who|where|why|when|is|are|was|does|do|did|how many|how much)\b/i;

export function requestedLanguage(message: string): string | null {
  const text = message.trim();
  // A long message that only mentions a language in passing is not a request to switch.
  if (!text || text.length > 160) return null;
  const words = text.split(/\s+/).length;
  const native = LANGUAGES.filter((l) => l.native?.test(text));
  const latin = LANGUAGES.filter((l) => l.latin.test(text));
  // Its own name in its own script, in a short message: "తెలుగులో మాట్లాడండి".
  if (native.length === 1 && latin.length <= 1 && words <= 8) return native[0].code;
  if (latin.length !== 1) return null;
  if (ASKING.test(text)) return latin[0].code;
  // A short phrase naming one language ("Telugu lo matladandi", "Odia re kuha"), not a question about it.
  return words <= 6 && !ASKING_ABOUT.test(text) ? latin[0].code : null;
}

/**
 * Plainly English ("Who is the COO?"), so it needs no translating first. A language typed in English
 * letters ("mote gote application amo office") has few of these little English words.
 */
export function looksEnglish(text: string): boolean {
  if (/[^\u0000-ɏ\s\d\p{P}\p{S}]/u.test(text)) return false;
  const words = text.toLowerCase().match(/[a-z']+/g) ?? [];
  const common =
    /^(the|a|an|is|are|was|were|be|do|does|did|can|could|will|would|should|what|who|whom|which|where|when|why|how|you|your|yours|we|our|i|me|my|it|its|this|that|these|those|to|of|in|on|for|with|about|and|or|not|no|yes|please|tell|have|has|any|from|at|by|need|want|like|know|give|show|there|they|them|their|he|she|his|her)$/;
  return words.length > 0 && words.filter((w) => common.test(w)).length / words.length >= 0.3;
}
