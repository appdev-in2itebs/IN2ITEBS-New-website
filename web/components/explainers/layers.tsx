import type { CSSProperties } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ExList, toneClass, type ExplainerBase, type Tone } from "./shared";

/**
 * Full-width bands stacked top to bottom: layers of an offer, tiers of a service, severity rows,
 * sectors of a reference book. Each band wipes in from the left as it scrolls into view and its
 * contents settle a beat later. A band can carry bullets in columns, chips, named entries, or
 * labelled columns (response / resolution).
 */
export type LayerSpec = {
  /** Small uppercase label: "ADVISE", "THE CORE", "S1". */
  label: string;
  /** Second line under the label: "Critical", "S/4HANA · ECC · Business Suite". */
  sub?: string;
  title?: string;
  body?: string;
  tone: Tone;
  bullets?: string[];
  chips?: string[];
  /** `href` links the name to its case study (only where that reveals no anonymised client). */
  entries?: { name: string; text: string; href?: string }[];
  cols?: { label: string; text: string }[];
  foot?: { label: string; text: string };
};

export type LayersSpec = ExplainerBase & {
  kind: "layers";
  layers: LayerSpec[];
  /** Headings shown once above the `cols` of every band (e.g. Response / Resolution). */
  colHeads?: string[];
};

export function LayersExplainer({ spec }: { spec: LayersSpec }) {
  return (
    <div className="ex-layers">
      {spec.colHeads ? (
        <div className="ex-layers__heads" aria-hidden="true">
          {spec.colHeads.map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>
      ) : null}
      <ol className="ex-layers__list">
        {spec.layers.map((l, i) => (
          <li
            key={l.label}
            className={cn("ex-layer", toneClass(l.tone))}
            data-sr="wipe"
            data-sr-delay={(i * 0.08).toFixed(2)}
          >
            <div className="ex-layer__lead" data-sr="fade" data-sr-delay={(i * 0.08 + 0.12).toFixed(2)}>
              <p className="ex-layer__label">{l.label}</p>
              {l.sub ? <p className="ex-layer__sub">{l.sub}</p> : null}
              {l.title ? <h3 className="ex-layer__title font-display">{l.title}</h3> : null}
              {l.body ? <p className="ex-layer__body">{l.body}</p> : null}
            </div>
            <div className="ex-layer__content">
              {l.bullets ? <ExList items={l.bullets} delay={i * 0.08 + 0.16} step={0.05} /> : null}
              {l.chips ? (
                <ul className="ex-chips">
                  {l.chips.map((c, k) => (
                    <li key={c} data-sr="pop" data-sr-delay={(i * 0.08 + 0.14 + k * 0.04).toFixed(2)}>
                      {c}
                    </li>
                  ))}
                </ul>
              ) : null}
              {l.entries ? (
                <ul className="ex-entries">
                  {l.entries.map((e, k) => (
                    <li key={e.name} data-sr data-sr-delay={(i * 0.08 + 0.14 + k * 0.05).toFixed(2)}>
                      {e.href ? (
                        <Link href={e.href} className="ex-entry-link">
                          <b>{e.name}</b>
                        </Link>
                      ) : (
                        <b>{e.name}</b>
                      )}
                      <span>{e.text}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {l.cols ? (
                <div className="ex-layer__cols" style={{ "--c": l.cols.length } as CSSProperties}>
                  {l.cols.map((c, k) => (
                    <div key={c.label} data-sr="rise" data-sr-delay={(i * 0.08 + 0.18 + k * 0.08).toFixed(2)}>
                      <small>{c.label}</small>
                      <b>{c.text}</b>
                    </div>
                  ))}
                </div>
              ) : null}
              {l.foot ? (
                <p className="ex-layer__foot" data-sr="fade" data-sr-delay={(i * 0.08 + 0.3).toFixed(2)}>
                  <small>{l.foot.label}</small>
                  {l.foot.text}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
