"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow, Accent } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

/**
 * The Application Estate Review diagnostic.
 *
 * Built after reading how the comparable firms present portfolio assessment. Persistent's
 * Application Portfolio Rationalization page is the closest competitor equivalent and it has no
 * assessment on it at all: a problem statement, a framework name, a claim that it cuts application
 * spend by 20–30%, and a "Request a Demo" button. A demo of what? There is nothing to demonstrate.
 *
 * Four things that page does are deliberately not done here.
 *
 * 1. NO SAVINGS PERCENTAGE. "20–30%" is an outcome claim offered before anyone has looked at the
 *    estate. We have no basis for a number like that and neither do they.
 * 2. NO "REQUEST A DEMO". The call to action is to send us what the visitor just worked out, which
 *    is a thing they now own whether or not they ever reply.
 * 3. THE OUTPUT IS ABOUT THEM, NOT US. This does not score our capability. It scores how much of
 *    their own estate they can currently see — which is the actual precondition for deciding
 *    anything, and usually the uncomfortable finding.
 * 4. THE DELIVERABLE IS NAMED. Not "deep insights and a structured roadmap". The specific documents
 *    the engagement hands over.
 *
 * The visitor can finish this, close the tab, and be better off. That is the point: a diagnostic
 * that is only useful if you buy something is an advertisement wearing a lab coat.
 */

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/** `visibility` is how much of their own estate the answer proves they can see today. */
type Option = { id: string; label: string; hint?: string; visibility: 0 | 1 | 2 };
type Question = { id: string; legend: string; help?: string; options: Option[] };

const QUESTIONS: Question[] = [
  {
    id: "size",
    legend: "Roughly how many applications are in the estate?",
    help: "Count anything with a licence, a login or a server. Best guess is fine.",
    options: [
      { id: "s", label: "Under 25", visibility: 2 },
      { id: "m", label: "25 to 75", visibility: 2 },
      { id: "l", label: "75 to 200", visibility: 2 },
      { id: "xl", label: "More than 200", visibility: 2 },
      { id: "unknown", label: "Nobody could tell you today", visibility: 0 },
    ],
  },
  {
    id: "owners",
    legend: "For how many could you name the person accountable for it?",
    help: "Not the team. The person whose decision it is to switch it off.",
    options: [
      { id: "most", label: "Nearly all of them", visibility: 2 },
      { id: "some", label: "The important ones", visibility: 1 },
      { id: "few", label: "A handful", visibility: 0 },
      { id: "none", label: "That list does not exist", visibility: 0 },
    ],
  },
  {
    id: "cost",
    legend: "Do you know what each application costs to run in a year?",
    help: "Licence, infrastructure, support and the people time it absorbs.",
    options: [
      { id: "all", label: "For most of them", visibility: 2 },
      { id: "licence", label: "Licence cost only", visibility: 1 },
      { id: "total", label: "Only the total IT spend", visibility: 0 },
      { id: "no", label: "No", visibility: 0 },
    ],
  },
  {
    id: "support",
    legend: "How many are out of vendor support, or on a version that soon will be?",
    options: [
      { id: "none", label: "None that we know of", visibility: 1 },
      { id: "few", label: "A few, and we know which", visibility: 2 },
      { id: "many", label: "Several, and it is getting worse", visibility: 2 },
      { id: "unknown", label: "We have not checked", visibility: 0 },
    ],
  },
  {
    id: "integrations",
    legend: "How many interfaces run between these applications?",
    help: "Every file drop, API call and overnight job counts.",
    options: [
      { id: "few", label: "Under 20", visibility: 2 },
      { id: "some", label: "20 to 100", visibility: 2 },
      { id: "many", label: "More than 100", visibility: 2 },
      { id: "unknown", label: "There is no register", visibility: 0 },
    ],
  },
  {
    id: "usage",
    legend: "When did anyone last measure who actually uses them?",
    help: "Logins and transactions, not licences bought.",
    options: [
      { id: "recent", label: "Within the last year", visibility: 2 },
      { id: "old", label: "One to three years ago", visibility: 1 },
      { id: "never", label: "Never, as far as we know", visibility: 0 },
    ],
  },
  {
    id: "record",
    legend: "Is there a system of record these applications have to agree with?",
    help: "The ledger, in other words — the number an auditor would accept.",
    options: [
      { id: "sap", label: "Yes, SAP", visibility: 2 },
      { id: "other", label: "Yes, something else", visibility: 2 },
      { id: "several", label: "More than one, and they do not always agree", visibility: 1 },
      { id: "no", label: "No single one", visibility: 0 },
    ],
  },
  {
    id: "trigger",
    legend: "What has put this on the agenda?",
    options: [
      { id: "cost", label: "The run cost", visibility: 2 },
      { id: "erp", label: "An ERP move that is coming", visibility: 2 },
      { id: "deal", label: "An acquisition, merger or carve-out", visibility: 2 },
      { id: "audit", label: "An auditor or a regulator asked", visibility: 2 },
      { id: "risk", label: "Something broke, or nearly did", visibility: 2 },
      { id: "none", label: "Nothing specific yet", visibility: 1 },
    ],
  },
];

/** The sections the Review covers for everyone, plus the ones a given answer makes necessary. */
const ALWAYS = [
  "Every application named, with the person accountable for it",
  "A disposition for each one — keep, replace, re-host, retire — with the reasoning written down",
  "A sequenced plan, with what to switch off first",
];

function tailoredScope(answers: Record<string, string>): string[] {
  const extra: string[] = [];
  if (answers.cost === "total" || answers.cost === "no" || answers.cost === "licence")
    extra.push("Run cost rebuilt per application, including the infrastructure and people time behind it");
  if (answers.support === "unknown" || answers.support === "many")
    extra.push("Support and version exposure, application by application, with the dates each one runs out");
  if (answers.integrations === "unknown")
    extra.push("An interface register — source, target, direction, frequency, named owner and failure mode");
  if (answers.usage === "never" || answers.usage === "old")
    extra.push("Actual usage measured from the systems themselves, not from licences bought");
  if (answers.record === "several" || answers.record === "no")
    extra.push("Where the applications and the ledger stop agreeing, and what it costs to reconcile them");
  if (answers.owners === "few" || answers.owners === "none")
    extra.push("An ownership map, because nothing can be retired until somebody owns the decision");
  if (answers.trigger === "erp")
    extra.push("What the ERP move forces on each application, and what can be dealt with before it starts");
  if (answers.trigger === "deal")
    extra.push("Overlap between the two estates, and what a carve-out would have to separate");
  if (answers.trigger === "audit")
    extra.push("The evidence an auditor will ask for, and which applications cannot currently produce it");
  return extra;
}

type Band = { key: "clear" | "partial" | "dark"; title: string; verdict: string };

function band(score: number, max: number): Band {
  const pct = score / max;
  if (pct >= 0.75)
    return {
      key: "clear",
      title: "You can see most of your estate",
      verdict:
        "You already hold most of what a disposition decision needs. The gap is probably not information — it is that nobody has been asked to make the calls and own them. A review here is short, and its value is the decisions, not the discovery.",
    };
  if (pct >= 0.4)
    return {
      key: "partial",
      title: "You can see the important half",
      verdict:
        "This is the normal position and it is a workable one. You know the applications that matter and rather less about the long tail — which is usually where the retirable cost sits, because nothing draws attention to an application nobody is using.",
    };
  return {
    key: "dark",
    title: "The estate is largely unmeasured",
    verdict:
      "Nothing here is unusual, and it is not a criticism: most estates of any age are in this state, because the work of keeping the picture current never makes anyone's quarter. It does mean any plan built today would rest on assumptions. That is the thing worth fixing first, and it is a few weeks of work rather than a programme.",
  };
}

export function EstateReviewDiagnostic() {
  const reduce = useReducedMotion();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const answered = QUESTIONS.filter((q) => answers[q.id]).length;
  const complete = answered === QUESTIONS.length;

  const result = useMemo(() => {
    if (!complete) return null;
    const max = QUESTIONS.length * 2;
    const score = QUESTIONS.reduce((sum, q) => {
      const opt = q.options.find((o) => o.id === answers[q.id]);
      return sum + (opt?.visibility ?? 0);
    }, 0);
    return { ...band(score, max), score, max, scope: tailoredScope(answers) };
  }, [answers, complete]);

  const summary = useMemo(() => {
    if (!result) return "";
    const lines = QUESTIONS.map((q) => {
      const opt = q.options.find((o) => o.id === answers[q.id]);
      return `${q.legend}\n  ${opt?.label ?? "—"}`;
    });
    return [
      "Application Estate Review — self-assessment",
      "",
      `Estate visibility: ${result.score} of ${result.max} — ${result.title}`,
      "",
      ...lines,
      "",
      "Scope this indicates:",
      ...[...ALWAYS, ...result.scope].map((s) => `  - ${s}`),
    ].join("\n");
  }, [answers, result]);

  if (done && result) {
    return (
      <div className="rounded-card border border-border-subtle bg-surface p-7 md:p-10">
        <Eyebrow>Your estate, as you have just described it</Eyebrow>
        <h3 className="mt-3 font-display text-h2 text-foreground">
          {result.title.split(" ").slice(0, -1).join(" ")} <Accent>{result.title.split(" ").slice(-1)}</Accent>
        </h3>

        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-surface-subtle" aria-hidden>
          <div
            className={cn(
              "h-full rounded-full",
              result.key === "clear" ? "bg-action" : result.key === "partial" ? "bg-brand-muted" : "bg-gold",
            )}
            style={{ width: `${Math.max(6, Math.round((result.score / result.max) * 100))}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-foreground-muted">
          Estate visibility: {result.score} of {result.max}
        </p>

        <p className="mt-6 max-w-measure text-lg leading-relaxed text-foreground">{result.verdict}</p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div>
            <p className="label-caps text-foreground-muted">What the Review covers for everyone</p>
            <ul className="mt-4 space-y-3">
              {ALWAYS.map((item) => (
                <li key={item} className="flex gap-3 text-foreground-muted">
                  <Check aria-hidden size={18} className="mt-0.5 shrink-0 text-action" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label-caps text-foreground-muted">
              {result.scope.length ? "What your answers add to it" : "Your answers add nothing unusual"}
            </p>
            {result.scope.length ? (
              <ul className="mt-4 space-y-3">
                {result.scope.map((item) => (
                  <li key={item} className="flex gap-3 text-foreground-muted">
                    <Check aria-hidden size={18} className="mt-0.5 shrink-0 text-action" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-foreground-muted">
                You hold the information the Review normally has to reconstruct, so it would be a short engagement spent
                on the decisions rather than the discovery.
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 rounded-card border border-border-subtle bg-surface-subtle p-6">
          <p className="text-foreground">
            <span className="font-semibold">Three to four weeks, fixed price, no onward commitment.</span>
          </p>
          <p className="mt-3 text-foreground-muted">
            We scope it with you first — a short working session where we agree together which applications are in,
            which are out, and what the output has to answer. The price is then fixed for that scope and confirmed in
            writing before any work starts. No day rates, no running meter, and no change request unless you change the
            scope.
          </p>
          <p className="mt-3 text-foreground-muted">
            You own the output whether or not you do anything else with us — including the version that says do nothing
            yet, or that somebody else is the better fit for what comes next.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button href="/contact/">Send this to us</Button>
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setDone(false);
            }}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-foreground transition-[transform,color] duration-200 ease-out hover:text-action active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <RotateCcw size={15} strokeWidth={1.75} aria-hidden />
            Start again
          </button>
        </div>

        <details className="mt-8">
          <summary className="cursor-pointer text-sm font-semibold text-action underline-offset-4 hover:underline">
            Show this as text, to copy or send to a colleague
          </summary>
          <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-card border border-border-subtle bg-surface-subtle p-5 text-sm text-foreground-muted">
            {summary}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-border-subtle bg-surface p-7 md:p-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <Eyebrow>Before you talk to anyone</Eyebrow>
        <p className="text-sm text-foreground-muted">
          {answered} of {QUESTIONS.length} answered
        </p>
      </div>
      <h3 className="mt-3 max-w-measure font-display text-h2 text-foreground">
        How much of your estate can you <Accent>actually see?</Accent>
      </h3>
      <p className="mt-4 max-w-measure text-foreground-muted">
        Eight questions, no email address, nothing stored. It scores how much of your own estate you can account for
        today — which is the thing that decides whether a plan is a plan or a guess.
      </p>

      <div className="mt-10 space-y-10">
        {QUESTIONS.map((q) => (
          <fieldset key={q.id}>
            <legend className="max-w-measure font-display text-h3 text-foreground">{q.legend}</legend>
            {q.help ? <p className="mt-2 max-w-measure text-sm text-foreground-muted">{q.help}</p> : null}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {q.options.map((o) => {
                const selected = answers[q.id] === o.id;
                return (
                  <label
                    key={o.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-card border p-4 transition-colors",
                      selected
                        ? "border-action bg-surface-subtle"
                        : "border-border-subtle bg-surface hover:border-border-strong",
                    )}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={o.id}
                      checked={selected}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}
                      className="h-4 w-4 accent-[oklch(var(--color-action))]"
                    />
                    <span className="text-foreground">{o.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <AnimatePresence>
        {complete ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="mt-10"
          >
            <button
              type="button"
              onClick={() => setDone(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-action px-5 py-3 text-sm font-semibold text-on-action transition-[transform,background-color] duration-200 ease-out hover:bg-action-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              See what this says about your estate
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
