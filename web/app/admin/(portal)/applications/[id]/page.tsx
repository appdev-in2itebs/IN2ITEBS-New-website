import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin/session";
import { APPLICATION_STATUSES, can } from "@/lib/admin/permissions";
import { isUuid } from "@/lib/admin/query";
import { Badge, Card, Field, Notice, PageTitle, input, primaryBtn, secondaryBtn, when } from "@/components/admin/ui";
import { AiDetails } from "@/components/admin/ai-details";
import { DangerZone } from "@/components/admin/danger-zone";
import { eraseByEmail } from "../../leads/actions";
import { Transcript } from "@/components/admin/transcript";
import { deleteApplication, updateApplication } from "../actions";

export default async function ApplicationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const admin = await requireAdmin("applications");
  const { id } = await params;
  const sp = await searchParams;
  if (!isUuid(id)) notFound();
  const { data: app } = await supabaseAdmin().from("job_applications").select("*").eq("id", id).maybeSingle();
  if (!app) notFound();

  const facts: [string, string | null | undefined][] = [
    ["Role", app.role_applied],
    ["Email", app.email],
    ["Phone", app.phone],
    ["Location", app.location],
    ["Current role", app.current_position],
    ["Notice period", app.notice_period],
    ["Expected CTC", app.expected_ctc],
    ["LinkedIn", app.linkedin_url],
    ["Source", app.source === "chatbot" ? "Chat assistant" : app.source === "website" ? "Careers page" : app.source],
    ["Applied", when(app.created_at)],
    ["Consent given", app.consent_at ? when(app.consent_at) : null],
  ];

  return (
    <>
      <Link href="/admin/applications/" className="mb-3 inline-block text-sm text-action hover:underline">
        ← All applications
      </Link>
      <PageTitle
        title={app.name}
        intro={app.role_applied}
        actions={
          <>
            {app.resume_path ? (
              <a href={`/admin/applications/${app.id}/cv/`} className={primaryBtn}>
                Download CV
              </a>
            ) : null}
            <a href={`mailto:${app.email}`} className={secondaryBtn}>
              Email candidate
            </a>
          </>
        }
      />
      {sp.saved ? <Notice tone="ok">Saved.</Notice> : null}
      {sp.error ? <Notice tone="warn">That did not save. Please try again.</Notice> : null}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {facts
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">{k}</dt>
                    <dd className="mt-0.5 break-words text-sm text-foreground">
                      {k === "LinkedIn" ? (
                        <a href={v!} target="_blank" rel="noopener noreferrer" className="text-action hover:underline">
                          {v}
                        </a>
                      ) : (
                        v
                      )}
                    </dd>
                  </div>
                ))}
            </dl>
          </Card>
          <AiDetails summary={app.ai_summary} details={app.details} fitScore={app.fit_score} language={app.language} />
          {app.cover_note ? (
            <Card>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground-muted">Cover note</h2>
              <p className="mt-2 whitespace-pre-line text-foreground">{app.cover_note}</p>
            </Card>
          ) : null}
          <DangerZone
            title="Delete"
            explain="Removes this application, the CV file and the chat conversation from the database and storage for good. This cannot be undone."
            action={deleteApplication}
            id={app.id}
            label="Delete this application permanently"
            confirm={`Delete ${app.name}'s application, CV and chat permanently? This cannot be undone.`}
            email={can(admin.role, "users") ? app.email : null}
            eraseAction={eraseByEmail}
            back="/admin/applications/"
          />
          {app.conversation_id ? (
            <Card>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground-muted">
                Chat transcript
              </h2>
              <Transcript conversationId={app.conversation_id} />
            </Card>
          ) : null}
        </div>
        <Card className="h-fit">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            Hiring status <Badge>{app.status}</Badge>
          </h2>
          <form action={updateApplication} className="space-y-4">
            <input type="hidden" name="id" value={app.id} />
            <Field label="Status">
              <select name="status" defaultValue={app.status} className={input}>
                {APPLICATION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Internal notes">
              <textarea name="notes" defaultValue={app.notes ?? ""} rows={6} maxLength={5000} className={input} />
            </Field>
            <button type="submit" className={primaryBtn}>
              Save
            </button>
          </form>
        </Card>
      </div>
    </>
  );
}
