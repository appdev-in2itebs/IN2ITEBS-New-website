import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin/session";
import { LEAD_STATUSES } from "@/lib/admin/permissions";
import { PAGE_SIZE, listUrl, pageOf, searchTerm } from "@/lib/admin/query";
import { Badge, Notice, PageTitle, Pager, Table, input, secondaryBtn, td, when } from "@/components/admin/ui";

type Search = { q?: string; status?: string; source?: string; page?: string; deleted?: string };

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Search> }) {
  await requireAdmin("leads");
  const sp = await searchParams;
  const page = pageOf(sp.page);
  const q = searchTerm(sp.q);
  const status = LEAD_STATUSES.includes(sp.status as never) ? sp.status : undefined;
  const source = ["website", "chatbot", "voice"].includes(sp.source ?? "") ? sp.source : undefined;

  let query = supabaseAdmin()
    .from("leads")
    .select("id, created_at, name, email, company, phone, interest, source, status, assigned_to")
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  if (status) query = query.eq("status", status);
  if (source) query = query.eq("source", source);
  if (q) query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,company.ilike.%${q}%`);
  const { data, error } = await query;
  const rows = (data ?? []).slice(0, PAGE_SIZE);

  return (
    <>
      <PageTitle
        title="Leads"
        intro="Every enquiry from the contact form and the chat assistant. Open one to see the full requirement and update its status."
        actions={
          <a href={listUrl("/admin/leads/export/", { q, status, source })} className={secondaryBtn}>
            Export CSV
          </a>
        }
      />
      {sp.deleted ? <Notice tone="ok">Deleted permanently: {sp.deleted}.</Notice> : null}
      <form className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]" role="search">
        <input name="q" defaultValue={q} placeholder="Search name, email or company" className={input} />
        <select name="status" defaultValue={status ?? ""} className={input} aria-label="Status">
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select name="source" defaultValue={source ?? ""} className={input} aria-label="Source">
          <option value="">All sources</option>
          <option value="website">Contact form</option>
          <option value="chatbot">Chat assistant</option>
          <option value="voice">Voice</option>
        </select>
        <button type="submit" className={secondaryBtn}>
          Filter
        </button>
      </form>
      {error ? <p className="mb-4 text-sm">Could not load leads: {error.message}</p> : null}
      <Table head={["Received", "Name", "Contact", "Interest", "Source", "Status", "Owner"]} empty={!rows.length}>
        {rows.map((l) => (
          <tr key={l.id}>
            <td className={`${td} whitespace-nowrap`}>{when(l.created_at)}</td>
            <td className={td}>
              <Link href={`/admin/leads/${l.id}/`} className="font-semibold text-action hover:underline">
                {l.name}
              </Link>
              {l.company ? <span className="block text-xs text-foreground-muted">{l.company}</span> : null}
            </td>
            <td className={td}>
              <span className="block">{l.email}</span>
              {l.phone ? <span className="block text-xs text-foreground-muted">{l.phone}</span> : null}
            </td>
            <td className={td}>{l.interest ?? "—"}</td>
            <td className={td}>{l.source === "website" ? "Form" : l.source === "chatbot" ? "Chat" : l.source}</td>
            <td className={td}>
              <Badge>{l.status}</Badge>
            </td>
            <td className={td}>{l.assigned_to ?? "—"}</td>
          </tr>
        ))}
      </Table>
      <Pager
        page={page}
        hasMore={(data?.length ?? 0) > PAGE_SIZE}
        base={listUrl("/admin/leads/", { q, status, source })}
      />
    </>
  );
}
