import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { ExList, toneClass, type ExplainerBase, type Tone } from "./shared";

/**
 * A grid of cards: equal members of a set, each with an eyebrow label, a title, a line or two, and
 * optionally bullets, a big figure and a footer. Tones make one card the point of the set.
 * Cards arrive left to right, row by row, as the grid scrolls in.
 */
export type CardSpec = {
  label?: string;
  title: string;
  /** A large figure or short headline shown above the title (e.g. "Eight cities"). */
  big?: string;
  body?: string;
  bullets?: string[];
  foot?: string;
  tone?: Tone;
};

export type CardsSpec = ExplainerBase & {
  kind: "cards";
  columns?: 2 | 3 | 4;
  cards: CardSpec[];
  /** Taller, airier cards for sets of four columns with lists (the "where it sits" picture). */
  variant?: "default" | "columns";
};

export function CardsExplainer({ spec }: { spec: CardsSpec }) {
  const cols = spec.columns ?? (spec.cards.length % 3 === 0 ? 3 : 4);
  return (
    <ol
      className={cn("ex-cards", spec.variant === "columns" && "ex-cards--columns")}
      style={{ "--cols": cols } as CSSProperties}
    >
      {spec.cards.map((c, i) => {
        const delay = (i % cols) * 0.3;
        return (
          <li key={c.title} className={cn("ex-card", toneClass(c.tone))} data-sr data-sr-delay={delay.toFixed(2)}>
            {c.label ? <p className="ex-card__label">{c.label}</p> : null}
            {c.big ? (
              <p className="ex-card__big font-display" data-sr="rise" data-sr-delay={(delay + 0.1).toFixed(2)}>
                {c.big}
              </p>
            ) : null}
            <h3 className={cn("ex-card__title", c.big ? "ex-card__title--sub" : "font-display")}>{c.title}</h3>
            {c.body ? <p className="ex-card__body">{c.body}</p> : null}
            {c.bullets ? <ExList items={c.bullets} delay={delay + 0.12} /> : null}
            {c.foot ? <p className="ex-card__foot">{c.foot}</p> : null}
          </li>
        );
      })}
    </ol>
  );
}
