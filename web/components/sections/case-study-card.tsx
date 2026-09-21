import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CaseStudy } from "@/content/case-studies";

/** A single case-study card — industry + SAP-path chips, client (or NDA label),
 *  featured solution, a clamped scenario and a context-aware link. */
export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const href = study.named ? `/case-studies/${study.slug}/` : "/contact/";
  const linkLabel = study.named ? "Read the case study" : "Request full story under NDA";
  const clientName = study.named ? study.client : "Confidential — under NDA";

  return (
    <article className="group glass-card flex h-full flex-col rounded-surface p-7">
      <div className="flex flex-wrap gap-2">
        <span className="glass-pill text-foreground-muted">{study.industry}</span>
        <span className="glass-gold rounded-full px-3 py-1 text-xs font-semibold">{study.sapPath}</span>
      </div>

      <h3 className="mt-4 text-h3 font-bold text-foreground transition-colors group-hover:text-action">{clientName}</h3>
      <p className="mt-1.5 text-sm font-semibold text-gold">{study.featuredSolution}</p>

      <p className="mt-3 line-clamp-2 flex-1 text-[0.9rem] leading-relaxed text-foreground-muted">{study.scenario}</p>

      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:text-action focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
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
