import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container, Section } from "@/components/ui/container";
import { SectionHeading, Accent, Lead } from "@/components/ui/typography";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { HeroObject } from "@/components/sections/hero-media";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaSection } from "@/components/sections/cta-section";

export const metadata = pageMetadata("/workday/", {
  title: "Workday",
  description:
    "Full-lifecycle Workday transformation — advisory, implementation, integration, analytics and managed services for HR and finance.",
});

const capabilities = [
  {
    title: "HCM Transformation",
    body: "Core HR, Talent, Compensation, Benefits, and Time & Absence on a single people platform.",
  },
  {
    title: "Financial Management",
    body: "Workday Financials with multi-entity accounting and integrated planning.",
  },
  {
    title: "Adaptive Planning",
    body: "Driver-based planning, forecasting and scenario analysis for finance and operations.",
  },
  {
    title: "Workforce Planning",
    body: "Headcount and scenario modelling with talent-supply analysis.",
  },
  {
    title: "Workforce Analytics",
    body: "People analytics, dashboards and predictive insights across the organisation.",
  },
];

const services = [
  {
    title: "Workforce Transformation Advisory",
    body: "HR digitisation roadmap, process re-engineering and change management.",
  },
  {
    title: "Implementation",
    body: "Phased deployment, configuration, data migration, parallel testing and hypercare.",
  },
  {
    title: "Integration",
    body: "Workday Studio, EIB and Core Connectors across SuccessFactors, Payroll and Identity.",
  },
  {
    title: "HR Analytics",
    body: "Prism Analytics, People Analytics, and dashboards & reporting.",
  },
  {
    title: "Managed Services",
    body: "Tenant management, release support, L1–L3 and continuous optimisation.",
  },
];

export default function WorkdayPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/workday/" />
      <PageHero
        eyebrow="Workday"
        headline="HR and finance on a single"
        accentWord="cloud."
        subhead="Modernising HR and finance functions on Workday — advisory through managed services."
        media={<HeroObject name="pages/workday" />}
        frame={false}
      />

      {/* PRACTICE OVERVIEW */}
      <Section tone="light">
        <Container>
          <Reveal className="max-w-3xl">
            <SectionHeading
              eyebrow="Practice overview"
              lead="We partner with enterprises on full-lifecycle Workday transformations — from advisory and implementation through to integration and managed services."
            >
              Enabling the modern <Accent>workforce</Accent>.
            </SectionHeading>
          </Reveal>
        </Container>
      </Section>

      {/* CAPABILITIES */}
      <Section tone="white" id="capabilities">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading eyebrow="Capabilities">
              Capability modules across HR and <Accent>finance</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={capabilities} columns={3} />
        </Container>
      </Section>

      {/* SERVICES & DELIVERY */}
      <Section tone="light" id="services">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Services & delivery"
              lead="From early advisory through tenant lifecycle management, our Workday team operates as a single integrated unit across onshore and offshore."
            >
              Five engagement types, one Workday <Accent>team</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={services} columns={3} />
        </Container>
      </Section>

      {/* PRACTICE STRENGTH */}
      <Section tone="white">
        <Container>
          <Reveal className="max-w-3xl">
            <SectionHeading eyebrow="Practice strength">
              Certified consultants, multi-region <Accent>experience</Accent>.
            </SectionHeading>
            <Lead className="mt-6">
              Workday-certified consultants with multi-region experience and integration patterns into SAP, Salesforce
              and legacy HR systems.
            </Lead>
          </Reveal>
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
