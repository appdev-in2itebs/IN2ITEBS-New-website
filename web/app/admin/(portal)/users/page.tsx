import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin/session";
import { ROLES, ROLE_LABELS } from "@/lib/admin/permissions";
import { Badge, Card, Field, Notice, PageTitle, Table, input, primaryBtn, td, when } from "@/components/admin/ui";
import { addUser, updateUser } from "./actions";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const admin = await requireAdmin("users");
  const sp = await searchParams;
  const { data: users } = await supabaseAdmin()
    .from("admin_users")
    .select("user_id, email, name, role, active, created_at")
    .order("created_at");

  return (
    <>
      <PageTitle title="Users" intro="Who can sign in to this admin, and what each person can see." />
      {sp.saved ? <Notice tone="ok">{sp.saved}</Notice> : null}
      {sp.error ? <Notice tone="warn">{sp.error}</Notice> : null}
      <Table head={["Person", "Role", "Access", "Added", ""]} empty={!users?.length}>
        {users?.map((u) => (
          <tr key={u.user_id}>
            <td className={td}>
              <span className="font-semibold">{u.name || u.email}</span>
              {u.name ? <span className="block text-xs text-foreground-muted">{u.email}</span> : null}
            </td>
            <td className={td} colSpan={2}>
              <form action={updateUser} className="flex flex-wrap items-center gap-2">
                <input type="hidden" name="id" value={u.user_id} />
                <select name="role" defaultValue={u.role} className={`${input} mt-0 w-auto`} aria-label="Role">
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <select
                  name="active"
                  defaultValue={u.active ? "yes" : "no"}
                  className={`${input} mt-0 w-auto`}
                  aria-label="Access"
                >
                  <option value="yes">Active</option>
                  <option value="no">Switched off</option>
                </select>
                <button type="submit" className="text-sm font-semibold text-action hover:underline">
                  Save
                </button>
                {u.user_id === admin.id ? <Badge>you</Badge> : null}
              </form>
            </td>
            <td className={`${td} whitespace-nowrap text-xs`}>{when(u.created_at)}</td>
            <td className={td}>{u.active ? <Badge>active</Badge> : <Badge>off</Badge>}</td>
          </tr>
        ))}
      </Table>

      <Card className="mt-8 max-w-2xl">
        <h2 className="mb-1 text-lg font-semibold">Add a person</h2>
        <p className="mb-4 text-sm text-foreground-muted">
          They sign in at /admin/login with this email and the temporary password you set. Share it with them privately.
        </p>
        <form action={addUser} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email *">
              <input name="email" type="email" required className={input} />
            </Field>
            <Field label="Name">
              <input name="name" maxLength={120} className={input} />
            </Field>
          </div>
          <Field label="Role *">
            <select name="role" defaultValue="sales" className={input}>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Temporary password *" hint="At least 10 characters.">
            <input
              name="password"
              type="text"
              required
              minLength={10}
              maxLength={72}
              autoComplete="off"
              className={input}
            />
          </Field>
          <button type="submit" className={primaryBtn}>
            Add person
          </button>
        </form>
      </Card>
    </>
  );
}
