import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { toneClass, type ExplainerBase, type Tone } from "./shared";
import type { CardSpec } from "./cards";

/**
 * A sequence: things that only make sense read in order. A rail draws across with the scroll;
 * each step lights up as the rail reaches it. Optional "gap" callouts sit between steps (the
 * meter-to-cash hand-offs), an optional anchor step stands apart at the start (the estate review
 * that is "the way in"), and an optional row of cards follows (what is fixed / not included…).
 */
export type StepSpec = {
  /** "01", "A", "Weeks 1–2"… shown in the node. */
  badge: string;
  /** Small label above the title, e.g. "Evidence", "Weeks 3–6". */
  label?: string;
  title: string;
  body?: string;
  bullets?: string[];
  /** A second, quieter line: a sign-off, a caveat. */
  sub?: { label?: string; text: string };
  /** Monospace small print: a file name, a reference. */
  code?: string;
  tone?: Tone;
};

export type StepsSpec = ExplainerBase & {
  kind: "steps";
  steps: StepSpec[];
  /** Callouts between consecutive steps; length = steps.length - 1. */
  gaps?: string[];
  gapsLabel?: string;
  /** A highlighted step that comes before the sequence proper. */
  anchor?: StepSpec;
  cardsLabel?: string;
  cards?: CardSpec[];
  cardsColumns?: 2 | 3 | 4;
};

function RailList({ items }: { items: string[] }) {
  return (
    <ul className="ex-list ex-list--rail">
      {items.map((b, k) => (
        <li key={b} style={{ "--j": k } as CSSProperties}>
          {b}
        </li>
      ))}
    </ul>
  );
}

export function StepsExplainer({ spec }: { spec: StepsSpec }) {
  const n = spec.steps.length;
  const cols = spec.cardsColumns ?? (spec.cards ? Math.min(4, spec.cards.length) : 3);
  return (
    <div className={cn("ex-steps", spec.anchor && "ex-steps--anchored")} style={{ "--n": n } as CSSProperties}>
      {spec.anchor ? (
        <div
          className={cn("ex-steps__anchor", toneClass(spec.anchor.tone ?? "navy"))}
          style={{ "--start": 0 } as CSSProperties}
        >
          <span className="ex-steps__badge ex-steps__badge--anchor">{spec.anchor.badge}</span>
          <h3 className="font-display">{spec.anchor.title}</h3>
          {spec.anchor.body ? <p>{spec.anchor.body}</p> : null}
          {spec.anchor.label ? <small>{spec.anchor.label}</small> : null}
        </div>
      ) : null}

      <div className="ex-steps__flow">
        <div className="ex-steps__rail" aria-hidden="true">
          <i className="ex-steps__track" />
          <i className="ex-steps__progress" />
          <i className="ex-steps__tip" />
        </div>
        <ol className="ex-steps__list">
          {spec.steps.map((s, i) => (
            <li
              key={`${s.badge}-${s.title}`}
              className={cn("ex-step", toneClass(s.tone))}
              style={{ "--i": i, "--at": (i + 0.5) / n } as CSSProperties}
            >
              <span className="ex-steps__badge">{s.badge}</span>
              <div className="ex-step__card" style={{ "--start": ((i + 0.5) / n) * (1 / 1.3) - 0.02 } as CSSProperties}>
                {s.label ? <p className="ex-step__label">{s.label}</p> : null}
                <h3 className="font-display">{s.title}</h3>
                {s.body ? <p className="ex-step__body">{s.body}</p> : null}
                {s.bullets ? <RailList items={s.bullets} /> : null}
                {s.sub ? (
                  <p className="ex-step__sub">
                    {s.sub.label ? <b>{s.sub.label}</b> : null}
                    {s.sub.text}
                  </p>
                ) : null}
                {s.code ? <code className="ex-step__code">{s.code}</code> : null}
              </div>
              {spec.gaps && i < n - 1 ? (
                <div
                  className="ex-step__gap"
                  style={{ "--start": ((i + 0.5) / n) * (1 / 1.3) + 0.06 } as CSSProperties}
                >
                  <i>!</i>
                  <span>{spec.gaps[i]}</span>
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      {spec.cards ? (
        <div className="ex-steps__cards">
          {spec.cardsLabel ? <p className="ex__eyebrow">{spec.cardsLabel}</p> : null}
          <ol className="ex-cards" style={{ "--cols": cols } as CSSProperties}>
            {spec.cards.map((c, i) => (
              <li
                key={c.title}
                className={cn("ex-card", toneClass(c.tone))}
                style={{ "--start": 0.78 + i * 0.05 } as CSSProperties}
              >
                {c.label ? <p className="ex-card__label">{c.label}</p> : null}
                <h3 className="ex-card__title font-display">{c.title}</h3>
                {c.body ? <p className="ex-card__body">{c.body}</p> : null}
                {c.bullets ? <RailList items={c.bullets} /> : null}
                {c.foot ? <p className="ex-card__foot">{c.foot}</p> : null}
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}
