import { Sparkles } from "lucide-react";
import { ASSISTANT_LANGUAGES } from "@/lib/cms/settings";
import { Card } from "./ui";

type Screening = { question: string; answer: string };

/**
 * What the AI assistant collected for a lead or an application: its summary for the team, every
 * answer as its own row (one per question the assistant asked), the job-description screening
 * questions with the candidate's answers, the fit score, and the language of the conversation.
 */
export function AiDetails({
  summary,
  details,
  fitScore,
  language,
}: {
  summary?: string | null;
  details?: Record<string, unknown> | null;
  fitScore?: number | null;
  language?: string | null;
}) {
  const rows = Object.entries(details ?? {}).filter(
    ([k, v]) => k !== "screening" && v !== null && v !== undefined && String(v).trim(),
  );
  const screening = Array.isArray(details?.screening) ? (details.screening as Screening[]) : [];
  if (!summary && !rows.length && !screening.length) return null;
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground-muted">
          <Sparkles size={15} className="text-action" aria-hidden /> Collected by the AI assistant
        </h2>
        <div className="flex flex-wrap gap-2 text-xs">
          {language ? (
            <span className="rounded-full bg-surface-subtle px-2.5 py-0.5 font-semibold text-foreground">
              {ASSISTANT_LANGUAGES[language] ?? language}
            </span>
          ) : null}
          {typeof fitScore === "number" ? (
            <span
              className={
                fitScore >= 70
                  ? "rounded-full bg-action/10 px-2.5 py-0.5 font-semibold text-action"
                  : "rounded-full bg-surface-subtle px-2.5 py-0.5 font-semibold text-foreground"
              }
              title="How well the candidate's answers match the job description, in the assistant's judgement"
            >
              Fit {fitScore}/100
            </span>
          ) : null}
        </div>
      </div>
      {summary ? (
        <p className="mt-3 rounded-xl bg-surface-subtle px-4 py-3 text-sm text-foreground">{summary}</p>
      ) : null}
      {rows.length ? (
        <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {rows.map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                {k.replace(/\s*\(optional\)\s*/i, "")}
              </dt>
              <dd className="mt-0.5 whitespace-pre-line break-words text-sm text-foreground">{String(v)}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {screening.length ? (
        <div className="mt-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Screening questions</h3>
          <ol className="mt-2 space-y-3">
            {screening.map((s, i) => (
              <li key={i} className="rounded-xl border border-border-subtle p-3 text-sm">
                <p className="font-semibold text-foreground">
                  {i + 1}. {s.question}
                </p>
                <p className="mt-1 whitespace-pre-line text-foreground-muted">{s.answer}</p>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </Card>
  );
}
