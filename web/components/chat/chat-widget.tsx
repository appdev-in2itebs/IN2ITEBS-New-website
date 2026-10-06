"use client";

import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  AudioLines,
  CheckCircle2,
  Languages,
  Loader2,
  MessageCircle,
  Mic,
  Paperclip,
  Send,
  Square,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { loadSiteConfig, type SiteConfig } from "./site-config";
import {
  ServerSpeaker,
  StreamSpeaker,
  canListen,
  canRecord,
  canSpeak,
  listen,
  recordUtterance,
  speak,
  stopSpeaking,
  transcribe,
  type Recording,
} from "./voice";
import { VoiceMode, type VoiceReply } from "./voice-mode";

type Link_ = { label: string; url: string };
type Opening = { id: string; title: string; location: string; employment_type: string };
type Action = { type: "cv_upload"; openingTitle?: string } | { type: "saved"; kind: "lead" | "application" };
type Message = {
  from: "bot" | "user";
  text: string;
  links?: Link_[];
  openings?: Opening[];
  suggestions?: string[];
  actions?: Action[];
  /** A CV picked for this message's upload button: its name once uploaded. */
  uploaded?: string;
  /** Set on a reply while it is still streaming in, to find it again. */
  sid?: number;
};

/** The steps of the client-details form, asked one at a time when the AI assistant is off. */
const STEPS = [
  { key: "name", ask: "What is your name?", optional: false },
  { key: "email", ask: "Thanks. What is your work email?", optional: false },
  { key: "company", ask: "Which company are you with?", optional: true },
  { key: "phone", ask: "A phone number we can call? (optional)", optional: true },
  { key: "requirement", ask: "Please describe your requirement in a sentence or two.", optional: false },
] as const;
type StepKey = (typeof STEPS)[number]["key"];

/** What to tell the visitor when the microphone does not work, by the browser's error code. */
const MIC_ERRORS: Record<string, string> = {
  "not-allowed":
    "I can't use your microphone yet. Click the microphone or lock icon in the address bar, allow the microphone for this site, then try again. You can always type instead.",
  "service-not-allowed":
    "Your browser does not allow speech recognition here. Please try Chrome or Edge, or type your message.",
  "audio-capture": "I couldn't find a working microphone. Check that one is connected and not used by another app.",
  network: "Speech recognition needs an internet connection. Please check it, or type your message.",
  "no-speech": "I didn't hear anything. Tap the microphone and start speaking, or type your message.",
  "language-not-supported": "Your browser can't listen in this language yet. Please type, or choose English for voice.",
  unsupported: "Your browser doesn't support voice input. Please use Chrome, Edge or Safari, or type your message.",
  "start-failed": "The microphone could not start. Please try again in a moment.",
};

const CV_MAX_BYTES = 5 * 1024 * 1024;

/** Why a picked file cannot be sent as a CV, in words for the candidate; null when it is fine. */
function cvProblem(file: File): string | null {
  if (!/\.(pdf|docx?)$/i.test(file.name))
    return `"${file.name}" is not a PDF or Word file. Please upload your CV as a PDF, DOC or DOCX file under 5 MB.`;
  if (file.size === 0) return `"${file.name}" is empty. Please choose your CV again.`;
  if (file.size > CV_MAX_BYTES)
    return `Your CV "${file.name}" is ${(file.size / 1024 / 1024).toFixed(1)} MB. The CV must be under 5 MB: please upload a smaller PDF or Word file (for example, save it as PDF or remove large images) and try again.`;
  return null;
}

const STORE = "in2it-chat-v2";
const LANG_STORE = "in2it-chat-lang";
/** "1" when the visitor muted the chat's voice; remembered on this device. */
const MUTE_STORE = "in2it-chat-muted";
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const phoneOk = (v: string) => /^[+()\d\s-]{6,20}$/.test(v);

/**
 * The website assistant: a launcher in the bottom-right corner and a chat panel.
 *
 * With the AI assistant on (/admin/assistant), /api/chat runs the agent: it answers in the chosen
 * language, collects a client's requirement or a candidate's application step by step and files it
 * in /admin. The visitor can talk instead of typing (microphone), hear the replies (speaker), and
 * upload a CV when asked. With the AI off, answers come from the FAQs and "Share my requirement"
 * opens a short step-by-step form.
 */
export function ChatWidget() {
  const [site, setSite] = useState<SiteConfig | null>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState<number | null>(null);
  const [details, setDetails] = useState<Partial<Record<StepKey, string>>>({});
  const [lang, setLang] = useState("en-IN");
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  /** Replies are read aloud as they arrive, until the visitor mutes the chat. */
  const [muted, setMuted] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);
  const [voiceModeOn, setVoiceModeOn] = useState(false);
  const serverSpeaker = useRef<ServerSpeaker | null>(null);
  const streamSpeaker = useRef<StreamSpeaker | null>(null);
  const recording = useRef<Recording | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const stopListening = useRef<(() => void) | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadFor = useRef<number | null>(null);

  const config = site?.chatbot ?? null;
  const ai = Boolean(site?.assistant?.ai);
  // Sarvam listens and speaks for the languages it supports; the browser does the rest.
  const serverVoice = site?.assistant?.voice === "server" && (site.assistant.serverVoiceLanguages ?? []).includes(lang);
  const mic = ai && Boolean(site?.assistant?.voiceInput) && (serverVoice ? canRecord() : canListen());
  const speaker = ai && Boolean(site?.assistant?.voiceOutput) && (serverVoice || canSpeak());
  const voiceModeAvailable = mic && speaker && site?.assistant?.voiceMode !== false;
  const endOfSpeech = site?.assistant?.endOfSpeechMs ?? 1500;

  /** Which message the Listen button is reading (its button shows Stop), or null. */
  const [reading, setReading] = useState<number | null>(null);
  const readTurn = useRef(0);

  /** Silences whichever voice is speaking. */
  const hush = useCallback(() => {
    readTurn.current++;
    setReading(null);
    streamSpeaker.current?.stop();
    streamSpeaker.current = null;
    serverSpeaker.current?.stop();
    stopSpeaking();
    setSpeaking(false);
  }, []);

  const languages = site?.assistant?.languages ?? [];

  useEffect(() => {
    loadSiteConfig().then((c) => c?.chatbot.enabled && setSite(c));
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE) ?? "null");
      if (saved?.messages?.length) {
        setMessages(saved.messages);
        setConversationId(saved.conversationId ?? null);
      }
      if (localStorage.getItem(MUTE_STORE) === "1") setMuted(true);
      const l = localStorage.getItem(LANG_STORE);
      if (l) setLang(l);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (messages.length)
        sessionStorage.setItem(STORE, JSON.stringify({ messages: messages.slice(-80), conversationId }));
    } catch {}
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, conversationId, busy]);

  useEffect(() => {
    if (!open) {
      hush();
      stopListening.current?.();
      recording.current?.cancel();
      setVoiceModeOn(false);
      return;
    }
    if (config && messages.length === 0)
      setMessages([{ from: "bot", text: config.greeting, suggestions: config.quickReplies }]);
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, config, messages.length, hush]);

  const push = (m: Message) => setMessages((all) => [...all, m]);

  /**
   * Speaks a reply: Sarvam's voice where it supports the language, else the browser's. Whatever is
   * already speaking stops first, so two voices never play over each other; a later Listen click
   * retires an earlier one, which then never falls back to another voice.
   */
  const say = useCallback(
    async (text: string, index: number | null = null) => {
      hush();
      const mine = ++readTurn.current;
      setReading(index);
      setSpeaking(true);
      try {
        if (serverVoice) {
          serverSpeaker.current ??= new ServerSpeaker();
          await serverSpeaker.current.speak(text, lang);
        } else if (canSpeak()) await new Promise<void>((resolve) => speak(text, lang, resolve));
      } finally {
        if (mine === readTurn.current) {
          setSpeaking(false);
          setReading(null);
        }
      }
    },
    [lang, serverVoice, hush],
  );

  // ---------------------------------------------------------------- the rule-based form (AI off)

  const startDetails = useCallback((intro?: string) => {
    setDetails({});
    setStep(0);
    push({ from: "bot", text: `${intro ? intro + " " : ""}${STEPS[0].ask}` });
  }, []);

  async function submitDetails(all: Partial<Record<StepKey, string>>) {
    setBusy(true);
    try {
      const res = await fetch("/api/chat/lead/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, ...all }),
      });
      const data = await res.json().catch(() => ({}));
      push(
        res.ok
          ? {
              from: "bot",
              text: `Thank you, ${all.name?.split(" ")[0] ?? "there"}. Your requirement has reached our team and a consultant will contact you at ${all.email}.`,
              suggestions: config?.quickReplies.slice(0, 3),
            }
          : { from: "bot", text: data.error ?? "Sorry, that did not go through. Please email info@in2itebs.com." },
      );
    } catch {
      push({ from: "bot", text: "Sorry, that did not go through. Please email info@in2itebs.com." });
    } finally {
      setBusy(false);
      setStep(null);
    }
  }

  async function answerStep(value: string) {
    if (step === null) return;
    const current = STEPS[step];
    const v = value.trim();
    if (!v && !current.optional) return push({ from: "bot", text: "This one is needed. " + current.ask });
    if (current.key === "email" && !emailOk(v))
      return push({ from: "bot", text: "That email does not look right. Please check it." });
    if (current.key === "phone" && v && !phoneOk(v))
      return push({ from: "bot", text: "Please use digits only (you can add + and spaces), or type skip." });
    if (current.key === "name" && v.length < 2) return push({ from: "bot", text: "Please share your full name." });
    if (current.key === "requirement" && v.length < 5)
      return push({ from: "bot", text: "Could you add a little more detail?" });
    const next = { ...details, [current.key]: v };
    setDetails(next);
    if (step + 1 < STEPS.length) {
      setStep(step + 1);
      push({ from: "bot", text: STEPS[step + 1].ask, suggestions: STEPS[step + 1].optional ? ["Skip"] : undefined });
    } else await submitDetails(next);
  }

  // ---------------------------------------------------------------- sending

  async function send(
    raw: string,
    opts: { spoken?: boolean; silent?: boolean; voice?: boolean; onSpeaking?: () => void } = {},
  ): Promise<VoiceReply> {
    const text = raw.trim();
    if (!text || busy) return null;
    setInput("");
    hush();
    push({ from: "user", text });
    if (step !== null) {
      await answerStep(/^skip$/i.test(text) ? "" : text);
      return null;
    }
    setBusy(true);
    // Spoken to, it speaks back (voice conversation always); otherwise only when the speaker is on.
    // Every reply is spoken as it is written, in the admin's voice, unless the visitor muted the
    // chat; voice conversation always speaks.
    const speakIt = Boolean(opts.voice) || (!opts.silent && speaker && !muted);
    const voice = speakIt
      ? new StreamSpeaker(lang, serverVoice, () => {
          setSpeaking(true);
          opts.onSpeaking?.();
        })
      : null;
    streamSpeaker.current = voice;
    voice?.done.then(() => setSpeaking(false));
    const sid = Date.now();
    let shown = "";
    const show = (next: string) => {
      shown = next;
      setMessages((all) =>
        all.some((m) => m.sid === sid)
          ? all.map((m) => (m.sid === sid ? { ...m, text: next } : m))
          : [...all, { from: "bot", text: next, sid }],
      );
    };
    try {
      const res = await fetch("/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationId,
          pageUrl: location.pathname,
          language: lang,
          channel: opts.voice ? "voice" : "text",
          stream: true,
        }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        voice?.stop();
        push({ from: "bot", text: data.error ?? "Sorry, something went wrong. Please try again." });
        return null;
      }
      // The answer arrives as it is written: one JSON event per line.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let done: { conversationId?: string | null; reply: Record<string, unknown> } | null = null;
      for (;;) {
        const chunk = await reader.read();
        if (chunk.done) break;
        buffer += decoder.decode(chunk.value, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf("\n")) >= 0) {
          const line = buffer.slice(0, nl).trim();
          buffer = buffer.slice(nl + 1);
          if (!line) continue;
          let ev: {
            t: string;
            text?: string;
            error?: string;
            conversationId?: string | null;
            reply?: Record<string, unknown>;
          };
          try {
            ev = JSON.parse(line);
          } catch {
            continue;
          }
          if (ev.t === "start" && ev.conversationId) setConversationId(ev.conversationId);
          else if (ev.t === "delta" && ev.text) {
            show(shown + ev.text);
            voice?.push(ev.text);
          } else if (ev.t === "replace" && typeof ev.text === "string") {
            show(ev.text);
            voice?.replace(ev.text);
          } else if (ev.t === "error") {
            voice?.stop();
            push({ from: "bot", text: ev.error ?? "Sorry, something went wrong. Please try again." });
            return null;
          } else if (ev.t === "done" && ev.reply) done = { conversationId: ev.conversationId, reply: ev.reply };
        }
      }
      if (!done) {
        voice?.stop();
        if (!shown) push({ from: "bot", text: "Sorry, the answer was interrupted. Please try again." });
        return null;
      }
      if (done.conversationId) setConversationId(done.conversationId);
      const r = done.reply as {
        text: string;
        links?: Link_[];
        openings?: Opening[];
        suggestions?: string[];
        actions?: Action[];
        action?: string;
      };
      // The server decides when the CV step has come (lib/assistant/agent.ts settleCvButton).
      const actions: Action[] = [...(r.actions ?? [])];
      const final: Message = {
        from: "bot",
        text: r.text,
        links: r.links,
        openings: r.openings,
        suggestions: r.suggestions,
        actions,
      };
      setMessages((all) =>
        all.some((m) => m.sid === sid) ? all.map((m) => (m.sid === sid ? final : m)) : [...all, final],
      );
      if (voice) {
        if (!shown) voice.push(r.text);
        voice.end();
      }
      if (r.action === "collect-lead") startDetails();
      return { text: r.text, needsCv: actions.some((a) => a.type === "cv_upload"), speech: voice?.done };
    } catch {
      voice?.stop();
      push({ from: "bot", text: "I could not reach the server. Please check your connection and try again." });
      return null;
    } finally {
      setBusy(false);
    }
  }

  function toggleMic() {
    if (listening) {
      stopListening.current?.();
      recording.current?.stop();
      return;
    }
    hush();
    setListening(true);
    if (serverVoice) {
      // Records until the visitor stops talking, then Sarvam turns it into text.
      const rec = recordUtterance({ endSilenceMs: endOfSpeech });
      recording.current = rec;
      rec.result
        .then(async (parts) => {
          recording.current = null;
          setListening(false);
          if (!parts) return push({ from: "bot", text: MIC_ERRORS["no-speech"] });
          setInput("…");
          const said = await transcribe(parts, lang);
          setInput("");
          if (said) void send(said, { spoken: true });
          else push({ from: "bot", text: MIC_ERRORS["no-speech"] });
        })
        .catch((e: Error) => {
          recording.current = null;
          setListening(false);
          setInput("");
          push({
            from: "bot",
            text: /NotAllowed|Permission/i.test(e.name + e.message)
              ? MIC_ERRORS["not-allowed"]
              : /NotFound/i.test(e.name)
                ? MIC_ERRORS["audio-capture"]
                : e.message || MIC_ERRORS["start-failed"],
          });
        });
      return;
    }
    stopListening.current = listen(
      lang,
      (t) => setInput(t),
      (finalText, error) => {
        setListening(false);
        stopListening.current = null;
        if (finalText) void send(finalText, { spoken: true });
        else if (error && MIC_ERRORS[error]) push({ from: "bot", text: MIC_ERRORS[error] });
      },
      endOfSpeech,
    );
  }

  async function uploadCv(file: File, index: number) {
    const problem = cvProblem(file);
    if (problem) {
      push({ from: "bot", text: problem, actions: [{ type: "cv_upload" }] });
      return;
    }
    if (!conversationId) {
      push({
        from: "bot",
        text: "Please send me a message first (for example, the role you are interested in), then upload your CV.",
      });
      return;
    }
    setUploading(index);
    try {
      const form = new FormData();
      form.set("conversationId", conversationId);
      form.set("cv", file);
      const res = await fetch("/api/chat/cv/", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        push({ from: "bot", text: data.error ?? "The upload did not work. Please try again." });
        return;
      }
      // Every upload button shown so far now says the CV arrived.
      const name = data.name ?? file.name;
      setMessages((all) =>
        all.map((m) => (m.actions?.some((a) => a.type === "cv_upload") && !m.uploaded ? { ...m, uploaded: name } : m)),
      );
      await send(`I have uploaded my CV (${data.name ?? file.name}).`);
    } catch {
      push({ from: "bot", text: "The upload did not work. Please check your connection and try again." });
    } finally {
      setUploading(null);
    }
  }

  function chooseLanguage(code: string) {
    setLang(code);
    try {
      localStorage.setItem(LANG_STORE, code);
    } catch {}
    hush();
  }

  if (!config) return null;
  const last = messages[messages.length - 1];
  // Only the newest CV request shows an upload button; older ones disappear.
  const cvAt = messages.reduce((at, m, i) => (m.actions?.some((a) => a.type === "cv_upload") ? i : at), -1);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="in2it-chat"
        aria-label={open ? "Close the assistant" : `Chat with ${config.name}`}
        data-chat-launcher
        className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-action text-on-action shadow-glass transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
      >
        {open ? <X size={24} aria-hidden /> : <MessageCircle size={26} aria-hidden />}
      </button>
      {open ? (
        <section
          id="in2it-chat"
          role="dialog"
          aria-label={config.name}
          data-chat-panel
          className="fixed bottom-24 right-5 z-40 flex h-[min(640px,calc(100svh-8rem))] w-[min(400px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-surface border border-border-subtle bg-surface shadow-glass"
        >
          {voiceModeOn ? (
            <VoiceMode
              lang={lang}
              serverVoice={serverVoice}
              endSilenceMs={endOfSpeech}
              name={config.name}
              ask={(text, onSpeaking) => send(text, { spoken: true, voice: true, onSpeaking })}
              stopSpeaking={hush}
              onClose={(note) => {
                setVoiceModeOn(false);
                hush();
                if (note) push({ from: "bot", text: note });
              }}
            />
          ) : null}
          <header className="theme-on-brand flex items-center gap-2 bg-brand px-4 py-3 text-on-brand">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{config.name}</p>
              <p className="flex items-center gap-1.5 text-xs text-on-brand/70">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-green-400" />
                {speaking ? "Speaking…" : listening ? "Listening…" : ai ? "Online" : "Usually replies instantly"}
              </p>
            </div>
            {ai && languages.length > 1 ? (
              <label
                className="relative flex items-center rounded-full bg-on-brand/10 pl-2 hover:bg-on-brand/15"
                title="Language"
              >
                <Languages size={14} aria-hidden />
                <span className="sr-only">Language</span>
                <select
                  value={lang}
                  onChange={(e) => chooseLanguage(e.target.value)}
                  className="max-w-[7.5rem] cursor-pointer appearance-none bg-transparent py-1.5 pl-1.5 pr-2 text-xs font-semibold text-on-brand focus:outline-none [&>option]:text-foreground"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            {voiceModeAvailable && step === null ? (
              <button
                type="button"
                onClick={() => {
                  hush();
                  stopListening.current?.();
                  recording.current?.cancel();
                  setVoiceModeOn(true);
                }}
                aria-label="Start a voice conversation"
                title="Voice conversation: talk back and forth, hands-free"
                className="rounded-full p-1.5 hover:bg-on-brand/10"
              >
                <AudioLines size={18} aria-hidden />
              </button>
            ) : null}
            {speaker ? (
              <button
                type="button"
                onClick={() => {
                  const next = !muted;
                  if (next) hush();
                  setMuted(next);
                  try {
                    localStorage.setItem(MUTE_STORE, next ? "1" : "0");
                  } catch {}
                }}
                aria-pressed={muted}
                aria-label={muted ? "Unmute: read replies aloud" : "Mute the voice"}
                title={muted ? "Voice is off: replies are not read aloud" : "Voice is on: replies are read aloud"}
                className="rounded-full p-1.5 hover:bg-on-brand/10"
              >
                {muted ? <VolumeX size={18} aria-hidden /> : <Volume2 size={18} aria-hidden />}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="rounded-full p-1.5 hover:bg-on-brand/10"
            >
              <X size={18} aria-hidden />
            </button>
          </header>
          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex flex-col gap-2", m.from === "user" ? "items-end" : "items-start")}>
                <div
                  className={cn(
                    "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    m.from === "user"
                      ? "whitespace-pre-line rounded-br-sm bg-action text-on-action"
                      : "rounded-bl-sm bg-surface-subtle text-foreground",
                  )}
                >
                  {m.from === "bot" ? <ChatText text={m.text} /> : m.text}
                </div>
                {m.from === "bot" && speaker ? (
                  reading === i ? (
                    <button
                      type="button"
                      onClick={hush}
                      className="-mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-action"
                    >
                      <VolumeX size={12} aria-hidden /> Stop
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => say(m.text, i)}
                      className="-mt-1 inline-flex items-center gap-1 text-[11px] text-foreground-muted hover:text-action"
                    >
                      <Volume2 size={12} aria-hidden /> Listen
                    </button>
                  )
                ) : null}
                {m.actions?.map((a, k) =>
                  a.type === "cv_upload" ? (
                    i !== cvAt && !m.uploaded ? null : m.uploaded ? (
                      <p key={k} className="inline-flex items-center gap-1.5 text-xs font-semibold text-action">
                        <CheckCircle2 size={14} aria-hidden /> CV uploaded: {m.uploaded}
                      </p>
                    ) : (
                      <button
                        key={k}
                        type="button"
                        disabled={uploading !== null || busy}
                        onClick={() => {
                          uploadFor.current = i;
                          fileRef.current?.click();
                        }}
                        className="inline-flex items-center gap-2 rounded-full border border-action px-4 py-2 text-sm font-semibold text-action hover:bg-action/10 disabled:opacity-50"
                      >
                        {uploading === i ? (
                          <Loader2 size={15} className="animate-spin" aria-hidden />
                        ) : (
                          <Paperclip size={15} aria-hidden />
                        )}
                        {uploading === i ? "Uploading…" : "Upload your CV (PDF or Word, under 5 MB)"}
                      </button>
                    )
                  ) : (
                    <p
                      key={k}
                      className="inline-flex items-center gap-1.5 rounded-full bg-action/10 px-3 py-1 text-xs font-semibold text-action"
                    >
                      <CheckCircle2 size={14} aria-hidden />
                      {a.kind === "application" ? "Application submitted to HR" : "Sent to our team"}
                    </p>
                  ),
                )}
                {m.openings?.length ? (
                  <ul className="w-full space-y-1.5">
                    {m.openings.map((o) => (
                      <li key={o.id}>
                        <Link
                          href={`/careers/current-openings/${o.id}/`}
                          className="block rounded-xl border border-border-subtle px-3 py-2 text-sm hover:border-action"
                        >
                          <span className="font-semibold text-foreground">{o.title}</span>
                          <span className="block text-xs text-foreground-muted">
                            {o.employment_type} · {o.location} · Apply
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {m.links?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {m.links.map((l) => (
                      <Link
                        key={l.url}
                        href={l.url}
                        className="inline-flex items-center gap-1 rounded-full border border-action/40 px-3 py-1 text-xs font-semibold text-action hover:bg-action/10"
                      >
                        {l.label} <ArrowUpRight size={12} aria-hidden />
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            {busy && last?.from === "user" ? (
              <div
                className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-surface-subtle px-3.5 py-3"
                aria-label="Typing"
              >
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    aria-hidden
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground-muted"
                    style={{ animationDelay: `${d * 150}ms` }}
                  />
                ))}
              </div>
            ) : null}
          </div>
          {last?.from === "bot" && last.suggestions?.length && !busy ? (
            <div className="flex flex-wrap gap-2 border-t border-border-subtle px-4 py-2.5">
              {last.suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full bg-surface-subtle px-3 py-1.5 text-xs font-medium text-foreground hover:bg-action/10 hover:text-action"
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2 border-t border-border-subtle p-3"
          >
            <label htmlFor="in2it-chat-input" className="sr-only">
              Your message
            </label>
            <textarea
              id="in2it-chat-input"
              ref={inputRef}
              value={input}
              rows={1}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              maxLength={step !== null && STEPS[step].key === "requirement" ? 3000 : ai ? 2000 : 500}
              placeholder={
                listening
                  ? "Listening… speak now"
                  : step !== null
                    ? STEPS[step].ask
                    : ai
                      ? "Type or tap the mic…"
                      : "Type your question…"
              }
              className="max-h-28 min-h-11 flex-1 resize-none rounded-3xl border border-border-subtle bg-canvas px-4 py-3 text-sm leading-snug text-foreground placeholder:text-foreground-muted focus:border-action focus:outline-none"
            />
            {mic && step === null ? (
              <button
                type="button"
                onClick={toggleMic}
                disabled={busy}
                aria-pressed={listening}
                aria-label={listening ? "Stop listening" : "Speak your message"}
                title={listening ? "Stop" : "Speak"}
                className={cn(
                  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors disabled:opacity-40",
                  listening
                    ? "animate-pulse border-red-600 bg-red-600 text-on-action"
                    : "border-border-subtle text-foreground hover:border-action hover:text-action",
                )}
              >
                {listening ? <Square size={16} aria-hidden /> : <Mic size={18} aria-hidden />}
              </button>
            ) : null}
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-action text-on-action disabled:opacity-40"
            >
              <Send size={18} aria-hidden />
            </button>
          </form>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file && uploadFor.current !== null) void uploadCv(file, uploadFor.current);
            }}
          />
          <p className="px-4 pb-2 text-[11px] leading-snug text-foreground-muted">
            {ai ? "AI assistant: answers may contain mistakes. " : ""}Conversations are stored to improve our answers.
            See our{" "}
            <Link href="/legal/privacy-notice/" className="underline">
              privacy notice
            </Link>
            .
          </p>
        </section>
      ) : null}
    </>
  );
}

/**
 * The assistant's reply: paragraphs, "- " bullets, **bold** and [links](/path/). Links stay on this
 * site (and mail and phone links); anything else is shown as plain text.
 */
function ChatText({ text }: { text: string }) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n\s*\n/);
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n").filter((l) => l.trim());
        const bullets = lines.length > 0 && lines.every((l) => /^\s*([-*•]|\d+[.)])\s+/.test(l));
        return bullets ? (
          <ul key={i} className={cn("space-y-1", i && "mt-2")}>
            {lines.map((l, j) => (
              <li key={j} className="flex gap-2">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-action" />
                <span>{inline(l.replace(/^\s*([-*•]|\d+[.)])\s+/, ""))}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p key={i} className={cn(i && "mt-2")}>
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j ? <br /> : null}
                {inline(l)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={m.index}>{m[1]}</strong>);
    else {
      const href = m[3];
      const internal = /^\/(?!\/)/.test(href);
      out.push(
        internal ? (
          <Link key={m.index} href={href} className="font-semibold text-action underline underline-offset-2">
            {m[2]}
          </Link>
        ) : /^(mailto:|tel:)/.test(href) ? (
          <a key={m.index} href={href} className="font-semibold text-action underline underline-offset-2">
            {m[2]}
          </a>
        ) : (
          m[2]
        ),
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
