import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { toneClass, type ExplainerBase, type Tone } from "./shared";

/**
 * Rows against columns, where the point is the pattern of what is and is not there: four kinds of
 * footprint against five countries, four levels of evidence against four practice areas. Cells
 * arrive in reading order, row by row; empty cells stay quiet so the gaps read as gaps.
 */
export type MatrixCell = {
  text?: string;
  items?: string[];
  tone?: Tone;
  /** Shown muted and smaller: "none", "nothing at this level". */
  empty?: string;
};

export type MatrixSpec = ExplainerBase & {
  kind: "matrix";
  columns: { title: string; sub?: string; subTone?: "steel" | "muted" }[];
  rows: { label: string; hint?: string; tone?: Tone; cells: MatrixCell[] }[];
};

export function MatrixExplainer({ spec }: { spec: MatrixSpec }) {
  const c = spec.columns.length;
  return (
    <div className="ex-matrix" style={{ "--c": c } as CSSProperties} role="table" aria-label={spec.summary}>
      <div className="ex-matrix__row ex-matrix__row--head" role="row">
        <div className="ex-matrix__corner" role="columnheader" />
        {spec.columns.map((col, k) => (
          <div
            key={col.title}
            className="ex-matrix__col"
            role="columnheader"
            data-sr
            data-sr-delay={(k * 0.08).toFixed(2)}
          >
            <b className="font-display">{col.title}</b>
            {col.sub ? <small className={col.subTone === "muted" ? "is-muted" : undefined}>{col.sub}</small> : null}
          </div>
        ))}
      </div>
      {spec.rows.map((row, r) => (
        <div key={row.label} className={cn("ex-matrix__row", toneClass(row.tone))} role="row">
          <div className="ex-matrix__label" role="rowheader" data-sr="left" data-sr-delay={(r * 0.06).toFixed(2)}>
            <p>{row.label}</p>
            {row.hint ? <small>{row.hint}</small> : null}
          </div>
          {row.cells.map((cell, k) => (
            <div
              key={k}
              className={cn("ex-matrix__cell", cell.tone ? toneClass(cell.tone) : undefined, cell.empty && "is-empty")}
              role="cell"
              data-col={spec.columns[k]?.title}
              data-sr
              data-sr-delay={(r * 0.06 + 0.1 + k * 0.07).toFixed(2)}
            >
              {cell.empty ? <span>{cell.empty}</span> : null}
              {cell.text ? <span>{cell.text}</span> : null}
              {cell.items ? (
                <ul>
                  {cell.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
