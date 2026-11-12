"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow, Accent } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

/**
 * Which SAP maintenance door are you eligible for?
 *
 * ── THE FACTS, AND WHERE THEY COME FROM ──────────────────────────────────────────────────────
 * Every date below is from SAP's own announcement of 7 October 2026, "Planning Beyond 2030", by
 * Philipp Herzig, CTO, on the SAP News Center, and from SAP's published maintenance strategy:
 *
 *   - Mainstream maintenance for SAP Business Suite 7 runs to 31 December 2027.
 *   - Optional extended maintenance runs to 31 December 2030, at an additional fee.
 *   - Customer-specific maintenance begins in 2031. There is no follow-on release.
 *   - A Transition Option for SAP ERP covers 2031 through 2033. It requires the system to be moved
 *     to SAP ERP, private edition, on SAP HANA before 31 December 2030; SAP states that further
 *     eligibility requirements apply and that it does not support Java-dependent capabilities.
 *   - Conversion tooling is available only until the end of 2030. After that, only greenfield.
 *
 * WHAT IS DELIBERATELY NOT HERE, and must not be added without a source on the page:
 *   - The uplift percentage for extended maintenance. SAP says "an additional fee" and publishes
 *     no percentage. A number widely repeated in the market is not a number we can publish.
 *   - A minimum database size for the transition option. SAP has not published one.
 *   - Any migration-progress percentage. ASUG (Americas) and DSAG (DACH) disagree by more than
 *     twenty points on how many customers have moved, so no global figure is reliable.
 *   - An end date for customer-specific maintenance. SAP has not given one.
 *
 * Re-verify every date before any campaign. The 2033 transition option was announced weeks before
 * this was written, and the terms that sit underneath it are still moving.
 *
 * ── WHAT THIS PAGE IS NOT ────────────────────────────────────────────────────────────────────
 * This is an eligibility tool, not an argument against migrating. We migrate clients to S/4HANA
 * and we think most ECC estates should get there. SAP publishes all of these options itself. The
 * commercial conversation about extending the life of an estate happens with a person, in a bid,
 * under NDA — not on a public web page, and not while we are asking SAP to consider us for two
 * invitation-based validation programmes.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

type Question = { id: string; legend: string; help?: string; options: { id: string; label: string }[] };

const QUESTIONS: Question[] = [
  {
    id: "release",
    legend: "What are you running today?",
    options: [
      { id: "ecc", label: "SAP ERP 6.0 / Business Suite 7" },
      { id: "s4-onprem", label: "S/4HANA, on premise" },
      { id: "s4-cloud", label: "S/4HANA Cloud, already" },
      { id: "older", label: "Something older than ERP 6.0" },
    ],
  },
  {
    id: "database",
    legend: "What database is it on?",
    help: "This is the gate that decides more than anything else on this page.",
    options: [
      { id: "hana", label: "SAP HANA" },
      { id: "third-party", label: "Oracle, SQL Server, DB2 or similar" },
      { id: "unknown", label: "I would have to ask" },
    ],
  },
  {
    id: "java",
    legend: "Does anything in the landscape depend on SAP NetWeaver AS Java?",
    help: "Older portals, Process Integration, Adobe Document Services and MDM commonly do.",
    options: [
      { id: "no", label: "No" },
      { id: "yes", label: "Yes" },
      { id: "unknown", label: "Not sure" },
    ],
  },
  {
    id: "target",
    legend: "When does the business expect to have moved?",
    options: [
      { id: "2027", label: "By the end of 2027" },
      { id: "2030", label: "2028 to 2030" },
      { id: "later", label: "After 2030" },
      { id: "none", label: "There is no agreed date" },
    ],
  },
  {
    id: "custom",
    legend: "How much custom code is in it?",
    options: [
      { id: "light", label: "Light — close to standard" },
      { id: "moderate", label: "Moderate — the usual Z-programs and enhancements" },
      { id: "heavy", label: "Heavy — the business runs on the custom build" },
      { id: "unknown", label: "Nobody has counted" },
    ],
  },
];

type Door = {
  key: string;
  eyebrow: string;
  title: string;
  accent: string;
  body: string[];
  gates?: string[];
  tone: "ok" | "watch" | "act";
};

function evaluate(a: Record<string, string>): Door {
  const onHana = a.database === "hana";
  const java = a.java === "yes";

  if (a.release === "s4-cloud")
    return {
      key: "done",
      eyebrow: "Nothing on this page applies to you",
      title: "You are already",
      accent: "past all of it",
      tone: "ok",
      body: [
        "None of the 2027, 2030 or 2033 dates apply to an estate already on S/4HANA Cloud. SAP's innovation commitment for S/4HANA runs to 2040.",
        "If you came here looking for something, it is probably a question about release strategy or about an estate somewhere else in the group. Both are worth a conversation, but this tool will not answer either.",
      ],
    };

  if (a.release === "s4-onprem")
    return {
      key: "s4",
      eyebrow: "A different clock",
      title: "You are on S/4HANA,",
      accent: "so this is a release question",
      tone: "ok",
      body: [
        "The Business Suite 7 dates below do not govern you. SAP's innovation commitment for S/4HANA runs to 2040, and what matters for you is release level and upgrade cadence rather than an end-of-maintenance cliff.",
        "The useful question for an on-premise S/4HANA estate is usually whether to stay on premise at all, and what a move to private edition would cost and change.",
      ],
    };

  if (a.release === "older")
    return {
      key: "older",
      eyebrow: "Before the staircase",
      title: "You are behind",
      accent: "the options on this page",
      tone: "act",
      body: [
        "A release older than SAP ERP 6.0 has already left the maintenance arrangements described here. In practice the decision is not which door to take but how to get onto a supported footing at all.",
        "That is a real position and a recoverable one. It is not a web-page conversation.",
      ],
    };

  // ERP 6.0 / Business Suite 7 from here down.
  if (onHana && !java)
    return {
      key: "transition",
      eyebrow: "The longest runway available",
      title: "You can reach",
      accent: "the 2033 transition option",
      tone: "ok",
      body: [
        "Mainstream maintenance ends 31 December 2027 and extended maintenance is available to 31 December 2030. Because you are already on SAP HANA and nothing depends on NetWeaver AS Java, the Transition Option for SAP ERP — 2031 to 2033 — is open to you.",
        "It is not automatic. It requires the system to be on SAP ERP, private edition, on SAP HANA before 31 December 2030, and SAP states that further eligibility requirements apply beyond the ones published.",
        "The thing most people miss: conversion tooling is only available until the end of 2030. After that, SAP supports greenfield only — a new implementation rather than a conversion of what you have. The 2033 date buys you running room, not decision room.",
      ],
      gates: [
        "On SAP ERP, private edition, on SAP HANA before 31 December 2030",
        "No Java-dependent capabilities in scope",
        "Further SAP eligibility requirements, which SAP has not published in full",
      ],
    };

  if (onHana && java)
    return {
      key: "java-blocked",
      eyebrow: "One dependency decides it",
      title: "The Java estate",
      accent: "is what blocks you",
      tone: "watch",
      body: [
        "You are on HANA, which is the hard part done. But SAP states that the Transition Option does not support Java-dependent capabilities, and SAP's reselling and support arrangements for NetWeaver AS Java also run out at the end of 2030.",
        "So the question is not whether to take the 2033 door. It is what the Java components actually are, whether they can be retired or re-platformed before the end of 2030, and what is left if they cannot.",
        "That is a scoping exercise of a few weeks, and it is worth doing early, because the answer changes the whole plan rather than one workstream of it.",
      ],
      gates: [
        "Identify every NetWeaver AS Java dependency — portals, PI, Adobe Document Services, MDM",
        "Retire or re-platform them before 31 December 2030",
        "Then the 2033 conditions apply as normal",
      ],
    };

  // Third-party database, or unknown.
  const unknownDb = a.database === "unknown";
  return {
    key: "database",
    eyebrow: unknownDb ? "Find this out first" : "The database is the gate",
    title: unknownDb ? "One answer decides" : "A third-party database",
    accent: unknownDb ? "everything else" : "closes the 2033 door",
    tone: "act",
    body: [
      unknownDb
        ? "Whether the system runs on SAP HANA decides which options exist at all, and it is a question your Basis team can answer in a minute. Everything below assumes the answer is a third-party database, which is the more common case."
        : "SAP's reselling and support arrangements for third-party databases run out at the end of 2030, and the Transition Option for SAP ERP requires SAP HANA. On a third-party database, the 2031–2033 door is not available.",
      "That leaves mainstream maintenance to 31 December 2027, optional extended maintenance to 31 December 2030 at an additional fee, and then customer-specific maintenance from 2031.",
      "Customer-specific maintenance is the part worth understanding before anyone treats 2031 as a safe harbour. The contract continues and you get limited technology compatibility updates — but no new support packages, no SAP commitment to fix newly discovered high-severity vulnerabilities, and no legal-change updates.",
      "That last one is the one that bites in India. GST changes, statutory payroll and e-invoicing requirements do not stop arriving because your maintenance phase changed. Somebody has to build them, and after 2030 that somebody is you or a partner.",
    ],
    gates: [
      "Moving to SAP HANA before the end of 2030 removes the third-party database problem",
      "On its own it does not extend maintenance — the system still enters customer-specific maintenance",
      "To reach 2031–2033 it must be SAP ERP, private edition, on HANA, before 31 December 2030",
    ],
  };
}

export function EccMaintenanceChecker() {
  const reduce = useReducedMotion();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const answered = QUESTIONS.filter((q) => answers[q.id]).length;
  const complete = answered === QUESTIONS.length;
  const door = useMemo(() => (complete ? evaluate(answers) : null), [answers, complete]);

  const urgency = useMemo(() => {
    if (!door) return null;
    if (answers.target === "none")
      return "There is no agreed date inside the business. That is the finding, not the custom code or the database — every option on this page has a gate in 2030, and a decision nobody owns will arrive at that gate by default.";
    if (answers.target === "later" && door.key === "database")
      return "The business expects to move after 2030, and on this estate that means customer-specific maintenance: no legal changes, no new support packages. Worth putting in front of whoever set that date.";
    if (answers.custom === "unknown")
      return "Nobody has counted the custom code. Every estimate you are given until that changes is a guess with a confidence interval nobody has told you about.";
    if (answers.custom === "heavy")
      return "A heavy custom build is the single biggest driver of both cost and duration, and it is the part a standard readiness report usually waves at. It is worth measuring properly before you commit to a date.";
    return null;
  }, [answers, door]);

  if (done && door) {
    return (
      <div className="rounded-card border border-border-subtle bg-surface p-7 md:p-10">
        <Eyebrow>{door.eyebrow}</Eyebrow>
        <h3 className="mt-3 max-w-measure font-display text-h2 text-foreground">
          {door.title} <Accent>{door.accent}</Accent>
        </h3>

        <div className="mt-6 max-w-measure space-y-4">
          {door.body.map((p) => (
            <p key={p} className="leading-relaxed text-foreground-muted">
              {p}
            </p>
          ))}
        </div>

        {door.gates?.length ? (
          <div className="mt-8 rounded-card border border-border-subtle bg-surface-subtle p-6">
            <p className="label-caps text-foreground-muted">The gates, in SAP&rsquo;s terms</p>
            <ul className="mt-4 space-y-2">
              {door.gates.map((g) => (
                <li key={g} className="text-foreground-muted">
                  — {g}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {urgency ? (
          <p className="mt-8 max-w-measure border-l-2 border-gold pl-5 text-lg leading-relaxed text-foreground">
            {urgency}
          </p>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/contact/">Talk this through with someone</Button>
          <Button href="/services/ecc-prism/" variant="ghost">
            What an assessment covers
          </Button>
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

        <p className="mt-8 max-w-measure text-sm text-foreground-muted">
          Dates from SAP&rsquo;s published maintenance strategy and from &ldquo;Planning Beyond 2030&rdquo;, SAP News
          Center, 7 October 2026. SAP states that further eligibility requirements apply to the transition option beyond
          those published. This tool gives you SAP&rsquo;s position, not a commitment from us or from SAP — confirm your
          own entitlement with SAP or with your account team before you plan against it.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-border-subtle bg-surface p-7 md:p-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <Eyebrow>2027 · 2030 · 2033</Eyebrow>
        <p className="text-sm text-foreground-muted">
          {answered} of {QUESTIONS.length} answered
        </p>
      </div>
      <h3 className="mt-3 max-w-measure font-display text-h2 text-foreground">
        Which maintenance door are you <Accent>actually eligible for?</Accent>
      </h3>
      <p className="mt-4 max-w-measure text-foreground-muted">
        Five questions. It is a staircase, not a cliff — there are three dates, not one, and which of them applies to
        you is decided mostly by your database and your Java estate rather than by your ambition.
      </p>

      <div className="mt-10 space-y-10">
        {QUESTIONS.map((q) => (
          <fieldset key={q.id}>
            <legend className="font-display text-h3 text-foreground">{q.legend}</legend>
            {q.help ? <p className="mt-2 text-sm text-foreground-muted">{q.help}</p> : null}
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
              Show me which door
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
