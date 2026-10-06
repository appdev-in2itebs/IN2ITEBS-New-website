import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin/session";
import { LEAD_STATUSES } from "@/lib/admin/permissions";
import { isUuid } from "@/lib/admin/query";
import { Badge, Card, Field, Notice, PageTitle, input, primaryBtn, secondaryBtn, when } from "@/components/admin/ui";
import { Transcript } from "@/components/admin/transcript";
import { deleteLead, eraseByEmail, updateLead } from "../actions";
import { AiDetails } from "@/components/admin/ai-details";
import { DangerZone } from "@/components/admin/danger-zone";
import { can } from "@/lib/admin/permissions";

const regions: Record<string, string> = { IN: "India", KE: "Kenya", ZA: "South Africa", ME: "Middle East" };

export default async function LeadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const admin = await requireAdmin("leads");
  const { id } = await params;
  const sp = await searchParams;
  if (!isUuid(id)) notFound();
  const { data: lead } = await supabaseAdmin().from("leads").select("*").eq("id", id).maybeSingle();
  if (!lead) notFound();

  const facts: [string, string | null | undefined][] = [
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["Company", lead.company],
    ["Region", lead.region ? (regions[lead.region] ?? lead.region) : null],
    ["Interest", lead.interest],
    ["Asked for", lead.offer],
    ["Assessment", lead.assessment],
    ["Source", lead.source === "website" ? "Contact form" : lead.source === "chatbot" ? "Chat assistant" : lead.source],
    ["Received", when(lead.created_at)],
    ["Forwarded to webhook", lead.delivered ? when(lead.delivered_at) : "No"],
  ];

  return (
    <>
      <Link href="/admin/leads/" className="mb-3 inline-block text-sm text-action hover:underline">
        ← All leads
      </Link>
      <PageTitle
        title={lead.name}
        intro={lead.company ?? undefined}
        actions={
          <a href={`mailto:${lead.email}`} className={secondaryBtn}>
            Email {lead.name.split(" ")[0]}
          </a>
        }
      />
      {sp.saved ? <Notice tone="ok">Saved.</Notice> : null}
      {sp.error ? <Notice tone="warn">That did not save. Please try again.</Notice> : null}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground-muted">Requirement</h2>
            <p className="mt-2 whitespace-pre-line text-foreground">{lead.message || "—"}</p>
          </Card>
          <AiDetails summary={lead.ai_summary} details={lead.details} language={lead.language} />
          <Card>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {facts
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">{k}</dt>
                    <dd className="mt-0.5 break-words text-sm text-foreground">{v}</dd>
                  </div>
                ))}
            </dl>
          </Card>
          <DangerZone
            title="Delete"
            explain="Removes this lead and its chat conversation from the database for good. This cannot be undone."
            action={deleteLead}
            id={lead.id}
            label="Delete this lead permanently"
            confirm={`Delete the lead from ${lead.name} and its chat permanently? This cannot be undone.`}
            email={can(admin.role, "users") ? lead.email : null}
            eraseAction={eraseByEmail}
            back="/admin/leads/"
          />
          {lead.conversation_id ? (
            <Card>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground-muted">
                Chat transcript
              </h2>
              <Transcript conversationId={lead.conversation_id} />
            </Card>
          ) : null}
        </div>
        <Card className="h-fit">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            Follow-up <Badge>{lead.status}</Badge>
          </h2>
          <form action={updateLead} className="space-y-4">
            <input type="hidden" name="id" value={lead.id} />
            <Field label="Status">
              <select name="status" defaultValue={lead.status} className={input}>
                {LEAD_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Owner" hint="Who is following this up.">
              <input name="assigned_to" defaultValue={lead.assigned_to ?? ""} maxLength={120} className={input} />
            </Field>
            <Field label="Internal notes">
              <textarea name="notes" defaultValue={lead.notes ?? ""} rows={6} maxLength={5000} className={input} />
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
