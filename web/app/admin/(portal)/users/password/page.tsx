import Link from "next/link";
import { redirect } from "next/navigation";
import { CODE_MINUTES, ownerEmail, requireOwner } from "@/lib/admin/password";
import { Card, Notice, PageTitle } from "@/components/admin/ui";
import { PasswordCodeForm } from "@/components/admin/password-code-form";
import { finishUserPassword } from "../actions";

/** The owner's code screen for another person's password (first password or a reset). */
export default async function UserPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ ticket?: string; email?: string }>;
}) {
  await requireOwner();
  const { ticket, email } = await searchParams;
  if (!ticket || !email) redirect("/admin/users/");
  return (
    <>
      <PageTitle title="Set a password" intro={`A new password for ${email}.`} />
      <Notice tone="info">
        A one-time code went to {ownerEmail()}. It works for {CODE_MINUTES} minutes. Enter it with the password you will
        share with {email} privately; they can change it later under My account.
      </Notice>
      <Card className="mt-6 max-w-xl">
        <PasswordCodeForm
          action={finishUserPassword}
          ticket={ticket!}
          email={email!}
          compact
          submitLabel="Set the password"
        />
        <p className="mt-4 text-sm">
          <Link href="/admin/users/" className="font-semibold text-action hover:underline">
            Back to users
          </Link>
        </p>
      </Card>
    </>
  );
}
