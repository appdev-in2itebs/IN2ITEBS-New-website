import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container, Section } from "@/components/ui/container";
import { Eyebrow, Accent, SectionHeading } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaSection } from "@/components/sections/cta-section";

export const metadata = pageMetadata("/sap-enterprise-solutions/grow-fast/", {
  title: "SAP GROW Fast",
  description:
    "Go live on SAP S/4HANA Cloud in weeks, not months — fixed scope, fixed price and Joule AI from day one, in three In2IT EBS Converge packages.",
});

/**
 * SAP GROW Fast — the port of the existing site's /sap-grow-fast/ page.
 *
 * This is the newest page on the existing site and the only one already written in this site's
 * voice, so it is carried over close to word for word: what GROW Fast is, where the value shows up,
 * why In2IT EBS, and the three Converge packages. The banner is the existing page's own, which was
 * already drawn in the current brand.
 */

/** Where the value shows up — the four the existing page names. */
const value = [
  {
    title: "Guaranteed speed to value",
    body: "You go live in weeks instead of quarters. Most first-wave go-lives land in sixteen weeks or less.",
  },
  {
    title: "Reduced risk",
    body: "The scope and the methodology are already battle-tested rather than reinvented for your project.",
  },
  {
    title: "Transparent, fixed costs",
    body: "Fixed from day one, with no service-fee surprises once the contract is signed.",
  },
  {
    title: "Minimal disruption",
    body: "Your business keeps running while the implementation happens around it, not instead of it.",
  },
];

/** Three packages, one converged core — the existing page's offering set. */
const packages = [
  {
    title: "In2IT Converge Pulse",
    body: "Pairs Cloud ERP with Core HR, so finance and people operations run on one connected core instead of two disconnected systems — hire to pay, pay to close, with the same AI copilot supporting both sides of the business.",
  },
  {
    title: "In2IT Converge Momentum",
    body: "Pairs Cloud ERP with Professional Services, built for consulting, engineering and project-based businesses that need staffing, billing and financial close to move at the same speed as client delivery — not a wave behind it.",
  },
  {
    title: "In2IT Converge Flow",
    body: "Pairs Cloud ERP with Mill Products, and covers exactly what that name implies: sugar, rice, wheat, textile and metal mills alike. One order-to-cash pattern, batch and lot traceability included, with no material-specific rebuild required to make it fit your operation.",
  },
];

export default function GrowFastPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/sap-enterprise-solutions/grow-fast/" />
      <PageHero
        eyebrow="SAP Enterprise Solutions · SAP GROW Fast"
        headline="Go live in weeks, not"
        accentWord="months."
        subhead="Most companies that put off moving to a modern ERP are not dragging their feet because they cannot see the value. They are dragging their feet because “ERP implementation” has become shorthand for eighteen months of workshops, a budget that keeps drifting and a go-live date that keeps slipping. SAP GROW Fast exists to remove that trade-off."
      />

      {/* THE BANNER + WHAT IT IS */}
      <Section tone="white">
        <Container>
          <Reveal>
            <Image
              src="/services/sap-grow-fast-banner.jpg"
              alt="SAP GROW Fast, Converged — go live on SAP S/4HANA Cloud in weeks, not months, with fixed scope, fixed price and Joule AI built in from day one; sixteen weeks to go-live, three packages: Pulse, Momentum and Flow."
              width={1123}
              height={376}
              sizes="(min-width: 1024px) 72rem, 100vw"
              className="h-auto w-full rounded-feature"
              priority
            />
          </Reveal>

          <Reveal className="mb-12 mt-20 max-w-2xl">
            <SectionHeading
              eyebrow="What SAP GROW Fast actually is"
              lead="SAP's accelerated path onto Cloud ERP — a pre-defined, SAP-validated scope covering the processes every business runs on: Finance, Order-to-Cash and Procure-to-Pay."
            >
              A proven scope, not a blank <Accent>page</Accent>.
            </SectionHeading>
          </Reveal>

          <Stagger className="grid gap-5 md:grid-cols-2">
            <StaggerItem className="h-full">
              <Card bezel className="h-full">
                <Eyebrow>Fit-to-standard, fixed-price</Eyebrow>
                <p className="mt-5 text-[0.95rem] leading-relaxed text-foreground-muted">
                  Instead of designing your ERP from a blank page, you start from a proven, fit-to-standard scope and
                  configuration, delivered by a certified partner on a fixed price and a fixed timeline. Most first-wave
                  go-lives land in sixteen weeks or less.
                </p>
              </Card>
            </StaggerItem>
            <StaggerItem className="h-full">
              <Card bezel className="h-full">
                <Eyebrow>Joule, from day one</Eyebrow>
                <p className="mt-5 text-[0.95rem] leading-relaxed text-foreground-muted">
                  What makes this a genuinely modern ERP rather than just a faster old one is Joule, SAP&rsquo;s AI
                  copilot, active from day one. From your very first go-live your team is not learning a new system cold
                  — they have an assistant that understands natural language, helps them navigate and flags issues
                  before they become problems.
                </p>
              </Card>
            </StaggerItem>
            <StaggerItem className="h-full md:col-span-2">
              <Card bezel className="h-full">
                <Eyebrow>Land and expand</Eyebrow>
                <p className="mt-5 max-w-[80ch] text-[0.95rem] leading-relaxed text-foreground-muted">
                  &ldquo;Fast&rdquo; does not mean &ldquo;limited&rdquo;. SAP GROW Fast follows a land-and-expand model:
                  your first wave gets you live with the essentials in one entity and one country, and every wave after
                  that — additional countries, deeper integrations, industry-specific capability — happens on your
                  timeline, not a vendor&rsquo;s.
                </p>
              </Card>
            </StaggerItem>
          </Stagger>
        </Container>
      </Section>

      {/* VALUE */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Where the value shows up"
              lead="Four things at once, rather than one traded against another."
            >
              Fast and <Accent>right</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={value} columns={4} bezel />
        </Container>
      </Section>

      {/* WHY IN2IT EBS */}
      <Section tone="navy" className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07]">
          <div className="absolute -right-24 top-10 h-[30rem] w-[30rem] origin-center rotate-45 border-[64px] border-gold-on-brand" />
        </div>
        <Container>
          <Reveal className="max-w-3xl">
            <Eyebrow onDark>Why In2IT EBS</Eyebrow>
            <h2 className="mt-5 text-h2 font-bold">
              A discipline, not a <Accent>badge</Accent>.
            </h2>
            <p className="mt-7 max-w-[70ch] text-base leading-relaxed text-brand-muted">
              Being SAP-qualified as a partner-packaged solution provider is not a badge we point to — it is a
              discipline we deliver against. Our GROW Fast practice runs on a clear delivery methodology, RACI-defined
              roles and the quality gates SAP itself recommends, so &ldquo;fast&rdquo; never comes at the expense of
              &ldquo;right&rdquo;. That is what Converged Intelligence means to us: bringing SAP&rsquo;s platform, AI
              and our own delivery discipline together into one dependable outcome, not three separate risks.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* PACKAGES */}
      <Section tone="white">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Three packages. One converged core."
              lead="Every In2IT EBS GROW Fast offering starts from the same mandatory Cloud ERP backbone, then adds the specialisation your business actually runs on."
            >
              Pick the one you already <Accent>are</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={packages} columns={3} bezel />

          <Reveal className="mt-12">
            <Link
              href="/sap-enterprise-solutions/rise-vs-grow/"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gold hover:underline"
            >
              Not sure GROW is the right path? Compare RISE and GROW <ArrowUpRight aria-hidden size={17} />
            </Link>
          </Reveal>
        </Container>
      </Section>

      <CtaSection
        eyebrow="Ready when you are"
        heading={
          <>
            Fixed scope. Fixed price. Weeks, not <Accent>quarters</Accent>.
          </>
        }
        body="If your business has been putting off ERP modernisation because “not now” felt safer than an open-ended project, SAP GROW Fast changes that math. Talk to us about which GROW Fast package fits your business."
      />
    </>
  );
}
