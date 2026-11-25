/** Types and small pieces every explainer kind uses. Kept apart from explainer.tsx so the kinds
 *  never import the dispatcher that imports them. */
export type Tone = "navy" | "steel" | "light" | "plain";

export type ExplainerBase = {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  lede?: string;
  /** What the drawing says, for assistive technology; the job the SVG's alt text used to do. */
  summary: string;
  /** A navy band at the end: the one sentence the reader should leave with, plus its reason. */
  note?: { title: string; body?: string };
  /** A quiet closing line after the note (or instead of it). */
  closing?: { title: string; body?: string };
};

/** Shared bullet list with the drawn-in dash marker. */
export function ExList({ items, delay = 0, step = 0.07 }: { items: string[]; delay?: number; step?: number }) {
  return (
    <ul className="ex-list">
      {items.map((b, k) => (
        <li key={b} data-sr="left" data-sr-delay={(delay + k * step).toFixed(2)}>
          {b}
        </li>
      ))}
    </ul>
  );
}

export function toneClass(tone?: Tone) {
  return `tone-${tone ?? "plain"}`;
}
