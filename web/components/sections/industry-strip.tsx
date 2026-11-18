import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { industries } from "@/content/industries";

/**
 * THE INDUSTRY STRIP — nine routes out of the homepage, one line deep.
 *
 * ── WHY IT EXISTS ────────────────────────────────────────────────────────────────────────────
 * The content audit of 18 November 2026 measured what a visitor actually sees in the first screen
 * of the homepage, and found that nothing on it names an industry. A mining CFO, a discom CIO and
 * a pharma QA head all read the same sentence about enterprise transformation and none of them
 * sees themselves in it.
 *
 * That costs more here than it would at a generalist firm. Our credibility is concentrated —
 * Navratna undertakings, state utilities, mining — and the nine industry pages are the best copy
 * on the site. Before this strip, the homepage pointed at none of them: a visitor had to find the
 * Industries item in the navigation, open a hub page, and choose from a grid.
 *
 * ── WHY IT IS A LINE OF TEXT AND NOT A CARD GRID ─────────────────────────────────────────────
 * A card grid for nine sectors is roughly a full screen of real estate, and it pushes the service
 * grid below the fold to deliver information that nine words would carry. McKinsey and Accenture
 * both run their industry lists as dense text rather than cards for the same reason: by the time
 * someone is scanning for their own sector, they are reading labels, not looking at pictures.
 *
 * So this is one band, about sixty pixels on desktop, that gives every visitor a one-click route
 * to the page written for them. The ninth link goes to the hub for anyone who does not see
 * themselves in the eight.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */
export function IndustryStrip() {
  return (
    <section
      aria-labelledby="industry-strip-heading"
      className="border-b border-border-subtle bg-surface-subtle py-7 md:py-9"
    >
      <Container>
        <Reveal className="flex flex-col gap-4 lg:flex-row lg:items-baseline lg:gap-10">
          <h2 id="industry-strip-heading" className="label-caps shrink-0 text-gold lg:pt-px">
            Find your sector
          </h2>
          <ul className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
            {industries.map((industry) => (
              <li key={industry.slug}>
                <Link
                  href={`/industries/${industry.slug}/`}
                  className="inline-flex min-h-11 items-center text-[0.95rem] font-semibold leading-snug text-foreground underline-offset-4 transition-colors hover:text-action hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  {industry.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/industries/"
                className="group inline-flex min-h-11 items-center gap-1.5 text-[0.95rem] font-semibold leading-snug text-action underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                All industries
                <ArrowRight
                  size={15}
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </li>
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
