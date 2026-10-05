import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Small building blocks shared by every /admin screen, in the site's own colours and type. */

export const input =
  "mt-1 block w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-foreground focus:border-action focus:outline-none";
export const label = "block text-sm font-medium text-foreground";
export const primaryBtn =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-action px-5 text-sm font-semibold text-on-action hover:bg-action-hover disabled:opacity-60";
export const secondaryBtn =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border-subtle px-5 text-sm font-semibold text-foreground hover:border-action hover:text-action";

export function PageTitle({ title, intro, actions }: { title: string; intro?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {intro ? <p className="mt-1 max-w-2xl text-sm text-foreground-muted">{intro}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-border-subtle bg-surface p-5", className)}>{children}</div>;
}

export function Stat({ label: text, value, href }: { label: string; value: number | string; href?: string }) {
  const body = (
    <Card className="h-full transition-colors hover:border-action/50">
      <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">{text}</p>
      <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
    </Card>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

const tones: Record<string, string> = {
  new: "bg-action/10 text-action",
  open: "bg-action/10 text-action",
  contacted: "bg-surface-subtle text-foreground",
  screening: "bg-surface-subtle text-foreground",
  qualified: "bg-brand text-on-brand",
  interview: "bg-brand text-on-brand",
  offer: "bg-brand text-on-brand",
  won: "bg-brand text-on-brand",
  hired: "bg-brand text-on-brand",
  active: "bg-action/10 text-action",
};
export function Badge({ children }: { children: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        tones[children] ?? "bg-surface-subtle text-foreground-muted",
      )}
    >
      {children}
    </span>
  );
}

export function Table({ head, children, empty }: { head: string[]; children: ReactNode; empty?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border-subtle bg-surface">
      <table className="w-full text-left text-sm">
        <thead className="bg-brand text-on-brand">
          <tr>
            {head.map((h) => (
              <th key={h} className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {empty ? (
            <tr>
              <td colSpan={head.length} className="px-4 py-10 text-center text-foreground-muted">
                Nothing here yet.
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}

export const td = "px-4 py-3 align-top text-foreground";

export function Field({ label: text, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className={label}>
      {text}
      {children}
      {hint ? <span className="mt-1 block text-xs font-normal text-foreground-muted">{hint}</span> : null}
    </label>
  );
}

export function Notice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "ok" | "warn" }) {
  return (
    <div
      role="status"
      className={cn(
        "mb-5 rounded-xl px-4 py-3 text-sm",
        tone === "ok" && "bg-action/10 text-action",
        tone === "warn" && "bg-surface-subtle text-foreground",
        tone === "info" && "bg-surface-subtle text-foreground-muted",
      )}
    >
      {children}
    </div>
  );
}

export function Pager({ page, hasMore, base }: { page: number; hasMore: boolean; base: string }) {
  if (page <= 1 && !hasMore) return null;
  const href = (p: number) => `${base}${base.includes("?") ? "&" : "?"}page=${p}`;
  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      {page > 1 ? (
        <Link href={href(page - 1)} className={secondaryBtn}>
          Previous
        </Link>
      ) : (
        <span />
      )}
      <span className="text-foreground-muted">Page {page}</span>
      {hasMore ? (
        <Link href={href(page + 1)} className={secondaryBtn}>
          Next
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}

export const when = (iso: string | null | undefined) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })
    : "—";
