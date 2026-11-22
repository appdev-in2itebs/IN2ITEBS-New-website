import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin/session";
import { ROLES, ROLE_LABELS } from "@/lib/admin/permissions";
import { isOwner, ownerEmail } from "@/lib/admin/password";
import { Badge, Card, Field, Notice, PageTitle, Table, input, primaryBtn, td, when } from "@/components/admin/ui";
import { addUser, startUserPassword, updateUser } from "./actions";

/**
 * Who can sign in and what they may open. Changing people, roles and passwords is reserved for the
 * website owners (ADMIN_OWNER_EMAIL); other admins see the list read-only. Passwords are never typed
 * here directly: "Reset password" and "Add person" lead to the one-time code screen.
 */
export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const admin = await requireAdmin("users");
  const sp = await searchParams;
  const owner = ownerEmail();
  const manage = isOwner(admin.email);
  const { data: users } = await supabaseAdmin()
    .from("admin_users")
    .select("user_id, email, name, role, active, created_at")
    .order("created_at");

  return (
    <>
      <PageTitle title="Users" intro="Who can sign in to this admin, and what each person can see." />
      {sp.saved ? <Notice tone="ok">{sp.saved}</Notice> : null}
      {sp.error ? <Notice tone="warn">{sp.error}</Notice> : null}
      {!owner ? (
        <Notice tone="warn">
          No website owner is set on the server (ADMIN_OWNER_EMAIL), so any admin may change users. Ask the web team to
          set it.
        </Notice>
      ) : !manage ? (
        <Notice tone="info">Only the website owners ({owner}) add people, change roles and reset passwords.</Notice>
      ) : null}
      <Table head={["Person", "Role", "Access", "Added", "Password"]} empty={!users?.length}>
        {users?.map((u) => (
          <tr key={u.user_id}>
            <td className={td}>
              <span className="font-semibold">{u.name || u.email}</span>
              {u.name ? <span className="block text-xs text-foreground-muted">{u.email}</span> : null}
              {owner && u.email === owner ? (
                <span className="mt-1 block">
                  <Badge>owner</Badge>
                </span>
              ) : null}
            </td>
            <td className={td} colSpan={2}>
              {manage ? (
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
              ) : (
                <span className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="capitalize">{u.role}</span>
                  {u.active ? <Badge>active</Badge> : <Badge>off</Badge>}
                  {u.user_id === admin.id ? <Badge>you</Badge> : null}
                </span>
              )}
            </td>
            <td className={`${td} whitespace-nowrap text-xs`}>{when(u.created_at)}</td>
            <td className={td}>
              {manage && u.active ? (
                <form action={startUserPassword}>
                  <input type="hidden" name="email" value={u.email} />
                  <button type="submit" className="whitespace-nowrap text-sm font-semibold text-action hover:underline">
                    Reset password
                  </button>
                </form>
              ) : (
                <span className="text-xs text-foreground-muted">—</span>
              )}
            </td>
          </tr>
        ))}
      </Table>

      {manage ? (
        <Card className="mt-8 max-w-2xl">
          <h2 className="mb-1 text-lg font-semibold">Add a person</h2>
          <p className="mb-4 text-sm text-foreground-muted">
            They get an email that their account exists. On the next screen you set their first password with a one-time
            code sent to your inbox ({admin.email}), then share that password with them privately.
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
            <button type="submit" className={primaryBtn}>
              Add person
            </button>
          </form>
        </Card>
      ) : null}
    </>
  );
}
