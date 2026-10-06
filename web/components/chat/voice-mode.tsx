"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { listen, recordUtterance, transcribe, type Recording } from "./voice";

type Phase = "listening" | "transcribing" | "thinking" | "speaking" | "paused";

/** The reply, and its speech: it starts playing while the reply is still being written. */
export type VoiceReply = { text: string; needsCv: boolean; speech?: Promise<void> } | null;

/**
 * Hands-free voice conversation, like a phone call with the assistant (ChatGPT-style voice mode):
 * it listens until the visitor stops talking, sends what they said, speaks the answer, and listens
 * again, with no tapping. The screen shows only the circle and what it is doing, not the words. Tapping the circle while it speaks interrupts it. Everything said also appears in the chat,
 * so the conversation is there when voice mode closes. When a CV is needed, it hands back to the
 * chat so the upload button can be used.
 */
export function VoiceMode({
  lang,
  serverVoice,
  endSilenceMs = 1500,
  name,
  ask,
  stopSpeaking,
  onClose,
}: {
  lang: string;
  serverVoice: boolean;
  /** How long the visitor may pause before their turn ends. */
  endSilenceMs?: number;
  name: string;
  /** Sends what was said; onSpeaking fires when the answer starts to be heard. */
  ask: (text: string, onSpeaking: () => void) => Promise<VoiceReply>;
  stopSpeaking: () => void;
  onClose: (note?: string) => void;
}) {
  const [phase, setPhase] = useState<Phase>("listening");
  const [level, setLevel] = useState(0);
  const [hint, setHint] = useState("");
  const recording = useRef<Recording | null>(null);
  const stopBrowser = useRef<(() => void) | null>(null);
  const alive = useRef(true);
  const turn = useRef(0);

  const stopListening = () => {
    recording.current?.cancel();
    recording.current = null;
    stopBrowser.current?.();
    stopBrowser.current = null;
  };

  /** Hears one utterance: Sarvam (record, then transcribe) or the browser's recognition. */
  const hear = useCallback(async (): Promise<string | null> => {
    if (serverVoice) {
      const rec = recordUtterance({ onLevel: setLevel, endSilenceMs });
      recording.current = rec;
      const parts = await rec.result;
      recording.current = null;
      setLevel(0);
      if (!parts) return null;
      setPhase("transcribing");
      return transcribe(parts, lang);
    }
    return new Promise<string | null>((resolve, reject) => {
      stopBrowser.current = listen(
        lang,
        () => {},
        (text, error) => {
          stopBrowser.current = null;
          if (error && error !== "no-speech" && error !== "aborted") reject(new Error(error));
          else resolve(text || null);
        },
        endSilenceMs,
      );
    });
  }, [lang, serverVoice, endSilenceMs]);

  const loop = useCallback(async () => {
    const mine = ++turn.current;
    const current = () => alive.current && mine === turn.current;
    try {
      setPhase("listening");
      setHint("");
      const said = await hear();
      if (!current()) return;
      if (!said) {
        setPhase("paused");
        setHint("I didn't hear anything. Tap the circle when you're ready to talk.");
        return;
      }
      setPhase("thinking");
      const reply = await ask(said, () => current() && setPhase("speaking"));
      if (!current()) return;
      if (!reply) {
        setPhase("paused");
        setHint("Something went wrong. Tap the circle to try again.");
        return;
      }
      await reply.speech;
      if (!current()) return;
      if (reply.needsCv) {
        onClose("Upload your CV with the button in the chat, then carry on by voice or text.");
        return;
      }
      // A short breath before listening again, so the end of its own voice is not heard as speech.
      await new Promise((r) => setTimeout(r, 400));
      if (!current()) return;
      void loop();
    } catch (e) {
      if (!current()) return;
      const msg = e instanceof Error ? e.message : "";
      setPhase("paused");
      setHint(
        /not-allowed|NotAllowed|Permission/i.test(msg)
          ? "Please allow the microphone for this site (the icon in the address bar), then tap the circle."
          : /busy/i.test(msg)
            ? "The voice service is busy right now. Tap the circle to try again in a moment, or type your question."
            : "I couldn't hear that clearly. Tap the circle to try again.",
      );
    }
  }, [ask, hear, onClose]);

  useEffect(() => {
    alive.current = true;
    void loop();
    return () => {
      alive.current = false;
      stopListening();
      stopSpeaking();
    };
    // Start once when voice mode opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** The circle: interrupt while speaking, stop and send while listening, resume when paused. */
  const tapOrb = () => {
    if (phase === "speaking") {
      turn.current++;
      stopSpeaking();
      void loop();
    } else if (phase === "listening") {
      if (recording.current) recording.current.stop();
      else stopBrowser.current?.();
    } else if (phase === "paused") void loop();
  };

  const pause = () => {
    turn.current++;
    stopListening();
    stopSpeaking();
    setLevel(0);
    setPhase("paused");
    setHint("Paused. Tap the circle to talk again.");
  };

  const label = {
    listening: "Listening…",
    transcribing: "Got it…",
    thinking: "Thinking…",
    speaking: "Speaking… tap to interrupt",
    paused: "Tap to talk",
  }[phase];

  return (
    <div
      className="theme-on-brand absolute inset-0 z-20 flex flex-col bg-brand text-on-brand"
      role="dialog"
      aria-label="Voice conversation"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 hero-ambient opacity-60" />
      <div className="relative flex items-center justify-between px-4 py-3">
        <p className="text-sm font-semibold">Voice conversation · {name}</p>
        <button
          type="button"
          onClick={() => onClose()}
          aria-label="End voice conversation"
          className="rounded-full p-1.5 hover:bg-on-brand/10"
        >
          <X size={18} aria-hidden />
        </button>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <button
          type="button"
          onClick={tapOrb}
          aria-label={label}
          className="relative flex h-40 w-40 items-center justify-center rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-on-brand/40"
        >
          <span
            aria-hidden
            className={cn(
              "absolute inset-0 rounded-full bg-gradient-to-br from-gold-on-brand/80 via-action to-on-brand/30 blur-[2px] transition-transform duration-100",
              phase === "thinking" || phase === "transcribing" ? "animate-spin [animation-duration:2.4s]" : "",
              phase === "speaking" ? "animate-pulse" : "",
              phase === "paused" ? "opacity-50" : "",
            )}
            style={{
              transform: `scale(${phase === "listening" ? 0.86 + level * 0.3 : phase === "speaking" ? 1 : 0.9})`,
            }}
          />
          <span aria-hidden className="absolute inset-3 rounded-full bg-brand/70 backdrop-blur" />
          <span className="relative">
            {phase === "paused" ? <Mic size={34} aria-hidden /> : null}
            {phase === "listening" ? (
              <span className="flex items-end gap-1" aria-hidden>
                {[0.6, 1, 0.75, 0.9, 0.55].map((h, i) => (
                  <span
                    key={i}
                    className="w-1.5 rounded-full bg-on-brand transition-[height] duration-100"
                    style={{ height: `${10 + level * 38 * h}px` }}
                  />
                ))}
              </span>
            ) : null}
            {phase === "speaking" ? (
              <span className="flex items-end gap-1" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="h-6 w-1.5 animate-bounce rounded-full bg-on-brand"
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </span>
            ) : null}
          </span>
        </button>
        <p className="text-base font-semibold" aria-live="polite">
          {label}
        </p>
        {hint ? <p className="max-w-xs text-sm text-on-brand/80">{hint}</p> : null}
      </div>

      <div className="relative flex items-center justify-center gap-4 pb-6">
        <button
          type="button"
          onClick={phase === "paused" ? () => void loop() : pause}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-on-brand/10 px-5 text-sm font-semibold hover:bg-on-brand/15"
        >
          {phase === "paused" ? <Mic size={16} aria-hidden /> : <MicOff size={16} aria-hidden />}
          {phase === "paused" ? "Talk" : "Pause"}
        </button>
        <button
          type="button"
          onClick={() => onClose()}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-red-600 px-5 text-sm font-semibold text-on-action hover:bg-red-700"
        >
          <X size={16} aria-hidden /> End
        </button>
      </div>
      <p className="relative pb-3 text-center text-[11px] text-on-brand/60">
        {serverVoice ? "Voice by Sarvam AI" : "Voice by your browser"} · the conversation is also saved in the chat
      </p>
    </div>
  );
}
