import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin/session";
import { APPLICATION_STATUSES } from "@/lib/admin/permissions";
import { PAGE_SIZE, isUuid, listUrl, pageOf, searchTerm } from "@/lib/admin/query";
import { Badge, Notice, PageTitle, Pager, Table, input, secondaryBtn, td, when } from "@/components/admin/ui";

type Search = { q?: string; status?: string; opening?: string; page?: string; deleted?: string };

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<Search> }) {
  await requireAdmin("applications");
  const sp = await searchParams;
  const page = pageOf(sp.page);
  const q = searchTerm(sp.q);
  const status = APPLICATION_STATUSES.includes(sp.status as never) ? sp.status : undefined;
  const opening = sp.opening && isUuid(sp.opening) ? sp.opening : undefined;
  const db = supabaseAdmin();

  let query = db
    .from("job_applications")
    .select("id, created_at, name, email, phone, role_applied, location, notice_period, status, source")
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  if (status) query = query.eq("status", status);
  if (opening) query = query.eq("opening_id", opening);
  if (q) query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,role_applied.ilike.%${q}%`);
  const [{ data, error }, { data: openings }] = await Promise.all([
    query,
    db.from("job_openings").select("id, title, status").order("sort_order"),
  ]);
  const rows = (data ?? []).slice(0, PAGE_SIZE);

  return (
    <>
      <PageTitle
        title="Applications"
        intro="Candidates who applied on the website. Open one to read the details and download the CV."
      />
      {sp.deleted ? <Notice tone="ok">Deleted permanently: {sp.deleted}.</Notice> : null}
      <form className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]" role="search">
        <input name="q" defaultValue={q} placeholder="Search name, email or role" className={input} />
        <select name="opening" defaultValue={opening ?? ""} className={input} aria-label="Opening">
          <option value="">All openings</option>
          {openings?.map((o) => (
            <option key={o.id} value={o.id}>
              {o.title}
              {o.status === "closed" ? " (closed)" : ""}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={status ?? ""} className={input} aria-label="Status">
          <option value="">All statuses</option>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="submit" className={secondaryBtn}>
          Filter
        </button>
      </form>
      {error ? <p className="mb-4 text-sm">Could not load applications: {error.message}</p> : null}
      <Table head={["Received", "Candidate", "Role", "Location", "Notice", "Status"]} empty={!rows.length}>
        {rows.map((a) => (
          <tr key={a.id}>
            <td className={`${td} whitespace-nowrap`}>{when(a.created_at)}</td>
            <td className={td}>
              <Link href={`/admin/applications/${a.id}/`} className="font-semibold text-action hover:underline">
                {a.name}
              </Link>
              <span className="block text-xs text-foreground-muted">{a.email}</span>
            </td>
            <td className={td}>{a.role_applied}</td>
            <td className={td}>{a.location ?? "—"}</td>
            <td className={td}>{a.notice_period ?? "—"}</td>
            <td className={td}>
              <Badge>{a.status}</Badge>
            </td>
          </tr>
        ))}
      </Table>
      <Pager
        page={page}
        hasMore={(data?.length ?? 0) > PAGE_SIZE}
        base={listUrl("/admin/applications/", { q, status, opening })}
      />
    </>
  );
}
