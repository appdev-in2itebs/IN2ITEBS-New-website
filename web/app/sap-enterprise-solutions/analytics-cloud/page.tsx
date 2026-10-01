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

export const metadata = pageMetadata("/sap-enterprise-solutions/analytics-cloud/", {
  title: "SAP Analytics Cloud",
  description:
    "The front door to your enterprise data — SAP Analytics Cloud brings business intelligence, planning and predictive analytics into one experience.",
});

/** Value pillars — Blueprint §8.10. */
const pillars = [
  {
    title: "One analytics experience",
    body: "BI, planning and predictive in a single tool.",
    bullets: [
      "Business intelligence and dashboards",
      "Integrated financial and operational planning",
      "Predictive analytics built in",
      "No stitching together separate point tools",
    ],
  },
  {
    title: "Plan and forecast",
    body: "Look forward, not just back.",
    bullets: [
      "Scenario simulation and what-if modelling",
      "Rolling forecasts",
      "Driver-based planning",
      "Reforecast as the business moves",
    ],
  },
  {
    title: "Connected and collaborative",
    body: "Self-service on live enterprise data.",
    bullets: [
      "Self-service collaboration across teams",
      "Native connectivity to S/4HANA, Datasphere and BW/4HANA",
      "Connectors to non-SAP sources",
      "One version of the truth, governed",
    ],
  },
];

/** Coverage across the business — Blueprint §8.10. */
const coverage = ["Finance", "Sales", "Operations", "HR", "Supply Chain", "Procurement", "Executive reporting"];

/**
 * The detailed feature set, carried over from the existing site's /sap-sac/ page, which sets these
 * five groups out one by one under "Detailed features are described below". The three pillars above
 * are why you would buy it; this is what is actually in it.
 */
const capabilities = [
  {
    title: "Augmented analytics",
    body: "Reveal relevant, accurate and actionable insight faster with artificial intelligence and machine learning.",
    bullets: [
      "Data science for all — machine intelligence embedded in business intelligence and planning workflows",
      "Conversational analytics — visualisations and explanations from natural-language querying",
      "Automated machine learning — key influencers and relationships, anomalies and remedial actions",
      "Intelligent predictions — outcomes and forecasts at the push of a button, no data science skills required",
    ],
  },
  {
    title: "Business intelligence",
    body: "Explore data across the organisation and deliver insight at the point of decision with intuitive self-service analytics.",
    bullets: [
      "Data exploration and visualisation — interactive stories, filtering and drilling regardless of volume",
      "Efficient modelling and preparation — automated cleansing that alerts errors and categorises measures and dimensions",
    ],
  },
  {
    title: "Enterprise planning",
    body: "Link and create financial and operational plans in one solution to drive better decisions from integrated plans.",
    bullets: [
      "Collaborative planning across every line of business, with strategic alignment kept intact",
      "Intelligent planning — predictive forecasting and machine learning",
      "Integrated financial planning — transactions, analytics and planning combined with SAP S/4HANA",
      "Company-wide advanced analytics — versions of a planning model for budgeting, forecasting and analysis",
    ],
  },
  {
    title: "Design of analytics applications",
    body: "Create centrally governable analytic content, from guided analytics to sophisticated planning and smart applications.",
    bullets: [
      "Custom interactions — business intelligence, planning and predictive united in one application",
      "Rapid prototyping — customise, integrate and extend existing content, templates and stories",
      "Standardised analytics content — reusable interface elements and adjustable widget behaviour",
      "Custom widgets — tailored widgets, centrally managed composites and data-science capability",
    ],
  },
  {
    title: "Mobile and web extensions",
    body: "Reach your analytics from an iPhone or iPad to get the most recent picture of the business anywhere.",
    bullets: [
      "Engaging connections — mobile-ready stories and charts with drill-down, filter on selection and inspection",
      "Productive collaboration — chat with colleagues and manage notifications, such as a shared story, in the app",
    ],
  },
];

export default function AnalyticsCloudPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/sap-enterprise-solutions/analytics-cloud/" />
      <PageHero
        eyebrow="SAP Enterprise Solutions · SAP Analytics Cloud"
        headline="The front door to your"
        accentWord="enterprise data."
        subhead="SAP Analytics Cloud brings business intelligence, planning and predictive analytics into one experience — the single front door to data across every function, connected live to your SAP and non-SAP landscape."
        media={<HeroObject name="pages/sap-analytics-cloud" />}
        frame={false}
      />

      {/* VALUE PILLARS */}
      <Section tone="white">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Value pillars"
              lead="One platform that answers what happened, plans what comes next and predicts what is likely — on data drawn live from across the business."
            >
              Insight, plan and <Accent>predict</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={pillars} columns={3} bezel />
        </Container>
      </Section>

      {/* COVERAGE ACROSS THE BUSINESS */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Coverage across the business"
              lead="Analytics Cloud is not a finance-only tool. It serves every function from one trusted source, so each team works from the same numbers."
            >
              Every function, one <Accent>source</Accent>.
            </SectionHeading>
          </Reveal>
          <Reveal>
            <Card tone="white" className="h-full">
              <Eyebrow>Where it serves</Eyebrow>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {coverage.map((area) => (
                  <span key={area} className="glass-pill px-4 py-2 text-sm font-medium text-foreground">
                    {area}
                  </span>
                ))}
              </div>
            </Card>
          </Reveal>
        </Container>
      </Section>

      {/* DETAILED CAPABILITIES */}
      <Section tone="white">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Detailed capabilities"
              lead="Analytics Cloud is one product with five distinct capability sets inside it. Knowing which of them you are buying for is most of the work of scoping a rollout."
            >
              What is actually <Accent>in it</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={capabilities} columns={3} bezel />
          <Reveal className="mt-10">
            <p className="max-w-[80ch] text-base leading-relaxed text-foreground-muted">
              Taken together, that is complete in-memory data management and analytics, smart insight delivered in
              context through natural-language processing, confident decisions made faster without expert intervention,
              and affordability, availability and scalability as the estate grows.
            </p>
          </Reveal>
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
              Live faster, <Accent>sooner</Accent>.
            </h2>
          </Reveal>
          <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "Pre-built", label: "Dashboard accelerators" },
              { value: "Live", label: "Connection patterns" },
              { value: "Ready", label: "Planning templates" },
              { value: "3 weeks", label: "Average first dashboard" },
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
        eyebrow="SAP Analytics Cloud"
        heading={
          <>
            Build your first enterprise <Accent>dashboard</Accent>.
          </>
        }
        body="Tell us which decisions you need to make faster. We'll connect Analytics Cloud to your landscape and stand up a first dashboard that puts live enterprise data in front of the people who need it."
      />
    </>
  );
}
