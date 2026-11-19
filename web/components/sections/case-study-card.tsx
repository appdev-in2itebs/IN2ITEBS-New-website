import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CaseStudy } from "@/content/case-studies";

/**
 * A single case-study card — industry and SAP-path chips, the client or the sector that stands in
 * for them, the featured solution, a clamped scenario and a link.
 *
 * Every study now has a page, including the ones where the client is not named: `client` already
 * carries the sector description in that case ("A state-owned mining undertaking, eastern India"),
 * so the work is readable without the name. The card says plainly that the client is withheld
 * rather than implying there is nothing to read.
 */
export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const href = `/case-studies/${study.slug}/`;
  const linkLabel = "Read the case study";
  const clientName = study.client;

  return (
    <article className="group glass-card flex h-full flex-col rounded-surface p-7">
      <div className="flex flex-wrap gap-2">
        <span className="glass-pill text-foreground-muted">{study.industry}</span>
        <span className="glass-gold rounded-full px-3 py-1 text-xs font-semibold">{study.sapPath}</span>
        {study.named ? null : <span className="glass-pill text-foreground-muted">Client not named</span>}
      </div>

      <h3 className="mt-4 text-h3 font-bold text-foreground transition-colors group-hover:text-action">{clientName}</h3>
      <p className="mt-1.5 text-sm font-semibold text-gold">{study.featuredSolution}</p>

      <p className="mt-3 line-clamp-2 flex-1 text-[0.9rem] leading-relaxed text-foreground-muted">{study.scenario}</p>

      <Link
        href={href}
        className="mt-5 inline-flex min-h-6 items-center gap-1.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:text-action focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        {linkLabel}
        <ArrowRight
          size={15}
          strokeWidth={1.75}
          className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
        />
      </Link>
    </article>
  );
}
