"use client";

import { useRef, useState } from "react";
import { Loader2, Play, Square } from "lucide-react";

const SAMPLES: Record<string, string> = {
  "en-IN": "Hello! I'm the In2IT EBS assistant. How can I help you today?",
  "hi-IN": "नमस्ते! मैं In2IT EBS की सहायक हूँ। मैं आपकी कैसे मदद कर सकती हूँ?",
  "ta-IN": "வணக்கம்! நான் In2IT EBS உதவியாளர். நான் உங்களுக்கு எப்படி உதவ முடியும்?",
  "te-IN": "నమస్కారం! నేను In2IT EBS సహాయకుడిని. నేను మీకు ఎలా సహాయం చేయగలను?",
  "kn-IN": "ನಮಸ್ಕಾರ! ನಾನು In2IT EBS ಸಹಾಯಕ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
  "bn-IN": "নমস্কার! আমি In2IT EBS-এর সহকারী। আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
  "mr-IN": "नमस्कार! मी In2IT EBS ची सहाय्यक आहे. मी तुमची कशी मदत करू शकते?",
  "or-IN": "ନମସ୍କାର! ମୁଁ In2IT EBS ର ସହାୟକ। ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?",
};

/**
 * Plays a sample sentence with the voice and speed chosen in the form above it (Sarvam), before
 * saving, so the admin hears exactly what visitors will hear.
 */
export function VoicePreview() {
  const [lang, setLang] = useState("en-IN");
  const [state, setState] = useState<"idle" | "loading" | "playing" | "error">("idle");
  const audio = useRef<HTMLAudioElement | null>(null);

  async function play(button: HTMLButtonElement) {
    if (state === "playing") {
      audio.current?.pause();
      setState("idle");
      return;
    }
    const form = button.form;
    const voice = (form?.elements.namedItem("voiceName") as HTMLSelectElement | null)?.value;
    const pace = Number((form?.elements.namedItem("voicePace") as HTMLInputElement | null)?.value || 1);
    setState("loading");
    try {
      const res = await fetch("/api/voice/tts/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: SAMPLES[lang], language: lang, voice, pace }),
      });
      if (!res.ok) throw new Error();
      const url = URL.createObjectURL(await res.blob());
      const a = new Audio(url);
      audio.current = a;
      a.onended = () => {
        URL.revokeObjectURL(url);
        setState("idle");
      };
      await a.play();
      setState("playing");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        aria-label="Sample language"
        className="h-10 rounded-full border border-border-subtle bg-surface px-3 text-sm"
      >
        {Object.keys(SAMPLES).map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={(e) => play(e.currentTarget)}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-border-subtle px-4 text-sm font-semibold hover:border-action hover:text-action"
      >
        {state === "loading" ? (
          <Loader2 size={15} className="animate-spin" aria-hidden />
        ) : state === "playing" ? (
          <Square size={14} aria-hidden />
        ) : (
          <Play size={15} aria-hidden />
        )}
        {state === "playing" ? "Stop" : "Preview voice"}
      </button>
      {state === "error" ? (
        <span className="text-xs text-red-800">Could not play: check the Sarvam key and the voice.</span>
      ) : null}
    </div>
  );
}
