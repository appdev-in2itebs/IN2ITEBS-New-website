"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { listen, openMic, recordUtterance, transcribe, type Background, type Heard, type Recording } from "./voice";

type Phase = "listening" | "transcribing" | "thinking" | "speaking" | "paused";

/** The reply, and its speech: it starts playing while the reply is still being written. */
export type VoiceReply = { text: string; needsCv: boolean; speech?: Promise<void> } | null;

/** Real words, not just noise the recogniser turned into "hmm", "uh" or punctuation. */
function isWords(text: string): boolean {
  const letters = text.replace(/[^\p{L}\p{N}]/gu, "");
  return letters.length >= 2 && !/^(h+m+|u+h+m*|a+h+|o+h+|e+r+m*|m+)$/i.test(letters);
}

/** Extra details sent with a spoken question. */
type AskMore = { spokenLanguage?: string | null; signal?: AbortSignal; interrupted?: boolean };

/**
 * Hands-free voice conversation, like a phone call with the assistant: it listens until the visitor
 * stops talking, sends what they said, speaks the answer, and listens again, with no tapping. The
 * screen shows only the circle and what it is doing, not the words; everything said also appears in
 * the chat, so the conversation is there when voice mode closes.
 *
 * Like a real call, the visitor can cut in: while the assistant is thinking or talking the mic stays
 * open (with the Sarvam voice), and as soon as they speak it stops, drops the rest of its answer and
 * answers what they said instead. Tapping the circle does the same.
 *
 * The visitor's language is followed: Sarvam detects what they speak (Odia, Hindi, Tamil…), the
 * answer comes back in it, and the voice speaks it. When a CV is needed, it hands back to the chat
 * so the upload button can be used.
 */
export function VoiceMode({
  lang,
  serverVoice,
  endSilenceMs = 1200,
  bargeIn = false,
  bargeInSensitivity = "medium",
  micRange = "normal",
  name,
  ask,
  stopSpeaking,
  introduce,
  onClose,
}: {
  lang: string;
  serverVoice: boolean;
  /** How long the visitor may pause before their turn ends. */
  endSilenceMs?: number;
  /** The visitor may cut in by speaking (Admin → AI assistant → Voice). */
  bargeIn?: boolean;
  bargeInSensitivity?: "low" | "medium" | "high";
  /** How far from the microphone the visitor may be (Admin → AI assistant → Voice). */
  micRange?: "close" | "normal" | "far";
  name: string;
  /** Sends what was said; onSpeaking fires when the answer starts to be heard. */
  ask: (text: string, onSpeaking: () => void, more?: AskMore) => Promise<VoiceReply>;
  stopSpeaking: () => void;
  /** Says the first words of the call (a greeting that offers a choice of language); resolves when done. */
  introduce?: () => Promise<void>;
  onClose: (note?: string) => void;
}) {
  const [phase, setPhase] = useState<Phase>("listening");
  const [level, setLevel] = useState(0);
  const [hint, setHint] = useState("");
  const recording = useRef<Recording | null>(null);
  /** The mic left open while the assistant answers, for the visitor to cut in. */
  const cutInMic = useRef<Recording | null>(null);
  /** Cancels the answer being written (the visitor cut in). */
  const answer = useRef<AbortController | null>(null);
  const stopBrowser = useRef<(() => void) | null>(null);
  /** One microphone for the whole call: opened once, released when paused or ended. */
  const micStream = useRef<MediaStream | null>(null);
  /**
   * How loud (dB) this visitor speaks, learnt from their turns. Speech 12 dB or more quieter than
   * that (colleagues talking nearby, a TV) does not count as the visitor speaking.
   */
  const voiceLevel = useRef<number | null>(null);
  /** The room's background, kept from turn to turn so each turn does not start learning it again. */
  const background = useRef<Background | null>(null);
  /** This turn's speaking level, kept once the words are confirmed to be real speech. */
  const turnLevel = useRef<number | null>(null);
  const alive = useRef(true);
  /** The greeting at the start of the call, said once. */
  const intro = useRef<Promise<void> | null>(null);
  const turn = useRef(0);

  // The latest props: the conversation goes on across many renders of the chat (language changes,
  // new conversation id), and every turn must use the current ones.
  const latest = useRef({
    lang,
    serverVoice,
    endSilenceMs,
    bargeIn,
    bargeInSensitivity,
    micRange,
    ask,
    stopSpeaking,
    onClose,
  });
  latest.current = {
    lang,
    serverVoice,
    endSilenceMs,
    bargeIn,
    bargeInSensitivity,
    micRange,
    ask,
    stopSpeaking,
    onClose,
  };

  const mic = async () => {
    if (!micStream.current?.active) micStream.current = await openMic();
    return micStream.current;
  };
  const releaseMic = () => {
    micStream.current?.getTracks().forEach((track) => track.stop());
    micStream.current = null;
  };

  const stopListening = () => {
    recording.current?.cancel();
    recording.current = null;
    cutInMic.current?.cancel();
    cutInMic.current = null;
    stopBrowser.current?.();
    stopBrowser.current = null;
  };

  /** Turns a recording into words (and the language they were spoken in). */
  const understand = async (parts: Blob[] | null): Promise<Heard | null> => {
    if (!parts) return null;
    setPhase("transcribing");
    return transcribe(parts, latest.current.lang);
  };

  /** Hears one utterance: Sarvam (record, then transcribe) or the browser's recognition. */
  const hear = async (): Promise<Heard | null> => {
    const { serverVoice: server, endSilenceMs: endAfter, lang: language } = latest.current;
    if (server) {
      turnLevel.current = null;
      const rec = recordUtterance({
        onLevel: setLevel,
        endSilenceMs: endAfter,
        // A call: wait longer for the visitor to speak before pausing (background talk is ignored).
        waitMs: 25_000,
        voiceDb: voiceLevel.current ?? undefined,
        onSpeechLevel: (db) => (turnLevel.current = db),
        background: background.current ?? undefined,
        onBackground: (b) => (background.current = b),
        range: latest.current.micRange,
        stream: await mic(),
      });
      recording.current = rec;
      const parts = await rec.result;
      recording.current = null;
      setLevel(0);
      return understand(parts);
    }
    return new Promise<Heard | null>((resolve, reject) => {
      stopBrowser.current = listen(
        language,
        () => {},
        (text, error) => {
          stopBrowser.current = null;
          if (error && error !== "no-speech" && error !== "aborted") reject(new Error(error));
          else resolve(text ? { text, language: null } : null);
        },
        endAfter,
      );
    });
  };

  /**
   * One turn: hear the visitor (or take what they said when cutting in), ask, speak the answer while
   * listening for them to cut in, then go round again.
   */
  const loop = async (cutIn?: Promise<Blob[] | null>) => {
    const mine = ++turn.current;
    const current = () => alive.current && mine === turn.current;
    const now = latest.current;
    try {
      setPhase("listening");
      setHint("");
      const heard = cutIn ? await understand(await cutIn) : await hear();
      if (!current()) return;
      // Background noise that started the microphone but held no words ("", "hmm", "."): not a
      // question, so keep listening quietly instead of answering it.
      if (heard && !cutIn && !isWords(heard.text)) return void loop();
      // Real words: remember how loud the visitor speaks, for telling them apart from people nearby.
      if (heard?.text && turnLevel.current !== null)
        voiceLevel.current =
          voiceLevel.current === null ? turnLevel.current : voiceLevel.current * 0.7 + turnLevel.current * 0.3;
      if (!heard?.text) {
        // Nothing heard for a while: maybe the visitor moved away or speaks more softly now, so the
        // next attempt listens for quieter speech again.
        voiceLevel.current = null;
        setPhase("paused");
        setHint("I didn't hear anything. Tap the circle when you're ready to talk.");
        return;
      }
      setPhase("thinking");

      // While it thinks and talks, the mic stays open: speaking cuts in (Sarvam voice only).
      const controller = new AbortController();
      answer.current = controller;
      let cut: () => void = () => {};
      const cutInHeard = new Promise<"cut">((resolve) => (cut = () => resolve("cut")));
      let cutInRec: Recording | null = null;
      if (now.bargeIn && now.serverVoice) {
        cutInRec = recordUtterance({
          stream: await mic(),
          endSilenceMs: now.endSilenceMs,
          bargeIn: now.bargeInSensitivity,
          background: background.current ?? undefined,
          onLevel: (l) => current() && setLevel(l),
          onSpeech: () => {
            if (!current()) return;
            controller.abort();
            latest.current.stopSpeaking();
            setPhase("listening");
            cut();
          },
        });
        cutInMic.current = cutInRec;
        // A mic problem here is not fatal: tapping the circle still interrupts.
        cutInRec.result.catch(() => {});
      }
      const dropMic = () => {
        cutInRec?.cancel();
        if (cutInMic.current === cutInRec) cutInMic.current = null;
      };

      const reply = await Promise.race([
        latest.current.ask(heard.text, () => current() && setPhase("speaking"), {
          spokenLanguage: heard.language,
          signal: controller.signal,
          interrupted: Boolean(cutIn),
        }),
        cutInHeard,
      ]);
      if (!current()) return dropMic();
      if (reply === "cut") return void loop(cutInRec!.result);
      if (!reply) {
        dropMic();
        setPhase("paused");
        setHint("Something went wrong. Tap the circle to try again.");
        return;
      }
      const ended = await Promise.race([reply.speech ?? Promise.resolve(), cutInHeard]);
      if (!current()) return dropMic();
      if (ended === "cut") return void loop(cutInRec!.result);
      dropMic();
      answer.current = null;
      if (reply.needsCv) {
        latest.current.onClose("Upload your CV with the button in the chat, then carry on by voice or text.");
        return;
      }
      // A short breath before listening again, so the end of its own voice is not heard as speech.
      await new Promise((r) => setTimeout(r, 300));
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
  };

  useEffect(() => {
    alive.current = true;
    // The assistant speaks first, like answering a call: it greets the visitor and asks which
    // language to talk in. Tapping the circle (or pausing) during it moves on.
    const mine = ++turn.current;
    void (async () => {
      if (introduce) {
        setPhase("speaking");
        // Once per call, even when the component is started twice (React's development mode does).
        intro.current ??= introduce().catch(() => {});
        await intro.current;
      }
      if (alive.current && turn.current === mine) void loop();
    })();
    return () => {
      alive.current = false;
      answer.current?.abort();
      stopListening();
      releaseMic();
      latest.current.stopSpeaking();
    };
    // Start once when voice mode opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Stops whatever the assistant is doing (thinking or talking). */
  const silence = () => {
    turn.current++;
    answer.current?.abort();
    answer.current = null;
    stopListening();
    stopSpeaking();
  };

  /** The circle: interrupt while thinking or speaking, stop and send while listening, resume when paused. */
  const tapOrb = () => {
    if (phase === "speaking" || phase === "thinking") {
      silence();
      void loop();
    } else if (phase === "listening") {
      if (recording.current) recording.current.stop();
      else stopBrowser.current?.();
    } else if (phase === "paused") void loop();
  };

  const pause = () => {
    silence();
    releaseMic();
    setLevel(0);
    setPhase("paused");
    setHint("Paused. Tap the circle to talk again.");
  };

  const canCutIn = bargeIn && serverVoice;
  const label = {
    listening: "Listening…",
    transcribing: "Got it…",
    thinking: canCutIn ? "Thinking… (just talk to change your question)" : "Thinking…",
    speaking: canCutIn ? "Speaking… just talk to interrupt" : "Speaking… tap to interrupt",
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
        {serverVoice ? "Voice by Sarvam AI" : "Voice by your browser"} · speak any Indian language · the conversation is
        also saved in the chat
      </p>
    </div>
  );
}
