import { AdvisoryDiagram } from "@/components/sections/advisory-diagrams";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { heroPicture } from "@/components/sections/hero-override";
import { HeroFigure } from "@/components/sections/hero-figure";
import { V2Hero, V2StickyNav, V2Section, V2Closing } from "@/components/sections/v2";
import { Container } from "@/components/ui/container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { site } from "@/content/site";
import { ADVISORY_FIGURES_CONFIRMED, advisoryHub, type AdvisoryPage, type Outcome } from "@/content/advisory";
import { cn } from "@/lib/utils";

/**
 * The Advisory hub and its four service pages (owner's production brief, 27 Nov 2026). Built from
 * the same parts as every other service page (components/sections/v2.tsx) so the pages read as one
 * site, plus the blocks the brief's template asks for: an at-a-glance box, the problem, a diagram
 * with captions, numbered services, an outputs table, a case study with a side panel and outcome
 * tiles, related pages and the call to action.
 */

const ADVISOR_CTA = { label: "Talk to an advisor", href: "#talk" };
const MAILTO = `mailto:${site.primaryEmail}`;

/** Production leaves out outcomes the brief marks "Confirm"; preview shows them, tagged. */
const PRODUCTION = process.env.SITE_ENV === "production";
function visibleOutcomes(outcomes: Outcome[]) {
  if (ADVISORY_FIGURES_CONFIRMED) return outcomes.map((o) => ({ ...o, confirm: false }));
  return PRODUCTION ? outcomes.filter((o) => !o.confirm) : outcomes;
}

function Glance({ rows, className }: { rows: { label: string; text: string }[]; className?: string }) {
  return (
    <dl
      className={cn(
        "grid gap-px overflow-hidden rounded-feature border border-border-subtle bg-border-subtle sm:grid-cols-2",
        rows.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4",
        className,
      )}
    >
      {rows.map((row) => (
        <div key={row.label} className="bg-surface p-6">
          <dt className="label-caps text-gold">{row.label}</dt>
          <dd className="mt-3 text-[0.95rem] leading-relaxed text-foreground">{row.text}</dd>
        </div>
      ))}
    </dl>
  );
}

function GlanceBand({ rows }: { rows: { label: string; text: string }[] }) {
  return (
    <section id="overview" className="scroll-mt-28 bg-canvas pb-6">
      <Container>
        <Reveal>
          <p className="label-caps mb-4 text-foreground-muted">At a glance</p>
          <Glance rows={rows} />
        </Reveal>
      </Container>
    </section>
  );
}

function DiagramFigure({ diagram }: { diagram: AdvisoryPage["diagram"] }) {
  return (
    <section className="bg-surface-subtle py-16 md:py-24">
      <Container>
        <Reveal className="max-w-[70ch]">
          <span className="label-caps text-gold">Diagram</span>
          <h2 className="mt-5 text-h2 font-bold">{diagram.title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-foreground-muted">{diagram.intro}</p>
        </Reveal>
        <div className="mt-10">
          <figure>
            {/* The brief: on phones the diagram scrolls sideways at a minimum of 760px, so its
                captions and labels stay readable rather than shrinking. The two-panel systems
                diagram stacks instead. */}
            <div className="overflow-x-auto rounded-feature border border-border-subtle bg-surface p-5 md:p-10">
              <div className={diagram.visual === "eight-systems" ? undefined : "min-w-[760px]"}>
                <AdvisoryDiagram visual={diagram.visual} alt={diagram.alt} />
              </div>
            </div>
            {diagram.visual === "eight-systems" ? null : (
              <p className="mt-3 text-xs text-foreground-muted md:hidden">Scroll the diagram sideways to read it.</p>
            )}
            <figcaption className="mt-5 flex flex-col gap-2 text-sm md:flex-row md:items-start md:justify-between md:gap-10">
              <span className="text-foreground-muted">{diagram.captionLeft}</span>
              <span className="font-semibold text-foreground md:text-right">{diagram.captionRight}</span>
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}

function NumberedCards({ items, columns = 2 }: { items: { title: string; body: string }[]; columns?: 2 | 3 }) {
  return (
    <Stagger className={cn("grid gap-5 md:grid-cols-2", columns === 3 && "lg:grid-cols-3")}>
      {items.map((item, i) => (
        <StaggerItem key={item.title} className="h-full">
          <article className="flex h-full flex-col rounded-feature border border-border-subtle bg-surface p-7">
            <span className="font-display text-sm font-semibold text-gold">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-3 font-display text-h3 font-semibold leading-snug text-foreground">{item.title}</h3>
            <p className="mt-3 leading-relaxed text-foreground-muted">{item.body}</p>
          </article>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

function OutputsTable({ receive }: { receive: NonNullable<AdvisoryPage["receive"]> }) {
  return (
    <>
      {receive.intro ? (
        <Reveal>
          <p className="max-w-measure text-lg leading-relaxed text-foreground-muted">{receive.intro}</p>
        </Reveal>
      ) : null}
      <Reveal className={receive.intro ? "mt-8" : undefined}>
        {receive.specimen ? (
          <p className="mb-3 inline-flex rounded-full border border-dashed border-gold/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-gold">
            Specimen · illustrative entries
          </p>
        ) : null}
        <div className="overflow-x-auto rounded-feature border border-border-subtle bg-surface">
          <table
            className={cn("w-full border-collapse text-left text-sm", receive.columns.length > 3 && "min-w-[860px]")}
          >
            <thead>
              <tr className="bg-surface-subtle">
                {receive.columns.map((col) => (
                  <th key={col} scope="col" className="px-5 py-4 font-semibold text-foreground">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {receive.rows.map((row) => (
                <tr key={row[0]} className="border-t border-border-subtle align-top">
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      className={cn(
                        "px-5 py-4 leading-relaxed",
                        i === 0 ? "font-semibold text-foreground" : "text-foreground-muted",
                      )}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </>
  );
}

function Steps({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <Stagger className="grid gap-px overflow-hidden rounded-feature border border-border-subtle bg-border-subtle md:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <StaggerItem key={step.title} className="h-full">
          <div className="h-full bg-surface p-7">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand font-display text-sm font-semibold text-on-brand">
              {i + 1}
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{step.title}</h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-foreground-muted">{step.body}</p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

function CaseStudy({ study }: { study: AdvisoryPage["caseStudy"] }) {
  const outcomes = visibleOutcomes(study.outcomes);
  return (
    <section id="case" className="scroll-mt-28 bg-canvas py-20 md:py-28">
      <Container>
        <Reveal>
          <span className="label-caps text-gold">Case study</span>
          <h2 className="mt-5 max-w-[30ch] text-h2 font-bold">{study.heading}</h2>
        </Reveal>
        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-8">
            <Reveal>
              <h3 className="font-display text-h3 font-semibold text-foreground">The situation</h3>
              <div className="mt-4 space-y-4 text-lg leading-relaxed text-foreground-muted">
                {study.situation.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </Reveal>
            <Reveal>
              <h3 className="font-display text-h3 font-semibold text-foreground">What we did</h3>
              <ol className="mt-5 space-y-5">
                {study.whatWeDid.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/50 font-display text-sm font-semibold text-gold">
                      {i + 1}
                    </span>
                    <p className="leading-relaxed text-foreground-muted">
                      <span className="font-semibold text-foreground">{step.title}.</span> {step.body}
                    </p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-4" delay={0.1}>
            <aside className="rounded-feature border border-border-subtle bg-surface-subtle p-7 lg:sticky lg:top-32">
              <p className="label-caps text-gold">Case at a glance</p>
              <dl className="mt-5 space-y-5">
                {study.glance.map((row) => (
                  <div key={row.label}>
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground-muted">
                      {row.label}
                    </dt>
                    <dd className="mt-1 leading-relaxed text-foreground">{row.text}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </Reveal>
        </div>
        <Reveal className="mt-14">
          <h3 className="font-display text-h3 font-semibold text-foreground">What changed</h3>
        </Reveal>
        <Stagger className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((o) => (
            <StaggerItem key={o.figure} className="h-full">
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-feature border bg-surface p-6",
                  o.confirm ? "border-dashed border-gold/60" : "border-border-subtle",
                )}
              >
                {o.confirm ? (
                  <span className="absolute right-4 top-4 rounded-full bg-gold/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-gold">
                    To confirm
                  </span>
                ) : null}
                <p className="pr-16 font-display text-xl font-semibold leading-snug text-foreground">{o.figure}</p>
                <p className="mt-3 text-sm leading-relaxed text-foreground-muted">{o.detail}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-14">
          <blockquote className="border-l-2 border-gold pl-6 font-display text-[clamp(1.35rem,2.4vw,2rem)] italic leading-snug text-foreground">
            {study.quote}
          </blockquote>
        </Reveal>
      </Container>
    </section>
  );
}

function Related({ items }: { items: AdvisoryPage["related"] }) {
  return (
    <V2Section id="related" eyebrow="Related" heading="Where this connects" tone="subtle">
      <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <StaggerItem key={item.href} className="h-full">
            <Link
              href={item.href}
              className="group flex h-full flex-col rounded-feature border border-border-subtle bg-surface p-6 transition-colors hover:border-action"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground-muted">
                {item.group}
              </span>
              <span className="mt-2 font-display text-lg font-semibold leading-snug text-foreground group-hover:text-action">
                {item.label}
              </span>
              <span className="mt-2 flex-1 text-sm leading-relaxed text-foreground-muted">{item.body}</span>
              <ArrowRight
                aria-hidden
                size={18}
                className="mt-4 text-action transition-transform group-hover:translate-x-1"
              />
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </V2Section>
  );
}

/** One of the four Advisory service pages. */
export function AdvisoryServicePage({ page }: { page: AdvisoryPage }) {
  const route = `/services/advisory/${page.slug}/`;
  const anchors = [
    { id: "overview", label: "At a glance" },
    { id: "problem", label: page.problem.eyebrow === "Why now" ? "Why now" : "The problem" },
    { id: "services", label: "What we do" },
    ...(page.receive ? [{ id: "receive", label: "What you receive" }] : []),
    { id: "case", label: "Case study" },
    { id: "related", label: "Related" },
    { id: "talk", label: "Talk to us" },
  ];
  return (
    <>
      <V2Hero
        route={route}
        path={[
          { label: "Services", href: "/services/" },
          { label: "Advisory", href: "/services/advisory/" },
          { label: page.name },
        ]}
        title={page.h1}
        lead={page.standfirst}
        ctaLabel={ADVISOR_CTA.label}
        ctaHref={ADVISOR_CTA.href}
        media={heroPicture(page.heroImage, <HeroFigure figureKey={`services/advisory-${page.slug}`} />, page.name)}
      />
      <V2StickyNav anchors={anchors} />
      <GlanceBand rows={page.glance} />

      <V2Section id="problem" eyebrow={page.problem.eyebrow} heading={page.problem.heading}>
        {page.problem.intro ? (
          <Reveal>
            <p className="max-w-measure text-lg leading-relaxed text-foreground-muted">{page.problem.intro}</p>
          </Reveal>
        ) : null}
        {page.problem.items.length ? (
          <Stagger className="mt-10 grid gap-5 md:grid-cols-2">
            {page.problem.items.map((item) => (
              <StaggerItem key={item.title} className="h-full">
                <article className="h-full rounded-feature border-l-2 border-gold bg-surface-subtle p-7">
                  <h3 className="font-display text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-foreground-muted">{item.body}</p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        ) : null}
        {page.jurisdictions ? (
          <Reveal className="mt-10">
            <div className="grid gap-px overflow-hidden rounded-feature border border-border-subtle bg-border-subtle sm:grid-cols-3 lg:grid-cols-5">
              {page.jurisdictions.rows.map((row) => (
                <div key={row.market} className="bg-surface p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground-muted">
                    {row.market}
                  </p>
                  <p className="mt-2 font-display text-lg font-semibold text-foreground">{row.law}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-foreground-muted">{page.jurisdictions.note}</p>
          </Reveal>
        ) : null}
      </V2Section>

      <DiagramFigure diagram={page.diagram} />

      <V2Section id="services" eyebrow="What we do" heading={page.services.heading}>
        <NumberedCards items={page.services.items} columns={page.services.items.length > 4 ? 3 : 2} />
      </V2Section>

      {page.receive ? (
        <V2Section id="receive" eyebrow="What you receive" heading={page.receive.heading} tone="subtle">
          <OutputsTable receive={page.receive} />
        </V2Section>
      ) : null}

      {page.howItRuns ? (
        <V2Section eyebrow="How it runs" heading={page.howItRuns.heading} tone="canvas">
          <Steps steps={page.howItRuns.steps} />
        </V2Section>
      ) : null}

      <CaseStudy study={page.caseStudy} />
      <Related items={page.related} />
      <V2Closing
        eyebrow="Advisory"
        heading={page.cta.heading}
        body={page.cta.body}
        ctaLabel="Talk to an advisor"
        ctaHref={MAILTO}
      />
    </>
  );
}

/** "Where each one starts": the four services across the life of a programme, each bar a link. */
function Lifecycle() {
  const { lifecycle } = advisoryHub;
  return (
    <section className="bg-surface-subtle py-16 md:py-24">
      <Container>
        <Reveal className="max-w-[70ch]">
          <span className="label-caps text-gold">Where each one starts</span>
          <h2 className="mt-5 text-h2 font-bold">{lifecycle.heading}</h2>
          <p className="mt-5 text-lg leading-relaxed text-foreground-muted">{lifecycle.intro}</p>
        </Reveal>
        <Reveal className="mt-10">
          <figure>
            <div className="overflow-x-auto rounded-feature border border-border-subtle bg-surface p-4 md:p-8">
              <div role="img" aria-label={lifecycle.alt} className="min-w-[760px]">
                <div className="grid grid-cols-[7rem_repeat(4,1fr)] pb-3">
                  <span />
                  {lifecycle.phases.map((phase) => (
                    <span
                      key={phase}
                      className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-gold"
                    >
                      {phase}
                    </span>
                  ))}
                </div>
                <div className="relative">
                  {/* phase dividers */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-[7rem] right-0 grid grid-cols-4"
                  >
                    {lifecycle.phases.map((p) => (
                      <span key={p} className="border-l border-border-subtle" />
                    ))}
                  </div>
                  <div className="space-y-3">
                    {lifecycle.rows.map((row) => (
                      <div key={row.slug} className="grid grid-cols-[7rem_repeat(4,1fr)] items-center">
                        <span className="text-sm text-foreground-muted">{row.lane}</span>
                        <Link
                          href={`/services/advisory/${row.slug}/`}
                          style={{ gridColumn: `${row.from + 2} / ${row.to + 2}` }}
                          className={cn(
                            "relative z-10 mx-1 flex min-h-11 items-center gap-2 rounded-md px-4 text-sm font-semibold transition-transform hover:-translate-y-0.5",
                            row.strong ? "bg-brand text-on-brand" : "bg-gold/35 text-foreground",
                          )}
                        >
                          {row.label} <ArrowRight aria-hidden size={15} />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <figcaption className="mt-4 text-sm text-foreground-muted">
              {lifecycle.caption}
              <span className="md:hidden"> Swipe sideways to see the whole chart.</span>
            </figcaption>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}

/** The Advisory hub at /services/advisory/. */
export function AdvisoryHubPage({ heroImage }: { heroImage?: string }) {
  const hub = advisoryHub;
  return (
    <>
      <V2Hero
        route="/services/advisory/"
        path={[{ label: "Services", href: "/services/" }, { label: "Advisory" }]}
        title={hub.h1}
        lead={hub.standfirst}
        ctaLabel={ADVISOR_CTA.label}
        ctaHref={ADVISOR_CTA.href}
        media={heroPicture(heroImage, <HeroFigure figureKey="services/advisory" />, "Advisory")}
      />
      <V2StickyNav
        anchors={[
          { id: "overview", label: "At a glance" },
          { id: "services", label: "Services" },
          { id: "rules", label: "How we advise" },
          { id: "talk", label: "Talk to us" },
        ]}
      />
      <GlanceBand rows={hub.glance} />
      <V2Section id="services" eyebrow="Services" heading={hub.services.heading}>
        <Reveal>
          <p className="max-w-measure text-lg leading-relaxed text-foreground-muted">{hub.services.intro}</p>
        </Reveal>
        <Stagger className="mt-10 grid gap-5 md:grid-cols-2">
          {hub.services.items.map((item, i) => (
            <StaggerItem key={item.href} className="h-full">
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-feature border border-border-subtle bg-surface p-7 transition-colors hover:border-action"
              >
                <span className="font-display text-sm font-semibold text-gold">{String(i + 1).padStart(2, "0")}</span>
                <span className="mt-3 font-display text-h3 font-semibold leading-snug text-foreground group-hover:text-action">
                  {item.title}
                </span>
                <span className="mt-3 leading-relaxed text-foreground-muted">{item.body}</span>
                <span className="mt-5 border-t border-border-subtle pt-4 text-sm text-foreground-muted">
                  <span className="font-semibold text-foreground">Case study:</span> {item.caseStudy}
                </span>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-action">
                  Open the service{" "}
                  <ArrowRight aria-hidden size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </V2Section>
      <Lifecycle />
      <section
        id="rules"
        className="theme-on-brand relative isolate scroll-mt-28 overflow-hidden bg-brand py-20 text-on-brand md:py-28"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 hero-ambient opacity-70" />
        <Container className="relative">
          <Reveal>
            <span className="label-caps text-gold-on-brand">How we advise</span>
            <h2 className="heading-plain mt-6 font-display text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.05] tracking-[-0.035em]">
              {hub.rules.heading}
            </h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-px overflow-hidden rounded-feature bg-on-brand/15 md:grid-cols-3">
            {hub.rules.items.map((rule, i) => (
              <StaggerItem key={rule.title} className="h-full">
                <div className="flex h-full flex-col bg-brand p-8 md:p-10">
                  <span aria-hidden className="font-display text-sm font-semibold text-gold-on-brand">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 font-display text-[clamp(1.3rem,2vw,1.7rem)] font-semibold leading-[1.2] text-on-brand">
                    {rule.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-on-brand/75">{rule.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>
      <V2Closing
        eyebrow="Advisory"
        heading={hub.cta.heading}
        body={hub.cta.body}
        ctaLabel="Talk to an advisor"
        ctaHref={MAILTO}
      />
    </>
  );
}
