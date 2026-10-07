/**
 * How the voice says the company's name. Written "In2IT EBS", spoken "Into I-T, E-B-S". Left alone,
 * the voice spelt it out letter by letter in the Indian languages ("I-N-two-I-T-E-B-S") and said
 * "IN2 ITEBS" in English. Each language gets the name in its own script, with a short pause before
 * E-B-S so the E is not swallowed. Each form was checked on 2026-10-07 by having Sarvam's voice say it
 * and Sarvam's speech recognition write down what it heard: all came back as "Into IT EBS".
 * Only the spoken text changes; the chat still shows "In2IT EBS".
 */
const COMPANY: Record<string, string> = {
  "en-IN": "Into I-T, E-B-S",
  "hi-IN": "इन-टू आई-टी, ई-बी-एस",
  "mr-IN": "इन-टू आय-टी, ई-बी-एस",
  "or-IN": "ଇନ୍-ଟୁ ଆଇ-ଟି, ଇ-ବି-ଏସ୍",
  // Spaced letters: with hyphens the voice ran "IT" and "E" together.
  "te-IN": "ఇన్-టు ఐ-టీ, ఈ బీ ఎస్",
  "ta-IN": "இன்-டு ஐ-டி, இ-பி-எஸ்",
  "kn-IN": "ಇನ್-ಟು ಐ-ಟಿ, ಇ-ಬಿ-ಎಸ್",
  "ml-IN": "ഇൻ-ടു ഐ-ടി, ഇ-ബി-എസ്",
  "bn-IN": "ইন-টু আই-টি, ই-বি-এস",
  "gu-IN": "ઇન-ટુ આઈ-ટી, ઈ-બી-એસ",
  "pa-IN": "ਇਨ-ਟੂ ਆਈ-ਟੀ, ਈ-ਬੀ-ਐੱਸ",
};

/** The text as it should be spoken in this language: the company's name said the right way. */
export function pronounce(text: string, language: string): string {
  const full = COMPANY[language] ?? COMPANY["en-IN"];
  // "In2IT" on its own (e.g. "In2IT Assistant") is the part before the pause.
  const short = full.split(",")[0];
  return text.replace(/\bin2it\s*-?\s*ebs/gi, full).replace(/\bin2it/gi, short);
}
