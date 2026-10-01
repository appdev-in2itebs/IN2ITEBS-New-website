import { Container } from "@/components/ui/container";
import { Eyebrow, Accent } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { Words } from "@/components/motion/words";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Inner-page hero: eyebrow + large display headline (with accent word) + subhead + CTA.
 *  Optional `media` renders a right-hand visual panel (e.g. <HeroMotif/> or a photo). */
export function PageHero({
  eyebrow,
  headline,
  accentWord,
  subhead,
  cta = true,
  media,
  animate = false,
  frame = true,
}: {
  eyebrow?: string;
  headline: string;
  accentWord?: string;
  subhead?: ReactNode;
  cta?: boolean;
  media?: ReactNode;
  /** Bring the headline in word by word (the homepage treatment) rather than as one block. */
  animate?: boolean;
  /** Put the media in the glass card (the default) or straight on the page. */
  frame?: boolean;
}) {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-canvas pt-36 pb-20 md:pt-44 md:pb-28">
      <div aria-hidden className="hero-ambient pointer-events-none absolute inset-0" />
      {/* The container is positioned after the ambient layer, so it already paints above it. It must not
          carry a z-index: that would open a stacking context and stop a frameless logo (HeroImage,
          mix-blend-multiply) from blending with the canvas behind it. */}
      <Container className="relative w-full">
        <div className={cn(media && "grid items-center gap-10 lg:grid-cols-2 lg:gap-16")}>
          <Reveal className="flex max-w-4xl flex-col gap-6">
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            <h1 className="text-display font-display font-bold">
              {animate ? <Words variant="rise">{headline}</Words> : headline}{" "}
              {accentWord ? <Accent>{accentWord}</Accent> : null}
            </h1>
            {subhead ? (
              <p className="max-w-measure text-lg leading-relaxed text-foreground-muted md:text-xl">{subhead}</p>
            ) : null}
            {cta ? (
              <div className="pt-2">
                <Button href={site.primaryCta.href} variant="primary" withArrow>
                  {site.primaryCta.label}
                </Button>
              </div>
            ) : null}
          </Reveal>
          {media ? (
            <Reveal delay={0.12} className="mx-auto w-full max-w-md lg:max-w-none">
              <div className={cn("aspect-[3/2] w-full lg:aspect-[5/4]", frame && "glass-elevated rounded-feature p-2")}>
                {media}
              </div>
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
