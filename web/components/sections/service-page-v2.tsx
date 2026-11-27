import { heroPicture } from "@/components/sections/hero-override";
import { serviceIcon } from "@/components/sections/service-icon";
import { HeroFigure } from "@/components/sections/hero-figure";
import { DiagramBand } from "@/components/sections/diagram-band";
import { Explainer, isExplainer } from "@/components/explainers/explainer";
import { RiseGrowChooser } from "@/components/interactive/rise-grow-chooser";
import { SapToolchain } from "@/components/sections/sap-toolchain";
import { EstateReviewDiagnostic } from "@/components/interactive/estate-review-diagnostic";
import { EccMaintenanceChecker } from "@/components/interactive/ecc-maintenance-checker";
import { ToolsBand } from "@/components/sections/tools-band";
import { PackageScope } from "@/components/sections/package-scope";
import { V2Blueprint } from "@/components/sections/v2-ledger";
import {
  V2Hero,
  V2StickyNav,
  V2Overview,
  V2PositionSlab,
  V2Section,
  V2Bento,
  V2Rail,
  V2Closing,
  type BentoItem,
} from "@/components/sections/v2";
import { getServiceGroup, flattenItems, type ServicePage } from "@/content/legacy-services";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { packagesFor, SAP_PROFILE_URL } from "@/content/qpps";

/** Every service page the existing site's menu lists, in the approved design (components/sections/v2.tsx). */
export function ServicePageV2({ page }: { page: ServicePage & { heroImage?: string } }) {
  const group = getServiceGroup(page.group);
  const title = page.title ?? page.name;
  const [lead, ...rest] = page.intro;
  const siblings = group ? flattenItems(group.items).filter((item) => item.href !== `/services/${page.slug}/`) : [];
  const groupIsThisPage = group?.href === `/services/${page.slug}/`;
  const anchors = [
    { id: "overview", label: "Overview" },
    ...(page.sections.length ? [{ id: "covers", label: page.sectionsHeading ? "Details" : "What it covers" }] : []),
    ...(page.extraSections
      ? [{ id: "detail", label: page.extraSections.anchorLabel ?? page.extraSections.heading }]
      : []),
    ...(page.qualifiedPackages ? [{ id: "qualified", label: "Qualified by SAP" }] : []),
    ...(siblings.length ? [{ id: "related", label: `More in ${group?.name ?? "Services"}` }] : []),
    { id: "talk", label: "Talk to us" },
  ];
  /**
   * The page's position, promoted out of the closing block and up to block three.
   *
   * `closing[0]` is, on almost every page, the sentence the writer was actually trying to land —
   * and it was sitting below a card grid at the bottom of the page. It now renders as a navy slab
   * immediately after the overview, and the remaining closing paragraphs keep their old place, so
   * nothing is printed twice and nothing is lost.
   */
  const [position, ...closingRest] = page.closing ?? [];
  const items: BentoItem[] = page.sections.map((section) => ({
    title: section.title,
    body: section.body,
    bullets: section.bullets,
    iconImage: section.iconImage,
    icon: section.iconImage ? undefined : serviceIcon(section.icon),
    href: section.href,
  }));

  return (
    <>
      {/*
        The hero is a generated figure, not a photograph. `heroPicture` still runs first, so a
        picture uploaded deliberately in /admin wins — a person choosing an image for a reason is
        a different thing from a stock library choosing one for us. See hero-figure.tsx for why
        there are no photographs left on this site.
      */}
      <V2Hero
        route={`/services/${page.slug}/`}
        path={[
          { label: "Services", href: "/services/" },
          ...(group && !groupIsThisPage ? [{ label: group.name, href: group.href }] : []),
          { label: page.name },
        ]}
        title={title}
        lead={lead}
        media={heroPicture(page.heroImage, <HeroFigure figureKey={`services/${page.slug}`} />, title)}
      />
      <V2StickyNav anchors={anchors} />
      <V2Overview
        eyebrow={group?.name ?? "Overview"}
        heading={page.introHeading ?? `About ${page.name}`}
        paragraphs={rest.length ? rest : [lead]}
        link={group && !groupIsThisPage ? { label: `${group.name} overview`, href: group.href } : undefined}
      />
      <V2PositionSlab>{position}</V2PositionSlab>
      {page.diagram ? (
        isExplainer(page.diagram) ? (
          <Explainer spec={page.diagram} tone="subtle" />
        ) : (
          <DiagramBand src={page.diagram.src} alt={page.diagram.alt} caption={page.diagram.caption} tone="subtle" />
        )
      ) : null}
      {page.sections.length ? (
        <V2Section
          id="covers"
          eyebrow={group?.name ?? "Services"}
          heading={page.sectionsHeading ?? `What ${page.name} covers.`}
        >
          {page.layout === "blueprint" ? (
            <V2Blueprint steps={page.sections.map((s) => ({ title: s.title, body: s.body, bullets: s.bullets }))} />
          ) : (
            <V2Bento items={items} />
          )}
          {closingRest.length ? (
            <Reveal className="mt-12 space-y-5">
              {closingRest.map((paragraph) => (
                <p
                  key={paragraph}
                  className="max-w-[70ch] text-lg font-medium leading-relaxed text-foreground md:text-xl"
                >
                  {paragraph}
                </p>
              ))}
            </Reveal>
          ) : null}
        </V2Section>
      ) : closingRest.length ? (
        <section className="bg-surface-subtle py-16">
          <Container className="space-y-5">
            {closingRest.map((paragraph) => (
              <p
                key={paragraph}
                className="max-w-[70ch] text-lg font-medium leading-relaxed text-foreground md:text-xl"
              >
                {paragraph}
              </p>
            ))}
          </Container>
        </section>
      ) : null}
      {page.extraSections ? (
        <>
          {page.extraSections.diagram ? (
            isExplainer(page.extraSections.diagram) ? (
              <Explainer spec={page.extraSections.diagram} tone="canvas" />
            ) : (
              <DiagramBand
                src={page.extraSections.diagram.src}
                alt={page.extraSections.diagram.alt}
                caption={page.extraSections.diagram.caption}
                tone="canvas"
              />
            )
          ) : null}
          <V2Section
            id="detail"
            eyebrow={page.extraSections.eyebrow ?? "In detail"}
            heading={page.extraSections.heading}
            tone="subtle"
          >
            {page.extraSections.intro ? (
              <Reveal>
                <p className="max-w-measure text-lg leading-relaxed text-foreground-muted">
                  {page.extraSections.intro}
                </p>
              </Reveal>
            ) : null}
            <div className={page.extraSections.intro ? "mt-10" : undefined}>
              <V2Bento
                items={page.extraSections.items.map((section) => ({
                  title: section.title,
                  body: section.body,
                  bullets: section.bullets,
                  iconImage: section.iconImage,
                  icon: section.iconImage ? undefined : serviceIcon(section.icon),
                  href: section.href,
                }))}
              />
            </div>
            {page.extraSections.closing?.length ? (
              <Reveal className="mt-12 space-y-5">
                {page.extraSections.closing.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="max-w-measure text-lg font-medium leading-relaxed text-foreground md:text-xl"
                  >
                    {paragraph}
                  </p>
                ))}
              </Reveal>
            ) : null}
          </V2Section>
          {page.extraSections.closingDiagram ? (
            isExplainer(page.extraSections.closingDiagram) ? (
              <Explainer spec={page.extraSections.closingDiagram} tone="canvas" />
            ) : (
              <DiagramBand
                src={page.extraSections.closingDiagram.src}
                alt={page.extraSections.closingDiagram.alt}
                caption={page.extraSections.closingDiagram.caption}
                tone="canvas"
              />
            )
          ) : null}
        </>
      ) : null}
      {page.accelerators ? (
        isExplainer(page.accelerators) ? (
          <Explainer spec={page.accelerators} tone="canvas" />
        ) : (
          <DiagramBand src={page.accelerators.src} alt={page.accelerators.alt} caption={page.accelerators.caption} />
        )
      ) : null}
      {/* The interactive blocks carried over from the existing site. The RISE/GROW chooser is the
          only thing on this site that answers a buyer's question before they talk to us, which is
          why it survived the restructure rather than being retired with the page it sat on. */}
      {page.interactive === "rise-grow-chooser" ? (
        <section className="bg-surface-subtle py-16 md:py-24">
          <Container>
            <RiseGrowChooser />
          </Container>
        </section>
      ) : page.interactive === "sap-toolchain" ? (
        <section className="bg-surface-subtle py-16 md:py-24">
          <SapToolchain />
        </section>
      ) : page.interactive === "estate-review-diagnostic" ? (
        <section id="diagnostic" className="bg-surface-subtle py-16 md:py-24">
          <Container>
            <EstateReviewDiagnostic />
          </Container>
        </section>
      ) : page.interactive === "ecc-maintenance-checker" ? (
        <section id="checker" className="bg-surface-subtle py-16 md:py-24">
          <Container>
            <EccMaintenanceChecker />
          </Container>
        </section>
      ) : null}
      {page.qualifiedPackages ? (
        <V2Section
          id="qualified"
          eyebrow="Qualified by SAP"
          heading="Packages SAP has reviewed and listed."
          tone="canvas"
        >
          <Reveal className="max-w-measure">
            <p className="text-lg leading-relaxed text-foreground-muted">
              A qualified partner-packaged solution is not a name we chose for ourselves. SAP reviews the package and
              then lists it on our partner profile, in SAP&rsquo;s own words. These are the ones registered against this
              practice, and you can check every one of them on sap.com without asking us for anything.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packagesFor(page.qualifiedPackages).map((pkg) => (
              <article
                key={pkg.name}
                className="flex h-full flex-col rounded-feature border border-border-subtle bg-surface p-7"
              >
                <span className="label-caps text-gold">SAP qualified</span>
                <h3 className="mt-3 font-display text-h3 font-semibold leading-snug text-foreground">{pkg.short}</h3>
                <p className="mt-1 text-sm text-foreground-muted">{pkg.name}</p>
                <p className="mt-4 text-sm font-semibold text-action">{pkg.forWhom}</p>
                <p className="mt-3 text-foreground-muted">{pkg.sapSummary}</p>
                <p className="mt-4 border-t border-border-subtle pt-4 text-sm leading-relaxed text-foreground-muted">
                  {pkg.ours}
                </p>
                {pkg.live ? <p className="mt-auto pt-5 text-sm font-semibold text-foreground">{pkg.live}</p> : null}
              </article>
            ))}
          </div>
          {/*
            The itemised contents, for the packages where we hold a signed-off scope. This is the
            content that used to live only inside a JPEG on an /insights/ article — sixty-eight
            line items that search engines and screen readers could not read. See
            components/sections/package-scope.tsx.
          */}
          {packagesFor(page.qualifiedPackages).some((pkg) => pkg.scope?.length) ? (
            <div className="mt-16 space-y-16">
              {packagesFor(page.qualifiedPackages)
                .filter((pkg) => pkg.scope?.length)
                .map((pkg) => (
                  <PackageScope key={pkg.short} packageName={pkg.short} />
                ))}
            </div>
          ) : null}

          <Reveal className="mt-10 max-w-measure">
            <p className="text-sm text-foreground-muted">
              The wording above in each card&rsquo;s middle paragraph is SAP&rsquo;s, trimmed for length and not for
              meaning. The last paragraph is ours.{" "}
              <a
                href={SAP_PROFILE_URL}
                className="inline-block min-h-6 font-semibold text-action underline-offset-4 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Our SAP partner profile
              </a>{" "}
              carries the full list and the delivery record behind it.
            </p>
          </Reveal>
        </V2Section>
      ) : null}
      {page.toolsBand ? <ToolsBand currentPath={`/services/${page.slug}/`} /> : null}
      {siblings.length ? (
        <V2Rail
          eyebrow={`More in ${group?.name}`}
          heading="Also in this group."
          items={[
            ...(group && !groupIsThisPage ? [{ label: `${group.name} overview`, href: group.href }] : []),
            ...siblings.map((item) => ({ label: item.label, href: item.href })),
          ]}
        />
      ) : null}
      <V2Closing
        body={`Tell us where ${page.name} fits in your landscape and what needs to change. We will map the first move in a single conversation.`}
      />
    </>
  );
}
