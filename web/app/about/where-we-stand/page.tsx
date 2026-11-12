import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { V2Hero, V2StickyNav, V2Overview, V2Section, V2Closing } from "@/components/sections/v2";
import { capabilities, capabilityReviewed, STATUS_LABELS, type CapabilityStatus } from "@/content/capability-status";

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
        <dl className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {counts.map(({ status, count }) => (
            <div key={status} className="rounded-card border border-border-subtle bg-surface p-6">
              <dt className="font-display text-h2 text-foreground">{count}</dt>
              <dd className="mt-2 text-sm text-foreground-muted">{STATUS_LABELS[status].label}</dd>
            </div>
          ))}
        </dl>
      </V2Overview>

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
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[42rem] border-collapse text-left">
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
                          <td className="py-4 pr-6 text-foreground">{c.capability}</td>
                          <td className="py-4 pr-6">
                            <span
                              className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${STATUS_CLASS[c.status]}`}
                            >
                              {STATUS_LABELS[c.status].label}
                            </span>
                          </td>
                          <td className="py-4 text-foreground-muted">{c.note}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 text-sm text-foreground-muted">
          Every line was last checked against delivery evidence on{" "}
          {new Date(capabilityReviewed).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          . A line changes when the evidence changes, not when the wording does.
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

      <V2Closing
        eyebrow="Found a gap that matters to you?"
        heading="Then let us talk about it directly."
        body="A gap on this page is not the end of a conversation. It usually means a partner, a different sequence, or an honest recommendation that somebody else is the better fit. All three are better than finding out in month four."
      />
    </>
  );
}
