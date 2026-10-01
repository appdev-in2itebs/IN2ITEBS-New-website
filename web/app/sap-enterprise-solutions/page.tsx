import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Eyebrow, Accent, SectionHeading, Lead } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { HeroObject } from "@/components/sections/hero-media";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaSection } from "@/components/sections/cta-section";
import { SapToolchain } from "@/components/sections/sap-toolchain";

export const metadata = pageMetadata("/sap-enterprise-solutions/", {
  title: "SAP Enterprise Solutions",
  description:
    "SAP run by a Gold Partner — 300+ consultants and 1,000+ combined years of experience across S/4HANA, SuccessFactors, Ariba, Concur, AI and BTP.",
});

/** Six IA clusters — drives both the sticky anchor nav and the section ids. */
const clusters = [
  { id: "core-erp-s4hana", label: "Core ERP & S/4HANA" },
  { id: "advisory-implementation", label: "Advisory & Implementation" },
  { id: "line-of-business", label: "Line-of-Business" },
  { id: "ai-intelligence", label: "AI & Intelligence" },
  { id: "data-analytics", label: "Data & Analytics" },
  { id: "platform-engineering", label: "Platform & Engineering" },
];

export default function SapEnterpriseSolutionsPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/sap-enterprise-solutions/" />
      <PageHero
        eyebrow="SAP Enterprise Solutions"
        headline="SAP, run by a"
        accentWord="Gold Partner."
        subhead="300+ consultants. 1,000+ combined years of SAP experience. A proud SAP Gold Partner."
        media={<HeroObject name="pages/sap-enterprise-solutions" />}
        frame={false}
      />

      {/* CREDENTIAL STRIP */}
      <div className="border-b border-gold-soft/30 bg-surface-subtle">
        <Container>
          <ul className="flex flex-wrap items-center gap-x-2.5 gap-y-2 py-4">
            {/* The gold gradient badge went on 2026-09-17 at the owner's request; the credential
                itself stays, set as a plain pill like the ones beside it. */}
            {["SAP Gold Partner", "RISE with SAP", "PCE Partner", "Co-Innovation Partner"].map((c) => (
              <li key={c} className="glass-pill text-foreground">
                {c}
              </li>
            ))}
          </ul>
        </Container>
      </div>

      {/* SAP SUITE LOGOS (deck-native) */}
      <div className="bg-canvas">
        <Container>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4 border-b border-border-subtle py-5">
            <span className="label-caps text-gold">Delivered across the SAP suite</span>
            {[
              { src: "/logos/sap/sap-s4hana.png", alt: "SAP S/4HANA" },
              { src: "/logos/sap/sap-ariba.png", alt: "SAP Ariba" },
              { src: "/logos/sap/sap-concur.png", alt: "SAP Concur" },
            ].map((l) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={l.alt} src={l.src} alt={l.alt} className="h-7 w-auto object-contain opacity-85" />
            ))}
          </div>
        </Container>
      </div>

      {/* STICKY ANCHOR NAV */}
      <nav
        aria-label="SAP practice clusters"
        className="sticky top-0 z-40 border-y border-gold-soft/30 bg-canvas/90 backdrop-blur supports-[backdrop-filter]:bg-canvas/70"
      >
        <Container>
          <ul className="-mx-1 flex items-center gap-x-1 gap-y-1 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {clusters.map((c) => (
              <li key={c.id} className="shrink-0">
                <a
                  href={`#${c.id}`}
                  className="inline-block whitespace-nowrap rounded-lg px-3 py-2 text-[0.82rem] font-semibold text-foreground-muted transition-colors duration-200 hover:bg-surface-subtle hover:text-foreground"
                >
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      {/* OVERVIEW — SOT-08 */}
      <Section tone="white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <SectionHeading
                eyebrow="Overview"
                lead="300+ consultants and 1,000+ combined years of SAP experience, across 50+ clients in manufacturing, infrastructure, professional services, metals and mining, and utilities."
              >
                A proud SAP <Accent>Gold</Accent> Partner.
              </SectionHeading>
            </Reveal>
            <FeatureGrid
              columns={2}
              features={[
                {
                  title: "Partnership depth",
                  body: "SAP Gold Partner; RISE with SAP (BTaaS); PCE & Co-Innovation Partner; active in SAP user groups.",
                },
                {
                  title: "Industry experience",
                  body: "50+ SAP clients across manufacturing, infrastructure, mining, utilities, professional services and the public sector.",
                },
                {
                  title: "Specialised skills",
                  body: "300+ consultants, 40% technical / 60% functional; migration and transformation experts across all major platforms.",
                },
                {
                  title: "Solutions & IP",
                  body: "RISE/GROW implementation, AMS support, country payroll localisations, packaged S/4HANA add-ons.",
                },
              ]}
            />
          </div>
        </Container>
      </Section>

      {/* THREE LENSES — SOT-09 */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="What we deliver"
              lead="One SAP practice, viewed through three lenses — the solutions we run, the services we deliver and the industries we know."
            >
              Three lenses on one SAP <Accent>practice</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid
            columns={3}
            bezel
            features={[
              {
                title: "Solutions",
                bullets: [
                  "S/4HANA Public Cloud",
                  "S/4HANA PCE",
                  "Ariba",
                  "SuccessFactors",
                  "Analytics Cloud",
                  "Extension Suite",
                  "Integration Suite",
                  "C/4HANA",
                  "CALM & Solution Manager",
                ],
              },
              {
                title: "Services",
                bullets: [
                  "Digital transformation",
                  "End-to-end implementation",
                  "Rollout & carve-outs",
                  "Upgrade & migration",
                  "Advisory",
                  "Analytics & reporting",
                  "SAP security",
                  "Industry solutions",
                  "Support & maintenance",
                ],
              },
              {
                title: "Industries",
                bullets: [
                  "Automotive & Manufacturing",
                  "BFSI",
                  "Retail & E-commerce",
                  "Energy & Utilities",
                  "Engineering & Construction",
                  "Pharma & Life Sciences",
                  "Chemicals & Fertilizers",
                  "Government & Public Enterprises",
                  "Professional Services",
                ],
              },
            ]}
          />
          <Reveal delay={0.1} className="mt-8">
            <Link
              href="/industries/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-action hover:text-foreground"
            >
              See Industries &amp; Clients <ArrowUpRight size={16} strokeWidth={1.5} />
            </Link>
          </Reveal>
        </Container>
      </Section>

      {/* CLUSTER 1 — CORE ERP & S/4HANA — SOT-10, SOT-24 */}
      <Section tone="white" id="core-erp-s4hana">
        <Container>
          <Reveal className="mb-12 max-w-3xl">
            <SectionHeading
              eyebrow="Core ERP & S/4HANA"
              lead="RISE, GROW and Private Cloud Edition give you different starting points. Our methodology, accelerators and certified consultants cover the full spectrum."
            >
              Three paths to <Accent>S/4HANA</Accent> — we run all three.
            </SectionHeading>
          </Reveal>
          <FeatureGrid
            columns={3}
            features={[
              {
                title: "RISE with SAP",
                body: "Business-process-led transformation; greenfield, brownfield or selective data transition, with SAP-managed cloud.",
              },
              {
                title: "GROW with SAP",
                body: "Public cloud, fast time-to-value; pre-configured best-practice processes on S/4HANA Cloud Public Edition for mid-market and faster-moving units.",
              },
              {
                title: "S/4HANA Private Cloud (PCE)",
                body: "Dedicated tenancy and full customisation for deep integration or regulatory isolation. We are an SAP PCE Partner.",
              },
            ]}
          />
          <Reveal delay={0.1} className="mt-8">
            <p className="text-sm font-medium text-foreground-muted">
              30% faster go-live vs benchmark <span className="text-gold">·</span> 25+ S/4HANA programmes delivered{" "}
              <span className="text-gold">·</span> 100% go-live success rate.
            </p>
          </Reveal>

          <Reveal delay={0.05} className="mt-14">
            <Card tone="navy" bezel={false} className="overflow-hidden">
              <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
                <div className="flex flex-col gap-5">
                  <Eyebrow onDark>Packaged S/4HANA</Eyebrow>
                  <h3 className="text-h2 font-bold text-on-brand">
                    Business-ready, GST-compliant S/4HANA — <Accent>out of the box</Accent>.
                  </h3>
                  <p className="max-w-measure text-brand-muted">
                    Pre-configured industry processes, embedded analytics and Fiori UX, live in 16 weeks instead of
                    12–18 months.
                  </p>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {[
                    "S/4HANA core",
                    "India localisation & GST",
                    "Embedded real-time analytics",
                    "Fiori UX (desktop + mobile)",
                    "Day-2 AMS bench",
                  ].map((item) => (
                    <li key={item} className="flex gap-2.5 text-[0.92rem] leading-relaxed text-brand-muted">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-on-brand" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </Reveal>
        </Container>
      </Section>

      {/* CLUSTER 2 — ADVISORY & IMPLEMENTATION — SOT-11, SOT-12 */}
      <Section tone="light" id="advisory-implementation">
        <Container>
          <Reveal className="mb-12 max-w-3xl">
            <SectionHeading
              eyebrow="Advisory & Implementation"
              lead="Six advisory engagements de-risk the transformation decision — from product evaluation to a board-ready roadmap."
            >
              We help you decide before you <Accent>commit</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid
            columns={3}
            features={[
              { title: "Product Assessments & Evaluation" },
              { title: "Proof of Concept / Value Advisory" },
              { title: "Business Process Advisory" },
              { title: "Discovery & Design" },
              { title: "Organisation Readiness Assessment" },
              { title: "Maturity Assessment & Roadmap" },
            ]}
          />

          <Reveal className="mb-10 mt-20 max-w-3xl">
            <SectionHeading
              eyebrow="Delivery method"
              lead="Five Activate phases, compressed by accelerators, pre-built configurations and a single delivery team from Discover through Run. In2IT EBS is recognised by SAP as a certified provider of implementation services."
            >
              SAP Activate, <Accent>accelerated</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid
            columns={3}
            bezel
            features={[
              {
                title: "Path",
                bullets: ["Greenfield (new build)", "Brownfield (convert in place from ECC)"],
              },
              {
                title: "Rollout",
                bullets: [
                  "Global template build & process harmonisation",
                  "Country localisation (legal, tax, payroll)",
                ],
              },
              {
                title: "Methodology",
                bullets: [
                  "SAP Activate",
                  "In2IT Rapid Deployment (RDS)",
                  "Accelerators",
                  "Governed rollouts on Solution Manager",
                ],
              },
            ]}
          />
        </Container>
      </Section>

      {/* CLUSTER 3 — LINE-OF-BUSINESS — SOT-13, SOT-15/16, SOT-17 */}
      <Section tone="white" id="line-of-business">
        <Container>
          <Reveal className="mb-14 max-w-3xl">
            <SectionHeading
              eyebrow="Line-of-Business"
              lead="Human experience, travel and expense, and source-to-pay — full-suite line-of-business SAP, delivered and integrated."
            >
              The business in your <Accent>SAP</Accent>.
            </SectionHeading>
          </Reveal>

          {/* SuccessFactors / HXM — SOT-13 */}
          <div id="successfactors-hxm" className="scroll-mt-24">
            <Reveal>
              <Eyebrow>SuccessFactors / Human Experience Management</Eyebrow>
              <h3 className="mt-5 max-w-3xl text-h2 font-bold text-foreground">
                Full-suite SAP SuccessFactors, delivered at <Accent>scale</Accent>.
              </h3>
              <Lead className="mt-5">
                125+ projects delivered globally across Core HR, Talent, Payroll and Workzone, by 87+ certified HXM
                consultants (70% Associate, 30% Professional) — plus 10+ live proofs of concept for Joule for HR and
                Talent Intelligence.
              </Lead>
            </Reveal>
          </div>
          <FeatureGrid
            className="mt-10"
            columns={3}
            features={[
              {
                title: "Core HR & Talent",
                body: "Employee Central, Recruiting, Onboarding, Performance, Succession.",
              },
              {
                title: "Cloud Payroll & Compensation",
                body: "Employee Central Payroll, Compensation, Variable Pay, statutory compliance.",
              },
              {
                title: "Time & Attendance",
                body: "Time Management, Time Sheet, plus our proprietary iTAM accelerator.",
              },
              {
                title: "Learning & Talent Intelligence",
                body: "LMS, Skills Ontology, Talent Intelligence Hub, AI-driven recommendations.",
              },
              {
                title: "Employee Experience",
                body: "HR Workzone, Qualtrics EX, Concur Travel & Expense.",
              },
              {
                title: "People Analytics & Planning",
                body: "Workforce Analytics, Headcount Planning, predictive attrition.",
              },
            ]}
          />
          <Reveal delay={0.1} className="mt-8">
            <p className="text-sm font-medium text-foreground-muted">
              Largest certified SAP HXM consultant pool in region <span className="text-gold">·</span> proprietary iTAM
              accelerator <span className="text-gold">·</span> EBSx rapid-deployment kit{" "}
              <span className="text-gold">·</span> Joule-for-HR playbook <span className="text-gold">·</span> 100%
              success rate on HR transformation projects.
            </p>
          </Reveal>

          {/* Concur — SOT-15, SOT-16 */}
          <div className="my-14 rule-gold" />
          <div id="concur" className="scroll-mt-24">
            <Reveal>
              <Eyebrow>Concur</Eyebrow>
              <h3 className="mt-5 max-w-3xl text-h2 font-bold text-foreground">
                End-to-end Concur, with the <Accent>integrations</Accent> to match.
              </h3>
              <Lead className="mt-5">
                Expense, Travel and Invoice — automated capture, approvals and policy enforcement, integrated cleanly
                into your finance landscape.
              </Lead>
            </Reveal>
          </div>
          <Reveal delay={0.05} className="mt-8">
            <Card tone="light" bezel={false}>
              <p className="text-[0.95rem] leading-relaxed text-foreground-muted">
                Integrated with SAP S/4HANA, Salesforce, NetSuite, QuickBooks, Microsoft Dynamics, Workday, Intacct,
                Oracle EBS and Oracle HCM; corporate card feeds, TMC and receipt OCR.
              </p>
              <p className="mt-5 text-sm font-medium text-foreground">
                25+ Concur implementations <span className="text-gold">·</span> 12-week average go-live{" "}
                <span className="text-gold">·</span> 4 country tax configs.
              </p>
            </Card>
          </Reveal>

          {/* Ariba — SOT-17 */}
          <div className="my-14 rule-gold" />
          <div id="ariba" className="scroll-mt-24">
            <Reveal>
              <Eyebrow>Ariba</Eyebrow>
              <h3 className="mt-5 max-w-3xl text-h2 font-bold text-foreground">
                Source-to-Pay, automated <Accent>end-to-end</Accent>.
              </h3>
              <Lead className="mt-5">
                The full SAP Ariba suite — Source, Contract, Procure, Invoice, Pay — integrated with S/4HANA, Concur and
                downstream finance. Sourcing, contracts, guided buying and the Ariba Network (6M+ suppliers).
              </Lead>
            </Reveal>
          </div>
          <Reveal delay={0.05} className="mt-8">
            <Card tone="light" bezel={false}>
              <p className="text-sm font-medium text-foreground">
                15+ Ariba programmes delivered <span className="text-gold">·</span> 40% average P2P cycle-time cut{" "}
                <span className="text-gold">·</span> S/4 native integration.
              </p>
            </Card>
          </Reveal>
        </Container>
      </Section>

      {/* CLUSTER 4 — AI & INTELLIGENCE — SOT-14, SOT-18, SOT-19 */}
      <Section tone="light" id="ai-intelligence">
        <Container>
          <Reveal className="mb-12 max-w-3xl">
            <SectionHeading
              eyebrow="AI & Intelligence"
              lead="Generative AI, machine learning and SAP Joule — in production across the persona's flow of work, on your own tenant and data."
            >
              Intelligence, in the <Accent>flow of work</Accent>.
            </SectionHeading>
          </Reveal>

          <Reveal>
            <Card tone="white" bezel={false} className="mb-6">
              <Eyebrow>AI-powered HR Health Check</Eyebrow>
              <h3 className="mt-5 max-w-3xl text-h3 font-bold text-foreground">
                ML on your tenant, not opinions on a <Accent>spreadsheet</Accent>.
              </h3>
              <p className="mt-4 max-w-measure text-[0.95rem] leading-relaxed text-foreground-muted">
                An AI-powered, industry-benchmarked diagnostic that unlocks measurable HR value: an ML audit of
                configuration, RBP and business rules; anomaly detection across usage and audit logs; and Joule &amp;
                Talent Intelligence readiness scoring, benchmarked against 200+ peers across 12 industries.
              </p>
              <p className="mt-5 text-sm font-medium text-foreground">
                30–40% reduction in customisation debt <span className="text-gold">·</span> 25% lift in monthly active
                users <span className="text-gold">·</span> 2× faster Joule activation{" "}
                <span className="text-gold">·</span> 4–6-week engagement. Built on our proprietary Health Check 360
                framework.
              </p>
            </Card>
          </Reveal>

          <FeatureGrid
            columns={2}
            features={[
              {
                title: "SAP Joule",
                body: "SAP's generative-AI co-pilot, in production: 10+ Joule rollouts across SuccessFactors, S/4HANA Cloud and SAC; 2 custom Joule Studio agents in production; 60+ Joule practitioners.",
                bullets: [
                  "Joule for Business Users",
                  "Joule Studio",
                  "Joule Agents",
                  "Joule for Developers",
                  "Joule + Claude/OpenAI integration patterns",
                  "Responsible-AI guardrails",
                ],
              },
              {
                title: "AI on SAP BTP",
                body: "Custom generative-AI apps on SAP AI Core with foundation models and the HANA Vector Engine; with an AI-governance framework aligned to the EU AI Act, deployable across AWS, Azure and Google Cloud.",
                bullets: [
                  "RAG pipelines over enterprise data",
                  "ML-driven forecasting and anomaly detection",
                  "Document AI for invoices, POs and contracts",
                ],
              },
            ]}
          />
        </Container>
      </Section>

      {/* CLUSTER 5 — DATA & ANALYTICS — SOT-21, SOT-22, SOT-23 */}
      <Section tone="white" id="data-analytics">
        <Container>
          <Reveal className="mb-12 max-w-3xl">
            <SectionHeading
              eyebrow="Data & Analytics"
              lead="The hard part of every S/4HANA programme is the data — and the value is in the analytics. We do both."
            >
              Get the data <Accent>right</Accent>.
            </SectionHeading>
          </Reveal>

          <Reveal>
            <Card tone="light" bezel={false} className="mb-6">
              <Eyebrow>Syniti Data Management</Eyebrow>
              <h3 className="mt-5 max-w-3xl text-h3 font-bold text-foreground">
                Data migration is the real <Accent>risk</Accent> in S/4HANA.
              </h3>
              <p className="mt-4 max-w-measure text-[0.95rem] leading-relaxed text-foreground-muted">
                70% of SAP transformations slip because of data, not technology. Our Syniti practice combines SAP
                Advanced Data Migration (by Syniti) credentials with a proven five-stage approach — Profile, Cleanse,
                Construct, Migrate, Govern — plus Master Data Governance and ongoing stewardship.
              </p>
              <p className="mt-5 text-sm font-medium text-foreground">
                20+ ECC→S/4 migrations <span className="text-gold">·</span> 99.5% data integrity at cutover{" "}
                <span className="text-gold">·</span> 3× faster than manual ETL.
              </p>
            </Card>
          </Reveal>

          <Reveal delay={0.05}>
            <Card tone="light" bezel={false}>
              <Eyebrow>SAP Analytics Cloud & the modern stack</Eyebrow>
              <h3 className="mt-5 max-w-3xl text-h3 font-bold text-foreground">
                Analytics, planning and prediction on one <Accent>platform</Accent>.
              </h3>
              <p className="mt-4 max-w-measure text-[0.95rem] leading-relaxed text-foreground-muted">
                We implement SAP Analytics Cloud as the front door to enterprise data — BI, planning and predictive in
                one experience — with pre-built dashboard accelerators and live connections to S/4HANA, BW/4HANA and
                Datasphere. Average first dashboard in 3 weeks. Across the portfolio: SAC, BPC / Group Reporting,
                Digital Boardroom and Datasphere. Legacy stacks like Lumira are deliberately retired in favour of SAC.
              </p>
            </Card>
          </Reveal>
        </Container>
      </Section>

      {/* CLUSTER 6 — PLATFORM & ENGINEERING — SOT-20, SOT-25, SOT-26 */}
      <Section tone="light" id="platform-engineering">
        <Container>
          <Reveal className="mb-12 max-w-3xl">
            <SectionHeading
              eyebrow="Platform & Engineering"
              lead="Extend SAP without breaking the core, industrialise custom development, and operate the platform layer as a service."
            >
              The engine room of <Accent>SAP</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid
            columns={3}
            bezel
            features={[
              {
                title: "Clean-core extensibility",
                body: "SuccessFactors and S/4HANA extensions on BTP — SAPUI5/Fiori, Workzone for HR, our proprietary Visa & Permit Management and iTAM, side-by-side apps on Cloud Foundry and Kyma, CAP (Node/Java), Event Mesh and SAP Build Process Automation.",
                bullets: [
                  "8+ proprietary BTP-based extensions in production",
                  "Clean-core certified delivery",
                  "DevOps CI/CD for SAP extensions",
                ],
              },
              {
                title: "ABAP Factory",
                body: "RICEFW, industrialised. An offshore ABAP factory built around Reports, Interfaces, Conversions, Enhancements, Forms and Workflow — delivered through a leveraged service-centre model with predictable throughput.",
              },
              {
                title: "Basis",
                body: "The platform layer, operated as a service. Full-lifecycle Basis — Plan, Install, Run, Optimise — from sizing and landscape design to monitoring, EarlyWatch, patching, and OS/DB migrations, typically delivered as a managed service alongside our functional teams.",
              },
            ]}
          />
        </Container>
      </Section>

      {/* POINT OF VIEW — THE CONVERGED INTELLIGENCE STACK — SOT-27 */}
      <Section tone="navy" className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07]">
          <div className="absolute -right-24 top-10 h-[30rem] w-[30rem] origin-center rotate-45 border-[64px] border-gold-on-brand" />
        </div>
        <Container>
          <Reveal className="mb-12 max-w-3xl">
            <SectionHeading
              onDark
              eyebrow="Point of view"
              lead="We bring SuccessFactors, Joule, BTP AI and extensions into one operating model — the Converged Intelligence Stack."
            >
              Convergence turns SAP investment into <Accent>outcomes</Accent>.
            </SectionHeading>
          </Reveal>

          <Stagger className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Composable",
                body: "Clean core, side-by-side — extensions that never compromise upgradeability.",
              },
              {
                title: "Intelligent",
                body: "GenAI, ML and Joule in every persona's flow of work.",
              },
              {
                title: "Continuous",
                body: "Advisory, telemetry and lifecycle management, sustained beyond go-live.",
              },
            ].map((p) => (
              <StaggerItem key={p.title} className="h-full">
                <Card tone="navy" bezel={false} className="h-full">
                  <h3 className="text-h3 font-bold text-on-brand">{p.title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-brand-muted">{p.body}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.1} className="mt-14 max-w-3xl">
            <blockquote className="border-l-2 border-l-gold-on-brand/60 pl-6 text-h3 font-medium italic leading-snug text-on-brand">
              &ldquo;Convergence is where SAP investments turn into measurable business outcomes.&rdquo;
            </blockquote>
          </Reveal>
        </Container>
      </Section>

      {/* ECC PRISM */}
      <Section tone="white">
        <Container>
          <Reveal>
            <Card tone="light" bezel className="overflow-hidden">
              <div className="grid gap-8 lg:grid-cols-[1.4fr_auto] lg:items-center">
                <div className="flex flex-col gap-4">
                  <Eyebrow>ECC Prism™</Eyebrow>
                  <h3 className="max-w-2xl text-h2 font-bold text-foreground">
                    Start with a clear-eyed <Accent>assessment</Accent>.
                  </h3>
                  <p className="max-w-measure text-[0.95rem] leading-relaxed text-foreground-muted">
                    ECC Prism™ — our ECC-to-S/4HANA assessment — gives you a fact-based view of your readiness before
                    you commit to the transformation.
                  </p>
                </div>
                <div className="shrink-0">
                  <Button href="/ecc-prism/" variant="secondary" withArrow>
                    See ECC Prism
                  </Button>
                </div>
              </div>
            </Card>
          </Reveal>
        </Container>
      </Section>

      {/* DELIVERY TOOLCHAIN */}
      <Section tone="light" id="toolchain">
        <SapToolchain />
      </Section>

      <CtaSection
        heading={
          <>
            Let&apos;s map your <Accent>SAP</Accent> transformation.
          </>
        }
        body="Start your transformation and we'll map your priorities across advisory, build and run — RISE, GROW or Private Cloud."
      />
    </>
  );
}
