import { pageMetadata } from "@/lib/metadata";
import { AllianceStrip } from "@/components/sections/alliance-strip";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { heroPicture } from "@/components/sections/hero-override";
import { HeroFigure } from "@/components/sections/hero-figure";
import { V2Hero, V2StickyNav, V2Overview, V2Section, V2Closing } from "@/components/sections/v2";

export const metadata = pageMetadata("/about/partnerships/", {
  title: "Partnerships",
  description:
    "SAP Gold Partner, Salesforce and Workday partners in India, RISE delivered on Azure, AWS and Google Cloud, with named data and content platform partners.",
});

/**
 * Partnerships — one page, replacing ten partner pages the old site could not fill.
 *
 * For each partnership this page states the tier, what we deliver under it, and where we have
 * delivered it. Partners we hold no current designation from are named as absent rather than
 * implied by a logo. Every tier requires written confirmation from Alliances before publish.
 */

const platforms = [
  {
    partner: "SAP",
    logo: "/logos/partners/sap.svg",
    tier: "Gold Partner · RISE Partnership (BTaaS) · Co-Innovation Partner",
    delivers:
      "RISE with SAP · S/4HANA Cloud Public Edition · Business Technology Platform · SuccessFactors · Ariba · Analytics Cloud · Signavio · Concur",
  },
  {
    partner: "Salesforce",
    logo: "/logos/partners/salesforce.svg",
    tier: "Partner, India",
    delivers: "Sales Cloud, Service Cloud and Platform — implementation, integration and support",
  },
  {
    partner: "Workday",
    logo: "/logos/partners/workday.svg",
    tier: "Partner, India",
    delivers: "HCM and Financials — implementation, integration and support",
  },
];

const dataPartners = [
  {
    name: "Syniti ADMM",
    what: "The SAP-endorsed data migration platform — rules, mappings, dashboards, reconciliation and governance",
    where: "Migration waves, alongside SAP's own Migration Cockpit",
  },
  {
    name: "JiVS IMP",
    what: "Historical data retention and legacy system decommissioning, including ECC and IS-U history",
    where: "Lean migrations where decades of history must stay accessible",
  },
  {
    name: "Solix",
    what: "Enterprise archiving, application retirement, data masking and test data management",
    where: "Archiving programmes and safe test environments",
  },
  {
    name: "OpenText for SAP",
    what: "Content and document management",
    where: "Configured and content migrated on a state distribution utility",
  },
];

export default function PartnershipsPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/about/partnerships/" name="Partnerships" />
      <V2Hero
        route="/about/partnerships/"
        path={[{ label: "About", href: "/about/" }, { label: "Partnerships" }]}
        title="The ones we hold. And what each of them actually gets you."
        lead="A partner logo on a website tells a buyer nothing on its own. For each partnership below we have said what tier it is, what we deliver under it, and — where there is one — where we have delivered it."
        media={heroPicture(
          "/hero/about-partnerships.webp",
          <HeroFigure figureKey="about/partnerships" />,
          "Partnerships and platform alliances — In2IT EBS",
        )}
      />
      <V2StickyNav
        anchors={[
          { id: "overview", label: "Platforms" },
          { id: "cloud", label: "Cloud" },
          { id: "data", label: "Data and content" },
          { id: "operational", label: "Operational systems" },
          { id: "alliances", label: "Delivery alliances" },
        ]}
      />
      <V2Overview
        eyebrow="Platform partners"
        heading="The platforms we implement"
        paragraphs={[
          "Oracle, ServiceNow, Microsoft Dynamics and Adobe are not on this list because we hold no designation from any of them.",
        ]}
      >
        <div className="mt-10 space-y-5">
          {platforms.map((p) => (
            <div key={p.partner} className="rounded-card border border-border-subtle bg-surface p-7">
              {/* Owner, 26 Nov 2026: each platform's mark at a readable size, to the right of its name. */}
              <div className="flex items-center justify-between gap-6">
                <h3 className="font-display text-h3 text-foreground">{p.partner}</h3>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.logo}
                  alt={`${p.partner} logo`}
                  width={160}
                  height={64}
                  loading="lazy"
                  className="h-12 w-auto max-w-[10rem] shrink-0 object-contain md:h-14"
                />
              </div>
              <p className="mt-2 text-sm uppercase tracking-label text-foreground-muted">{p.tier}</p>
              <p className="mt-3 text-foreground-muted">{p.delivers}</p>
            </div>
          ))}
        </div>
      </V2Overview>

      <V2Section id="cloud" eyebrow="Cloud" heading="Where RISE runs" tone="subtle">
        <div className="max-w-measure space-y-4 text-foreground-muted">
          <p>
            RISE with SAP is delivered on{" "}
            <span className="text-foreground">Microsoft Azure, Amazon Web Services and Google Cloud</span>. The
            hyperscaler is chosen on the client&rsquo;s data residency requirement, existing cloud commitments and
            regional availability — not on which one we prefer.
          </p>
          <p>We have delivered a brownfield ECC to S/4HANA conversion onto RISE on Azure in five months.</p>
        </div>
      </V2Section>

      <V2Section id="data" eyebrow="Data and content" heading="The platforms behind the data work" tone="canvas">
        <div className="grid gap-6 md:grid-cols-2">
          {dataPartners.map((d) => (
            <div key={d.name} className="rounded-card border border-border-subtle bg-surface p-7">
              <h3 className="font-display text-h3 text-foreground">{d.name}</h3>
              <p className="mt-3 text-foreground-muted">{d.what}</p>
              <p className="mt-3 text-sm text-foreground-muted">{d.where}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-measure text-foreground-muted">
          We are licence-agnostic across all four. We will tell you which one fits your landscape and which one you are
          being sold without cause.
        </p>
      </V2Section>

      <V2Section
        id="operational"
        eyebrow="Operational systems"
        heading="The systems we integrate to, and do not sell"
        tone="subtle"
      >
        <div className="max-w-measure space-y-4 text-foreground-muted">
          <p>
            A utility never runs on SAP alone, and neither does a mine. We integrate, vendor-neutrally, to geographic
            information systems, metering head-ends and meter data management, control and outage management systems,
            prepaid vending and mobile money, laboratory information management, fleet management and manufacturing
            execution systems.
          </p>
          <p>
            <span className="text-foreground">We do not resell any of them, and we do not take a margin on them.</span>{" "}
            That is the point of saying it here: integration advice from a party with no stake in which product you buy
            is worth more than integration advice from a reseller.
          </p>
        </div>
      </V2Section>

      <V2Section id="alliances" eyebrow="Delivery alliances" heading="Working alongside other firms" tone="canvas">
        <div className="max-w-measure space-y-4 text-foreground-muted">
          <p>
            We co-deliver with global and regional system integrators, as prime contractor or as the specialist partner
            inside somebody else&rsquo;s programme. Both are normal for us and we are comfortable in either seat.
          </p>
          <p>
            Where a tender requires a designation we do not hold, we will say so and propose the partner who does,
            rather than bidding and hoping.
          </p>
        </div>
        <div className="mt-10 border-t border-border-subtle pt-10">
          <p className="label-caps text-foreground-muted">The marks of the platforms we are designated on</p>
          <div className="mt-6">
            <AllianceStrip />
          </div>
        </div>
      </V2Section>

      <V2Closing
        eyebrow="Checking a designation?"
        heading="Ask us for it in writing."
        body="Every tier on this page is confirmable with the vendor. If a tender needs evidence of a partnership, we would rather send the certificate than the logo."
      />
    </>
  );
}
