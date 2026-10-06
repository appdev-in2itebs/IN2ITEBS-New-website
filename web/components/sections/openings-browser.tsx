"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, RotateCcw, Search } from "lucide-react";
import { places } from "@/lib/careers";
import { cn } from "@/lib/utils";

export type JobCard = {
  id: string;
  title: string;
  department: string | null;
  location: string;
  experience: string;
  type: string;
  days: number;
  skills: string;
  /** A posting elsewhere (only before the admin is connected); otherwise the job's page on this site. */
  href?: string;
};

const OTHER = "Other openings";
const control =
  "h-12 w-full rounded-control border border-border-strong/40 bg-surface px-4 text-[0.95rem] text-foreground transition-colors hover:border-action/60 focus:border-action focus:outline-none";

/**
 * Current openings as on the in2itebs Keka careers page: a search box, Location, Department and
 * Job Type filters with a reset, and the roles grouped by department, each card showing how long
 * ago it was posted and its location, experience and job type.
 */
export function OpeningsBrowser({ jobs }: { jobs: JobCard[] }) {
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [type, setType] = useState("");

  const options = useMemo(() => {
    const sorted = (values: string[]) => [...new Set(values)].sort((a, b) => a.localeCompare(b));
    return {
      locations: sorted(jobs.flatMap((j) => places(j.location))),
      departments: sorted(jobs.map((j) => j.department || OTHER)),
      types: sorted(jobs.map((j) => j.type).filter(Boolean)),
    };
  }, [jobs]);

  const shown = jobs.filter((j) => {
    const words = q.trim().toLowerCase();
    if (words && !`${j.title} ${j.skills} ${j.location} ${j.department ?? ""}`.toLowerCase().includes(words))
      return false;
    if (location && !places(j.location).includes(location)) return false;
    if (department && (j.department || OTHER) !== department) return false;
    if (type && j.type !== type) return false;
    return true;
  });
  const groups = new Map<string, JobCard[]>();
  for (const j of shown) {
    const key = j.department || OTHER;
    groups.set(key, [...(groups.get(key) ?? []), j]);
  }
  const ordered = [...groups.entries()].sort(([a], [b]) => (a === OTHER ? 1 : b === OTHER ? -1 : a.localeCompare(b)));
  const filtered = Boolean(q || location || department || type);
  const reset = () => {
    setQ("");
    setLocation("");
    setDepartment("");
    setType("");
  };

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))_auto] md:items-center">
        <label className="relative block">
          <span className="sr-only">Search openings</span>
          <Search
            size={18}
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className={cn(control, "pl-11")}
          />
        </label>
        <Filter label="Location" value={location} onChange={setLocation} options={options.locations} />
        <Filter label="Department" value={department} onChange={setDepartment} options={options.departments} />
        <Filter label="Job Type" value={type} onChange={setType} options={options.types} />
        <button
          type="button"
          onClick={reset}
          disabled={!filtered}
          title="Clear the search and filters"
          aria-label="Clear the search and filters"
          className="inline-flex h-12 w-12 items-center justify-center justify-self-start rounded-full text-foreground-muted transition-colors hover:bg-surface-subtle hover:text-action disabled:opacity-40"
        >
          <RotateCcw size={18} aria-hidden />
        </button>
      </div>

      <p className="mt-6 text-sm text-foreground-muted" aria-live="polite">
        {shown.length === jobs.length
          ? `${jobs.length} open role${jobs.length === 1 ? "" : "s"}`
          : `${shown.length} of ${jobs.length} open roles`}
      </p>

      {ordered.length ? (
        <div className="mt-4 space-y-12">
          {ordered.map(([name, list]) => (
            <section key={name} aria-label={name}>
              <h3 className="text-h3 font-bold text-foreground">{name}</h3>
              <ul className="mt-5 grid gap-4 md:grid-cols-2">
                {list.map((j) => (
                  <li key={j.id}>
                    <JobLink job={j} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-feature border border-dashed border-border-strong/40 p-10 text-center">
          <p className="font-semibold text-foreground">No openings match your search.</p>
          <button type="button" onClick={reset} className="mt-3 text-sm font-semibold text-action hover:underline">
            Show all openings
          </button>
        </div>
      )}
    </div>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(control, !value && "text-foreground-muted")}
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function JobLink({ job }: { job: JobCard }) {
  const meta = [job.location, job.experience, job.type].filter(Boolean);
  const body = (
    <>
      <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-lg font-semibold text-foreground transition-colors group-hover:text-action">
          {job.title}
        </span>
        {job.href ? null : (
          <span className="text-sm text-foreground-muted">
            {job.days === 0 ? "Today" : `${job.days} day${job.days === 1 ? "" : "s"}`}
          </span>
        )}
      </p>
      <p className="mt-2 flex flex-wrap items-center gap-x-2 text-[0.95rem] text-foreground-muted">
        {meta.map((m, i) => (
          <span key={i} className="inline-flex items-center gap-2">
            {i ? <span aria-hidden className="h-1 w-1 rounded-full bg-foreground-muted/60" /> : null}
            {m}
          </span>
        ))}
      </p>
      <ArrowUpRight
        size={18}
        aria-hidden
        className="absolute right-5 top-5 text-foreground-muted transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-action"
      />
    </>
  );
  const cls =
    "group relative block h-full rounded-feature border border-border-subtle bg-surface p-6 pr-12 transition-[border-color,box-shadow] duration-200 hover:border-action/50 hover:shadow-glass";
  return job.href ? (
    <a href={job.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {body}
    </a>
  ) : (
    <Link href={`/careers/current-openings/${job.id}/`} className={cls}>
      {body}
    </Link>
  );
}
