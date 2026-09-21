"use client";

import { useMemo, useState } from "react";
import type { CaseStudy, SapPath } from "@/content/case-studies";
import { CaseStudyCard } from "@/components/sections/case-study-card";
import { cn } from "@/lib/utils";

const ALL = "All" as const;
const SAP_PATHS: SapPath[] = ["RISE", "GROW", "ECC", "AMS"];

/** Filterable case-study grid — filter by industry and SAP path.
 *  Client component: holds filter state and renders CaseStudyCard. */
export function CaseStudyGrid({ studies }: { studies: CaseStudy[] }) {
  const [industry, setIndustry] = useState<string>(ALL);
  const [sapPath, setSapPath] = useState<SapPath | typeof ALL>(ALL);

  const industries = useMemo(() => [ALL, ...Array.from(new Set(studies.map((s) => s.industry)))], [studies]);

  const filtered = studies.filter(
    (s) => (industry === ALL || s.industry === industry) && (sapPath === ALL || s.sapPath === sapPath),
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <FilterRow label="Industry">
          {industries.map((opt) => (
            <FilterButton key={opt} active={industry === opt} onClick={() => setIndustry(opt)}>
              {opt}
            </FilterButton>
          ))}
        </FilterRow>

        <FilterRow label="SAP path">
          <FilterButton active={sapPath === ALL} onClick={() => setSapPath(ALL)}>
            {ALL}
          </FilterButton>
          {SAP_PATHS.map((opt) => (
            <FilterButton key={opt} active={sapPath === opt} onClick={() => setSapPath(opt)}>
              {opt}
            </FilterButton>
          ))}
        </FilterRow>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" aria-atomic="true" className="text-sm text-foreground-muted">
          {filtered.length} case {filtered.length === 1 ? "study" : "studies"} found.
        </p>
        {(industry !== ALL || sapPath !== ALL) && (
          <button
            type="button"
            onClick={() => {
              setIndustry(ALL);
              setSapPath(ALL);
            }}
            className="min-h-11 rounded-control px-3 text-sm font-semibold text-action underline"
          >
            Clear filters
          </button>
        )}
      </div>
      {filtered.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((study) => (
            <CaseStudyCard key={study.slug} study={study} />
          ))}
        </div>
      ) : (
        <p className="text-[0.95rem] leading-relaxed text-foreground-muted">No case studies match these filters yet.</p>
      )}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <span className="label-caps shrink-0 text-gold sm:w-24">{label}</span>
      <div className="flex flex-wrap gap-2" role="group" aria-label={`Filter by ${label}`}>
        {children}
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "min-h-11 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
        active ? "bg-action text-on-action" : "glass text-foreground-muted hover:border-action/40 hover:text-action",
      )}
    >
      {children}
    </button>
  );
}
