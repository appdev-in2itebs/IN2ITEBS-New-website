import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Accent, SectionHeading } from "@/components/ui/typography";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { CtaSection } from "@/components/sections/cta-section";
import { insights } from "@/content/insights";

export const metadata = pageMetadata("/insights/", {
  title: "Insights",
  description:
    "Perspectives on enterprise transformation — SAP, SuccessFactors, AI and the technologies reshaping the enterprise.",
});

export default function InsightsPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/insights/" />
      <PageHero
        eyebrow="Insights"
        headline="Perspectives on enterprise"
        accentWord="transformation"
        subhead="Points of view from our practices on SAP, SuccessFactors, AI and the technologies reshaping the enterprise."
      />

      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading eyebrow="From our article archive">
              Ideas worth <Accent>reading</Accent>.
            </SectionHeading>
          </Reveal>
          <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {insights.map((a, index) => (
              <StaggerItem key={a.slug} className="h-full">
                <Link
                  href={a.href ?? `/insights/${a.slug}/`}
                  data-insight-card={a.slug}
                  className="group glass-card flex h-full flex-col overflow-hidden rounded-surface"
                >
                  {/* The article's own image and its date, as the live listing shows them. */}
                  <span className="relative block aspect-[16/10] w-full overflow-hidden bg-surface-subtle">
                    {a.image && (
                      <Image
                        src={a.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 26rem, (min-width: 768px) 45vw, 90vw"
                        loading={index < 3 ? "eager" : "lazy"}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      />
                    )}
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-brand/70 via-brand/10 to-transparent"
                    />
                    {(a.date || a.dateLabel) && (
                      <span className="absolute bottom-4 left-4 inline-flex items-center rounded-full bg-gold px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-on-action">
                        {a.dateLabel || a.date}
                      </span>
                    )}
                  </span>
                  <span className="flex flex-1 flex-col gap-3 p-6">
                    <span className="label-caps text-gold">{a.category}</span>
                    <h2 className="text-lg font-semibold leading-snug tracking-[-0.02em] transition-colors group-hover:text-action">
                      {a.title}
                    </h2>
                    <p className="line-clamp-3 text-sm leading-relaxed text-foreground-muted">{a.excerpt}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-4 text-xs font-semibold uppercase tracking-[0.12em] text-foreground group-hover:text-action">
                      Read more <ArrowRight aria-hidden size={16} />
                    </span>
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
