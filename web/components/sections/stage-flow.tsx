import type { CSSProperties } from "react";
import { Container } from "@/components/ui/container";
import { ScrollScene } from "@/components/motion/scroll-scene";
import { cn } from "@/lib/utils";
import "./stage-flow.css";

/**
 * A staged engagement told in order, as live HTML rather than a drawn SVG: a rail that draws as
 * the reader scrolls, a node per stage, a card per stage that rises in as the rail reaches it, and
 * the deliverables arriving one by one. Decision markers sit between stages because that is the
 * commercial point of a "sellable on its own" structure.
 *
 * Why not the SVG: the drawings in /public/diagrams carry real type, but inside an <img> the brand
 * fonts never load and the whole thing has to scroll sideways on a phone. Here the text is the
 * page's own text (searchable, readable by a screen reader, right fonts), the layout reflows, and
 * the scroll-linked build gives the reader the order for free and holds once each stage has landed.
 * See components/motion/scroll-scene.tsx for the engine.
 */
export type StageFlowStage = {
  label: string;
  duration: string;
  title: string;
  body: string;
  bullets: string[];
  /** Small print in the card footer: the pricing basis, usually. */
  foot?: string;
  link?: { label: string; href: string };
};

export type StagesDiagram = {
  kind: "stages";
  eyebrow?: string;
  title: string;
  /** The italic, accent-coloured tail of the title, e.g. "Each one sellable on its own." */
  titleAccent?: string;
  /** What the drawing says, for assistive technology; the same job the SVG's alt text did. */
  summary: string;
  stages: StageFlowStage[];
  /** Label shown between stages; omit to show no markers. */
  decisionLabel?: string;
  note?: { title: string; body: string };
};

export function StageFlow({ diagram, tone = "subtle" }: { diagram: StagesDiagram; tone?: "canvas" | "subtle" }) {
  const n = diagram.stages.length;
  return (
    <ScrollScene
      as="section"
      className={cn("stage-flow", tone === "subtle" ? "bg-surface-subtle" : "bg-surface", "py-14 md:py-20")}
      aria-label={diagram.summary}
      style={{ "--n": n } as CSSProperties}
      data-scene-travel="1.25"
    >
      <Container>
        <div className="stage-flow__head" data-sr="fade">
          {diagram.eyebrow ? <p className="stage-flow__eyebrow">{diagram.eyebrow}</p> : null}
          <h2 className="stage-flow__title font-display">
            {diagram.title} {diagram.titleAccent ? <em>{diagram.titleAccent}</em> : null}
          </h2>
        </div>

        <div className="stage-flow__flow">
          <div className="stage-flow__rail" aria-hidden="true">
            <i className="stage-flow__track" />
            <i className="stage-flow__progress" />
            <i className="stage-flow__tip" />
            {diagram.stages.map((s, i) => (
              <span
                key={s.title}
                className="stage-flow__node"
                style={{ "--i": i, "--at": (i + 0.5) / n } as CSSProperties}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            ))}
            {diagram.decisionLabel
              ? diagram.stages.slice(1).map((s, i) => (
                  <span
                    key={`d-${s.title}`}
                    className="stage-flow__decision"
                    style={{ "--at": (i + 1) / n } as CSSProperties}
                  >
                    {diagram.decisionLabel}
                  </span>
                ))
              : null}
          </div>

          <ol className="stage-flow__grid">
            {diagram.stages.map((s, i) => (
              <li
                key={s.title}
                className={cn("stage-flow__card", `stage-flow__card--${Math.min(i, 2)}`)}
                style={{ "--start": ((i + 0.5) / n) * (1 / 1.12) - 0.02 } as CSSProperties}
              >
                <div className="stage-flow__band">
                  <b>{s.label}</b>
                  <span className="stage-flow__chip">{s.duration}</span>
                </div>
                <div className="stage-flow__body">
                  <h3 className="font-display">
                    {s.title} <small>{String(i + 1).padStart(2, "0")}</small>
                  </h3>
                  <p>{s.body}</p>
                  <hr />
                  <ul>
                    {s.bullets.map((b, k) => (
                      <li key={b} style={{ "--j": k } as CSSProperties}>
                        {b}
                      </li>
                    ))}
                  </ul>
                  {s.foot || s.link ? (
                    <div className="stage-flow__foot">
                      {s.foot ? <span>{s.foot}</span> : <span />}
                      {s.link ? <a href={s.link.href}>{s.link.label}</a> : null}
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>

          {diagram.note ? (
            <div className="stage-flow__note">
              <b>{diagram.note.title}</b>
              <span>{diagram.note.body}</span>
            </div>
          ) : null}
        </div>
      </Container>
    </ScrollScene>
  );
}
