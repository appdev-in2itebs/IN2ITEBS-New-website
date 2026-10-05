"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, MessageCircle, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { loadSiteConfig, type SiteConfig } from "./site-config";

type Link_ = { label: string; url: string };
type Opening = { id: string; title: string; location: string; employment_type: string };
type Message = {
  from: "bot" | "user";
  text: string;
  links?: Link_[];
  openings?: Opening[];
  suggestions?: string[];
};

/** The steps of the client-details form, asked one at a time inside the chat. */
const STEPS = [
  { key: "name", ask: "What is your name?", optional: false },
  { key: "email", ask: "Thanks. What is your work email?", optional: false },
  { key: "company", ask: "Which company are you with?", optional: true },
  { key: "phone", ask: "A phone number we can call? (optional)", optional: true },
  { key: "requirement", ask: "Please describe your requirement in a sentence or two.", optional: false },
] as const;
type StepKey = (typeof STEPS)[number]["key"];

const STORE = "in2it-chat-v1";
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const phoneOk = (v: string) => /^[+()\d\s-]{6,20}$/.test(v);

/**
 * The website assistant: a launcher in the bottom-right corner and a chat panel. Answers come from
 * /api/chat (FAQs and site content, no AI model yet). "Share my requirement" switches to a short
 * step-by-step form whose answers are saved as a lead in /admin.
 */
export function ChatWidget() {
  const [config, setConfig] = useState<SiteConfig["chatbot"] | null>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState<number | null>(null);
  const [details, setDetails] = useState<Partial<Record<StepKey, string>>>({});
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSiteConfig().then((c) => c?.chatbot.enabled && setConfig(c.chatbot));
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE) ?? "null");
      if (saved?.messages?.length) {
        setMessages(saved.messages);
        setConversationId(saved.conversationId ?? null);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (messages.length)
        sessionStorage.setItem(STORE, JSON.stringify({ messages: messages.slice(-60), conversationId }));
    } catch {}
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, conversationId]);

  useEffect(() => {
    if (!open) return;
    if (config && messages.length === 0)
      setMessages([{ from: "bot", text: config.greeting, suggestions: config.quickReplies }]);
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, config, messages.length]);

  const push = (m: Message) => setMessages((all) => [...all, m]);

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

  async function send(raw: string) {
    const text = raw.trim();
    if (!text || busy) return;
    setInput("");
    push({ from: "user", text });
    if (step !== null) return answerStep(/^skip$/i.test(text) ? "" : text);
    setBusy(true);
    try {
      const res = await fetch("/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, conversationId, pageUrl: location.pathname }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return push({ from: "bot", text: data.error ?? "Sorry, something went wrong. Please try again." });
      if (data.conversationId) setConversationId(data.conversationId);
      const r = data.reply;
      push({ from: "bot", text: r.text, links: r.links, openings: r.openings, suggestions: r.suggestions });
      if (r.action === "collect-lead") startDetails();
    } catch {
      push({ from: "bot", text: "I could not reach the server. Please check your connection and try again." });
    } finally {
      setBusy(false);
    }
  }

  if (!config) return null;
  const last = messages[messages.length - 1];

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
          className="fixed bottom-24 right-5 z-40 flex h-[min(600px,calc(100svh-8rem))] w-[min(390px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-surface border border-border-subtle bg-surface shadow-glass"
        >
          <header className="theme-on-brand flex items-center justify-between bg-brand px-4 py-3 text-on-brand">
            <div>
              <p className="text-sm font-semibold">{config.name}</p>
              <p className="text-xs text-on-brand/70">Usually replies instantly</p>
            </div>
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
                <p
                  className={cn(
                    "max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    m.from === "user"
                      ? "rounded-br-sm bg-action text-on-action"
                      : "rounded-bl-sm bg-surface-subtle text-foreground",
                  )}
                >
                  {m.text}
                </p>
                {m.openings?.length ? (
                  <ul className="w-full space-y-1.5">
                    {m.openings.map((o) => (
                      <li key={o.id}>
                        <Link
                          href={`/careers/apply/${o.id}/`}
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
            {busy ? <p className="text-xs text-foreground-muted">Typing…</p> : null}
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
            className="flex items-center gap-2 border-t border-border-subtle p-3"
          >
            <label htmlFor="in2it-chat-input" className="sr-only">
              Your message
            </label>
            <input
              id="in2it-chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={step !== null && STEPS[step].key === "requirement" ? 3000 : 500}
              autoComplete={
                step !== null
                  ? (
                      {
                        name: "name",
                        email: "email",
                        company: "organization",
                        phone: "tel",
                        requirement: "off",
                      } as const
                    )[STEPS[step].key]
                  : "off"
              }
              placeholder={step !== null ? STEPS[step].ask : "Type your question…"}
              className="min-h-11 flex-1 rounded-full border border-border-subtle bg-canvas px-4 text-sm text-foreground placeholder:text-foreground-muted focus:border-action focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-action text-on-action disabled:opacity-40"
            >
              <Send size={18} aria-hidden />
            </button>
          </form>
          <p className="px-4 pb-2 text-[11px] leading-snug text-foreground-muted">
            Conversations are stored to improve our answers. See our{" "}
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
