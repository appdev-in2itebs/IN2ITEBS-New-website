import type { CSSProperties } from "react";
import type { ExplainerBase } from "./shared";

/**
 * An account in numbers: headline figures that rise into place, a share breakdown whose bars grow
 * with the scroll, and the list of names the work spread to.
 */
export type FiguresSpec = ExplainerBase & {
  kind: "figures";
  stats: { value: string; label: string }[];
  breakdown?: { label: string; items: { value: number; label: string }[] };
  names?: { label: string; items: string[] };
};

export function FiguresExplainer({ spec }: { spec: FiguresSpec }) {
  return (
    <div className="ex-figures">
      <ol className="ex-figures__stats" style={{ "--c": spec.stats.length } as CSSProperties}>
        {spec.stats.map((s, i) => (
          <li key={s.label} className="tone-navy" data-sr data-sr-delay={(i * 0.12).toFixed(2)}>
            <b className="font-display" data-sr="rise" data-sr-delay={(i * 0.12 + 0.1).toFixed(2)}>
              {s.value}
            </b>
            <span>{s.label}</span>
          </li>
        ))}
      </ol>
      {spec.breakdown ? (
        <div className="ex-figures__breakdown">
          <p className="ex__eyebrow">{spec.breakdown.label}</p>
          <ol style={{ "--c": spec.breakdown.items.length } as CSSProperties}>
            {spec.breakdown.items.map((it, i) => (
              <li key={it.label} data-sr data-sr-delay={(i * 0.1).toFixed(2)}>
                <b>{it.value}%</b>
                <i className="ex-figures__bar">
                  <i
                    style={{ "--w": `${it.value}%` } as CSSProperties}
                    data-sr="grow-x"
                    data-sr-delay={(i * 0.1 + 0.1).toFixed(2)}
                  />
                </i>
                <span>{it.label}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
      {spec.names ? (
        <div className="ex-figures__names">
          <p className="ex__eyebrow">{spec.names.label}</p>
          <ul className="ex-chips ex-chips--names">
            {spec.names.items.map((n, i) => (
              <li key={n} data-sr="pop" data-sr-delay={(i * 0.05).toFixed(2)}>
                {n}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
