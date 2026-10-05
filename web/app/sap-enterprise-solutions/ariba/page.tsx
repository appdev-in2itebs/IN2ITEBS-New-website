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

export const metadata = pageMetadata("/sap-enterprise-solutions/ariba/", {
  title: "SAP Ariba",
  description:
    "Source-to-Pay on SAP Ariba — sourcing, contracts, guided buying and supplier collaboration, integrated natively with S/4HANA, Concur and finance.",
});

/** Source-to-Pay flow — Blueprint §8.6. */
const flow = [
  {
    title: "Source",
    body: "Spend analysis, supplier discovery, auctions and RFx to find the right supplier at the right price.",
  },
  { title: "Contract", body: "Authoring, workflow, compliance and a managed clause library — agreements that hold." },
  { title: "Procure", body: "Guided buying, catalogues, punchout and mobile approvals that keep buying on-contract." },
  { title: "Invoice", body: "Touchless invoice capture and matching, flowing straight into accounts payable." },
  { title: "Pay", body: "Settlement and reconciliation closing the loop, integrated with finance." },
];

/** Capability depth — Blueprint §8.6. */
const capabilities = [
  {
    title: "Sourcing",
    bullets: ["Spend analysis", "Supplier discovery", "Auctions", "RFx events"],
  },
  {
    title: "Contracts",
    bullets: ["Authoring & workflow", "Compliance controls", "Clause library", "Obligation management"],
  },
  {
    title: "Procurement",
    bullets: ["Guided buying", "Catalogues & punchout", "Mobile approvals", "On-contract spend"],
  },
  {
    title: "Supplier Network",
    bullets: ["6M+ suppliers", "PO collaboration", "Invoice exchange", "Supplier risk management"],
  },
];

export default function AribaPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/sap-enterprise-solutions/ariba/" />
      <PageHero
        route="/sap-enterprise-solutions/ariba/"
        eyebrow="SAP Enterprise Solutions · Ariba"
        headline="Source-to-Pay,"
        accentWord="automated end-to-end."
        subhead="The full SAP Ariba suite — from supplier discovery through to invoice automation — integrated natively with S/4HANA, Concur and your finance systems."
        media={<HeroObject name="pages/sap-ariba" />}
        frame={false}
      />

      {/* SOURCE-TO-PAY FLOW */}
      <Section tone="white">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="The flow"
              lead="One unbroken chain from sourcing decision to settled payment — every step on the platform, every step on-contract."
            >
              Source, Contract, Procure, Invoice, <Accent>Pay</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={flow} columns={3} />
        </Container>
      </Section>

      {/* CAPABILITY DEPTH */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Capability depth"
              lead="Sourcing, contracts, procurement and the supplier network — the full breadth of Ariba, configured to how your category teams actually buy."
            >
              Depth across the <Accent>suite</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={capabilities} columns={4} bezel />
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
              Procurement that <Accent>pays back</Accent>.
            </h2>
          </Reveal>
          <Stagger className="grid gap-5 md:grid-cols-3">
            {[
              { value: "15+", label: "Ariba programmes delivered" },
              { value: "40%", label: "Average P2P cycle-time cut" },
              { value: "S/4 native", label: "Integration to the digital core" },
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
        eyebrow="Ariba"
        heading={
          <>
            Automate <Accent>source-to-pay</Accent>.
          </>
        }
        body="Tell us where procurement slows you down. We'll map an Ariba rollout that shortens cycle times and keeps spend on-contract — integrated natively with S/4HANA."
      />
    </>
  );
}
