import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { V2Hero, V2StickyNav, V2Overview, V2Section, V2Closing } from "@/components/sections/v2";
import { HeroFigure } from "@/components/sections/hero-figure";
import { heroPicture } from "@/components/sections/hero-override";

export const metadata = pageMetadata("/services/how-we-price/", {
  title: "How we price",
  description:
    "Two commercial models, what each one costs you in risk, what we carry, what you supply, and what triggers a change request.",
});

/**
 * How we price.
 *
 * ── WHY THIS PAGE LOOKS LIKE THIS ────────────────────────────────────────────────────────────
 * Benchmarked in November 2026 against the firms In2IT competes with. None of Persistent,
 * Birlasoft, Zensar, Mastek, NTT DATA Business Solutions or Hexaware publishes anything about
 * commercial models at all. The nearest credible mid-tier example is ScienceSoft, and reading it
 * closely is what shaped this page — by showing what to avoid:
 *
 *   - It lists models without ever saying WHO CARRIES THE RISK in each, which is the only reason
 *     a buyer reads a pricing page.
 *   - It offers "time and materials with a cap" without saying how the cap is set or what happens
 *     above it. A cap nobody defines is not a cap.
 *   - It has a "mixed model — depending on the situation" with no criteria, which is a black box
 *     wearing a label.
 *   - It never says what the CLIENT must supply, so every commitment is implicitly one-sided.
 *   - Every concrete number sits behind a "request a free estimate" form, so the page itself
 *     commits to nothing.
 *
 * So this page states the risk allocation in both directions, defines the change-control trigger,
 * says what the client supplies, and does not hide the substance behind a form.
 *
 * WHAT IS DELIBERATELY ABSENT: outcome-linked and gain-share pricing. Both are real and both are
 * where buyer preference is heading, and the Managing Director's decision in November 2026 was
 * that neither goes on the public site — they are negotiated per deal, not advertised. Do not add
 * them here without reversing that decision explicitly.
 *
 * NO RATES OR RATE CARDS. Day rates on a public page get read by competitors before clients.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */

const models = [
  {
    name: "Fixed scope, fixed price",
    when: "The work can be specified before it starts — an implementation with a defined module set, a migration with a known estate, an assessment, a defined build.",
    weCarry: [
      "The estimate. If we read the effort wrong, that is ours to absorb, not yours to fund.",
      "Rework caused by our own defects, inside the agreed quality gates.",
      "The delivery plan and the people on it, including replacing anyone who is not working out.",
    ],
    youCarry: [
      "Decisions, within the timescale written into the plan. A decision that waits three weeks moves the date.",
      "Access to systems, data and the people who know how things actually work.",
      "Changes to what was agreed — which is what the change-control clause below is for.",
    ],
    youSupply: [
      "A named business owner who can take a decision without convening a committee",
      "Environments and access on the dates in the plan",
      "Subject matter experts for the hours the plan says, agreed before it starts",
    ],
  },
  {
    name: "Managed service, monthly fee",
    when: "The work is continuous and measured by availability and responsiveness rather than by deliverables — application management, support, operations.",
    weCarry: [
      "Meeting the service levels, with credits if we do not. The credits are in the contract, not in a side letter.",
      "Having the right skills available, including the ones you need twice a year.",
      "Continuity. Our attrition is our problem and it is not an excuse we will offer you.",
    ],
    youCarry: [
      "Volumes beyond the agreed envelope, which are priced and visible rather than absorbed quietly.",
      "Changes to the estate that change the work — new modules, new entities, new integrations.",
      "Your own approvals. The clock stops while we are waiting on you, and every pause is visible in the ticket.",
    ],
    youSupply: [
      "A named service owner on your side",
      "Access, environments and the standing approvals the runbook depends on",
      "Notice of estate changes that affect scope, before they land",
    ],
  },
];

const principles = [
  {
    title: "A change request is defined, not asserted",
    body: "A change request is work outside what was written down at the point of signature — not work that turned out to be harder than we expected. If we underestimated, that is our risk and we carry it. If you asked for something different, that is a change. We will tell you which it is in writing, with the clause that says so, before any work on it starts.",
  },
  {
    title: "The clock stops only for reasons we both agree on",
    body: "On a managed service, response and resolution timers pause while we are waiting on your approval, your access or your business input — and every pause is visible in the ticket. Miss the targets two months running and service credits apply.",
  },
  {
    title: "Shared pool, per-client service levels",
    body: "Our application management runs from a shared specialist pool rather than a dedicated per-client team. That is what makes a deep SAP bench affordable for a mid-sized estate — you get access to skills you could not justify employing. The service levels are still yours and are contracted per client.",
  },
  {
    title: "The assessment is priced separately, and you can stop after it",
    body: "Where we propose an assessment first, it is a fixed price with no onward commitment, and you own the output. That includes the version of the output that says do nothing, or that says somebody else is the better fit.",
  },
  {
    title: "We do not price risk we have not scoped",
    body: "If we cannot see the estate well enough to estimate it, we will say so rather than quoting a number with a margin hidden in it to cover what we did not look at. That usually means a short assessment first. It is a slower sale and a better project.",
  },
];

export default function HowWePricePage() {
  return (
    <>
      <BreadcrumbJsonLd path="/services/how-we-price/" name="How we price" />
      <FaqJsonLd route="/services/how-we-price/" />
      <V2Hero
        route="/services/how-we-price/"
        path={[{ label: "Services", href: "/services/" }, { label: "How we price" }]}
        title="Two commercial models, and who carries which risk in each."
        lead="Most firms in this market publish nothing about how they charge. We think the question a buyer is actually asking is not what it costs but who is exposed when it goes wrong — so this page answers that one."
        media={heroPicture(
          "/hero/services-how-we-price.webp",
          <HeroFigure figureKey="services/how-we-price" />,
          "How we price",
        )}
      />
      <V2StickyNav
        anchors={[
          { id: "overview", label: "Why publish this" },
          { id: "models", label: "The two models" },
          { id: "principles", label: "How we behave" },
          { id: "not", label: "What we do not do" },
        ]}
      />

      <V2Overview
        eyebrow="Why publish this at all"
        heading="Because the alternative is asking you to find out later"
        paragraphs={[
          "Buyers increasingly suspect that services firms are using new technology to move risk quietly onto the client rather than to lower the price. It is a reasonable suspicion and the way to answer it is to write the risk allocation down before the negotiation, not during it.",
          "There is a commercial cost to doing this. A buyer who wants pure time-and-materials staffing will read this page and go elsewhere, and that is the intended effect — we would rather lose that one here than in month three.",
        ]}
      />

      <V2Section id="models" eyebrow="The two models" heading="Fixed scope, or managed service" tone="subtle">
        <div className="grid gap-6 lg:grid-cols-2">
          {models.map((m) => (
            <div key={m.name} className="rounded-card border border-border-subtle bg-surface p-7">
              <h3 className="font-display text-h3 text-foreground">{m.name}</h3>
              <p className="mt-3 text-foreground-muted">{m.when}</p>

              <p className="mt-6 label-caps text-foreground-muted">What we carry</p>
              <ul className="mt-3 space-y-2">
                {m.weCarry.map((x) => (
                  <li key={x} className="text-foreground-muted">
                    — {x}
                  </li>
                ))}
              </ul>

              <p className="mt-6 label-caps text-foreground-muted">What you carry</p>
              <ul className="mt-3 space-y-2">
                {m.youCarry.map((x) => (
                  <li key={x} className="text-foreground-muted">
                    — {x}
                  </li>
                ))}
              </ul>

              <p className="mt-6 label-caps text-foreground-muted">What you supply</p>
              <ul className="mt-3 space-y-2">
                {m.youSupply.map((x) => (
                  <li key={x} className="text-foreground-muted">
                    — {x}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </V2Section>

      <V2Section
        id="principles"
        eyebrow="How we behave commercially"
        heading="Five things we will hold to"
        tone="canvas"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {principles.map((p) => (
            <div key={p.title} className="rounded-card border border-border-subtle bg-surface p-7">
              <h3 className="font-display text-h3 text-foreground">{p.title}</h3>
              <p className="mt-3 text-foreground-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </V2Section>

      <V2Section id="not" eyebrow="What is not here" heading="What we do not do" tone="subtle">
        <div className="max-w-measure space-y-5 text-foreground-muted">
          <p>
            <span className="text-foreground">We do not publish day rates.</span> A rate card on a public page is read
            by competitors long before it is read by a client, and a rate without a scope around it tells you nothing
            useful anyway.
          </p>
          <p>
            <span className="text-foreground">We do not sell outcome-linked or gain-share pricing from this page.</span>{" "}
            Both exist and both are negotiable in the right engagement, with the right measurement and the right
            relationship behind them. Neither is something to pick off a website, and a firm that advertises them
            cheaply is usually pricing the measurement dispute rather than the outcome.
          </p>
          <p>
            <span className="text-foreground">We do not resell hardware or hosting.</span> Infrastructure appears in our
            commercials as managed operations, never as a margin on somebody else&rsquo;s box.
          </p>
        </div>
      </V2Section>

      <V2Closing
        eyebrow="Want this against your actual scope?"
        heading="Then it is a conversation, not a form."
        body="Tell us what you are trying to do and we will tell you which model fits, what we would need from you, and where we think the risk sits. If the honest answer is that the scope is not clear enough to price, we will say that too."
      />
    </>
  );
}
