import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Briefcase, Building2, CalendarDays, Clock, MapPin } from "lucide-react";
import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ApplyForm } from "@/components/forms/apply-form";
import { ShareJob } from "@/components/sections/share-job";
import { getOpening, type OpeningRow } from "@/lib/cms/store";
import { daysSince, lines, paragraphs, places, postedLabel, skillList } from "@/lib/careers";
import { SITE_URL } from "@/lib/utils";

/** Openings change in /admin at any time, so the post is read on every visit. */
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const o = await getOpening(id);
  return pageMetadata(`/careers/current-openings/${id}/`, {
    title: o ? `${o.title} · Careers` : "Job opening",
    description: o
      ? (
          o.overview ||
          `${o.title} at In2IT EBS in ${o.location}${o.experience ? `, ${o.experience}` : ""}. Apply online.`
        ).slice(0, 200)
      : "A job opening at In2IT EBS.",
  });
}

/**
 * One job post, laid out like the in2itebs Keka careers page: the title with location, experience
 * and job type, then Job Overview, Job Description, Key Responsibilities, Required Qualifications
 * and Key Skills, a summary card with "Apply for this job", and the application form underneath.
 * Everything comes from /admin/openings.
 */
export default async function JobPage({ params }: Props) {
  const { id } = await params;
  const o = await getOpening(id);
  if (!o) notFound();
  const days = daysSince(o.posted_at);
  const responsibilities = lines(o.responsibilities);
  const qualifications = lines(o.requirements);
  const skills = skillList(o.skills);
  const facts = [
    { icon: MapPin, label: "Location", value: o.location },
    { icon: Briefcase, label: "Experience", value: o.experience },
    { icon: Clock, label: "Job type", value: o.employment_type },
    { icon: Building2, label: "Department", value: o.department },
    { icon: CalendarDays, label: "Posted", value: postedLabel(days).replace(/^Posted /, "") },
  ].filter((f) => f.value);

  return (
    <>
      <BreadcrumbJsonLd path={`/careers/current-openings/${o.id}/`} name={o.title} />
      <JobPostingJsonLd opening={o} />
      <section className="relative isolate overflow-hidden bg-canvas pb-16 pt-36 md:pt-44">
        <div aria-hidden className="pointer-events-none absolute inset-0 hero-ambient" />
        <Container className="relative">
          <Link
            href="/careers/current-openings/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground-muted transition-colors hover:text-action"
          >
            <ArrowLeft size={16} aria-hidden /> All current openings
          </Link>
          <h1 className="mt-6 max-w-4xl text-[clamp(2.2rem,4.6vw,3.8rem)] font-bold leading-[1.02] tracking-[-0.04em]">
            {o.title}
          </h1>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-[0.98rem] text-foreground-muted">
            {facts.slice(0, 4).map(({ icon: Icon, label, value }) => (
              <li key={label} className="inline-flex items-center gap-2">
                <Icon size={17} aria-hidden className="text-gold" />
                <span className="sr-only">{label}:</span>
                {value}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-foreground-muted">{postedLabel(days)}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href="#apply" variant="primary" withArrow>
              Apply for this job
            </Button>
            <ShareJob
              title={o.title}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border-strong/50 px-6 text-sm font-semibold text-foreground transition-colors hover:border-action hover:text-action"
            />
          </div>
        </Container>
      </section>

      <section className="bg-surface-subtle py-16 md:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <article className="space-y-10 lg:col-span-8">
              {o.overview ? (
                <Block title="Job Overview">
                  {paragraphs(o.overview).map((p, i) => (
                    <p key={i} className="leading-relaxed">
                      {p}
                    </p>
                  ))}
                </Block>
              ) : null}
              {o.description ? (
                <Block title="Job Description">
                  {paragraphs(o.description).map((p, i) => (
                    <p key={i} className="whitespace-pre-line leading-relaxed">
                      {p}
                    </p>
                  ))}
                </Block>
              ) : null}
              {responsibilities.length ? (
                <Block title="Key Responsibilities">
                  <Bullets items={responsibilities} />
                </Block>
              ) : null}
              {qualifications.length ? (
                <Block title="Required Qualifications">
                  <Bullets items={qualifications} />
                </Block>
              ) : null}
              {skills.length ? (
                <Block title="Key Skills">
                  <ul className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <li
                        key={s}
                        className="rounded-full border border-border-subtle bg-surface px-3.5 py-1.5 text-sm font-medium text-foreground"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </Block>
              ) : null}
              {!o.overview && !o.description && !responsibilities.length && !qualifications.length ? (
                <p className="leading-relaxed text-foreground-muted">
                  Tell us about yourself and attach your CV. Our HR team reads every application and will contact you if
                  your profile fits the role.
                </p>
              ) : null}
            </article>

            <aside className="lg:col-span-4">
              <div className="sticky top-28 rounded-feature border border-border-subtle bg-surface p-6 shadow-glass">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground-muted">Job summary</h2>
                <dl className="mt-4 space-y-3">
                  {facts.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex gap-3">
                      <Icon size={18} aria-hidden className="mt-0.5 shrink-0 text-gold" />
                      <div>
                        <dt className="text-xs text-foreground-muted">{label}</dt>
                        <dd className="text-sm font-semibold text-foreground">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
                <Button href="#apply" variant="primary" withArrow className="mt-6 w-full">
                  Apply for this job
                </Button>
                <Link
                  href="/careers/current-openings/"
                  className="mt-4 block text-center text-sm font-semibold text-action hover:underline"
                >
                  View all openings
                </Link>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section id="apply" className="scroll-mt-24 bg-canvas py-16 md:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="label-caps text-gold">Apply</span>
              <h2 className="mt-4 text-h2 font-bold">Apply for this job</h2>
              <p className="mt-4 leading-relaxed text-foreground-muted">
                Send your details and CV for <strong className="text-foreground">{o.title}</strong>. Our HR team reads
                every application and will contact you if your profile fits.
              </p>
            </div>
            <div className="lg:col-span-8">
              <ApplyForm openingId={o.id} title={o.title} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-h3 font-bold text-foreground">{title}</h2>
      <div className="mt-4 space-y-4 text-foreground-muted">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 leading-relaxed">
          <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const EMPLOYMENT: Record<string, string> = {
  "full time": "FULL_TIME",
  "full-time": "FULL_TIME",
  "part time": "PART_TIME",
  "part-time": "PART_TIME",
  contract: "CONTRACTOR",
  internship: "INTERN",
};

/** Google's job-posting markup, so the role can appear in Google's job search. */
function JobPostingJsonLd({ opening: o }: { opening: OpeningRow }) {
  const html = [
    o.overview && `<p>${esc(o.overview)}</p>`,
    o.description &&
      paragraphs(o.description)
        .map((p) => `<p>${esc(p)}</p>`)
        .join(""),
    lines(o.responsibilities).length &&
      `<h3>Key Responsibilities</h3><ul>${lines(o.responsibilities)
        .map((l) => `<li>${esc(l)}</li>`)
        .join("")}</ul>`,
    lines(o.requirements).length &&
      `<h3>Required Qualifications</h3><ul>${lines(o.requirements)
        .map((l) => `<li>${esc(l)}</li>`)
        .join("")}</ul>`,
    skillList(o.skills).length && `<h3>Key Skills</h3><p>${esc(skillList(o.skills).join(", "))}</p>`,
  ]
    .filter(Boolean)
    .join("");
  const data = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: o.title,
    description: html || `<p>${esc(o.title)} at In2IT EBS.</p>`,
    datePosted: o.posted_at,
    employmentType: EMPLOYMENT[o.employment_type.toLowerCase()] ?? "OTHER",
    hiringOrganization: { "@type": "Organization", name: "In2IT EBS", sameAs: SITE_URL },
    jobLocation: places(o.location).map((city) => ({
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: city, addressCountry: "IN" },
    })),
    url: `${SITE_URL}/careers/current-openings/${o.id}/`,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
