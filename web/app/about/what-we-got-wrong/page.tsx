import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { V2Hero, V2StickyNav, V2Overview, V2Section, V2Closing } from "@/components/sections/v2";
import { V2Ledger } from "@/components/sections/v2-ledger";
import { publicCorrections, reducedCount, correctionsReviewed } from "@/content/corrections";
import { longDate } from "@/content/capability-status";

export const metadata = pageMetadata("/about/what-we-got-wrong/", {
  title: "What we got wrong",
  description:
    "A dated list of the claims In2IT EBS has corrected or withdrawn from this site, including the ones that cost us something.",
});

/**
 * THE CORRECTIONS LOG.
 *
 * ── WHY A CONSULTANCY PUBLISHES THIS ─────────────────────────────────────────────────────────
 * Every firm in this market claims integrity on an About page. None of them publishes their own
 * errata. The asymmetry is the whole value: a buyer who reads this page has watched us pay a
 * price for honesty rather than describe it, and every other claim on the site gets more
 * believable as a consequence of this one page being here.
 *
 * It is also the logical completion of /about/where-we-stand/. That page publishes what we cannot
 * do. This one publishes what we got wrong. Together they say the same thing twice in different
 * registers: our claims are provisional, they are checked, and when they are wrong we say so in
 * the same place we said them.
 *
 * ── THE RULE THAT KEEPS IT WORTH READING ─────────────────────────────────────────────────────
 * See content/corrections.ts. The short version is that an entry has to have cost something — a
 * withdrawn designation, a reduced count, a claim made smaller. **A log of typos is worse than no
 * log**, because it reads as a firm performing humility while conceding nothing, and that is a
 * more expensive thing to be caught doing than having been wrong in the first place.
 *
 * The page prints the number of entries that reduced a claim, directly under the total. That
 * figure is the page auditing itself: if it ever drifts towards zero, the log has quietly turned
 * into a changelog and should be taken down rather than padded.
 *
 * ── NOT IN THE MAIN NAVIGATION ───────────────────────────────────────────────────────────────
 * Same reasoning as Where we stand. A buyer arrives here from the homepage's proof band or from a
 * claim they are weighing, which is the moment it is useful. Promoted to a nav item it becomes a
 * performance, and a firm advertising its own mistakes is doing something different from a firm
 * recording them.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */
export default function WhatWeGotWrongPage() {
  const dates = publicCorrections.map((c) => c.date).sort();
  const since = dates[0];

  return (
    <>
      <BreadcrumbJsonLd path="/about/what-we-got-wrong/" name="What we got wrong" />
      <V2Hero
        route="/about/what-we-got-wrong/"
        path={[{ label: "About", href: "/about/" }, { label: "What we got wrong" }]}
        title="What we got wrong."
        lead="Claims we published on this site and then had to correct or withdraw, with the date and what the correct position is. We keep the ones that cost us something, because those are the only ones worth publishing."
      />
      <V2StickyNav
        anchors={[
          { id: "overview", label: "Why this is here" },
          { id: "log", label: "The log" },
          { id: "rules", label: "What goes in it" },
        ]}
      />

      <V2Overview
        eyebrow="Why this is here"
        heading="Everyone says they are honest. This is the page where it is checkable."
        paragraphs={[
          "A claim on a website costs nothing to make. A correction costs something, which is exactly why publishing one is worth more than any number of sentences about integrity — and why almost nobody does it.",
          "Every entry below was a claim a visitor to this site could have read and believed. Several of them made us look better than we were. They were found during a content review in November 2026, and they are recorded here rather than quietly edited, because quietly editing is the thing this page exists to make impossible.",
          "Nothing is ever removed from this list. An entry that becomes embarrassing later is an entry doing its job.",
        ]}
      >
        <dl className="mt-10 grid grid-cols-2 gap-6">
          <div className="rounded-card border border-border-subtle bg-surface p-6">
            <dt className="font-display text-h2 text-foreground">{publicCorrections.length}</dt>
            <dd className="mt-2 text-sm text-foreground-muted">corrections published since {longDate(since)}</dd>
          </div>
          <div className="rounded-card border border-border-subtle bg-surface p-6">
            <dt className="font-display text-h2 text-foreground">{reducedCount}</dt>
            <dd className="mt-2 text-sm text-foreground-muted">of them made a claim smaller</dd>
          </div>
        </dl>
      </V2Overview>

      <V2Section
        id="log"
        eyebrow="The log"
        heading="Every correction, newest first."
        tone="canvas"
        note={`Last reviewed for completeness on ${correctionsReviewed}.`}
      >
        <V2Ledger
          entries={publicCorrections.map((c) => ({
            key: c.heading,
            marker: longDate(c.date),
            // The page it was published on belongs beside the date, not in a labelled row of its
            // own — it is an address, and giving it the same visual weight as "what is true"
            // suggested it mattered as much.
            // "/" on its own reads as an orphaned slash rather than an address.
            sub: c.where === "/" ? "Homepage" : c.where,
            flag: c.reduced ? "Reduced a claim" : undefined,
            title: c.heading,
            rows: [
              { label: "We published", value: c.published },
              { label: "What is true", value: c.correct },
              { label: "What we did", value: c.action },
            ],
          }))}
        />
      </V2Section>

      <V2Section id="rules" eyebrow="What goes in it" heading="The rule that keeps this worth reading" tone="subtle">
        <div className="max-w-measure space-y-5 text-foreground-muted">
          <p>
            An entry has to have cost something: a designation withdrawn, a number reduced, a capability un-claimed. A
            typo is not a correction. A broken link is not a correction. A log full of those is worse than no log,
            because it is a firm performing humility while conceding nothing.
          </p>
          <p>
            That is why the count above is printed in two parts. If the second number stops moving, this page has turned
            into a changelog and should come down rather than be padded.
          </p>
          <p>We also do not blame a tool, a vendor or a previous agency for anything on this page. We published it.</p>
          <p>
            <Link
              href="/about/where-we-stand/"
              className="inline-block min-h-6 font-semibold text-action underline-offset-4 hover:underline"
            >
              Where we stand
            </Link>{" "}
            is the other half of this: not what we got wrong, but what we currently cannot do, with the date each line
            was last checked against delivery evidence.
          </p>
        </div>
      </V2Section>

      <V2Closing
        eyebrow="Found something else?"
        heading="Tell us and we will add it."
        body="If a claim on this site does not match what you can verify, say so. If you are right, it goes on this page with your correction and the date — that is the only way the page stays worth anything."
        ctaLabel="Tell us what is wrong"
        ctaHref="/contact/"
      />
    </>
  );
}
