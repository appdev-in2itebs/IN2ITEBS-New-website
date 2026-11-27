import type { CSSProperties } from "react";
import type { ExplainerBase } from "./shared";

/**
 * A portfolio map: every application placed by business value (up) against cost and risk to
 * change (right), sized by what it costs to run, coloured by its disposition. Dots land one by one
 * as the plot scrolls in; a few carry labels.
 */
export type ScatterSpec = ExplainerBase & {
  kind: "scatter";
  xLabel: string;
  yLabel: string;
  legend: { label: string; swatch: "navy" | "steel" | "light" | "pale" | "sand" }[];
  /** x, y in percent of the plot (y measured from the top), r in pixels at desktop width. */
  points: { x: number; y: number; r: number; swatch: ScatterSpec["legend"][number]["swatch"]; label?: string }[];
  caption?: string;
};

export function ScatterExplainer({ spec }: { spec: ScatterSpec }) {
  return (
    <figure className="ex-scatter">
      <div className="ex-scatter__plot" role="img" aria-label={spec.summary}>
        <i className="ex-scatter__grid" aria-hidden="true" />
        <span className="ex-scatter__y">{spec.yLabel}</span>
        <span className="ex-scatter__x">{spec.xLabel}</span>
        {spec.points.map((p, i) => (
          <i
            key={i}
            className={`ex-scatter__dot swatch-${p.swatch}`}
            style={{ "--x": `${p.x}%`, "--y": `${p.y}%`, "--r": `${p.r}px` } as CSSProperties}
            data-sr="pop"
            data-sr-delay={(0.1 + (i % 9) * 0.05 + Math.floor(i / 9) * 0.1).toFixed(2)}
          >
            {p.label ? <b>{p.label}</b> : null}
          </i>
        ))}
      </div>
      <ul className="ex-scatter__legend" data-sr="fade" data-sr-delay="0.3">
        {spec.legend.map((l) => (
          <li key={l.label}>
            <i className={`swatch-${l.swatch}`} />
            {l.label}
          </li>
        ))}
      </ul>
      {spec.caption ? <figcaption className="ex__footnote">{spec.caption}</figcaption> : null}
    </figure>
  );
}
