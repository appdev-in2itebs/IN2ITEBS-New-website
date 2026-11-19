import { requireAdmin } from "@/lib/admin/session";
import { ROLE_LABELS } from "@/lib/admin/permissions";
import { CODE_MINUTES, isOwner, ownerEmail } from "@/lib/admin/password";
import { mailConfigured } from "@/lib/mail/send";
import { Badge, Card, Notice, PageTitle, primaryBtn, secondaryBtn } from "@/components/admin/ui";
import { PasswordCodeForm } from "@/components/admin/password-code-form";
import { finishMyPassword, startMyPassword } from "./actions";

/**
 * My account: who you are signed in as, and the password change. Press "Send me a code", the six
 * digits arrive in your own inbox, you enter them with the new password.
 */
export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ ticket?: string; saved?: string; error?: string }>;
}) {
  const admin = await requireAdmin("account");
  const sp = await searchParams;
  const owner = ownerEmail();
  return (
    <>
      <PageTitle title="My account" intro="Your sign-in details and password." />
      {sp.saved ? <Notice tone="ok">Your password is changed. Use it the next time you sign in.</Notice> : null}
      {sp.error ? <Notice tone="warn">{sp.error}</Notice> : null}
      {!mailConfigured() ? (
        <Notice tone="warn">Password changes need email on the server (SMTP settings). Ask the web team.</Notice>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-lg font-semibold">Signed in as</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-foreground-muted">Email</dt>
              <dd className="font-semibold">{admin.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-foreground-muted">Name</dt>
              <dd className="font-semibold">{admin.name || "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-foreground-muted">Role</dt>
              <dd className="font-semibold">{ROLE_LABELS[admin.role]}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-foreground-muted">Website owner</dt>
              <dd className="font-semibold">
                {owner ?? "not set"} {owner && isOwner(admin.email) ? <Badge>you</Badge> : null}
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="mb-1 text-lg font-semibold">Change your password</h2>
          {sp.ticket ? (
            <>
              <p className="mb-4 text-sm text-foreground-muted">
                A one-time code went to your inbox ({admin.email}). It works for {CODE_MINUTES} minutes. Enter it with
                your new password.
              </p>
              <PasswordCodeForm action={finishMyPassword} ticket={sp.ticket} compact submitLabel="Change my password" />
              <form action={startMyPassword} className="mt-4">
                <button type="submit" className={secondaryBtn}>
                  Send a new code
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="mb-4 text-sm text-foreground-muted">
                For safety every password change is confirmed with a one-time code emailed to you at {admin.email}.
                Press the button, open the email, then set your new password.
              </p>
              <form action={startMyPassword}>
                <button type="submit" className={primaryBtn} disabled={!mailConfigured()}>
                  Send me a code
                </button>
              </form>
            </>
          )}
        </Card>
      </div>
    </>
  );
}
