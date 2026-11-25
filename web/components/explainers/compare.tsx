import type { ExplainerBase } from "./shared";

/**
 * Two figures side by side: the usual, hollow form of a number on the left and the one we publish
 * on the right, each with the same four slots underneath. The left stays grey and its slots stay
 * empty; the right fills in as it scrolls up.
 */
export type CompareSide = {
  label: string;
  value: string;
  caption: string;
  slots: { label: string; text: string }[];
  footnote?: string;
};

export type CompareSpec = ExplainerBase & {
  kind: "compare";
  left: CompareSide;
  right: CompareSide;
};

export function CompareExplainer({ spec }: { spec: CompareSpec }) {
  return (
    <div className="ex-compare">
      {[spec.left, spec.right].map((side, s) => (
        <div
          key={side.label}
          className={s === 0 ? "ex-compare__side ex-compare__side--left" : "ex-compare__side"}
          data-sr
          data-sr-delay={(s * 0.15).toFixed(2)}
        >
          <p className="ex__eyebrow">{side.label}</p>
          <p className="ex-compare__value font-display" data-sr="rise" data-sr-delay={(s * 0.15 + 0.1).toFixed(2)}>
            {side.value}
          </p>
          <p className="ex-compare__caption">{side.caption}</p>
          <dl>
            {side.slots.map((slot, k) => (
              <div key={slot.label} data-sr="left" data-sr-delay={(s * 0.15 + 0.2 + k * 0.08).toFixed(2)}>
                <dt>{slot.label}</dt>
                <dd>{slot.text}</dd>
              </div>
            ))}
          </dl>
          {side.footnote ? <p className="ex__footnote">{side.footnote}</p> : null}
        </div>
      ))}
    </div>
  );
}
