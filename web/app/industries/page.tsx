import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Building2, GitBranch, Network } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Eyebrow, Accent, SectionHeading } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { HeroObject } from "@/components/sections/hero-media";
import { LogoMarquee } from "@/components/sections/logo-marquee";
import { CtaSection } from "@/components/sections/cta-section";
import { industries } from "@/content/industries";
import { getClientsBySectors } from "@/lib/content";

export const metadata = pageMetadata("/industries/", {
  title: "Industries",
  description:
    "Selected clients across the regulated, complex sectors where In2IT EBS has delivered SAP, Salesforce, Workday and application transformation programmes.",
});

const howEachPageWorks = [
  {
    title: "Sector body",
    body: "An overview, SAP solution offerings and capability sub-sections drawn from our delivery experience in that industry.",
  },
  {
    title: "Clients in this sector",
    body: "Logos for that industry only, grouped exactly as they appear in our portfolio — no client is shown on a sector it isn't placed in.",
  },
  {
    title: "Case studies, on request",
    body: "Detailed transformation case studies are shared on request, under NDA — never published on the open site.",
  },
];

/** Moved off the homepage on 2026-09-17: the three sectors that carry a photograph, as the
 *  opening band of this page. Names, copy, links and artwork are unchanged. */
const featuredIndustries = [
  {
    name: "Manufacturing",
    detail: "Automotive, heavy engineering and industrial products",
    href: "/industries/automobiles/",
    image: "/stock/automobiles.jpg",
    Icon: GitBranch,
    className: "md:col-span-7 md:row-span-2",
  },
  {
    name: "Energy & utilities",
    detail: "Critical infrastructure and public enterprises",
    href: "/industries/energy-utilities/",
    image: "/stock/energy-utilities.jpg",
    Icon: Network,
    className: "md:col-span-5",
  },
  {
    name: "Consumer products",
    detail: "Food, beverage and high-velocity supply chains",
    href: "/industries/fmcg/",
    image: "/stock/fmcg.jpg",
    Icon: Building2,
    className: "md:col-span-5",
  },
];

export default function IndustriesPage() {
  const otherSectorClients = getClientsBySectors(["Others"]);

  return (
    <>
      <BreadcrumbJsonLd path="/industries/" />
      <PageHero
        route="/industries/"
        eyebrow="Industries"
        headline="150+ global enterprises. Across regulated, complex"
        accentWord="industries"
        subhead="Selected clients across the sectors where we've delivered SAP, Salesforce, Workday and application transformation programmes."
        media={<HeroObject name="pages/industries" />}
        frame={false}
      />

      <section
        data-operating-context
        className="seamless-section relative scroll-mt-20 overflow-hidden bg-surface py-24 md:py-32"
      >
        <div aria-hidden className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-action/[0.06] blur-[100px]" />
        <Container className="relative">
          <Reveal className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Operating context</p>
              <h2 className="mt-5 max-w-[12ch] text-[clamp(2.65rem,5vw,5rem)] font-semibold leading-[0.97] tracking-[-0.05em]">
                Enterprise experience, grounded in the real world.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:col-start-8 lg:pt-3">
              <p className="max-w-[52ch] text-base leading-relaxed text-foreground-muted">
                Transformation behaves differently on a factory floor, across a transmission network and inside a
                regulated enterprise. Our work starts with that context.
              </p>
            </div>
          </Reveal>

          <Stagger className="mt-14 grid auto-rows-[19rem] gap-3 md:grid-cols-12">
            {featuredIndustries.map((industry) => (
              <StaggerItem key={industry.name} className={industry.className}>
                <Link
                  href={industry.href}
                  className="industry-tile group relative block h-full overflow-hidden rounded-feature bg-brand"
                >
                  <Image
                    src={industry.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 58vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-brand/95 via-brand/[0.12] to-transparent transition-colors duration-300 group-hover:from-brand"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 text-on-brand md:p-8">
                    <div>
                      <industry.Icon aria-hidden size={18} strokeWidth={1.5} className="mb-4 text-gold-on-brand" />
                      <h3 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">{industry.name}</h3>
                      <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-on-brand/70">{industry.detail}</p>
                    </div>
                    <ArrowUpRight
                      aria-hidden
                      size={20}
                      className="shrink-0 transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* INDUSTRIES WE SERVE */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Industries we serve"
              lead="Deep delivery experience across each sector — every card links to a dedicated page showing that industry's overview, capabilities and clients."
            >
              The sectors where we go <Accent>deep</Accent>.
            </SectionHeading>
          </Reveal>

          <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind) => (
              <StaggerItem key={ind.slug} className="h-full">
                <Link
                  href={`/industries/${ind.slug}/`}
                  className="group glass-card flex h-full flex-col justify-between gap-6 rounded-surface p-7"
                >
                  <h3 className="text-h3 font-bold leading-snug text-foreground">{ind.name}</h3>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-gold">
                    See clients in this sector
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.5}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* HOW EACH INDUSTRY PAGE WORKS */}
      <Section tone="white">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="How each page works"
              lead="Every industry page follows the same structure, so you can move between sectors and find what you need in the same place."
            >
              A consistent view of every <Accent>sector</Accent>.
            </SectionHeading>
          </Reveal>

          <Stagger className="grid gap-5 md:grid-cols-3">
            {howEachPageWorks.map((item, i) => (
              <StaggerItem key={item.title} className="h-full">
                <Card className="flex h-full flex-col">
                  <span className="label-caps text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 text-h3 font-bold text-foreground">{item.title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-foreground-muted">{item.body}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* CASE STUDIES — UNDER NDA */}
      <Section tone="light">
        <Container>
          <Reveal>
            <Card tone="navy" className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between md:gap-10">
              <div className="max-w-xl">
                <Eyebrow onDark>Case studies</Eyebrow>
                <h2 className="mt-4 text-h2 font-bold leading-tight">
                  Detailed case studies, on <Accent>request</Accent>.
                </h2>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-brand-muted">
                  Our detailed transformation case studies are available on request, under NDA.
                </p>
              </div>
              <div className="shrink-0">
                <Button href="/contact/" variant="on-dark" withArrow>
                  Request case studies under NDA
                </Button>
              </div>
            </Card>
          </Reveal>
        </Container>
      </Section>

      {/* OTHER SECTORS */}
      {otherSectorClients.length ? (
        <Section tone="white">
          <Container>
            <Reveal className="mb-10 max-w-2xl">
              <SectionHeading eyebrow="Other sectors">
                Enterprises beyond the named <Accent>verticals</Accent>.
              </SectionHeading>
            </Reveal>
          </Container>
          <LogoMarquee clients={otherSectorClients} />
        </Section>
      ) : null}

      <CtaSection />
    </>
  );
}
