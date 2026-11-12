"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow, Accent } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

/** House easings (mirrors components/motion/reveal.tsx). */
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const EASE_MOVE = [0.32, 0.72, 0, 1] as const;

type Weight = "rise" | "grow" | "neutral";

type Option = {
  id: string;
  label: string;
  hint?: string;
  weight: Weight;
};

type Question = {
  id: string;
  legend: string;
  options: Option[];
};

const QUESTIONS: Question[] = [
  {
    id: "profile",
    legend: "Which best describes your company profile?",
    options: [
      { id: "midmarket", label: "Mid-market or a net-new business unit", weight: "grow" },
      { id: "enterprise", label: "Large, complex enterprise", weight: "rise" },
    ],
  },
  {
    id: "customisation",
    legend: "How much customisation does your process really need?",
    options: [
      { id: "minimal", label: "Minimal — standard, best-practice processes", weight: "grow" },
      { id: "moderate", label: "Moderate — a few tailored flows", hint: "Leans slightly to RISE", weight: "rise" },
      { id: "heavy", label: "Heavy custom code and enhancements", weight: "rise" },
    ],
  },
  {
    id: "integration",
    legend: "How complex is your integration landscape?",
    options: [
      { id: "simple", label: "Simple — a few core systems", weight: "grow" },
      { id: "moderate", label: "Moderate — several connected apps", weight: "neutral" },
      { id: "complex", label: "Complex SAP and non-SAP landscape", weight: "rise" },
    ],
  },
  {
    id: "timeline",
    legend: "What timeline are you working toward?",
    options: [
      { id: "fast", label: "3–9 months — move fast", weight: "grow" },
      { id: "phased", label: "9–18 months — phased rollout", weight: "rise" },
      { id: "flexible", label: "Flexible — outcome over deadline", weight: "neutral" },
    ],
  },
  {
    id: "commercial",
    legend: "What is your commercial posture?",
    options: [
      { id: "subscription", label: "Prefer subscription and lower TCO", weight: "grow" },
      { id: "capex", label: "CapEx and dedicated tenancy are acceptable", weight: "rise" },
    ],
  },
  {
    id: "regulatory",
    legend: "How strict are your regulatory and data-residency needs?",
    options: [
      { id: "low", label: "Low — standard cloud is fine", weight: "grow" },
      { id: "high", label: "High — strict residency and controls", weight: "rise" },
    ],
  },
  {
    id: "landscape",
    legend: "Where are you starting from?",
    options: [
      { id: "greenfield", label: "Net-new or greenfield", weight: "grow" },
      { id: "migrating", label: "Migrating an existing SAP core", weight: "rise" },
    ],
  },
];

type Verdict = "RISE" | "GROW" | "Hybrid";

type Result = {
  verdict: Verdict;
  title: string;
  eyebrow: string;
  rationale: string;
  rise: number;
  grow: number;
};

/** Deterministic tally → recommendation. */
function evaluate(answers: Record<string, string>): Result {
  let rise = 0;
  let grow = 0;
  for (const q of QUESTIONS) {
    const chosenId = answers[q.id];
    const opt = q.options.find((o) => o.id === chosenId);
    if (opt?.weight === "rise") rise += 1;
    else if (opt?.weight === "grow") grow += 1;
  }

  const driverFor = (weight: Weight) =>
    QUESTIONS.map((q) => q.options.find((o) => o.id === answers[q.id])).filter(
      (o): o is Option => Boolean(o) && o!.weight === weight,
    );

  if (rise - grow >= 2) {
    const drivers = driverFor("rise");
    return {
      verdict: "RISE",
      title: "RISE with SAP",
      eyebrow: "Your recommended pathway",
      rationale:
        "Your landscape rewards depth over speed. With " +
        `${rise} of your answers pointing to enterprise scale — ` +
        "notably complexity, regulatory rigour and a core to migrate — RISE gives you a dedicated, " +
        "governed move to S/4HANA without forcing you to flatten the processes that differentiate you. " +
        (drivers.length ? "The dominant drivers here are " + summarise(drivers) + "." : ""),
      rise,
      grow,
    };
  }

  if (grow - rise >= 2) {
    const drivers = driverFor("grow");
    return {
      verdict: "GROW",
      title: "GROW with SAP",
      eyebrow: "Your recommended pathway",
      rationale:
        "Speed and total cost of ownership are on your side. With " +
        `${grow} of your answers favouring a lean, standardised path, ` +
        "GROW gets you live on cloud S/4HANA quickly on best-practice processes and a subscription model. " +
        (drivers.length ? "The dominant drivers here are " + summarise(drivers) + "." : ""),
      rise,
      grow,
    };
  }

  return {
    verdict: "Hybrid",
    title: "Hybrid (GROW + RISE)",
    eyebrow: "Your recommended pathway",
    rationale:
      "You sit between the two pathways — " +
      `${grow} signals lean toward GROW and ${rise} toward RISE. ` +
      "A hybrid approach lets you start fast where standard processes fit while reserving RISE-grade " +
      "governance for the complex, regulated or migration-heavy parts of your estate. " +
      "We will help you draw the line in the 2-week assessment.",
    rise,
    grow,
  };
}

function summarise(drivers: Option[]): string {
  const labels = drivers.map((d) => d.label.split(" — ")[0].toLowerCase());
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
}

export function RiseGrowChooser() {
  const reduce = useReducedMotion();
  const groupId = useId();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const focusPending = useRef(false);
  const fieldset = useRef<HTMLFieldSetElement>(null);

  const total = QUESTIONS.length;
  const current = QUESTIONS[step];
  const selected = current ? answers[current.id] : undefined;
  const progress = done ? 1 : (step + (selected ? 1 : 0)) / total;
  const isLast = step === total - 1;

  function choose(optionId: string) {
    setAnswers((prev) => ({ ...prev, [current.id]: optionId }));
  }

  function goNext() {
    if (!selected) return;
    if (isLast) {
      setDone(true);
      return;
    }
    setDirection(1);
    focusPending.current = true;
    setStep((s) => s + 1);
  }

  function goBack() {
    if (step === 0) return;
    setDirection(-1);
    focusPending.current = true;
    setStep((s) => s - 1);
  }

  function reset() {
    setAnswers({});
    focusPending.current = true;
    setStep(0);
    setDone(false);
    setDirection(1);
  }

  /** ArrowUp/Down/Left/Right move selection within the group (roving radio). */
  function onKeyNav(e: React.KeyboardEvent, index: number) {
    const opts = current.options;
    let next = index;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (index + 1) % opts.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (index - 1 + opts.length) % opts.length;
    else return;
    e.preventDefault();
    choose(opts[next].id);
    const el = document.getElementById(`${groupId}-${current.id}-${opts[next].id}`);
    el?.focus();
  }

  const slideVariants = {
    enter: (dir: 1 | -1) => (reduce ? { opacity: 0 } : { opacity: 0, x: dir * 24 }),
    center: reduce ? { opacity: 1 } : { opacity: 1, x: 0 },
    exit: (dir: 1 | -1) => (reduce ? { opacity: 0 } : { opacity: 0, x: dir * -24 }),
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="glass-elevated overflow-hidden rounded-feature p-7 text-foreground md:p-9">
        {/* Progress */}
        <div className="mb-7">
          <div className="mb-3 flex items-baseline justify-between">
            <Eyebrow>RISE vs GROW</Eyebrow>
            <span className="text-xs font-semibold text-foreground-muted" role="status" aria-live="polite">
              {done ? "Complete" : `Question ${step + 1} of ${total}`}
            </span>
          </div>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-border-subtle"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={done ? total : step + (selected ? 1 : 0)}
            aria-label="Assessment progress"
          >
            <motion.div
              className="h-full rounded-full bg-gold"
              initial={false}
              style={{ transformOrigin: "left" }}
              animate={{ scaleX: progress }}
              transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE_MOVE }}
            />
          </div>
        </div>

        {/* Body */}
        <div className="relative min-h-[20rem]">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            {done ? (
              <ResultPanel key="result" answers={answers} onReset={reset} reduce={reduce} />
            ) : (
              <motion.fieldset
                ref={fieldset}
                onAnimationComplete={() => {
                  if (focusPending.current) {
                    fieldset.current?.querySelector<HTMLElement>('[role="radio"]')?.focus();
                    focusPending.current = false;
                  }
                }}
                key={current.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={reduce ? { duration: 0.18 } : { duration: 0.28, ease: EASE_MOVE }}
                className="border-0 p-0"
              >
                <legend className="text-h3 font-bold leading-tight text-foreground">{current.legend}</legend>
                <div role="radiogroup" aria-label={current.legend} className="mt-6 flex flex-col gap-3">
                  {current.options.map((opt, i) => {
                    const checked = selected === opt.id;
                    const optId = `${groupId}-${current.id}-${opt.id}`;
                    return (
                      <button
                        key={opt.id}
                        id={optId}
                        type="button"
                        role="radio"
                        aria-checked={checked}
                        tabIndex={checked || (!selected && i === 0) ? 0 : -1}
                        onClick={() => choose(opt.id)}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.key === "Enter") {
                            e.preventDefault();
                            choose(opt.id);
                          } else {
                            onKeyNav(e, i);
                          }
                        }}
                        className={cn(
                          "glass-card group flex w-full items-start gap-4 rounded-surface px-5 py-4 text-left text-foreground active:scale-[0.97]",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                          checked && "glass-card-selected",
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-200",
                            checked
                              ? "border-action bg-action text-on-action"
                              : "border-border-strong bg-surface text-transparent group-hover:border-gold-soft",
                          )}
                        >
                          <Check size={12} strokeWidth={2.5} />
                        </span>
                        <span className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold leading-snug text-foreground">{opt.label}</span>
                          {opt.hint ? <span className="text-xs text-foreground-muted">{opt.hint}</span> : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.fieldset>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        {!done ? (
          <>
            <div className="mt-8 h-px w-full bg-border-subtle" aria-hidden />
            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={goBack}
                disabled={step === 0}
                className={cn(
                  "rounded-lg px-4 py-2.5 text-sm font-semibold transition-[transform,color] duration-200 ease-out active:scale-[0.97]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                  step === 0 ? "cursor-not-allowed text-foreground/30" : "text-foreground hover:text-gold",
                )}
              >
                Back
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={!selected}
                aria-disabled={!selected}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-[transform,background-color] duration-200 ease-out active:scale-[0.97]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                  selected
                    ? "bg-action text-on-action hover:bg-action-hover"
                    : "cursor-not-allowed bg-border-subtle text-foreground/40",
                )}
              >
                {isLast ? "See my recommendation" : "Next"}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function ResultPanel({
  answers,
  onReset,
  reduce,
}: {
  answers: Record<string, string>;
  onReset: () => void;
  reduce: boolean | null;
}) {
  const result = evaluate(answers);
  const accentWord = result.verdict === "RISE" ? "RISE" : result.verdict === "GROW" ? "GROW" : "Hybrid";

  return (
    <motion.div
      key="result"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reduce ? 0.18 : 0.6, ease: EASE_OUT }}
      className="glass-elevated rounded-feature p-6 md:p-8"
      role="region"
      aria-live="polite"
      aria-label="Your recommendation"
    >
      <Eyebrow>{result.eyebrow}</Eyebrow>
      <h3 className="mt-4 text-h2 font-bold leading-[1.05] text-foreground">
        {result.verdict === "Hybrid" ? (
          <>
            A <Accent>Hybrid</Accent> path
          </>
        ) : (
          <>
            Go with <Accent>{accentWord}</Accent>
          </>
        )}
      </h3>
      <p className="mt-2 text-sm font-semibold text-foreground-muted">{result.title}</p>

      <div className="mt-5 flex items-center gap-3" aria-hidden>
        <ScorePill label="GROW" value={result.grow} active={result.verdict === "GROW"} />
        <ScorePill label="RISE" value={result.rise} active={result.verdict === "RISE"} />
      </div>

      <p className="mt-6 max-w-measure text-base leading-relaxed text-foreground-muted">{result.rationale}</p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button href={`/contact/?offer=pathway&assessment=${result.verdict}&interest=SAP`} withArrow>
          Start the 2-week Pathway Assessment
        </Button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-foreground transition-[transform,color] duration-200 ease-out hover:text-action active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <RotateCcw size={15} strokeWidth={1.75} aria-hidden />
          Start over
        </button>
      </div>
    </motion.div>
  );
}

function ScorePill({ label, value, active }: { label: string; value: number; active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold",
        active ? "bg-action text-on-action" : "glass-pill text-foreground-muted",
      )}
    >
      <span className="label-caps">{label}</span>
      <span className={cn("tabular-nums", active ? "text-on-action" : "text-foreground")}>{value}</span>
    </span>
  );
}
