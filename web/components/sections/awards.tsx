import Image from "next/image";
import { Container, Section } from "@/components/ui/container";
import { Accent, SectionHeading } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { accreditations, awards, qualityStatement } from "@/content/awards";

/**
 * The two halves of the existing site's /accreditation-awards/ page, in its own order and layout.
 *
 * That page runs each award as a heading with its certificate photograph directly underneath, two
 * to a row, which is what these grids reproduce — the fifth award sits alone on the last row there
 * and does the same here. The certificates are photographs of very different crops, so each sits
 * `object-contain` on a fixed 3:4 tile: nothing is cut through a signature or a logo, and the rows
 * stay even whatever the source aspect.
 *
 * The entrance is the house `.reveal` stagger, so it stands down under reduced motion and the page
 * pause control with everything else; the hover lift and the slight zoom under it are decoration
 * only, and every certificate is fully readable without either.
 */
export function AwardsGrid() {
  return (
    <Section tone="light" id="awards">
      <Container>
        <Stagger className="grid gap-6 sm:grid-cols-2">
          {awards.map((award) => (
            <StaggerItem key={award.slug} className="h-full">
              <figure
                data-award={award.slug}
                className="glass-card group flex h-full flex-col gap-5 rounded-feature p-6 transition-transform duration-500 ease-out hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:p-8"
              >
                {/* Heading above the photograph, the way the existing page orders it. */}
                <figcaption className="text-h3 font-bold leading-tight tracking-[-0.01em] text-foreground">
                  {award.name}
                </figcaption>
                <span className="relative mx-auto block aspect-[3/4] w-full max-w-sm overflow-hidden rounded-surface bg-logo-surface ring-1 ring-border-subtle">
                  <Image
                    src={award.image}
                    alt={award.name}
                    width={award.width}
                    height={award.height}
                    sizes="(min-width: 640px) 24rem, 90vw"
                    className="h-full w-full object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </span>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

/** "Accreditation" — the quality-management half of the same page: statement, then each standard. */
export function AccreditationList() {
  return (
    <Section tone="white" id="accreditation">
      <Container>
        <Reveal className="mb-12 max-w-3xl">
          <SectionHeading eyebrow="Quality management" lead={qualityStatement}>
            <Accent>Accreditation</Accent>.
          </SectionHeading>
        </Reveal>

        <Stagger className="grid gap-6 md:grid-cols-2">
          {accreditations.map((item) => (
            <StaggerItem key={item.slug} className="h-full">
              <Card tone="white" className="flex h-full flex-col gap-4">
                {/* Heading first, then the mark, then the text — the existing page's own order.
                    The badges are decorative: the heading beside each one already names it. */}
                <h3 className="text-h3 font-bold leading-tight text-foreground">{item.name}</h3>
                <span className="flex h-28 w-fit items-center justify-center overflow-hidden rounded-surface bg-logo-surface px-6 py-3.5 ring-1 ring-border-subtle">
                  <Image
                    src={item.logo}
                    alt=""
                    width={300}
                    height={250}
                    className="h-full w-auto max-w-none object-contain"
                  />
                </span>
                {item.body.map((paragraph, index) => (
                  <p key={index} className="text-[0.92rem] leading-relaxed text-foreground-muted">
                    {paragraph}
                  </p>
                ))}
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
