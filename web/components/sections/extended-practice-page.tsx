import Link from "next/link";
import { PageHero } from "./page-hero";
import { HeroObject } from "./hero-media";
import { Container, Section } from "@/components/ui/container";
import { CtaSection } from "./cta-section";
import { extendedPractices } from "@/content/extended-practices";
import { ArrowUpRight } from "lucide-react";
export function ExtendedPracticePage({ practice }: { practice: keyof typeof extendedPractices }) {
  const content = extendedPractices[practice];
  return (
    <>
      <PageHero
        route={`/${practice}/`}
        eyebrow={`${content.name} practice`}
        headline={content.headline}
        subhead={content.summary}
        media={<HeroObject name={`pages/${practice}` as const} />}
        frame={false}
      />
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
            <div>
              <h2 className="text-h2 font-semibold">A clear starting point.</h2>
              <p className="mt-5 max-w-measure text-foreground-muted">
                Choose the part of your landscape you want to improve. We will discuss scope, dependencies and the
                delivery approach before recommending a programme.
              </p>
              <Link
                href="/platform-services/"
                className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-action"
              >
                All platform practices <ArrowUpRight size={16} aria-hidden />
              </Link>
            </div>
            <div>
              {content.sections.map((section, index) => (
                <section id={section.id} key={section.id} className="border-t border-border-subtle py-7">
                  <div className="flex items-start gap-5">
                    <span aria-hidden className="pt-1 text-sm text-action">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="text-h3 font-semibold">{section.title}</h3>
                      <p className="mt-3 max-w-measure leading-relaxed text-foreground-muted">{section.body}</p>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </div>
        </Container>
      </Section>
      <CtaSection
        eyebrow={`${content.name} services`}
        heading={`Discuss your ${content.name} landscape.`}
        body="Tell us which systems you use today and what needs to change. We will connect you with the relevant practice."
        ctaLabel={`Discuss ${content.name}`}
        ctaHref={`/contact/?interest=${content.name}`}
      />
    </>
  );
}
