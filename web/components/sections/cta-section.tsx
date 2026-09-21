import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/content/site";
import type { ReactNode } from "react";

export function CtaSection({
  eyebrow = "Let's begin",
  heading,
  body = "Tell us where you want to go. We'll bring the platforms, the people and the proof—and map your first move in a single conversation.",
  ctaLabel = site.primaryCta.label,
  ctaHref = site.primaryCta.href,
}: {
  eyebrow?: string;
  heading?: ReactNode;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-canvas py-24 text-foreground md:py-32">
      <div aria-hidden className="absolute inset-0 section-tint-b" />
      <div
        aria-hidden
        className="ambient-orb ambient-orb-c absolute -right-24 top-10 h-80 w-80 rounded-full bg-action/[0.10] blur-[100px]"
      />
      <Container className="relative">
        <div className="glass rounded-feature p-8 md:p-14">
          <Reveal className="grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{eyebrow}</p>
              <h2 className="mt-6 max-w-[17ch] text-[clamp(2.65rem,4.8vw,4.9rem)] font-semibold leading-[0.98] tracking-[-0.05em]">
                {heading ?? <>Your transformation starts with a conversation.</>}
              </h2>
            </div>

            <div className="border-t border-border-strong pt-7 lg:col-span-4">
              <p className="max-w-[48ch] text-base leading-relaxed text-foreground-muted">{body}</p>
              <div className="mt-7 flex flex-col items-start gap-5">
                <Button href={ctaHref} variant="primary" withArrow>
                  {ctaLabel}
                </Button>
                <p className="text-sm text-foreground-muted">
                  Prefer email?{" "}
                  <a
                    href={`mailto:${site.primaryEmail}`}
                    className="font-semibold text-foreground underline decoration-gold/40 underline-offset-4 hover:text-action hover:decoration-gold"
                  >
                    {site.primaryEmail}
                  </a>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
