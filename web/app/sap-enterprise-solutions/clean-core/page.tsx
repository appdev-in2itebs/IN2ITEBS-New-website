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

export const metadata = pageMetadata("/sap-enterprise-solutions/clean-core/", {
  title: "Clean Core & BTP Extensions",
  description:
    "Clean-core extensibility on SAP BTP — side-by-side innovation that keeps the SAP core stable and upgrade-ready, across SuccessFactors and S/4HANA.",
});

/** SuccessFactors extensions — Blueprint §8.8. */
const successFactors = [
  {
    title: "Custom UI extensions",
    body: "Bespoke SAPUI5 and Fiori applications built on BTP — extending SuccessFactors without touching the core.",
  },
  {
    title: "HR Workzone",
    body: "A unified, role-based entry point that brings people, tasks and self-service into a single guided experience.",
  },
  {
    title: "Visa & Permit Management",
    body: "Tracking of visas, permits and renewals — proactive expiry alerts and audit-ready compliance records.",
  },
  {
    title: "Shift Scheduling & Rostering",
    body: "Workforce rostering and shift planning tailored to operational demand, rules and availability.",
  },
  {
    title: "iTAM",
    body: "Integrated time and attendance management, captured at source and synchronised back into payroll.",
  },
  {
    title: "Integrations",
    body: "Payroll, finance and third-party HRMS systems connected cleanly through BTP integration services.",
  },
];

/** S/4HANA extensions — Blueprint §8.8. */
const s4hana = [
  {
    title: "ABAP Cloud & RAP",
    body: "Modern, cloud-ready development with ABAP Cloud and the RESTful Application Programming model.",
  },
  {
    title: "Key-user tools",
    body: "In-app key-user extensibility for fields, logic and layouts — governed and upgrade-safe.",
  },
  {
    title: "CAP apps on BTP",
    body: "Side-by-side services built with the Cloud Application Programming model, decoupled from the core.",
  },
  {
    title: "Fiori apps",
    body: "Purpose-built Fiori applications that extend standard processes with a consistent user experience.",
  },
  {
    title: "Event Mesh & automation",
    body: "Event-driven integration via SAP Event Mesh, with workflows orchestrated in SAP Build Process Automation.",
  },
  {
    title: "Master-data & migration",
    body: "Master-data harmonisation and migration of classic ABAP enhancements to BTP side-by-side.",
  },
];

export default function CleanCorePage() {
  return (
    <>
      <BreadcrumbJsonLd path="/sap-enterprise-solutions/clean-core/" />
      <PageHero
        eyebrow="SAP Enterprise Solutions · Clean Core & BTP"
        headline="Innovate alongside the core, not"
        accentWord="inside it."
        subhead="Clean-core extensibility as side-by-side innovation on SAP BTP — keeping the SAP core stable and upgrade-ready while you build exactly what the business needs."
        media={<HeroObject name="pages/sap-clean-core" />}
        frame={false}
      />

      {/* SUCCESSFACTORS EXTENSIONS */}
      <Section tone="white">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="SuccessFactors extensions"
              lead="Proprietary BTP-based extensions that close the gaps standard SuccessFactors leaves open — without compromising upgradeability."
            >
              Extend <Accent>people</Accent> processes.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={successFactors} columns={3} bezel />
        </Container>
      </Section>

      {/* S/4HANA EXTENSIONS */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="S/4HANA extensions"
              lead="Clean-core development for S/4HANA — modern ABAP and side-by-side services on BTP, with classic enhancements migrated out of the core."
            >
              Build a future-proof <Accent>core</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={s4hana} columns={3} />
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
              Clean by <Accent>design</Accent>.
            </h2>
          </Reveal>
          <Stagger className="grid gap-5 md:grid-cols-3">
            {[
              { value: "8+", label: "Proprietary BTP-based extensions" },
              { value: "Clean-core", label: "Certified approach" },
              { value: "40%", label: "Reduced time-to-value" },
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
        eyebrow="Clean Core & BTP"
        heading={
          <>
            Extend SAP <Accent>safely</Accent>.
          </>
        }
        body="Tell us what your standard SAP cannot yet do. We'll map a side-by-side extension on BTP that delivers it — and keeps your core stable and upgrade-ready."
      />
    </>
  );
}
