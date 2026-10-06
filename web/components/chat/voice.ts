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
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`#>]/g, "")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Reads text aloud in the chosen language, with the closest voice the device has. */
export function speak(text: string, lang: string, onEnd?: () => void) {
  if (!canSpeak()) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const voices = synth.getVoices();
  const base = lang.split("-")[0];
  const voice =
    voices.find((v) => v.lang.toLowerCase() === lang.toLowerCase()) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(base)) ??
    null;
  // Long replies are spoken sentence by sentence: some browsers stop speaking after about 15 seconds.
  const parts = speakable(text).match(/[^.!?।]+[.!?।]*/g) ?? [];
  parts.forEach((part, i) => {
    const u = new SpeechSynthesisUtterance(part.trim());
    u.lang = lang;
    if (voice) u.voice = voice;
    u.rate = 1;
    if (i === parts.length - 1 && onEnd) u.onend = onEnd;
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
export function recordUtterance(
  opts: {
    endSilenceMs?: number;
    waitMs?: number;
    maxMs?: number;
    onLevel?: (level: number) => void;
    onSpeech?: () => void;
  } = {},
): Recording {
  const { endSilenceMs = 1500, waitMs = 10_000, maxMs = 120_000 } = opts;
  let finishFn: (keep: boolean) => void = () => {};
  const result = new Promise<Blob[] | null>((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({
        // No automatic gain: it turns the room up as soon as the visitor stops, which looks like
        // more speech and keeps the turn open.
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false, channelCount: 1 },
      })
      .then((stream) => {
        const type = recordingType();
        const parts: Blob[] = [];
        let recorder: MediaRecorder;
        let partStart = performance.now();
        let pending = 0;
        let keep = true;
        let done = false;

        const startPart = () => {
          const chunks: Blob[] = [];
          const r = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
          r.ondataavailable = (ev) => ev.data.size && chunks.push(ev.data);
          r.onstop = () => {
            if (chunks.length) parts.push(new Blob(chunks, { type: r.mimeType || type || "audio/webm" }));
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
        const hz = ctx.sampleRate / analyser.fftSize;
        const lo = Math.max(1, Math.floor(300 / hz));
        const hi = Math.min(bins.length - 1, Math.ceil(3400 / hz));

        const started = performance.now();
        // The room's background: its average level and how much it normally wobbles, learnt from
        // the moments nobody is speaking. Speech must rise clearly above both.
        let noise = -1;
        let wobble = 2;
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
          stream.getTracks().forEach((tr) => tr.stop());
          void ctx.close();
          resolve(keep && spoke && parts.length ? parts : null);
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
          let sum = 0;
          for (let i = lo; i <= hi; i++) sum += bins[i];
          const energy = sum / (hi - lo + 1);
          level = level * 0.6 + energy * 0.4;
          const now = performance.now();
          if (noise < 0) noise = level;
          const startAt = noise + Math.max(14, wobble * 5);
          const keepAt = noise + Math.max(8, wobble * 3);
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
            // About 120 ms of clear speech starts the turn; a click or a bump does not.
            above = level > startAt ? above + 1 : 0;
            if (above >= 3) {
              spoke = true;
              lastVoice = now;
              opts.onSpeech?.();
            } else if (now - started > waitMs) return finish(false);
            return;
          }
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
export async function transcribe(audio: Blob | Blob[], lang: string): Promise<string> {
  const parts = Array.isArray(audio) ? audio : [audio];
  const words: string[] = [];
  for (const part of parts) {
    if (part.size < 800) continue;
    const form = new FormData();
    form.set("audio", part, "speech");
    form.set("language", lang);
    const res = await fetch("/api/voice/stt/", { method: "POST", body: form });
    const data = (await res.json().catch(() => ({}))) as { text?: string; error?: string };
    if (!res.ok) throw new Error(data.error ?? "Speech recognition failed.");
    if (data.text?.trim()) words.push(data.text.trim());
  }
  return words.join(" ");
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

  async speak(text: string, lang: string, opts: { voice?: string; pace?: number } = {}): Promise<void> {
    this.stop();
    this.stopped = false;
    const controller = new AbortController();
    this.controller = controller;
    const fetchPiece = async (piece: string): Promise<string | null> => {
      const res = await fetch("/api/voice/tts/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: piece, language: lang, voice: opts.voice, pace: opts.pace }),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error("voice unavailable");
      return URL.createObjectURL(await res.blob());
    };
    const pieces = speechChunks(text);
    let next = pieces.length ? fetchPiece(pieces[0]) : null;
    for (let i = 0; i < pieces.length && !this.stopped; i++) {
      const url = await next;
      next = i + 1 < pieces.length ? fetchPiece(pieces[i + 1]) : null;
      if (!url || this.stopped) break;
      await new Promise<void>((resolve) => {
        const a = new Audio(url);
        this.audio = a;
        a.onended = a.onerror = () => {
          URL.revokeObjectURL(url);
          resolve();
        };
        a.play().catch(() => resolve());
      });
    }
    next?.then((u) => u && URL.revokeObjectURL(u)).catch(() => {});
  }

  stop() {
    this.stopped = true;
    this.controller?.abort();
    this.controller = null;
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      this.audio = null;
    }
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
  private audio: HTMLAudioElement | null = null;
  private controller = new AbortController();
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
    void this.pump();
  }

  end() {
    if (this.buffer.trim()) this.queue.push(this.buffer);
    this.buffer = "";
    this.ended = true;
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
    this.controller.abort();
    this.audio?.pause();
    this.audio = null;
    if (!this.server) stopSpeaking();
  }

  private fetchAudio(text: string): Promise<string | null> {
    return fetch("/api/voice/tts/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.slice(0, 780), language: this.lang }),
      signal: this.controller.signal,
    })
      .then(async (res) => (res.ok ? URL.createObjectURL(await res.blob()) : null))
      .catch(() => null);
  }

  private async pump() {
    if (this.busy) return;
    this.busy = true;
    let prefetched: { text: string; url: Promise<string | null> } | null = null;
    while (!this.stopped && this.queue.length) {
      const text = speakable(this.queue.shift() ?? "");
      if (!text) continue;
      if (!this.started) {
        this.started = true;
        this.onStart?.();
      }
      if (this.server) {
        const url = prefetched && prefetched.text === text ? await prefetched.url : await this.fetchAudio(text);
        prefetched = null;
        const nextText = this.queue[0] ? speakable(this.queue[0]) : "";
        if (nextText) prefetched = { text: nextText, url: this.fetchAudio(nextText) };
        if (url && !this.stopped) await this.play(url);
        else if (!url && !this.stopped && canSpeak()) await new Promise<void>((r) => speak(text, this.lang, r));
      } else if (canSpeak()) {
        await new Promise<void>((r) => speak(text, this.lang, r));
      }
    }
    this.busy = false;
    if (this.stopped || (this.ended && !this.queue.length)) this.finish();
  }

  private play(url: string) {
    return new Promise<void>((resolve) => {
      const a = new Audio(url);
      this.audio = a;
      a.onended = a.onerror = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      a.play().catch(() => resolve());
    });
  }
}
