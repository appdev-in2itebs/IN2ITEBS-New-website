import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin/session";
import { Badge, Notice, PageTitle, Table, primaryBtn, td, when } from "@/components/admin/ui";
import { setOpeningStatus } from "./actions";

export default async function OpeningsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin("openings");
  const { saved } = await searchParams;
  const db = supabaseAdmin();
  const [{ data: openings }, { data: apps }] = await Promise.all([
    db
      .from("job_openings")
      .select("id, title, location, employment_type, status, sort_order, updated_at")
      .order("status", { ascending: false })
      .order("sort_order"),
    db.from("job_applications").select("opening_id"),
  ]);
  const counts = new Map<string, number>();
  for (const a of apps ?? []) if (a.opening_id) counts.set(a.opening_id, (counts.get(a.opening_id) ?? 0) + 1);

  return (
    <>
      <PageTitle
        title="Job openings"
        intro="Open roles appear on Careers → Current Openings straight away, each with an Apply form. Close a role to take it off the site; its applications stay."
        actions={
          <Link href="/admin/openings/new/" className={primaryBtn}>
            Add opening
          </Link>
        }
      />
      {saved ? <Notice tone="ok">Saved. The careers page shows the change now.</Notice> : null}
      <Table head={["Role", "Type", "Location", "Applications", "Status", "Updated", ""]} empty={!openings?.length}>
        {openings?.map((o) => (
          <tr key={o.id}>
            <td className={td}>
              <Link href={`/admin/openings/${o.id}/`} className="font-semibold text-action hover:underline">
                {o.title}
              </Link>
            </td>
            <td className={td}>{o.employment_type}</td>
            <td className={td}>{o.location}</td>
            <td className={td}>
              {counts.get(o.id) ? (
                <Link href={`/admin/applications/?opening=${o.id}`} className="text-action hover:underline">
                  {counts.get(o.id)}
                </Link>
              ) : (
                0
              )}
            </td>
            <td className={td}>
              <Badge>{o.status}</Badge>
            </td>
            <td className={`${td} whitespace-nowrap`}>{when(o.updated_at)}</td>
            <td className={td}>
              <form action={setOpeningStatus}>
                <input type="hidden" name="id" value={o.id} />
                <input type="hidden" name="status" value={o.status === "open" ? "closed" : "open"} />
                <button type="submit" className="text-sm font-semibold text-action hover:underline">
                  {o.status === "open" ? "Close" : "Reopen"}
                </button>
              </form>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
