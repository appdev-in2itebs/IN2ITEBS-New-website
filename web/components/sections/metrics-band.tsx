import { Container } from "@/components/ui/container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { ATTRIBUTION_LABELS, type Metric } from "@/content/evidence";

/**
 * OUTCOME FIGURES, WITH THE THING THEY ARE FIGURES OF.
 *
 * ── THE DESIGN DECISION, WHICH IS THE WHOLE POINT ────────────────────────────────────────────
 * The convention in this market is a band of enormous numbers with four words under each one:
 * "40%" over "faster resolution". That layout is optimised for a reader who is not going to ask
 * the next question. The buyer who decides is the one who asks it, and for them the big-number
 * band reads as decoration — or worse, as something being hidden behind the type size.
 *
 * So the figure here is large but not vast, and the line immediately under it is **what the
 * figure is a number of**, at full reading size rather than as a caption. The window and who
 * measured it sit below a hairline. The effect is a number that answers its own follow-up
 * question before the reader has to ask it, which is the only way a vendor figure survives being
 * taken into a procurement meeting.
 *
 * ── WHY THE ATTRIBUTION IS ALWAYS SHOWN, EVEN WHEN IT IS "OUR ESTIMATE" ──────────────────────
 * Especially then. A range labelled as our own estimate, next to a measurement labelled as a
 * measurement, tells the reader we know the difference — which is a stronger signal than two
 * numbers presented as though they were the same kind of thing. The weakest-looking label on the
 * band is doing the most work.
 *
 * Renders nothing when a study has no metrics, and that is a normal state: several of the best
 * studies on this site publish no percentage at all. See the note on `metrics` in
 * content/case-studies.ts.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */
export function MetricsBand({
  metrics,
  eyebrow = "The numbers, and where they came from",
  heading = "Two figures, both sourced.",
}: {
  metrics?: Metric[];
  eyebrow?: string;
  heading?: string;
}) {
  if (!metrics?.length) return null;
  return (
    <section aria-labelledby="metrics-heading" className="bg-surface-subtle py-16 md:py-24">
      <Container>
        <Reveal className="max-w-measure">
          <span className="label-caps text-gold">{eyebrow}</span>
          <h2 id="metrics-heading" className="mt-4 font-display text-h2 font-bold text-foreground">
            {heading}
          </h2>
        </Reveal>

        <Stagger className="mt-10 grid gap-6 md:grid-cols-2">
          {metrics.map((m) => (
            <StaggerItem key={`${m.value}-${m.of}`} className="h-full">
              <figure className="flex h-full flex-col rounded-feature border border-border-subtle bg-surface p-7 md:p-8">
                <span className="font-display text-[clamp(2.25rem,4vw,3rem)] font-bold leading-none tracking-[-0.04em] text-foreground">
                  {m.value}
                </span>
                {/* Reading size, not caption size: this sentence is what makes the number mean anything. */}
                <figcaption className="mt-5 max-w-[46ch] leading-relaxed text-foreground">{m.of}</figcaption>
                <dl className="mt-6 space-y-3 border-t border-gold-soft/60 pt-5 text-sm">
                  <div>
                    <dt className="label-caps text-foreground-muted">Measured over</dt>
                    <dd className="mt-1 leading-relaxed text-foreground-muted">{m.window}</dd>
                  </div>
                  <div>
                    <dt className="label-caps text-foreground-muted">Who measured it</dt>
                    <dd className="mt-1 leading-relaxed text-foreground-muted">
                      <span className="font-semibold text-foreground">{ATTRIBUTION_LABELS[m.attribution].label}</span>
                      {" — "}
                      {ATTRIBUTION_LABELS[m.attribution].meaning}
                    </dd>
                  </div>
                  {m.excludes ? (
                    <div>
                      <dt className="label-caps text-foreground-muted">Not counted</dt>
                      <dd className="mt-1 leading-relaxed text-foreground-muted">{m.excludes}</dd>
                    </div>
                  ) : null}
                </dl>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-8 max-w-measure">
          <p className="text-sm leading-relaxed text-foreground-muted">
            Every figure we publish carries what it is a number of, the period it covers and who did the arithmetic. A
            number we cannot source that way does not appear as a figure, which is why some of our case studies have
            none.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
