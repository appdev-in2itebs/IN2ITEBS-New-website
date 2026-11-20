"use client";

/**
 * Voice for the chat window, using the browser's own speech services: speech recognition (talk
 * instead of typing) and speech synthesis (hear the replies). No key and no extra download; both
 * follow the language chosen in the chat. Where a browser lacks one (Firefox has no recognition),
 * its button simply does not appear. A server provider (Sarvam, NVIDIA) can replace these later
 * behind the same two functions.
 */

type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult:
    | ((e: {
        resultIndex: number;
        results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
      }) => void)
    | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

function recognitionClass(): (new () => Recognition) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => Recognition;
    webkitSpeechRecognition?: new () => Recognition;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export const canListen = () => recognitionClass() !== null;
export const canSpeak = () => typeof window !== "undefined" && "speechSynthesis" in window;

/**
 * Listens to one turn with the browser's recognition: calls onText with the words so far while the
 * visitor speaks, and onDone with everything they said. It keeps listening through natural pauses
 * and ends after `endSilenceMs` without new words (or when stopped). Returns a stop function.
 */
export function listen(
  lang: string,
  onText: (text: string) => void,
  onDone: (text: string, error?: string) => void,
  endSilenceMs = 1500,
): () => void {
  const Rec = recognitionClass();
  if (!Rec) {
    onDone("", "unsupported");
    return () => {};
  }
  const rec = new Rec();
  rec.lang = lang;
  rec.interimResults = true;
  rec.continuous = true;
  rec.maxAlternatives = 1;
  let finalText = "";
  let interim = "";
  let failed: string | undefined;
  let ended = false;
  let quiet: ReturnType<typeof setTimeout> | undefined;
  const stop = () => {
    try {
      rec.stop();
    } catch {}
  };
  // Nobody speaks at all: give up after a while.
  const idle = setTimeout(stop, 10_000);
  rec.onresult = (e) => {
    clearTimeout(idle);
    interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) finalText += `${r[0].transcript} `;
      else interim += r[0].transcript;
    }
    onText(`${finalText}${interim}`.replace(/\s+/g, " ").trim());
    clearTimeout(quiet);
    quiet = setTimeout(stop, endSilenceMs);
  };
  rec.onerror = (e) => {
    failed = e.error;
  };
  rec.onend = () => {
    if (ended) return;
    ended = true;
    clearTimeout(idle);
    clearTimeout(quiet);
    onDone(`${finalText}${interim}`.replace(/\s+/g, " ").trim(), failed);
  };
  try {
    rec.start();
  } catch {
    onDone("", "start-failed");
  }
  return stop;
}

/** Plain text for speaking: no markdown, links read as their words, no emoji. */
export function speakable(text: string) {
  return (
    text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // Page addresses and web links are for the eye, never read out: "[/about/#leadership]", "(/contact/)".
      .replace(/\[\/[^\]\s]*\]|\(\/[^)\s]*\)|https?:\/\/\S+|(^|\s)\/[a-z0-9\-/#]+\/(?=\s|$|[.,!?])/gi, "$1")
      .replace(/[*_`#>]/g, "")
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
      .replace(/\s+/g, " ")
      .trim()
  );
}

import { languageOfText } from "@/lib/voice/script-language";
import { pronounce } from "@/lib/voice/pronounce";

// The device's voices do not say their gender, but their names do. The website speaks with one female
// voice (Sarvam's, chosen in the admin); when the device must speak instead, it picks a female one too.
const FEMALE_VOICE =
  /female|woman|heera|neerja|kalpana|swara|aarohi|ananya|pallavi|shruti|zira|aria|jenny|sonia|libby|natasha|clara|samantha|veena|lekha|karen|moira|tessa|fiona|victoria|allison|susan|hazel|google (us english|हिन्दी|বাংলা|தமிழ்|తెలుగు|मराठी|ગુજરાતી|ಕನ್ನಡ|മലയാളം)/i;
const MALE_VOICE =
  /\bmale\b|ravi|prabhat|hemant|madhur|valluvar|mohan|david|mark|guy|ryan|daniel|rishi|george|james|thomas|fred|alex|aaron|arthur|oliver/i;

/** The device voice for a language: a female one where there is one, never a known male one first. */
export function pickVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | null {
  const base = lang.split("-")[0].toLowerCase();
  const exact = voices.filter((v) => v.lang.toLowerCase().replace("_", "-") === lang.toLowerCase());
  const near = voices.filter((v) => v.lang.toLowerCase().startsWith(base));
  for (const group of [exact, near]) {
    const female = group.find((v) => FEMALE_VOICE.test(v.name));
    if (female) return female;
    const notMale = group.find((v) => !MALE_VOICE.test(v.name));
    if (notMale) return notMale;
  }
  return exact[0] ?? near[0] ?? null;
}

/** Reads text aloud in the chosen language, with the closest (female) voice the device has. */
export function speak(raw: string, lang: string, onEnd?: () => void) {
  if (!canSpeak()) return;
  // The device's voice says the company's name properly too.
  const text = pronounce(raw, lang);
  const synth = window.speechSynthesis;
  synth.cancel();
  const voice = pickVoice(synth.getVoices(), lang);
  // Long replies are spoken sentence by sentence: some browsers stop speaking after about 15 seconds.
  const parts = speakable(text).match(/[^.!?।]+[.!?।]*/g) ?? [];
  if (!parts.length) onEnd?.();
  parts.forEach((part, i) => {
    const u = new SpeechSynthesisUtterance(part.trim());
    u.lang = lang;
    if (voice) u.voice = voice;
    u.rate = 1;
    if (i === parts.length - 1 && onEnd) u.onend = u.onerror = () => onEnd();
    synth.speak(u);
  });
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}

// ------------------------------------------------------------------ server voice (Sarvam)

/** The best recording format this browser makes; Sarvam reads WebM, Ogg and MP4 audio. */
function recordingType(): string {
  if (typeof MediaRecorder === "undefined") return "";
  for (const t of ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4"])
    if (MediaRecorder.isTypeSupported(t)) return t;
  return "";
}

export const canRecord = () =>
  typeof window !== "undefined" && !!navigator.mediaDevices?.getUserMedia && recordingType() !== "";

export type Recording = {
  /** Resolves with the speech (one part per 25 seconds), or null when nothing was said. */
  result: Promise<Blob[] | null>;
  /** Stop now and keep what was said. */
  stop: () => void;
  /** Stop now and throw it away. */
  cancel: () => void;
};

/** Sarvam transcribes up to 30 seconds per request: longer speech is recorded in parts. */
const PART_MS = 25_000;

/**
 * Records one turn of speech and decides by itself when the visitor has finished (voice activity
 * detection):
 *
 * - it listens to the speech band only (300 to 3,400 Hz), so fans, hum and hiss are ignored;
 * - it keeps learning the room's background level, so a noisy or quiet room both work;
 * - speech has to rise clearly above that level to start a turn, but only a little to keep it going
 *   (hysteresis), so soft syllables and trailing words are not cut off;
 * - the turn ends only after `endSilenceMs` of quiet (a natural pause to think is shorter), or when
 *   the visitor taps to stop; nobody speaking for `waitMs` gives null.
 *
 * Long speech is split into parts of about 25 seconds at a pause, each a complete file, because
 * Sarvam takes 30 seconds per request; the parts are transcribed in order and joined.
 */
/** The room's background as the detector measures it: its usual level and how much it wobbles. */
export type Background = { noise: number; wobble: number };

/** How long each turn only listens to the room before speech may start it. */
const WARM_UP_MS = 400;

/**
 * The microphone, set up for speech: echo cancellation (so the assistant's own voice is not heard),
 * noise suppression, and no automatic gain, which turns the room up as soon as the visitor stops,
 * looks like more speech and keeps the turn open. (Tried for far-away speakers on 2026-10-07: it did
 * not make quiet speech any easier to understand, so it stays off.)
 */
export function openMic(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false, channelCount: 1 },
  });
}

export function recordUtterance(
  opts: {
    endSilenceMs?: number;
    waitMs?: number;
    maxMs?: number;
    onLevel?: (level: number) => void;
    onSpeech?: () => void;
    /**
     * Listening while the assistant is talking, for the visitor to cut in (voice conversation): the
     * mic stays open with no time limit, speech must be clearer and longer to count (how much depends
     * on the sensitivity), and the last second or so before it is kept, so the first words are not lost.
     */
    bargeIn?: "low" | "medium" | "high";
    /**
     * A microphone already open (voice conversation keeps one for the whole call): no new permission
     * prompt or start-up delay per turn, and it is left open afterwards.
     */
    stream?: MediaStream;
    /** How far away speech may come from (Admin → Voice → Microphone range); "far" hears softer voices. */
    range?: "close" | "normal" | "far";
    /**
     * How loud (dB) the visitor speaks, from earlier turns of the call: speech 12 dB or more quieter
     * than that (people talking further away, a TV) does not start a turn.
     */
    voiceDb?: number;
    /** Told, at the end, how loud (dB) the visitor spoke this turn, for the next turn's voiceDb. */
    onSpeechLevel?: (db: number) => void;
    /** The room's background from the previous turn of the call, so it is not learnt from zero again. */
    background?: Background;
    /** Told, at the end, the room's background, to pass to the next turn. */
    onBackground?: (background: Background) => void;
  } = {},
): Recording {
  const { endSilenceMs = 1500, maxMs = 120_000 } = opts;
  const waitMs = opts.bargeIn ? Infinity : (opts.waitMs ?? 10_000);
  // [minimum rise above the background, rise in multiples of its wobble, 40 ms ticks of speech needed]
  const strictness: Record<string, [number, number, number]> = {
    low: [30, 8, 10],
    medium: [22, 6, 7],
    high: [15, 5, 4],
  };
  // A normal turn: how far above the room's background speech must rise, by microphone range.
  const ranges: Record<string, [number, number, number]> = { close: [20, 6, 4], normal: [14, 5, 3], far: [9, 4, 3] };
  const [rise, wobbles, ticks] = (opts.bargeIn && strictness[opts.bargeIn]) || ranges[opts.range ?? "normal"];
  let finishFn: (keep: boolean) => void = () => {};
  const result = new Promise<Blob[] | null>((resolve, reject) => {
    (opts.stream ? Promise.resolve(opts.stream) : openMic())
      .then((stream) => {
        const type = recordingType();
        // Each part of the recording, numbered, so the ones from before the visitor cut in can be dropped.
        const parts: { no: number; blob: Blob }[] = [];
        let partNo = 0;
        let keepFrom = 0;
        let recorder: MediaRecorder;
        let partStart = performance.now();
        let pending = 0;
        let keep = true;
        let done = false;

        const startPart = () => {
          const chunks: Blob[] = [];
          const no = ++partNo;
          const r = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
          r.ondataavailable = (ev) => ev.data.size && chunks.push(ev.data);
          r.onstop = () => {
            if (chunks.length) parts.push({ no, blob: new Blob(chunks, { type: r.mimeType || type || "audio/webm" }) });
            pending--;
            if (done && pending === 0) wrapUp();
          };
          pending++;
          r.start(200);
          recorder = r;
          partStart = performance.now();
        };

        // The analyser: speech-band energy, smoothed.
        const ctx = new AudioContext();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.2;
        ctx.createMediaStreamSource(stream).connect(analyser);
        const bins = new Uint8Array(analyser.frequencyBinCount);
        const dbBins = new Float32Array(analyser.frequencyBinCount);
        const hz = ctx.sampleRate / analyser.fftSize;
        const lo = Math.max(1, Math.floor(300 / hz));
        const hi = Math.min(bins.length - 1, Math.ceil(3400 / hz));

        const started = performance.now();
        // The room's background: its average level and how much it normally wobbles, learnt from
        // the moments nobody is speaking. Speech must rise clearly above both.
        let noise = opts.background?.noise ?? -1;
        let wobble = opts.background?.wobble ?? 2;
        // The speech band's power in decibels, smoothed, and the visitor's average while speaking.
        let db = -100;
        // How loud the visitor's speech is as it begins (the loudest moment of its first half second):
        // compared with how other speech begins, which is like with like.
        let onsetDb = -Infinity;
        let spokeAt = 0;
        let level = 0;
        let above = 0;
        let spoke = false;
        let lastVoice = started;
        // The visitor's own speaking level, and the last moment they were clearly speaking.
        let speech = 0;
        let lastClear = started;
        // The last 1.2 s of levels: a steady sound (fan, AC, hum) is flat, speech rises and falls.
        const recent: number[] = [];
        // How long they have actually spoken: a short answer ("yes", a name, a city) ends sooner.
        let voicedMs = 0;

        const wrapUp = () => {
          clearInterval(timer);
          if (!opts.stream) stream.getTracks().forEach((tr) => tr.stop());
          void ctx.close();
          const kept = parts
            .filter((x) => x.no >= keepFrom)
            .sort((x, y) => x.no - y.no)
            .map((x) => x.blob);
          if (spoke && onsetDb > -Infinity) opts.onSpeechLevel?.(onsetDb);
          if (noise >= 0) opts.onBackground?.({ noise, wobble });
          resolve(keep && spoke && kept.length ? kept : null);
        };
        const finish = (k: boolean) => {
          if (done) return;
          done = true;
          keep = k;
          if (recorder.state !== "inactive") recorder.stop();
          else if (pending === 0) wrapUp();
        };
        finishFn = finish;

        const timer = setInterval(() => {
          analyser.getByteFrequencyData(bins);
          analyser.getFloatFrequencyData(dbBins);
          let sum = 0;
          let power = 0;
          for (let i = lo; i <= hi; i++) {
            sum += bins[i];
            power += 10 ** (dbBins[i] / 10);
          }
          const energy = sum / (hi - lo + 1);
          level = level * 0.6 + energy * 0.4;
          db = db * 0.6 + 10 * Math.log10(power / (hi - lo + 1) + 1e-12) * 0.4;
          const now = performance.now();
          // The first moments of a turn: the analyser is still settling (its level climbs from zero,
          // which looked like someone starting to speak), so only the background is learnt.
          if (now - started < WARM_UP_MS) {
            noise = noise < 0 ? level : opts.background ? noise : noise + (level - noise) * 0.35;
            opts.onLevel?.(0);
            return;
          }
          if (noise < 0) noise = level;
          const startAt = noise + Math.max(rise, wobble * wobbles);
          // Still speaking: a softer, farther voice dips lower mid-sentence, so "far" keeps it open longer.
          const [keepRise, keepWobbles] = { close: [10, 3.5], normal: [8, 3], far: [5, 2.5] }[
            opts.range ?? "normal"
          ] ?? [8, 3];
          const keepAt = noise + Math.max(keepRise, wobble * keepWobbles);
          // Learn the background only from quiet moments: quickly at first, slowly afterwards.
          if (level < keepAt) {
            const rate = now - started < 600 ? 0.25 : 0.04;
            noise += (level - noise) * rate;
            wobble += (Math.abs(level - noise) - wobble) * rate;
          }
          // A sound that has stayed level for 1.2 s is not speech: it becomes the new background, so a
          // fan or AC switching on can neither start a turn nor keep one open.
          recent.push(level);
          if (recent.length > 30) recent.shift();
          if (recent.length === 30) {
            const mean = recent.reduce((x, y) => x + y, 0) / 30;
            const spread = Math.sqrt(recent.reduce((x, y) => x + (y - mean) ** 2, 0) / 30);
            if (mean > noise && spread < Math.max(2.5, mean * 0.07)) {
              noise = mean;
              wobble = Math.max(2, spread);
              speech = 0;
            }
          }
          opts.onLevel?.(Math.max(0, Math.min(1, (level - noise) / 60)));

          if (!spoke) {
            // About 120 ms of clear speech starts the turn (longer when cutting in); a click does not.
            // Clearly above the background, and (later in a call) not much quieter than the visitor.
            const loudEnough = opts.voiceDb === undefined || db > opts.voiceDb - 10;
            above = level > startAt && loudEnough ? above + 1 : 0;
            if (above >= ticks) {
              spoke = true;
              spokeAt = now;
              onsetDb = db;
              lastVoice = now;
              // Cutting in: keep this part and, if it only just began, the one before it.
              if (opts.bargeIn) keepFrom = now - partStart < 600 ? partNo - 1 : partNo;
              opts.onSpeech?.();
            } else if (now - started > waitMs) return finish(false);
            else if (opts.bargeIn && now - partStart > 1500) {
              // While waiting, start a fresh part every 1.5 s, so little of the assistant's voice is kept.
              recorder.stop();
              startPart();
            }
            return;
          }
          if (now - spokeAt < 500) onsetDb = Math.max(onsetDb, db);
          if (level > startAt) {
            speech = speech ? speech * 0.9 + level * 0.1 : level;

            lastClear = now;
          }
          // Still speaking: above the background, and not far below their own voice. A room that got
          // louder (a fan, a TV) is above the background but well below the voice, so it ends the turn.
          const ownVoiceFloor = speech ? noise + (speech - noise) * 0.3 : keepAt;
          if (level > keepAt && level > ownVoiceFloor) {
            lastVoice = now;
            voicedMs += 40;
          }
          const quietFor = now - lastVoice;
          const endAfter = voicedMs < 900 ? Math.min(endSilenceMs, 1000) : endSilenceMs;
          if (quietFor > endAfter) return finish(true);
          // Nothing clearly spoken for a long while also ends it, whatever the room is doing.
          if (now - lastClear > endSilenceMs * 2.2) return finish(true);
          if (now - started > maxMs) return finish(true);
          // Start a new part at a short pause once this one is long, or at 28 s whatever happens.
          const partFor = now - partStart;
          if ((partFor > PART_MS && quietFor > 250) || partFor > 28_000) {
            recorder.stop();
            startPart();
          }
        }, 40);

        startPart();
      })
      .catch((err: Error) => reject(err));
  });
  return { result, stop: () => finishFn(true), cancel: () => finishFn(false) };
}

/** Sends the recording (all its parts, in order) to the server (Sarvam) and returns the words. */
/** What the visitor said, and the language Sarvam heard it in (our code, e.g. "or-IN"), if it said. */
export type Heard = { text: string; language: string | null };

export async function transcribe(audio: Blob | Blob[], lang: string): Promise<Heard> {
  const parts = (Array.isArray(audio) ? audio : [audio]).filter((part) => part.size >= 800);
  // All parts at once (a long answer, or the second before the visitor cut in), joined in order.
  const heard = await Promise.all(
    parts.map(async (part) => {
      const form = new FormData();
      form.set("audio", part, "speech");
      form.set("language", lang);
      const res = await fetch("/api/voice/stt/", { method: "POST", body: form });
      const data = (await res.json().catch(() => ({}))) as { text?: string; language?: string | null; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Speech recognition failed.");
      return { text: data.text?.trim() ?? "", language: data.language ?? null };
    }),
  );
  const said = heard.filter((h) => h.text);
  return { text: said.map((h) => h.text).join(" "), language: said.findLast((h) => h.language)?.language ?? null };
}

/** A reply split into pieces of a sentence or two, so the first one can play at once. */
export function speechChunks(text: string, max = 380): string[] {
  const sentences = speakable(text).match(/[^.!?।\n]+[.!?।]*/g) ?? [];
  const out: string[] = [];
  let cur = "";
  for (const s of sentences.map((x) => x.trim()).filter(Boolean)) {
    if (cur && (cur + " " + s).length > max) {
      out.push(cur);
      cur = s;
    } else cur = cur ? `${cur} ${s}` : s;
    // The first piece stays short, so speech starts quickly.
    if (out.length === 0 && cur.length > 120) {
      out.push(cur);
      cur = "";
    }
  }
  if (cur) out.push(cur);
  return out.map((c) => c.slice(0, 780));
}

/**
 * Speaks a reply with the server voice: fetches the pieces one after another (the next while the
 * current one plays) and plays them in order. stop() silences it at once.
 */
export class ServerSpeaker {
  private audio: HTMLAudioElement | null = null;
  private controller: AbortController | null = null;
  private stopped = false;

  /** Which speak() is current: a newer call (or stop) retires every older one. */
  private generation = 0;

  /**
   * Speaks `text` in the server voice, one sentence or two at a time. Only one reply ever plays:
   * a new speak() or stop() silences the previous one, and a cancelled request is never mistaken
   * for a failure (that used to start the browser's voice on top of the new one). Only when the
   * server voice really fails is that one piece read by the browser's voice instead.
   */
  async speak(text: string, lang: string, opts: { voice?: string; pace?: number } = {}): Promise<void> {
    this.stop();
    const mine = ++this.generation;
    this.stopped = false;
    const live = () => mine === this.generation && !this.stopped;
    const controller = new AbortController();
    this.controller = controller;
    const fetchPiece = async (piece: string): Promise<string | null> => {
      try {
        const res = await fetch("/api/voice/tts/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: piece,
            language: languageOfText(piece, lang),
            voice: opts.voice,
            pace: opts.pace,
          }),
          signal: controller.signal,
        });
        return res.ok ? URL.createObjectURL(await res.blob()) : null;
      } catch {
        return null;
      }
    };
    const pieces = speechChunks(text);
    let next = pieces.length ? fetchPiece(pieces[0]) : null;
    for (let i = 0; i < pieces.length; i++) {
      const url = await next;
      if (!live()) {
        if (url) URL.revokeObjectURL(url);
        break;
      }
      next = i + 1 < pieces.length ? fetchPiece(pieces[i + 1]) : null;
      if (url) await this.play(url);
      else if (canSpeak())
        await new Promise<void>((resolve) => speak(pieces[i], languageOfText(pieces[i], lang), resolve));
      if (!live()) break;
    }
    next?.then((u) => u && URL.revokeObjectURL(u));
  }

  private play(url: string) {
    return new Promise<void>((resolve) => {
      const a = new Audio(url);
      this.audio = a;
      a.onended =
        a.onerror =
        a.onpause =
          () => {
            URL.revokeObjectURL(url);
            resolve();
          };
      a.play().catch(() => resolve());
    });
  }

  stop() {
    this.stopped = true;
    this.generation++;
    this.controller?.abort();
    this.controller = null;
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      this.audio = null;
    }
    stopSpeaking();
  }
}

/**
 * Speaks a reply while it is still being written: words go in as they arrive (push), each sentence
 * is spoken as soon as it is complete (with the server voice, the next sentence's audio is fetched
 * while the current one plays), and `done` resolves when everything has been said. stop() silences
 * it at once; replace() starts again with corrected text.
 */
export class StreamSpeaker {
  private buffer = "";
  private queue: string[] = [];
  private ended = false;
  private stopped = false;
  private busy = false;
  private started = false;
  /** Bumped by every halt, so a loop that was waiting on audio from before knows to give up. */
  private generation = 0;
  private audio: HTMLAudioElement | null = null;
  private controller = new AbortController();
  /** Audio already asked for, by sentence: fetched the moment a sentence is complete. */
  private early = new Map<string, Promise<string | null>>();
  private finish: () => void = () => {};
  readonly done: Promise<void>;

  constructor(
    private lang: string,
    private server: boolean,
    private onStart?: () => void,
  ) {
    this.done = new Promise((r) => (this.finish = r));
  }

  push(delta: string) {
    if (this.stopped) return;
    this.buffer += delta;
    // Whole sentences go to the queue; the first may be short, so speech starts quickly.
    const re = /^[\s\S]*?[.!?।](?=\s|$)|^[\s\S]*?\n/;
    let m: RegExpMatchArray | null;
    while ((m = this.buffer.match(re))) {
      const sentence = m[0];
      const minLength = this.started || this.queue.length ? 40 : 12;
      if (sentence.trim().length < minLength && this.buffer.length < 200) break;
      this.queue.push(sentence);
      this.buffer = this.buffer.slice(sentence.length);
    }
    // The very first words go as soon as there is a phrase, at a comma, rather than a whole sentence,
    // so the visitor hears the answer begin sooner.
    if (!this.started && !this.queue.length && this.buffer.length >= 60) {
      const at = this.buffer.slice(25).search(/[,;:]\s/);
      if (at >= 0) {
        const cut = 25 + at + 1;
        this.queue.push(this.buffer.slice(0, cut));
        this.buffer = this.buffer.slice(cut);
      }
    }
    this.fetchEarly();
    void this.pump();
  }

  end() {
    if (this.buffer.trim()) this.queue.push(this.buffer);
    this.buffer = "";
    this.ended = true;
    this.fetchEarly();
    void this.pump();
  }

  replace(text: string) {
    this.halt();
    this.stopped = false;
    this.controller = new AbortController();
    this.queue = [];
    this.buffer = "";
    this.ended = false;
    this.push(text);
    this.end();
  }

  stop() {
    this.halt();
    this.finish();
  }

  private halt() {
    this.stopped = true;
    this.generation++;
    this.busy = false;
    this.controller.abort();
    this.audio?.pause();
    this.audio = null;
    // Audio fetched for sentences that will not be spoken now.
    for (const url of this.early.values()) void url.then((u) => u && URL.revokeObjectURL(u));
    this.early.clear();
    if (!this.server) stopSpeaking();
  }

  /** Starts fetching the audio of every queued sentence not asked for yet (server voice). */
  private fetchEarly() {
    if (!this.server || this.stopped) return;
    for (const raw of this.queue) {
      const text = speakable(raw);
      if (text && !this.early.has(text)) this.early.set(text, this.fetchAudio(text));
    }
  }

  private fetchAudio(text: string): Promise<string | null> {
    return fetch("/api/voice/tts/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Each piece in the language it is written in (the reply may have switched to Odia, say).
      body: JSON.stringify({ text: text.slice(0, 780), language: languageOfText(text, this.lang) }),
      signal: this.controller.signal,
    })
      .then(async (res) => (res.ok ? URL.createObjectURL(await res.blob()) : null))
      .catch(() => null);
  }

  private async pump() {
    if (this.busy) return;
    this.busy = true;
    const mine = this.generation;
    const live = () => mine === this.generation && !this.stopped;
    while (live() && this.queue.length) {
      const text = speakable(this.queue.shift() ?? "");
      if (!text) continue;
      if (!this.started) {
        this.started = true;
        this.onStart?.();
      }
      if (this.server) {
        const url = await (this.early.get(text) ?? this.fetchAudio(text));
        this.early.delete(text);
        if (!live()) break;
        if (url) await this.play(url);
        else if (canSpeak()) await new Promise<void>((r) => speak(text, languageOfText(text, this.lang), r));
      } else if (canSpeak()) {
        await new Promise<void>((r) => speak(text, languageOfText(text, this.lang), r));
      }
    }
    // A halted loop leaves the speaker to whatever started after it.
    if (mine !== this.generation) return;
    this.busy = false;
    if (this.stopped || (this.ended && !this.queue.length)) this.finish();
  }

  private play(url: string) {
    return new Promise<void>((resolve) => {
      const a = new Audio(url);
      this.audio = a;
      a.onended =
        a.onerror =
        a.onpause =
          () => {
            URL.revokeObjectURL(url);
            resolve();
          };
      a.play().catch(() => resolve());
    });
  }
}
