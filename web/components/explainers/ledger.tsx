import type { ExplainerBase } from "./shared";

/**
 * Paired rows: what was found on the left, what is recommended on the right, joined by a letter
 * marker. Reads like a page of the report it illustrates, which is the point.
 */
export type LedgerSpec = ExplainerBase & {
  kind: "ledger";
  /** A small header strip, e.g. "Report section 05 · Licence position". */
  strip?: { left: string; right?: string; title: string };
  leftLabel: string;
  rightLabel: string;
  rows: { marker: string; finding: string; measure?: string; action: string }[];
  impact?: { title: string; body: string };
  footnote?: string;
};

export function LedgerExplainer({ spec }: { spec: LedgerSpec }) {
  return (
    <div className="ex-ledger">
      {spec.strip ? (
        <div className="ex-ledger__strip" data-sr="wipe">
          <span>{spec.strip.left}</span>
          <b className="font-display">{spec.strip.title}</b>
          {spec.strip.right ? <span>{spec.strip.right}</span> : null}
        </div>
      ) : null}
      <div className="ex-ledger__heads" aria-hidden="true">
        <span>{spec.leftLabel}</span>
        <span />
        <span>{spec.rightLabel}</span>
      </div>
      <ol className="ex-ledger__rows">
        {spec.rows.map((r, i) => (
          <li key={r.marker} className="ex-ledger__row">
            <div className="ex-ledger__finding" data-sr="left" data-sr-delay={(i * 0.1).toFixed(2)}>
              <p>{r.finding}</p>
              {r.measure ? <small>{r.measure}</small> : null}
            </div>
            <div className="ex-ledger__marker" aria-hidden="true">
              <i data-sr="grow-x" data-sr-delay={(i * 0.1 + 0.08).toFixed(2)} />
              <b data-sr="pop" data-sr-delay={(i * 0.1 + 0.16).toFixed(2)}>
                {r.marker}
              </b>
              <i data-sr="grow-x" data-sr-delay={(i * 0.1 + 0.2).toFixed(2)} />
            </div>
            <div className="ex-ledger__action" data-sr="right" data-sr-delay={(i * 0.1 + 0.26).toFixed(2)}>
              <p>{r.action}</p>
            </div>
          </li>
        ))}
      </ol>
      {spec.impact ? (
        <div className="ex__note" data-sr data-sr-delay="0.1">
          <b>{spec.impact.title}</b>
          <span>{spec.impact.body}</span>
        </div>
      ) : null}
      {spec.footnote ? <p className="ex__footnote">{spec.footnote}</p> : null}
    </div>
  );
}
