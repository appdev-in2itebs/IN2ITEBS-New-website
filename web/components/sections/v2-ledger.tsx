import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import type { ReactNode } from "react";

/**
 * TWO PATTERNS THAT ARE NOT A CARD GRID.
 *
 * ── THE PROBLEM ──────────────────────────────────────────────────────────────────────────────
 * Eighteen of the twenty-two service pages on this site render the same three-column grid of
 * bordered cards, each with an icon, a bold line and two sentences. It is a competent layout and
 * it is also the layout on the website of every competitor benchmarked in November 2026. When a
 * buyer opens three SAP partners in three tabs, the thing that distinguishes them cannot be the
 * grid, because they all have the grid.
 *
 * The deeper problem is that a grid of equal cards asserts that the things in it are equal and
 * unordered. Most of what these pages describe is neither. A sequence is not a grid. A record is
 * not a grid. Forcing both into one flattens the only information the layout could have carried.
 *
 * ── LEDGER ───────────────────────────────────────────────────────────────────────────────────
 * For a record: corrections, capabilities, anything with a date or an identity per row and a set
 * of labelled fields. Rows, not tiles. One marker column that stays put, hairlines instead of
 * borders, and no box around anything — because a box says "card" and the reading job here is
 * scanning down a column looking for one entry, not browsing a set.
 *
 * ── BLUEPRINT ────────────────────────────────────────────────────────────────────────────────
 * For a sequence: phases, stages, the order in which work happens. Big outline numerals, a rule
 * running down the page, each step offset from the last. The numbers are the design, and they do
 * something a grid cannot — they tell you step four comes after step three, which on a card grid
 * is information the reader has to supply themselves.
 *
 * ── BOTH ARE DELIBERATELY NARROW ─────────────────────────────────────────────────────────────
 * Neither takes an icon. The icon on a service card is almost always decoration standing in for a
 * concept the words already carry, and allowing one here would turn these into card grids with
 * extra steps inside a fortnight.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */

export interface LedgerEntry {
  key: string;
  /** The left column: a date, a reference, a short identity. Set in the display face. */
  marker: string;
  /** An optional short chip under the marker — a status, a flag. */
  flag?: string;
  /** A short secondary fact under the marker: a page, a reference. Not a labelled row. */
  sub?: string;
  title: string;
  rows: { label: string; value: ReactNode }[];
}

export function V2Ledger({ entries }: { entries: LedgerEntry[] }) {
  if (!entries.length) return null;
  return (
    <Stagger className="border-t border-gold-soft/50">
      {entries.map((entry) => (
        <StaggerItem key={entry.key}>
          <article className="grid gap-6 border-b border-gold-soft/50 py-10 md:grid-cols-12 md:gap-10 md:py-12">
            <div className="md:col-span-3">
              <p className="font-display text-lg font-semibold tracking-[-0.01em] text-foreground">{entry.marker}</p>
              {entry.sub ? <p className="mt-2 font-mono text-sm text-foreground-muted">{entry.sub}</p> : null}
              {entry.flag ? (
                <p className="mt-3 inline-flex rounded-full bg-brand px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-on-brand">
                  {entry.flag}
                </p>
              ) : null}
            </div>
            <div className="md:col-span-9">
              <h3 className="max-w-[48ch] font-display text-[clamp(1.25rem,2vw,1.6rem)] font-semibold leading-[1.25] tracking-[-0.02em] text-foreground">
                {entry.title}
              </h3>
              <dl className="mt-6 space-y-4">
                {entry.rows.map((row) => (
                  <div key={row.label} className="grid gap-1 sm:grid-cols-12 sm:gap-6">
                    <dt className="label-caps pt-0.5 text-foreground-muted sm:col-span-3">{row.label}</dt>
                    <dd className="max-w-[62ch] leading-relaxed text-foreground-muted sm:col-span-9">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export interface BlueprintStep {
  title: string;
  body?: string;
  /** Optional short lines under the body — what comes out of this step. */
  bullets?: string[];
}

export function V2Blueprint({ steps }: { steps: BlueprintStep[] }) {
  if (!steps.length) return null;
  return (
    <Stagger className="relative">
      {/*
        The rule the numerals hang from. It stops level with the last numeral rather than running
        to the bottom of the block — a rule that continues past the final step reads as a sequence
        with something missing from the end of it.

        Hidden on small screens, where the vertical stack is already the sequence and a rule beside
        a 390px column is just a line.
      */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-16 left-[3.25rem] top-2 hidden w-px bg-gold-soft/50 md:block"
      />
      {steps.map((step, i) => (
        <StaggerItem key={step.title}>
          <div className="relative grid gap-5 pb-12 md:grid-cols-[6.5rem_1fr] md:gap-10 md:pb-16">
            <div className="relative">
              <span
                aria-hidden
                className="block font-display text-[clamp(2.75rem,6vw,4rem)] font-bold leading-none tracking-[-0.05em] text-gold-soft"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="md:pt-3">
              <h3 className="max-w-[40ch] font-display text-[clamp(1.35rem,2.2vw,1.85rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-foreground">
                {step.title}
              </h3>
              {step.body ? (
                <p className="mt-4 max-w-[62ch] leading-relaxed text-foreground-muted">{step.body}</p>
              ) : null}
              {step.bullets?.length ? (
                <ul className="mt-5 max-w-[62ch] space-y-2 border-l border-gold-soft/60 pl-5">
                  {step.bullets.map((b) => (
                    <li key={b} className="text-sm leading-relaxed text-foreground-muted">
                      {b}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/**
 * A single quiet fact, set on a hairline. Used where a page needs to state one number or one date
 * without building a statistic band around it.
 */
export function V2Marginalia({ children }: { children: ReactNode }) {
  return (
    <Reveal className="max-w-measure border-t border-gold-soft/60 pt-5">
      <p className="text-sm leading-relaxed text-foreground-muted">{children}</p>
    </Reveal>
  );
}
