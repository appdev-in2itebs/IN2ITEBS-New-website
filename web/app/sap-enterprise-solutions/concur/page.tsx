import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container, Section } from "@/components/ui/container";
import { Eyebrow, Accent, SectionHeading } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { HeroObject } from "@/components/sections/hero-media";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaSection } from "@/components/sections/cta-section";

export const metadata = pageMetadata("/sap-enterprise-solutions/concur/", {
  title: "SAP Concur",
  description:
    "Connect travel, expense and invoice workflows with SAP Concur, including policy controls and finance integration.",
});

/** The three Concur pillars — Blueprint §8.5. */
const pillars = [
  {
    title: "Expense",
    body: "Spend that audits itself.",
    bullets: [
      "Mobile receipt capture",
      "Automated policy enforcement",
      "Corporate card feeds",
      "Intelligent, AI-assisted audit",
    ],
  },
  {
    title: "Travel",
    body: "Booking, managed end-to-end.",
    bullets: [
      "Online booking within policy",
      "Traveller policy management",
      "Duty-of-care reporting",
      "TMC and itinerary integration",
    ],
  },
  {
    title: "Invoice",
    body: "Accounts payable, automated.",
    bullets: ["Supplier invoice capture", "Three-way match", "Payment processing", "End-to-end AP automation"],
  },
];

/** Integration map — Blueprint §8.5. */
const integrations = [
  {
    title: "ERP & Finance",
    body: "SAP S/4HANA, Oracle EBS, Microsoft Dynamics 365, NetSuite, Intacct and QuickBooks — so spend posts cleanly into your books.",
  },
  {
    title: "HR & Workforce",
    body: "SuccessFactors, Workday and Oracle HCM — employee, cost-centre and approval hierarchies kept in sync.",
  },
  {
    title: "Travel & Card",
    body: "Identity providers, corporate card feeds and travel management companies — connected to the right people and budgets.",
  },
];

export default function ConcurPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/sap-enterprise-solutions/concur/" />
      <PageHero
        route="/sap-enterprise-solutions/concur/"
        eyebrow="SAP Enterprise Solutions · Concur"
        headline="Travel, expense and invoice —"
        accentWord="under control."
        subhead="SAP Concur across Expense, Travel and Invoice — automated capture, policy enforcement and AP automation, integrated cleanly into your finance and HR landscape."
        media={<HeroObject name="pages/sap-concur" />}
        frame={false}
      />

      {/* THREE PILLARS */}
      <Section tone="white">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="What we deliver"
              lead="One platform across the three spend journeys — each automated, policy-driven and integrated, rather than three disconnected tools."
            >
              Three pillars of <Accent>spend</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={pillars} columns={3} bezel />
        </Container>
      </Section>

      {/* INTEGRATION MAP */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Integration map"
              lead="Concur only delivers value when it sits inside your landscape, not beside it. We connect it across finance, HR and travel."
            >
              Connected where it <Accent>counts</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={integrations} columns={3} />
        </Container>
      </Section>

      {/* PROOF BAND */}
      <Section tone="navy" className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07]">
          <div className="absolute -right-24 top-10 h-[30rem] w-[30rem] origin-center rotate-45 border-[64px] border-gold-on-brand" />
        </div>
        <Container>
          <Reveal className="mb-10 max-w-2xl">
            <Eyebrow onDark>Proof</Eyebrow>
            <h2 className="mt-5 text-h2 font-bold">
              Delivered, <Accent>repeatedly</Accent>.
            </h2>
          </Reveal>
          <Stagger className="grid gap-5 md:grid-cols-3">
            {[
              { value: "25+", label: "Concur implementations" },
              { value: "12-week", label: "Average go-live" },
              { value: "4", label: "Country tax configurations" },
            ].map((s) => (
              <StaggerItem key={s.label} className="h-full">
                <Card tone="navy" bezel={false} className="h-full">
                  <div className="text-[2.5rem] font-bold leading-none text-gold-on-brand">{s.value}</div>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-brand-muted">{s.label}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <CtaSection
        eyebrow="Concur"
        heading={
          <>
            Optimise travel, expense and <Accent>invoice</Accent> management.
          </>
        }
        body="Tell us where spend leaks today. We'll map a Concur rollout that automates capture, enforces policy and integrates into your finance landscape."
      />
    </>
  );
}
