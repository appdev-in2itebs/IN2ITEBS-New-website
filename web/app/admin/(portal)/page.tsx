import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin/session";
import { can } from "@/lib/admin/permissions";
import { Badge, Card, Notice, PageTitle, Stat, Table, td, when } from "@/components/admin/ui";

/** Rows in a table, optionally where column = value, or column >= since. */
async function count(table: string, where?: { eq?: [string, string]; since?: [string, string] }) {
  let q = supabaseAdmin().from(table).select("*", { count: "exact", head: true });
  if (where?.eq) q = q.eq(where.eq[0], where.eq[1]);
  if (where?.since) q = q.gte(where.since[0], where.since[1]);
  const { count: n } = await q;
  return n ?? 0;
}

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const admin = await requireAdmin("dashboard");
  const { denied } = await searchParams;
  const db = supabaseAdmin();
  const week = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const sales = can(admin.role, "leads");
  const hr = can(admin.role, "applications");
  const chats = can(admin.role, "chats");

  const [newLeads, allLeads, newApps, openRoles, recentChats, leads, apps] = await Promise.all([
    sales ? count("leads", { eq: ["status", "new"] }) : 0,
    sales ? count("leads") : 0,
    hr ? count("job_applications", { eq: ["status", "new"] }) : 0,
    hr ? count("job_openings", { eq: ["status", "open"] }) : 0,
    chats ? count("chat_conversations", { since: ["started_at", week] }) : 0,
    sales
      ? db
          .from("leads")
          .select("id, created_at, name, company, source, status")
          .order("created_at", { ascending: false })
          .limit(6)
      : { data: [] },
    hr
      ? db
          .from("job_applications")
          .select("id, created_at, name, role_applied, status")
          .order("created_at", { ascending: false })
          .limit(6)
      : { data: [] },
  ]);

  return (
    <>
      <PageTitle
        title={`Welcome${admin.name ? `, ${admin.name.split(" ")[0]}` : ""}`}
        intro="What has come in from the website."
      />
      {denied ? <Notice tone="warn">Your role does not include that section.</Notice> : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sales ? <Stat label="New leads" value={newLeads} href="/admin/leads/?status=new" /> : null}
        {sales ? <Stat label="All leads" value={allLeads} href="/admin/leads/" /> : null}
        {hr ? <Stat label="New applications" value={newApps} href="/admin/applications/?status=new" /> : null}
        {hr ? <Stat label="Open roles" value={openRoles} href="/admin/openings/" /> : null}
        {chats ? <Stat label="Chats this week" value={recentChats} href="/admin/chats/" /> : null}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {sales ? (
          <section>
            <h2 className="mb-3 text-lg font-semibold">Latest leads</h2>
            <Table head={["Received", "Name", "Source", "Status"]} empty={!leads.data?.length}>
              {leads.data?.map((l) => (
                <tr key={l.id}>
                  <td className={td}>{when(l.created_at)}</td>
                  <td className={td}>
                    <Link href={`/admin/leads/${l.id}/`} className="font-semibold text-action hover:underline">
                      {l.name}
                    </Link>
                    {l.company ? <span className="block text-xs text-foreground-muted">{l.company}</span> : null}
                  </td>
                  <td className={td}>{l.source}</td>
                  <td className={td}>
                    <Badge>{l.status}</Badge>
                  </td>
                </tr>
              ))}
            </Table>
          </section>
        ) : null}
        {hr ? (
          <section>
            <h2 className="mb-3 text-lg font-semibold">Latest applications</h2>
            <Table head={["Received", "Candidate", "Role", "Status"]} empty={!apps.data?.length}>
              {apps.data?.map((a) => (
                <tr key={a.id}>
                  <td className={td}>{when(a.created_at)}</td>
                  <td className={td}>
                    <Link href={`/admin/applications/${a.id}/`} className="font-semibold text-action hover:underline">
                      {a.name}
                    </Link>
                  </td>
                  <td className={td}>{a.role_applied}</td>
                  <td className={td}>
                    <Badge>{a.status}</Badge>
                  </td>
                </tr>
              ))}
            </Table>
          </section>
        ) : null}
        {!sales && !hr ? (
          <Card>
            <p className="text-sm text-foreground-muted">
              Use the menu to edit the chatbot&apos;s answers, the site settings or the page heroes.
            </p>
          </Card>
        ) : null}
      </div>
    </>
  );
}
