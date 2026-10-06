import type { ReactNode } from "react";
import { Card } from "./ui";
import { ConfirmSubmit } from "./confirm-submit";

const danger =
  "inline-flex min-h-10 items-center justify-center rounded-full border border-red-700/40 px-5 text-sm font-semibold text-red-800 hover:border-red-700 hover:bg-red-50";

/**
 * Permanent deletion on a record's page: the record itself and, for admins, everything held about
 * the person's email address. Both ask for confirmation; neither can be undone.
 */
export function DangerZone({
  title,
  explain,
  action,
  id,
  label,
  confirm,
  email,
  eraseAction,
  back,
}: {
  title: string;
  explain: ReactNode;
  action: (form: FormData) => void | Promise<void>;
  id: string;
  label: string;
  confirm: string;
  email?: string | null;
  eraseAction?: (form: FormData) => void | Promise<void>;
  back: string;
}) {
  return (
    <Card className="border-red-700/25">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-red-800">{title}</h2>
      <p className="mt-2 text-sm text-foreground-muted">{explain}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <form action={action}>
          <input type="hidden" name="id" value={id} />
          <ConfirmSubmit className={danger} message={confirm}>
            {label}
          </ConfirmSubmit>
        </form>
        {email && eraseAction ? (
          <form action={eraseAction}>
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="back" value={back} />
            <ConfirmSubmit
              className={danger}
              message={`Erase ALL data for ${email}? Every lead, job application, CV and chat with this email address is deleted permanently. This cannot be undone.`}
            >
              Erase all data for this email
            </ConfirmSubmit>
          </form>
        ) : null}
      </div>
    </Card>
  );
}
