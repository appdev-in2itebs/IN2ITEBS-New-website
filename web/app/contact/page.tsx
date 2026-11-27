import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container, Section } from "@/components/ui/container";
import { Eyebrow, Accent, SectionHeading } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { HeroFigure } from "@/components/sections/hero-figure";
import { heroPicture } from "@/components/sections/hero-override";
import { DemoForm } from "@/components/forms/demo-form";
import { contactsFor } from "@/content/offices";
import type { Office } from "@/content/types";
import { getCms } from "@/lib/cms/content";
import { publicMailboxes } from "@/content/page-owners";
import { footerCertifications } from "@/content/site";

export const metadata = pageMetadata("/contact/", {
  title: "Contact",
  description:
    "Start your transformation with In2IT EBS, or reach the office nearest you across India and our global entities.",
});

function OfficeCard({ office }: { office: Office }) {
  return (
    <Card tone="white" className="flex h-full flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold leading-snug text-foreground">{office.name}</h3>
        <p className="text-xs font-semibold text-foreground-muted">{office.legalEntity}</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground-muted">{office.address}</p>
      <div className="mt-auto flex flex-col gap-1 pt-2 text-sm">
        <a href={`mailto:${office.email}`} className="inline-block min-h-6 font-medium text-action hover:underline">
          {office.email}
        </a>
        {office.phone ? <span className="text-foreground-muted">{office.phone}</span> : null}
      </div>
    </Card>
  );
}

export default async function ContactPage() {
  // Offices as edited in /admin/content.
  const { offices } = await getCms();
  const indiaOffices = offices.filter((o) => o.kind.includes("india-office"));
  const globalEntities = offices.filter((o) => o.kind.includes("global-entity") || !o.kind.includes("india-office"));
  const regionalContacts = contactsFor(offices);
  return (
    <>
      <BreadcrumbJsonLd path="/contact/" />
      <PageHero
        route="/contact/"
        eyebrow="Contact"
        headline="Let's talk about your"
        accentWord="transformation"
        subhead="Start your transformation, or reach the office nearest you."
        cta={false}
        media={heroPicture("/hero/contact-hero.webp", <HeroFigure figureKey="pages/contact" />, "Contact")}
        frame={false}
      />

      {/* FORM + INDIA OFFICES */}
      <Section tone="white">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
            {/* LEFT — intro + form */}
            <Reveal>
              <div className="flex flex-col gap-7">
                <SectionHeading
                  eyebrow="Start your transformation"
                  lead="Tell us about your priorities and the region you operate in so we can connect you with the relevant practice. The form below explains which enquiry options are currently available."
                >
                  A focused conversation, <Accent>not</Accent> a sales pitch.
                </SectionHeading>
                <Card tone="light" className="p-7 md:p-8">
                  <DemoForm />
                </Card>
              </div>
            </Reveal>

            {/* RIGHT — India offices */}
            <div className="flex flex-col gap-7">
              <Reveal>
                <SectionHeading eyebrow="India offices" level={3}>
                  Where our delivery <Accent>begins</Accent>.
                </SectionHeading>
              </Reveal>
              <Stagger className="grid gap-5 sm:grid-cols-2">
                {indiaOffices.map((office) => (
                  <StaggerItem key={office.slug} className="h-full">
                    <OfficeCard office={office} />
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
        </Container>
      </Section>

      {/* GLOBAL ENTITIES */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12">
            <SectionHeading
              split
              eyebrow="Global entities"
              lead="Registered entities and delivery presence across the Middle East, Africa, South-East Asia and North America."
            >
              A presence that follows your <Accent>operations</Accent>.
            </SectionHeading>
          </Reveal>
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {globalEntities.map((office) => (
              <StaggerItem key={office.slug} className="h-full">
                <OfficeCard office={office} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* REGIONAL CONTACTS + CERTIFICATIONS */}
      <Section tone="white" className="py-20 md:py-24">
        <Container>
          <div className="flex flex-col gap-12">
            <Reveal>
              <div className="flex flex-col gap-6">
                <Eyebrow>Regional contacts</Eyebrow>
                <div className="flex flex-wrap gap-x-10 gap-y-4">
                  {regionalContacts.map((r) => (
                    <div key={r.region} className="flex flex-col gap-1">
                      <span className="label-caps text-foreground-muted">{r.region}</span>
                      <a
                        href={`mailto:${r.email}`}
                        className="text-sm inline-block min-h-6 font-medium text-action hover:underline"
                      >
                        {r.email}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <div className="border-t border-gold-soft/40 pt-10">
              <Reveal className="flex flex-col gap-5">
                <Eyebrow>Who to write to</Eyebrow>
                <p className="max-w-measure text-sm text-foreground-muted">
                  Role mailboxes, not individuals — so a message still reaches the right desk when somebody changes job.
                </p>
                <dl className="grid gap-4 sm:grid-cols-2">
                  {[
                    { what: "Anything at all", who: publicMailboxes.general },
                    { what: "A requirement, a tender or a quote", who: publicMailboxes.newBusiness },
                    { what: "Applying for a role, or sending a CV", who: publicMailboxes.careers },
                    { what: "Invoices, billing and suppliers", who: publicMailboxes.accounts },
                  ].map((row) => (
                    <div key={row.who}>
                      <dt className="text-sm text-foreground-muted">{row.what}</dt>
                      <dd className="mt-1">
                        <a
                          href={`mailto:${row.who}`}
                          className="inline-block min-h-6 font-medium text-action hover:underline"
                        >
                          {row.who}
                        </a>
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>

            <div className="border-t border-gold-soft/40 pt-10">
              <Reveal className="flex flex-col gap-5">
                <Eyebrow>Credentials</Eyebrow>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium uppercase tracking-wider text-foreground-muted">
                  {footerCertifications.map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
