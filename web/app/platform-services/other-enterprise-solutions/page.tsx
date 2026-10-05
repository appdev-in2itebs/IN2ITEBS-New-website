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
import { CtaSection } from "@/components/sections/cta-section";

export const metadata = pageMetadata("/platform-services/other-enterprise-solutions/", {
  title: "Other Enterprise Solutions",
  description:
    "Plan, implement and customise the leading enterprise platforms — SAP, Microsoft and Oracle — with consulting that recovers the estate when it stalls.",
});

/**
 * Other Enterprise Solutions — the port of the existing site's /other-enterprise-solutions/ page.
 *
 * The existing page introduces the idea and then gives SAP and Microsoft a card each with a "Read
 * More" link. Oracle is named in the introduction but has no card there; it gets one here, because
 * this site has an Oracle practice page to send people to and a named platform with no way through
 * to it is a dead end rather than a faithful copy.
 */

const platforms = [
  {
    name: "SAP",
    body: "SAP solutions help you increase the customer value and the brand value of your business. They let you execute enterprise functions simply in the digital world. Implementation, however, is not as easy as anticipated — so we offer SAP consulting to improve working speed and reduce cost.",
    href: "/sap-enterprise-solutions/",
  },
  {
    name: "Microsoft",
    body: "With Microsoft offering several desk and workplace solutions, it is possible for businesses to stay ahead of the market. These tools can be used for every business activity from communication to development. Our expertise in Microsoft products lets us guide you through adopting them.",
    href: "/microsoft/",
  },
  {
    name: "Oracle",
    body: "Oracle runs finance and operations for a great many of the enterprises we work with. We connect the applications, the cloud services and the data around the processes your organisation actually depends on — E-Business Suite, Cloud ERP, JD Edwards, database and middleware.",
    href: "/oracle/",
  },
];

export default function OtherEnterpriseSolutionsPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/platform-services/other-enterprise-solutions/" />
      <PageHero
        route="/platform-services/other-enterprise-solutions/"
        eyebrow="Platform Services · Other Enterprise Solutions"
        headline="Enterprises have to keep"
        accentWord="changing."
        subhead="Enterprises need to keep changing according to the evolving demands of the market. As the technology landscape presents new opportunities every day, it becomes essential to anticipate how you will serve the future needs of your organisation, your customers, your employees and your stakeholders."
        media={
          <div className="relative h-full w-full overflow-hidden rounded-[calc(var(--radius-feature)-0.5rem)] bg-surface">
            <Image
              src="/services/other-enterprise-solutions.jpg"
              alt="Four pairs of hands fitting jigsaw pieces together on a table"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        }
      />

      {/* WHAT WE DO */}
      <Section tone="white">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="How we help"
              lead="We help you take advantage of several leading platforms — SAP, Microsoft and Oracle among them."
            >
              Plan, implement, <Accent>customise</Accent>.
            </SectionHeading>
          </Reveal>
          <Reveal>
            <Card tone="white">
              <p className="max-w-[80ch] text-base leading-relaxed text-foreground-muted">
                Our team assists you to plan, implement and customise the way you work with these tools, so you can
                ensure smooth functioning and enhanced performance in the long term. Whenever you face system glitches
                or struggle with bottlenecks, our experts provide enterprise consulting to recover from the damage and
                reduce its impact.
              </p>
            </Card>
          </Reveal>
        </Container>
      </Section>

      {/* THE PLATFORMS */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="The platforms"
              lead="Each one has a practice behind it, with the consultants, the accelerators and the support model already in place."
            >
              Three estates, one accountable <Accent>partner</Accent>.
            </SectionHeading>
          </Reveal>
          <Stagger className="grid gap-5 md:grid-cols-3">
            {platforms.map((platform) => (
              <StaggerItem key={platform.name} className="h-full">
                <Card bezel className="flex h-full flex-col">
                  <h3 className="text-h3 font-bold text-foreground">{platform.name}</h3>
                  <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-foreground-muted">{platform.body}</p>
                  <Link
                    href={platform.href}
                    className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gold hover:underline"
                  >
                    Read more <ArrowUpRight aria-hidden size={17} />
                  </Link>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-12">
            <Eyebrow>Also in Platform Services</Eyebrow>
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-4">
              {[
                { label: "Salesforce", href: "/salesforce/" },
                { label: "Workday", href: "/workday/" },
                { label: "All platform services", href: "/platform-services/" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gold hover:underline"
                >
                  {link.label} <ArrowUpRight aria-hidden size={17} />
                </Link>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>

      <CtaSection
        eyebrow="Other Enterprise Solutions"
        heading={
          <>
            Get the estate working as <Accent>one</Accent>.
          </>
        }
        body="Tell us which platforms you run and where they stop talking to each other. We will show you what it takes to connect them, and what it is worth before you commit to it."
      />
    </>
  );
}
