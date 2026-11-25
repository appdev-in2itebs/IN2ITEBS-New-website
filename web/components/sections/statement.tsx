import type { CSSProperties, ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { ScrollScene } from "@/components/motion/scroll-scene";
import { cn } from "@/lib/utils";
import "./statement.css";

/**
 * A single position statement on navy: centred, serif, and read in as the page scrolls. Each word
 * lights up in turn against the scene's progress, so the sentence arrives at reading pace and
 * stays lit afterwards. A thin sand rule draws underneath as the last word lands.
 *
 * Used by V2PositionSlab on every service page and by any other band that carries one sentence
 * the page wants the reader to sit with. Non-string children render centred without the reveal.
 */
export function Statement({
  children,
  id,
  eyebrow,
  className,
}: {
  children: ReactNode;
  id?: string;
  eyebrow?: string;
  className?: string;
}) {
  if (!children) return null;
  const text = typeof children === "string" ? children : null;
  const words = text ? text.split(/\s+/).filter(Boolean) : [];
  return (
    <ScrollScene
      as="section"
      id={id}
      className={cn(
        "statement theme-on-brand relative isolate overflow-hidden bg-brand py-20 text-on-brand md:py-28",
        className,
      )}
      style={{ "--n": Math.max(words.length, 1) } as CSSProperties}
      data-scene-travel="0.95"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 hero-ambient opacity-60" />
      <Container className="relative">
        <div className="statement__inner">
          {eyebrow ? <p className="statement__eyebrow">{eyebrow}</p> : null}
          <p className="statement__text font-display">
            {text
              ? words.map((w, i) => (
                  <span key={`${i}-${w}`} className="statement__word" style={{ "--i": i } as CSSProperties}>
                    {w}
                    {i < words.length - 1 ? " " : ""}
                  </span>
                ))
              : children}
          </p>
          <span aria-hidden className="statement__rule" />
        </div>
      </Container>
    </ScrollScene>
  );
}
