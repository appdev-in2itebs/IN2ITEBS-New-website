import { Explainer } from "@/components/explainers/explainer";
import { EXPLAINERS } from "@/content/explainers";
import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { heroPicture } from "@/components/sections/hero-override";
import { HeroFigure } from "@/components/sections/hero-figure";
import { V2Hero, V2StickyNav, V2Overview, V2Section, V2Closing } from "@/components/sections/v2";
import { deliveryCentres, internationalOffices, legalEntities, headquarters } from "@/content/site";

export const metadata = pageMetadata("/about/markets/", {
  title: "Where we operate",
  description:
    "Headquartered in Bengaluru, with four delivery centres and five legal entities — and the data residency position for every market we deliver in.",
});

/**
 * Where we operate — the geographic container the site did not have.
 *
 * This page exists because a buyer in Nairobi or Accra checking whether we are real in their
 * market previously found an address. Public-sector and regulated buyers check this before they
 * check anything else, and data residency is now a procurement question in every market we are in.
 *
 * A new market is one entry from this model, added when the entity exists or there is a delivered
 * engagement — not when there is a pursuit. Build the slot, not the page.
 */

const markets = [
  {
    name: "India",
    entity: "In2IT Enterprise Business Services Pvt Ltd",
    centres: "Bengaluru (headquarters and registered office), Delhi, Bhubaneswar, Hyderabad",
    residency:
      "MeitY-compliant hosting for government workloads, with data centre and disaster recovery inside Indian jurisdiction. Aligned to the DPDP Act and the IT Act 2000.",
    proof:
      "Public sector undertakings, state transmission and distribution utilities, Navratna mining and metals enterprises, listed manufacturers and hospital groups.",
  },
  {
    name: "South Africa",
    entity: "In2IT Enterprise Business Services (Pty) Ltd",
    centres: "Johannesburg",
    residency: "Aligned to the Protection of Personal Information Act (POPIA).",
    proof: "A state-owned freight rail, port and pipeline operator of more than fifty-five thousand people.",
  },
  {
    name: "Kenya",
    entity: "In2IT Enterprise Business Services Kenya Limited",
    centres: "Nairobi",
    residency: "Aligned to the Kenyan Data Protection Act.",
    proof: "A state rail corporation, and the Kenyan food business of a multinational beverage group.",
  },
  {
    name: "Singapore",
    entity: "In2IT Enterprise Business Services Pte Ltd",
    centres: "Singapore",
    residency: "Aligned to the Personal Data Protection Act (PDPA).",
    proof: "Regional delivery and client coverage across Southeast Asia.",
  },
  {
    name: "United Arab Emirates",
    entity: "In2IT EB Solutions L.L.C.",
    centres: "Dubai",
    residency: "Aligned to the UAE Personal Data Protection Law.",
    proof: "Middle East client coverage and regional delivery.",
  },
];

export default function MarketsPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/about/markets/" name="Where we operate" />
      <FaqJsonLd route="/about/markets/" />
      <V2Hero
        route="/about/markets/"
        path={[{ label: "About", href: "/about/" }, { label: "Where we operate" }]}
        title="Registered, staffed and delivering"
        lead="A delivery centre is somewhere you can visit. Every city on this page has people in it. An entity without a staffed office is listed as an entity, not as a delivery centre."
        media={heroPicture(
          "/hero/about-markets.webp",
          <HeroFigure figureKey="about/markets" />,
          "Global operating entities and delivery centres — In2IT EBS",
        )}
      />
      <V2StickyNav
        anchors={[
          { id: "overview", label: "At a glance" },
          { id: "markets", label: "By market" },
          { id: "residency", label: "Data residency" },
        ]}
      />
      <V2Overview
        eyebrow="At a glance"
        heading="Five entities, four delivery centres, thirty-plus countries"
        paragraphs={[
          `${headquarters.legalName} is headquartered and registered in ${headquarters.city}, ${headquarters.country}.`,
          `Delivery centres, all in India: ${deliveryCentres.join(", ")}.`,
          `Offices without a delivery centre: ${internationalOffices.join(", ")}.`,
          `Legal entities in ${legalEntities.map((e) => e.country).join(", ")}. Clients across India and South Asia, Africa, the Middle East, Southeast Asia and ANZ, Europe and North America.`,
        ]}
      />

      {/*
        FOUR LAYERS, NOT ONE PIN SET.
        The overview above states the distinction in prose, which is easy to read past. Drawn as
        four rows over the same five markets, the delivery-centre row is visibly empty outside
        India — the honest answer, and the one a footprint map normally hides by giving every
        location an identical pin.
      */}
      <Explainer spec={EXPLAINERS["z4-footprint-layers"]} tone="canvas" />

      <V2Section id="markets" eyebrow="By market" heading="What we are in each one" tone="subtle">
        <div className="space-y-6">
          {markets.map((m) => (
            <div key={m.name} className="rounded-card border border-border-subtle bg-surface p-7">
              <h3 className="font-display text-h3 text-foreground">{m.name}</h3>
              <dl className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <dt className="text-sm uppercase tracking-label text-foreground-muted">Legal entity</dt>
                  <dd className="mt-1 text-foreground-muted">{m.entity}</dd>
                </div>
                <div>
                  <dt className="text-sm uppercase tracking-label text-foreground-muted">Delivery</dt>
                  <dd className="mt-1 text-foreground-muted">{m.centres}</dd>
                </div>
                <div>
                  <dt className="text-sm uppercase tracking-label text-foreground-muted">Data residency</dt>
                  <dd className="mt-1 text-foreground-muted">{m.residency}</dd>
                </div>
                <div>
                  <dt className="text-sm uppercase tracking-label text-foreground-muted">What we have delivered</dt>
                  <dd className="mt-1 text-foreground-muted">{m.proof}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </V2Section>

      <V2Section
        id="residency"
        eyebrow="Data residency"
        heading="Answered here rather than in a clarification round"
        tone="canvas"
      >
        <div className="text-foreground-muted lg:columns-2 lg:gap-x-12 [&>*]:mb-5 [&>*]:break-inside-avoid">
          <p>
            Where your data sits, and which law governs it, is a procurement question in every market we work in. We
            would rather answer it on a web page than in the third round of a tender.
          </p>
          <p>
            Where a client or a regulator requires it, we deliver with both the data centre and the disaster recovery
            site inside the same jurisdiction, on hosting that meets that market&rsquo;s own compliance regime.
          </p>
        </div>
      </V2Section>

      <V2Closing
        eyebrow="Operating somewhere we are not?"
        heading="Tell us where."
        body="We open a market when there is an entity or a delivered engagement behind it, not when there is a pursuit. If you need us somewhere on this list — or somewhere that is not — that is a short conversation."
      />
    </>
  );
}
