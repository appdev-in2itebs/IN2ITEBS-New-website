import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Accent, SectionHeading } from "@/components/ui/typography";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { HeroObject } from "@/components/sections/hero-media";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaSection } from "@/components/sections/cta-section";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata("/digital-data-ai/", {
  title: "Digital, Data & AI",
  description:
    "Engineering-led transformation — application engineering, AI & automation, data & analytics, integration and cloud, delivered by one accountable team.",
});

/** Four sub-practices (§9.4). Application Engineering and AI & Automation have their
 *  own sub-pages; Data & Analytics and Integration & Cloud anchor to sections below. */
const subPractices = [
  {
    title: "Application Engineering",
    summary:
      "Custom application development, intelligent applications, digital experience platforms, low-code/no-code and DevOps.",
    href: "/digital-data-ai/application-engineering/",
  },
  {
    title: "AI & Automation",
    summary:
      "GenAI solutions and copilots, intelligent automation, computer vision, document AI, industrial AI, IoT and digital twins.",
    href: "/digital-data-ai/ai-automation/",
  },
  {
    title: "Data & Analytics",
    summary:
      "Data platforms, lakehouses, analytics, visualisation, master data, governance, ML/MLOps and predictive models.",
    href: "#data-analytics",
  },
  {
    title: "Integration & Cloud",
    summary:
      "API-led integration, middleware, AWS/Azure/GCP cloud engineering, event-driven architectures and OT-to-ERP convergence.",
    href: "#integration-cloud",
  },
] as const;

const dataAnalytics = [
  {
    title: "Data platforms & lakehouses",
    body: "Modern foundations that unify enterprise data for analytics and AI.",
    bullets: ["Data platforms", "Lakehouses", "Real-time and batch pipelines"],
  },
  {
    title: "Analytics & visualisation",
    body: "Decision-ready insight surfaced where the business works.",
    bullets: ["Enterprise analytics", "Visualisation & dashboards", "Self-service reporting"],
  },
  {
    title: "Master data & governance",
    body: "Trusted, governed data as the basis for every downstream model.",
    bullets: ["Master data management", "Data governance", "Quality & lineage"],
  },
  {
    title: "ML & MLOps",
    body: "Predictive models built, deployed and sustained as production assets.",
    bullets: ["Machine learning", "MLOps", "Predictive models"],
  },
];

const integrationCloud = [
  {
    title: "API-led integration",
    body: "Composable integration that connects platforms, products and channels.",
    bullets: ["API-led integration", "Middleware", "Reusable integration patterns"],
  },
  {
    title: "Cloud engineering",
    body: "Cloud-native engineering across the major hyperscalers.",
    bullets: ["AWS", "Microsoft Azure", "Google Cloud Platform"],
  },
  {
    title: "Event-driven architecture",
    body: "Responsive, decoupled systems built around events and streams.",
    bullets: ["Event-driven architectures", "Streaming & messaging", "Resilient, scalable design"],
  },
  {
    title: "OT-to-ERP convergence",
    body: "Bridging operational technology and the enterprise core.",
    bullets: ["OT-to-ERP convergence", "Operational data integration", "Plant-to-platform connectivity"],
  },
];

/** Gold accent edge for the Digital, Data & AI pillar — matches the premium glass pillar cards. */
function SubPracticeCard({ title, summary, href }: { title: string; summary: string; href: string }) {
  const isInternalPage = href.startsWith("/");
  const content = (
    <>
      <h3 className="text-h3 font-bold text-foreground">{title}</h3>
      <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-foreground-muted">{summary}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
        {isInternalPage ? "Explore" : "Jump to section"}
        <ArrowRight
          size={15}
          strokeWidth={1.75}
          className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
        />
      </span>
    </>
  );
  const classes = cn(
    "group glass-card flex h-full flex-col rounded-surface border-l-4 border-l-gold p-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
  );
  if (isInternalPage) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }
  return (
    <a href={href} className={classes}>
      {content}
    </a>
  );
}

export default function DigitalDataAiPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/digital-data-ai/" />
      <PageHero
        route="/digital-data-ai/"
        eyebrow="Digital, Data & AI"
        headline="Engineering-led innovation across application, data and"
        accentWord="intelligence"
        subhead="Modern application engineering, AI & automation, data & analytics, integration and cloud — built and run by one accountable team."
        media={<HeroObject name="pages/digital-data-ai" />}
        frame={false}
      />

      {/* SUB-PRACTICE GRID */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Capability overview"
              lead="Four connected sub-practices that take an enterprise from idea to running system — software, intelligence, data and the cloud that holds them together."
            >
              Four sub-practices, one <Accent>engineering</Accent> team.
            </SectionHeading>
          </Reveal>
          <Stagger className="grid gap-5 md:grid-cols-2">
            {subPractices.map((p) => (
              <StaggerItem key={p.title} className="h-full">
                <SubPracticeCard title={p.title} summary={p.summary} href={p.href} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* DATA & ANALYTICS */}
      <Section tone="white" id="data-analytics">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Data & Analytics"
              lead="Data platforms, lakehouses, analytics, visualisation, master data, governance, ML/MLOps and predictive models — the foundation every intelligent application depends on."
            >
              Trusted data, decision-ready <Accent>insight</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={dataAnalytics} columns={2} />
        </Container>
      </Section>

      {/* INTEGRATION & CLOUD */}
      <Section tone="light" id="integration-cloud">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Integration & Cloud"
              lead="API-led integration, middleware, AWS/Azure/GCP cloud engineering, event-driven architectures and OT-to-ERP convergence — connecting the estate end to end."
            >
              Connected systems, cloud-native by <Accent>design</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={integrationCloud} columns={2} />
        </Container>
      </Section>

      <CtaSection
        eyebrow="Next step"
        heading={
          <>
            Identify your AI and digital <Accent>opportunities</Accent>.
          </>
        }
        body="Start your transformation and we'll map where modern engineering, AI, data and cloud unlock the most value across your estate."
        ctaLabel="Start your transformation"
        ctaHref="/contact/"
      />
    </>
  );
}
