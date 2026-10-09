import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CountUp } from "./count-up";

/**
 * Small building blocks shared by every /admin screen, in the AURA Premium UI language locked to
 * the In2IT EBS brand (app/admin/admin.css): 28px cards, 16px inputs, 20px CTA buttons with the
 * Accent Blue gradient, Newsreader headlines, glass table headers, staggered entrances.
 */

export const input = "aura-input";
export const label = "aura-label";
export const primaryBtn = "aura-btn aura-press";
export const secondaryBtn = "aura-btn-secondary";

export function PageTitle({
  title,
  accent,
  intro,
  actions,
}: {
  title: string;
  /** One word set in italic Accent Blue after the title, e.g. the person's first name. */
  accent?: string;
  intro?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="aura-rise mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="aura-display-lg">
          {title}
          {accent ? (
            <>
              , <em className="aura-accent">{accent}</em>
            </>
          ) : null}
        </h1>
        {intro ? <p className="mt-2 max-w-2xl text-[15px] leading-[22px] text-foreground-muted">{intro}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("aura-card aura-rise", className)}>{children}</div>;
}

export function Stat({
  label: text,
  value,
  href,
  index = 0,
}: {
  label: string;
  value: number | string;
  href?: string;
  /** Position in its row: drives the 40ms stagger. */
  index?: number;
}) {
  const style = { "--i": index } as React.CSSProperties;
  const body = (
    <>
      <span className="aura-stat-glow" aria-hidden />
      <p className="aura-overline">{text}</p>
      <p className="aura-stat-value">{typeof value === "number" ? <CountUp value={value} /> : value}</p>
      {href ? (
        <span className="aura-stat-foot">
          Open
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            aria-hidden
          >
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      ) : null}
    </>
  );
  return href ? (
    <Link href={href} className="aura-card aura-rise aura-stat aura-press" style={style}>
      {body}
    </Link>
  ) : (
    <div className="aura-card aura-rise aura-stat" style={style}>
      {body}
    </div>
  );
}

/* Status colours: Pale Blue for new things, blues for work in progress, RAG green/red for outcomes
   (the brand's only permitted exception to the eight-colour palette, used for status cells only). */
const tones: Record<string, string> = {
  new: "aura-badge--new",
  open: "aura-badge--new",
  active: "aura-badge--new",
  you: "aura-badge--new",
  contacted: "aura-badge--work",
  screening: "aura-badge--work",
  qualified: "aura-badge--strong",
  interview: "aura-badge--strong",
  offer: "aura-badge--strong",
  won: "aura-badge--green",
  hired: "aura-badge--green",
  lost: "aura-badge--red",
  rejected: "aura-badge--red",
  spam: "aura-badge--red",
  closed: "",
  off: "",
};
export function Badge({ children }: { children: string }) {
  return <span className={cn("aura-badge", tones[children])}>{children}</span>;
}

export function Table({ head, children, empty }: { head: ReactNode[]; children: ReactNode; empty?: boolean }) {
  return (
    <div className="aura-table-wrap aura-rise">
      <table className="aura-table">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {empty ? (
            <tr>
              <td colSpan={head.length} className="px-4 py-14 text-center text-foreground-muted">
                <span className="aura-tile aura-tile--soft mx-auto mb-3" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-6l-2 3h-4l-2-3H2" strokeLinecap="round" strokeLinejoin="round" />
                    <path
                      d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="block text-[15px]">Nothing here yet.</span>
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

export const td = "aura-td";

export function Field({ label: text, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className={label}>
      {text}
      {children}
      {hint ? <span className="mt-1.5 block text-[13px] font-normal text-foreground-muted">{hint}</span> : null}
    </label>
  );
}

export function Notice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "ok" | "warn" }) {
  return (
    <div
      role="status"
      className={cn("aura-notice", tone === "ok" && "aura-notice--ok", tone === "warn" && "aura-notice--warn")}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
        className="mt-px shrink-0"
      >
        {tone === "ok" ? (
          <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        ) : tone === "warn" ? (
          <>
            <path
              d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
              strokeLinejoin="round"
            />
            <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
          </>
        )}
      </svg>
      <span>{children}</span>
    </div>
  );
}

export function Pager({ page, hasMore, base }: { page: number; hasMore: boolean; base: string }) {
  if (page <= 1 && !hasMore) return null;
  const href = (p: number) => `${base}${base.includes("?") ? "&" : "?"}page=${p}`;
  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      {page > 1 ? (
        <Link href={href(page - 1)} className={`${secondaryBtn} aura-btn--sm`}>
          Previous
        </Link>
      ) : (
        <span />
      )}
      <span className="text-foreground-muted">Page {page}</span>
      {hasMore ? (
        <Link href={href(page + 1)} className={`${secondaryBtn} aura-btn--sm`}>
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
