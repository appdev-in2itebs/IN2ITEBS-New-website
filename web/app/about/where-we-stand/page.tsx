import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, CapabilityJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { FEED_PATH } from "@/lib/capability-feed";
import { V2Hero, V2StickyNav, V2Overview, V2Section, V2Closing } from "@/components/sections/v2";
import { DiagramBand } from "@/components/sections/diagram-band";
import { Container } from "@/components/ui/container";
import {
  capabilities,
  capabilityExpires,
  capabilityOwner,
  capabilityReviewed,
  longDate,
  STATUS_LABELS,
  type CapabilityStatus,
} from "@/content/capability-status";

export const metadata = pageMetadata("/about/where-we-stand/", {
  title: "Where we stand",
  description:
    "Every capability with one of four statuses — delivered, with a partner, building, or ahead of us. Including the ones we do not have.",
});

/**
 * Where we stand.
 *
 * The page that makes the positioning survivable. We advise independently and we deliver deepest
 * in SAP; the failure mode of saying both is that the first quietly borrows credibility from the
 * second. This table is the mechanism that stops it, because every line is individually true and
 * the gaps are printed next to the strengths.
 *
 * It is also the page most likely to rot. See the rules at the top of content/capability-status.ts
 * before editing anything: a stale status table is worse than none, and if the monthly owner
 * lapses, this page comes down rather than drifting.
 *
 * Deliberately not in the main navigation. A buyer arrives here from a service page or from
 * Credentials, at the moment they are weighing a specific claim — which is when it is useful.
 * In navigation it reads as corporate throat-clearing.
 */

const ORDER: CapabilityStatus[] = ["delivered", "partner", "building", "ahead"];

const STATUS_CLASS: Record<CapabilityStatus, string> = {
  delivered: "bg-brand text-on-brand",
  partner: "bg-brand-muted text-on-brand",
  building: "bg-surface-subtle text-foreground",
  ahead: "border border-border-strong bg-surface text-foreground-muted",
};

export default function WhereWeStandPage() {
  const areas = [...new Set(capabilities.map((c) => c.area))];
  const counts = ORDER.map((status) => ({
    status,
    count: capabilities.filter((c) => c.status === status).length,
  }));

  return (
    <>
      <BreadcrumbJsonLd path="/about/where-we-stand/" name="Where we stand" />
      <CapabilityJsonLd />
      <FaqJsonLd route="/about/where-we-stand/" />
      <V2Hero
        route="/about/where-we-stand/"
        path={[{ label: "About", href: "/about/" }, { label: "Where we stand" }]}
        title="What we have done, what we are building, and what we cannot do."
        lead="Most firms publish a list of capabilities and let you assume they are all equally real. This is the same list with a status against each line, including the ones where the honest status is that we do not do it."
      />
      <V2StickyNav
        anchors={[
          { id: "overview", label: "Why this exists" },
          { id: "key", label: "What the statuses mean" },
          { id: "table", label: "The table" },
          { id: "use", label: "How to use it" },
          { id: "upkeep", label: "Upkeep" },
        ]}
      />

      <V2Overview
        eyebrow="Why this exists"
        heading="Breadth is a promise about how we advise. Depth is a claim about what we can build."
        paragraphs={[
          "We advise independently, and we recommend what fits rather than what we happen to sell. That is a statement about conduct, and a firm of any size can make it honestly.",
          "What we can build is a different question, and it has a different answer in every area. SAP is where the bench, the certifications and the record are. Elsewhere the honest answer ranges from a reference in production to the fact that we do not do it at all.",
          "Letting the first borrow credibility from the second is the oldest move in professional services. This table is what stops us making it.",
        ]}
      >
        {/*
          The four counts stay, but small and on one line rather than as four large tiles. The
          tiles were the biggest thing on the page and said the least: a reader who wants the
          shape gets it from the diagram below, and a reader who wants a number gets it from the
          table. Four big numerals in between served neither.
        */}
        <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-gold-soft/60 pt-6">
          {counts.map(({ status, count }) => (
            <div key={status} className="flex items-baseline gap-2">
              <dt className="font-display text-xl font-semibold text-foreground">{count}</dt>
              <dd className="text-sm text-foreground-muted">{STATUS_LABELS[status].label.toLowerCase()}</dd>
            </div>
          ))}
        </dl>
      </V2Overview>

      {/*
        THE DEPTH PROFILE — the register as a shape, before the register as a list.
        Same nineteen lines as the table below it, arranged by evidence rather than by area, so a
        reader sees where the depth is and where it is not before they start looking anything up.
        The five "Ahead of us" capabilities are drawn as empty outlines rather than omitted, which
        is the whole reason this picture does not exist on any competitor's site.
      */}
      <DiagramBand
        src="/diagrams/z1-depth-profile.svg"
        alt="The capability register drawn as a grid: four areas across, four evidence levels down. SAP has five capabilities in production, Engineering and data three, Run and operations one, and Other platforms none. Five capabilities across the register are drawn as empty outlines because we do not deliver them at all."
        caption="The vertical axis is evidence, not volume. The five hollow blocks are the capabilities we do not have."
        tone="subtle"
      />

      <V2Section id="key" eyebrow="The four statuses" heading="What each one commits us to" tone="subtle">
        <div className="grid gap-6 md:grid-cols-2">
          {ORDER.map((status) => (
            <div key={status} className="rounded-card border border-border-subtle bg-surface p-7">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${STATUS_CLASS[status]}`}
              >
                {STATUS_LABELS[status].label}
              </span>
              <p className="mt-4 text-foreground-muted">{STATUS_LABELS[status].meaning}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-measure text-foreground-muted">
          &ldquo;Delivered&rdquo; is the strict one. It means in production at a named client, signed off, with a named
          person here accountable for it. A pilot is not delivered. A proof of concept is not delivered. Having people
          with the skill is not delivered.
        </p>
      </V2Section>

      <V2Section id="table" eyebrow="The table" heading="Every capability, with its status" tone="canvas">
        <div className="space-y-12">
          {areas.map((area) => (
            <div key={area}>
              <h3 className="font-display text-h3 text-foreground">{area}</h3>
              {/*
                A 42rem table inside a 390px screen is a horizontal scroller, and a horizontal
                scroller inside a vertically scrolling page is where a status a buyer is meant to
                read — "Ahead of us" — goes unseen. So the same rows render twice: stacked blocks
                below md, the table from md up. The duplication is deliberate and the two halves
                read from one array, so they cannot drift apart.
              */}
              <ul className="mt-5 space-y-4 md:hidden">
                {capabilities
                  .filter((c) => c.area === area)
                  .map((c) => (
                    <li key={c.capability} className="rounded-card border border-border-subtle bg-surface p-5">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${STATUS_CLASS[c.status]}`}
                      >
                        {STATUS_LABELS[c.status].label}
                      </span>
                      <p className="mt-3 font-semibold text-foreground">{c.capability}</p>
                      <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{c.note}</p>
                    </li>
                  ))}
              </ul>

              <div className="mt-5 hidden md:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border-strong">
                      <th scope="col" className="py-3 pr-6 text-sm font-semibold text-foreground">
                        Capability
                      </th>
                      <th scope="col" className="py-3 pr-6 text-sm font-semibold text-foreground">
                        Status
                      </th>
                      <th scope="col" className="py-3 text-sm font-semibold text-foreground">
                        What that means here
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {capabilities
                      .filter((c) => c.area === area)
                      .map((c) => (
                        <tr key={c.capability} className="border-b border-border-subtle align-top">
                          <td className="w-[22%] py-4 pr-6 text-foreground">{c.capability}</td>
                          <td className="w-[14%] py-4 pr-6">
                            <span
                              className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${STATUS_CLASS[c.status]}`}
                            >
                              {STATUS_LABELS[c.status].label}
                            </span>
                          </td>
                          <td className="py-4 text-foreground-muted">
                            <span className="block max-w-measure">{c.note}</span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 max-w-measure text-sm text-foreground-muted">
          Every line was last checked against delivery evidence on{" "}
          {new Date(capabilityReviewed).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          . A line changes when the evidence changes, not when the wording does.
        </p>
        {/*
          THE FEED, IN VISIBLE TEXT.

          This endpoint existed for weeks and nothing could reach it: robots.txt disallowed the
          whole of /api/, it appeared in no sitemap, and no page linked it. A machine-readable
          asset nothing links to does not exist — while the handover document described it as
          published, which is the exact class of unverifiable claim this page was built to stop.

          Linked from here rather than from a footer because this is the table it serialises, and
          a tender team screening a long-list with software is the reader it was written for.
        */}
        <p className="mt-4 max-w-measure text-sm text-foreground-muted">
          This table is also published as{" "}
          <a
            href={FEED_PATH}
            className="inline-block min-h-6 font-semibold text-action underline-offset-4 hover:underline"
          >
            structured data
          </a>{" "}
          — the same register and the SAP-qualified packages as JSON, built by the same serialiser as this page, with no
          key and no rate limit. If you are screening a long-list with software, parse that rather than this.
        </p>
      </V2Section>

      <V2Section id="use" eyebrow="How to use it" heading="Three things this is for" tone="subtle">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-card border border-border-subtle bg-surface p-7">
            <h3 className="font-display text-h3 text-foreground">Check a claim</h3>
            <p className="mt-3 text-foreground-muted">
              If somebody from here has told you we do something, this page says what kind of &ldquo;do&rdquo; that is.
              If the two disagree, this page is right.
            </p>
          </div>
          <div className="rounded-card border border-border-subtle bg-surface p-7">
            <h3 className="font-display text-h3 text-foreground">Qualify us out early</h3>
            <p className="mt-3 text-foreground-muted">
              If what you need sits under &ldquo;Ahead of us&rdquo;, you have saved a meeting. That is a fair trade for
              us too.
            </p>
          </div>
          <div className="rounded-card border border-border-subtle bg-surface p-7">
            <h3 className="font-display text-h3 text-foreground">Ask the follow-up</h3>
            <p className="mt-3 text-foreground-muted">
              &ldquo;Building&rdquo; is an invitation. Ask what is in production today and who is accountable for it,
              and you should get a straight answer with a name in it.
            </p>
          </div>
        </div>
      </V2Section>

      {/*
        THE STALENESS CLOCK.

        The build already refuses to ship this page when the table goes ninety days unchecked —
        scripts/check-build.mjs, verified by backdating the constant until the build failed. That
        machinery was invisible, which meant the strongest thing about this page was the one thing
        no visitor could see. This band shows it, in the only form that cannot itself go stale:
        two fixed dates. See the note above `capabilityExpires` in content/capability-status.ts
        for why this is deliberately not a countdown.
      */}
      <section
        aria-labelledby="upkeep-heading"
        id="upkeep"
        className="theme-on-brand relative isolate overflow-hidden bg-brand py-20 text-on-brand md:py-24"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 hero-ambient opacity-60" />
        <Container className="relative">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <span className="label-caps text-gold-on-brand">Upkeep</span>
              <h2
                id="upkeep-heading"
                className="heading-plain mt-6 font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-bold leading-[1.08] tracking-[-0.035em]"
              >
                This page has an expiry date.
              </h2>
            </div>
            <div className="lg:col-span-7">
              <dl className="grid gap-px overflow-hidden rounded-feature bg-on-brand/15 sm:grid-cols-2">
                <div className="bg-brand p-7">
                  <dt className="label-caps text-gold-on-brand">Last checked</dt>
                  <dd className="mt-3 font-display text-h3 font-semibold text-on-brand">
                    {longDate(capabilityReviewed)}
                  </dd>
                </div>
                <div className="bg-brand p-7">
                  <dt className="label-caps text-gold-on-brand">Stops publishing</dt>
                  <dd className="mt-3 font-display text-h3 font-semibold text-on-brand">
                    {longDate(capabilityExpires)}
                  </dd>
                </div>
              </dl>
              <div className="mt-8 max-w-[58ch] space-y-4 text-base leading-relaxed text-on-brand/80">
                <p>
                  If nobody here re-checks every line against delivery evidence before that second date, this site stops
                  building. Not a reminder that gets ignored &mdash; a failed build that has to be fixed before anything
                  else on this site can be published.
                </p>
                <p>
                  {capabilityOwner} owns the check. The only way past the gate without doing the work is to edit the
                  date on purpose, which is a different and far more visible kind of failure than letting a page quietly
                  rot.
                </p>
                <p>
                  We print the two dates rather than &ldquo;verified recently&rdquo; because a page can be built once
                  and served for months afterwards. Fixed dates stay true for as long as they are on the screen; a
                  countdown would start lying the day after it was rendered, which is the exact failure this page exists
                  to prevent.
                </p>
                {/*
                  Published for the bid team that parses a long-list before anyone reads it, and
                  for the assistants that now assemble "which partners deliver X" from structured
                  data rather than prose. No key, no rate limit, no conversation with Alliances
                  first — an endpoint you have to ask permission to read is the PDF problem again.
                */}
                <p className="border-t border-on-brand/20 pt-4 text-sm text-on-brand/70">
                  If you would rather parse this than read it, the whole register &mdash; every line, its status, the
                  review dates and SAP&rsquo;s qualified packages &mdash; is available as JSON at{" "}
                  <a
                    href={FEED_PATH}
                    className="inline-block min-h-6 font-semibold text-gold-on-brand underline underline-offset-4"
                  >
                    {FEED_PATH}
                  </a>
                  . No key, no rate limit.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/*
        THE CLAIM LIFECYCLE — the band above says this page expires; this says what the machinery
        around it actually is. It sits after the upkeep band rather than inside it because the
        subject widens at this point: the two dates above are about this page, and the four gates
        below are about every claim on the site.
      */}
      <DiagramBand
        src="/diagrams/z2-claim-lifecycle.svg"
        alt="Four stages left to right — evidence, recorded, published, expires — above the four checks that run on every build: the capability register at ninety days, the corporate facts at two hundred, the house style, and outcome figures. If any one fails, the whole site stays on its previous version."
        caption="Four checks run on every build of this site. Any one of them failing stops the whole site publishing, not only the line that failed."
        tone="canvas"
      />

      <V2Closing
        eyebrow="Found a gap that matters to you?"
        heading="Then let us talk about it directly."
        body="A gap on this page is not the end of a conversation. It usually means a partner, a different sequence, or an honest recommendation that somebody else is the better fit. All three are better than finding out in month four."
      />
    </>
  );
}
