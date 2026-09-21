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

export const metadata = pageMetadata("/sap-enterprise-solutions/rise-with-sap/", {
  title: "RISE with SAP",
  description:
    "SAP S/4HANA as the digital core — the key value proposition, the business benefits and the IT benefits of RISE with SAP, delivered by In2IT EBS.",
});

/**
 * RISE with SAP — the port of the existing site's /sap-rise-with-sap/ page.
 *
 * Its substance is carried over section for section: the S/4HANA introduction, the digital-core
 * diagram it illustrates that with, the six key-value-proposition points, and the business and IT
 * halves of the benefits. The copy is the existing page's own, lightly de-hyphenated and set in
 * sentence case; nothing has been added to it and nothing claimed that it did not claim.
 *
 * It is a different page from /sap-enterprise-solutions/rise-vs-grow/, which is the *choice*
 * between the two editions. This one is RISE itself, and the two link to each other.
 */

/** Key-value proposition of SAP S/4HANA — the six points the existing page lists. */
const valueProposition = [
  {
    title: "Business-centric innovation",
    body: "Empowers customers to become intelligent enterprises by transforming the business with a new generation of innovative end-to-end processes.",
  },
  {
    title: "Industry-leading capabilities",
    body: "Serves customers in more than 25 industries with an unmatched depth of capability and expertise.",
  },
  {
    title: "Runs on SAP HANA",
    body: "Massive simplification across customer adoption, the data model, user experience, decision making, business processes and models — and innovation across IoT, big data, business networks and mobile-first.",
  },
  {
    title: "Natively designed with SAP Fiori",
    body: "An integrated user experience with modern usability and instant insight on any device: role-based, mobile-first and consistent across every line of business.",
  },
  {
    title: "A choice of deployment",
    body: "Natively engineered for on-premise, multi-tenant and single-tenant cloud, and hybrid landscapes.",
  },
  {
    title: "Born for easy adoption",
    body: "Guided configuration and easy onboarding, from discovering the solution through cloud trials to deployment on preconfigured best practices.",
  },
];

/** Business value — the existing page's first benefits half. */
const businessValue = [
  "Connect to people, devices and business networks to deliver new value to your customers on any channel.",
  "Leverage digital assistance and natural-language conversations for increased productivity and user satisfaction.",
  "Add automation to key processes and signal users when input is required, with artificial intelligence and machine learning.",
  "Give business users context-aware, predictive insight in real time — planning, execution, prediction and simulation for better decisions and faster impact.",
];

/** IT value — the existing page's second benefits half. */
const itValue = [
  "Reduce your data footprint and work with larger data sets in one system, saving hardware cost, operational cost and time.",
  "Simplify innovation on an open platform (SAP Business Technology Platform) to drive advanced applications — predicting, recommending and simulating — while protecting existing investments.",
  "Give business users a simple, role-based user experience built on modern design principles, which cuts training effort while raising productivity.",
  "Choose your deployment — cloud, on-premise or hybrid — to drive quick time to value.",
];

export default function RiseWithSapPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/sap-enterprise-solutions/rise-with-sap/" />
      <PageHero
        eyebrow="SAP Enterprise Solutions · RISE with SAP"
        headline="SAP S/4HANA, the digital core of your"
        accentWord="business."
        subhead="SAP S/4HANA is a real-time enterprise resource management suite for digital business. It is built on the advanced in-memory platform SAP HANA, offers a personalised, consumer-grade user experience with SAP Fiori, and is deployable on-premise, in the cloud and hybrid."
        media={
          <div className="relative h-full w-full overflow-hidden rounded-[calc(var(--radius-feature)-0.5rem)] bg-surface">
            <Image
              src="/services/rise-with-sap.jpg"
              alt="A desk running S/4HANA dashboards, captioned RISE with SAP — Business Transformation as a Service"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        }
      />

      {/* WHAT S/4HANA IS */}
      <Section tone="white">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="SAP S/4HANA"
              lead="Designed for enterprises across industries that need a deep and broad level of functionality combined with a high degree of flexibility in customisation."
            >
              The digital core for your <Accent>business</Accent>.
            </SectionHeading>
          </Reveal>
          <Reveal>
            <Card tone="white">
              <p className="max-w-[80ch] text-base leading-relaxed text-foreground-muted">
                Built on the SAP HANA platform, S/4HANA can enable the digital network that connects your entire
                workforce, your suppliers, your customers and your assets to the digital core.
              </p>
              {/* SAP's own digital-core schematic, as the existing page uses it. It is drawn for a
                  white ground, so it sits on a white card rather than the page tint. */}
              <figure className="mt-8">
                <Image
                  src="/services/s4hana-digital-core.png"
                  alt="SAP S/4HANA as the digital core, with customer experience, manufacturing and supply chain, enterprise management, people engagement and network and spend management arranged around an intelligent suite, over integration, business objects, master data and orchestration, across 25 industries and all countries."
                  width={1400}
                  height={875}
                  sizes="(min-width: 1024px) 60rem, 100vw"
                  className="h-auto w-full rounded-surface bg-logo-surface"
                />
                <figcaption className="mt-4 text-sm leading-relaxed text-foreground-muted">
                  Out-of-the-box integration, a consistent user experience across the portfolio, a modular design that
                  is cost-effective to operate, room for customers and partners to extend it quickly, and intelligence
                  embedded in the applications themselves.
                </figcaption>
              </figure>
            </Card>
          </Reveal>
        </Container>
      </Section>

      {/* KEY-VALUE PROPOSITION */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Key-value proposition"
              lead="Six things S/4HANA brings to the estate, and the reason it is the platform the rest of the SAP landscape is built around."
            >
              Why S/4HANA sits at the <Accent>centre</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={valueProposition} columns={3} bezel />
        </Container>
      </Section>

      {/* BUSINESS BENEFITS */}
      <Section tone="white">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Business benefits"
              lead="From a business value perspective, S/4HANA lets you reinvent business models and drive new revenue and profit. From an IT value perspective, it simplifies the landscape and helps reduce total cost of ownership, with SAP HANA as the great simplifier."
            >
              Value on both sides of the <Accent>house</Accent>.
            </SectionHeading>
          </Reveal>
          <Stagger className="grid gap-5 md:grid-cols-2">
            {[
              { heading: "Business value", points: businessValue },
              { heading: "IT value", points: itValue },
            ].map((group) => (
              <StaggerItem key={group.heading} className="h-full">
                <Card bezel className="h-full">
                  <Eyebrow>{group.heading}</Eyebrow>
                  <ul className="mt-5 space-y-3.5">
                    {group.points.map((point) => (
                      <li key={point} className="flex gap-3 text-[0.95rem] leading-relaxed text-foreground-muted">
                        <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-action" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* THE OTHER PATH */}
      <Section tone="light">
        <Container>
          <Reveal className="mx-auto max-w-3xl text-center">
            <SectionHeading eyebrow="RISE is not the only path">
              There is also <Accent>GROW</Accent>.
            </SectionHeading>
            <p className="mx-auto mt-6 max-w-[60ch] text-base leading-relaxed text-foreground-muted">
              RISE is the private-cloud path and suits deep customisation and complex landscapes. GROW is the public
              cloud, fit-to-standard path. Both are valid; which one fits is an evidence question, not a preference.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-4">
              <Link
                href="/sap-enterprise-solutions/rise-vs-grow/"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gold hover:underline"
              >
                Compare RISE and GROW <ArrowUpRight aria-hidden size={17} />
              </Link>
              <Link
                href="/sap-enterprise-solutions/grow-fast/"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gold hover:underline"
              >
                SAP GROW Fast <ArrowUpRight aria-hidden size={17} />
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>

      <CtaSection
        eyebrow="RISE with SAP"
        heading={
          <>
            Put the digital core <Accent>in place</Accent>.
          </>
        }
        body="Tell us what your landscape looks like today. We will map the route from where you are to S/4HANA, and show you the evidence behind the recommendation before anything is committed."
      />
    </>
  );
}
