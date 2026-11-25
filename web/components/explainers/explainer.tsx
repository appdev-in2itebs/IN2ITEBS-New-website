import type { CSSProperties, ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { ScrollScene } from "@/components/motion/scroll-scene";
import { cn } from "@/lib/utils";
import { StageFlow, type StagesDiagram } from "@/components/sections/stage-flow";
import { CardsExplainer, type CardsSpec } from "./cards";
import { StepsExplainer, type StepsSpec } from "./steps";
import { LayersExplainer, type LayersSpec } from "./layers";
import { MatrixExplainer, type MatrixSpec } from "./matrix";
import { LedgerExplainer, type LedgerSpec } from "./ledger";
import { FiguresExplainer, type FiguresSpec } from "./figures";
import { CompareExplainer, type CompareSpec } from "./compare";
import { ScatterExplainer, type ScatterSpec } from "./scatter";
import type { ExplainerBase } from "./shared";
import "./explainer.css";

export type { Tone, ExplainerBase } from "./shared";

/**
 * Explainers: the former /public/diagrams SVGs rebuilt as live, scroll-choreographed HTML.
 *
 * Each page keeps describing WHAT it shows (a spec in content/explainers.ts); the kinds here decide
 * HOW. Every kind shares the same head (eyebrow, serif title with an italic accent, optional lede),
 * the same note bands, the same tones and the same scroll engine (components/motion/scroll-scene),
 * so the pages read as one family and the motion is consistent: things arrive in reading order as
 * the reader scrolls down, and stay once they have arrived.
 */
export type ExplainerSpec =
  | StagesDiagram
  | CardsSpec
  | StepsSpec
  | LayersSpec
  | MatrixSpec
  | LedgerSpec
  | FiguresSpec
  | CompareSpec
  | ScatterSpec;

/** A diagram slot on a page: either a drawn SVG (legacy) or a live explainer. */
export type DiagramSlot = { src: string; alt: string; caption?: string } | ExplainerSpec;

export function isExplainer(d: DiagramSlot): d is ExplainerSpec {
  return "kind" in d;
}

export function Explainer({ spec, tone = "subtle" }: { spec: ExplainerSpec; tone?: "canvas" | "subtle" }) {
  if (spec.kind === "stages") return <StageFlow diagram={spec} tone={tone} />;
  let body: ReactNode;
  switch (spec.kind) {
    case "cards":
      body = <CardsExplainer spec={spec} />;
      break;
    case "steps":
      body = <StepsExplainer spec={spec} />;
      break;
    case "layers":
      body = <LayersExplainer spec={spec} />;
      break;
    case "matrix":
      body = <MatrixExplainer spec={spec} />;
      break;
    case "ledger":
      body = <LedgerExplainer spec={spec} />;
      break;
    case "figures":
      body = <FiguresExplainer spec={spec} />;
      break;
    case "compare":
      body = <CompareExplainer spec={spec} />;
      break;
    case "scatter":
      body = <ScatterExplainer spec={spec} />;
      break;
  }
  return (
    <ExplainerFrame spec={spec} tone={tone} kind={spec.kind} travel={spec.kind === "steps" ? "1.4" : undefined}>
      {body}
    </ExplainerFrame>
  );
}

export function ExplainerFrame({
  spec,
  tone,
  kind,
  children,
  style,
  travel,
}: {
  spec: ExplainerBase;
  tone: "canvas" | "subtle";
  kind: string;
  children: ReactNode;
  style?: CSSProperties;
  /** Longer scroll run for sequences (a fraction of the viewport); see ScrollScene. */
  travel?: string;
}) {
  return (
    <ScrollScene
      as="section"
      className={cn("ex", `ex--${kind}`, tone === "subtle" ? "bg-surface-subtle" : "bg-surface", "py-14 md:py-20")}
      aria-label={spec.summary}
      style={style}
      data-scene-travel={travel}
    >
      <Container>
        <div className="ex__head" data-sr="fade">
          {spec.eyebrow ? <p className="ex__eyebrow">{spec.eyebrow}</p> : null}
          <h2 className="ex__title font-display">
            {spec.title} {spec.titleAccent ? <em>{spec.titleAccent}</em> : null}
          </h2>
          {spec.lede ? <p className="ex__lede">{spec.lede}</p> : null}
        </div>
        {children}
        {spec.note ? (
          <div className="ex__note" data-sr data-sr-delay="0.1">
            <b>{spec.note.title}</b>
            {spec.note.body ? <span>{spec.note.body}</span> : null}
          </div>
        ) : null}
        {spec.closing ? (
          <div className="ex__closing" data-sr data-sr-delay="0.15">
            <b>{spec.closing.title}</b>
            {spec.closing.body ? <span>{spec.closing.body}</span> : null}
          </div>
        ) : null}
      </Container>
    </ScrollScene>
  );
}
