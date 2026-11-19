import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";

/**
 * A full-width explanatory diagram.
 *
 * The diagrams in /public/diagrams/ are hand-drawn SVGs in the brand palette: navy ink on white,
 * Accent Blue for the one thing the reader should look at, Sand for rules. They are wide (roughly
 * 1760 × 620) and they carry real type, so they are rendered at the full measure of the page rather
 * than squeezed into the hero's image panel — a diagram the reader has to zoom into is a diagram
 * nobody reads.
 *
 * They are plain <img> rather than next/image on purpose. An SVG has no raster sizes to generate,
 * the optimiser would only add a request, and the file is a few kilobytes.
 *
 * `alt` is not decoration here. Each diagram makes a point that is not made anywhere else on the
 * page, so the alt text has to carry that point for a screen reader, not name the picture. "Three
 * stages of an ECC assessment" is a caption; "ECC Prism runs in three stages — assess, decide,
 * move — with the decision gate between the second and the third" is alt text.
 */
export function DiagramBand({
  src,
  alt,
  caption,
  tone = "canvas",
}: {
  src: string;
  alt: string;
  caption?: string;
  tone?: "canvas" | "subtle";
}) {
  return (
    <section className={tone === "subtle" ? "bg-surface-subtle py-14 md:py-20" : "bg-surface py-14 md:py-20"}>
      <Container>
        <Reveal>
          <figure>
            {/*
              The diagrams are drawn at 1760px wide and carry 12.5px type, so this frame scrolls
              sideways rather than shrinking the drawing.

              That was always the stated intent and the number never matched it. At
              `min-w-[44rem]` a diagram rendered 704px wide inside a 350px phone frame — a scale
              of 0.4, which puts the body type at 5px. It scrolled, and it was still unreadable:
              the cost of a horizontal scroller with none of the benefit. Measured on a real
              390px viewport on 18 November 2026 rather than estimated.

              `min-w-[110rem]` is 1760px, so the drawing renders at its own scale and the reader
              scrolls across it full size. That is several screens wide on a phone, which is the
              honest trade for a dense reference diagram — and every page carrying one also
              carries the same content as text, so nobody depends on the picture.
            */}
            <div className="overflow-x-auto rounded-card border border-border-subtle bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} className="block h-auto w-full min-w-[110rem]" loading="lazy" decoding="async" />
            </div>
            <p className="mt-3 text-xs text-foreground-muted md:hidden">Scroll the diagram sideways to read it.</p>
            {caption ? <figcaption className="mt-4 text-sm text-foreground-muted">{caption}</figcaption> : null}
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
