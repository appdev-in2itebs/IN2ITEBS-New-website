import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin/session";
import { Badge, Notice, PageTitle, Table, primaryBtn, secondaryBtn, td, when } from "@/components/admin/ui";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { SelectAll } from "@/components/admin/select-all";
import { bulkOpenings, setOpeningStatus } from "./actions";

/** The form the ticked openings belong to (the checkboxes sit in the table, the buttons above it). */
const BULK = "bulk-openings";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "open", label: "Open (on the website)" },
  { key: "closed", label: "Closed" },
] as const;

export default async function OpeningsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; none?: string; status?: string }>;
}) {
  await requireAdmin("openings");
  const { saved, none, status = "all" } = await searchParams;
  const db = supabaseAdmin();
  let query = db
    .from("job_openings")
    .select("id, title, department, location, employment_type, status, sort_order, updated_at")
    .order("status", { ascending: false })
    .order("sort_order");
  if (status === "open" || status === "closed") query = query.eq("status", status);
  const [{ data: openings }, { data: apps }] = await Promise.all([
    query,
    db.from("job_applications").select("opening_id"),
  ]);
  const counts = new Map<string, number>();
  for (const a of apps ?? []) if (a.opening_id) counts.set(a.opening_id, (counts.get(a.opening_id) ?? 0) + 1);
  const link = "text-sm font-semibold text-action hover:underline";

  return (
    <>
      <PageTitle
        title="Job openings"
        intro="Open roles appear on Careers → Current Openings straight away, each with an Apply form. Close a role to take it off the site; its applications stay. Tick roles to open, close or delete several at once."
        actions={
          <Link href="/admin/openings/new/" className={primaryBtn}>
            Add opening
          </Link>
        }
      />
      {saved ? (
        <Notice tone="ok">
          {Number(saved) > 1 ? `${saved} openings updated.` : "Saved."} The careers page shows the change now.
        </Notice>
      ) : null}
      {none ? <Notice tone="warn">Tick at least one opening first.</Notice> : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex flex-wrap gap-2" aria-label="Show openings">
          {FILTERS.map((f) => (
            <Link
              key={f.key}
              href={f.key === "all" ? "/admin/openings/" : `/admin/openings/?status=${f.key}`}
              aria-current={status === f.key ? "page" : undefined}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                status === f.key ? "bg-brand text-on-brand" : "bg-surface-subtle text-foreground hover:bg-border-subtle"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </nav>
        {/* The bulk buttons: they act on the openings ticked below. */}
        <form id={BULK} action={bulkOpenings} className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-foreground-muted">Selected:</span>
          <button type="submit" name="bulk" value="open" className={secondaryBtn}>
            Show on website
          </button>
          <button type="submit" name="bulk" value="close" className={secondaryBtn}>
            Close
          </button>
          <ConfirmSubmit
            name="bulk"
            value="delete"
            message="Delete the selected openings for good? Applications already received are kept."
            className={`${secondaryBtn} text-red-700`}
          >
            Delete
          </ConfirmSubmit>
        </form>
      </div>

      <Table
        head={[
          <SelectAll key="all" form={BULK} name="ids" label="Select all openings" />,
          "Role",
          "Department",
          "Type",
          "Location",
          "Applications",
          "Status",
          "Updated",
          "Actions",
        ]}
        empty={!openings?.length}
      >
        {openings?.map((o) => (
          <tr key={o.id}>
            <td className={td}>
              <input
                type="checkbox"
                name="ids"
                value={o.id}
                form={BULK}
                aria-label={`Select ${o.title}`}
                className="h-4 w-4"
              />
            </td>
            <td className={td}>
              <Link href={`/admin/openings/${o.id}/`} className="font-semibold text-action hover:underline">
                {o.title}
              </Link>
            </td>
            <td className={td}>{o.department || "—"}</td>
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
            <td className={`${td} whitespace-nowrap`}>
              <div className="flex items-center gap-3">
                <Link href={`/admin/openings/${o.id}/`} className={link}>
                  Edit
                </Link>
                {o.status === "open" ? (
                  <Link href={`/careers/current-openings/${o.id}/`} target="_blank" className={link}>
                    View
                  </Link>
                ) : null}
                <form action={setOpeningStatus}>
                  <input type="hidden" name="id" value={o.id} />
                  <input type="hidden" name="status" value={o.status === "open" ? "closed" : "open"} />
                  <button type="submit" className={link}>
                    {o.status === "open" ? "Close" : "Reopen"}
                  </button>
                </form>
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
