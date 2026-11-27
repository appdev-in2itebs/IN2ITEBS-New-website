import { qualifiedPackages } from "@/content/qpps";

/**
 * WHAT AN SAP-QUALIFIED PACKAGE ACTUALLY CONTAINS.
 *
 * ── WHY THIS COMPONENT EXISTS ────────────────────────────────────────────────────────────────
 * Until 18 November 2026 the scope of SimplifyTalent and SimplifyHiring was four flat images on
 * two /insights/ articles. Sixty-eight line items — every module, template and integration in two
 * fixed-price packages — with no text behind them. Google could not read it, a screen reader
 * could not read it, and a buyer could not find it by searching for the thing they wanted.
 *
 * It was also the most useful content on the site for somebody deciding whether to call us, which
 * is the part that makes it worth fixing beyond compliance. "What do I actually get" is the first
 * question, and the answer was in a picture.
 *
 * ── WHY IT IS A LIST AND NOT A GRID OF CARDS ─────────────────────────────────────────────────
 * Because it is a contents page, and the reading job is scanning for one item. The original
 * artwork arranged the same material as five or six coloured columns, which looks organised and
 * makes "is interview scheduling included?" genuinely hard to answer. Grouped lists under plain
 * headings answer that in about two seconds, and they reflow on a phone instead of needing a
 * horizontal scroll.
 *
 * Renders nothing for a package with no itemised scope. Three of the five are in that state and
 * the honest fix is to get the scope signed off, not to invent one here.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */
export function PackageScope({ packageName, heading }: { packageName: string; heading?: string }) {
  const pkg = qualifiedPackages.find((p) => p.short === packageName || p.name === packageName);
  if (!pkg?.scope?.length) return null;
  const total = pkg.scope.reduce((n, g) => n + g.items.length, 0);

  return (
    <section aria-labelledby={`scope-${pkg.short}`} className="not-prose">
      <h2 id={`scope-${pkg.short}`} className="heading-plain text-h3 font-semibold text-foreground">
        {heading ?? `What ${pkg.short} contains`}
      </h2>
      <p className="mt-3 max-w-measure text-base text-foreground-muted">
        {total} items across {pkg.scope.length} groups, as the package is sold. Anything outside this list is a priced
        change request with its own date, agreed before work starts.
      </p>

      <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {pkg.scope.map((group) => (
          <div key={group.group} className="border-t border-gold-soft/60 pt-5">
            <h3 className="label-caps text-action">{group.group}</h3>
            <ul className="mt-4 space-y-2.5">
              {group.items.map((item) => (
                <li key={item} className="flex gap-3 text-base leading-relaxed text-foreground-muted">
                  <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
