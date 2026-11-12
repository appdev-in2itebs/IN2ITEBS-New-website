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
            {/* The diagrams are drawn at 1760px wide and carry 12px type. Scaled to a phone they
                would be unreadable, so below roughly 720px the frame scrolls sideways instead of
                shrinking the drawing. */}
            <div className="overflow-x-auto rounded-card border border-border-subtle bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} className="block h-auto w-full min-w-[44rem]" loading="lazy" decoding="async" />
            </div>
            {caption ? <figcaption className="mt-4 text-sm text-foreground-muted">{caption}</figcaption> : null}
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
