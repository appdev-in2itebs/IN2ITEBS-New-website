import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ExternalLink, LogOut } from "lucide-react";
import { GROUPS, SECTIONS, can, type Section } from "@/lib/admin/permissions";
import type { AdminUser } from "@/lib/admin/session";
import { signOut } from "@/app/admin/login/actions";
import { AdminNav, type NavItem } from "./nav";

/** "Good morning" / "Good afternoon" / "Good evening" by the office clock (Asia/Kolkata). */
function greeting(now = new Date()) {
  const hour = Number(
    new Intl.DateTimeFormat("en-IN", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }).format(now),
  );
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

function initials(admin: AdminUser) {
  const source = admin.name?.trim() || admin.email;
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "A";
}

/**
 * The admin portal frame in the AURA language: a cinematic navy header band (official pale-blue
 * logo, greeting with the italic accent name, glass controls), a white panel rising over it with
 * 28px corners, a glass sidebar of icon tiles on desktop and a floating glass pill on phones.
 */
export function AdminShell({ admin, children }: { admin: AdminUser; children: ReactNode }) {
  // The menu: what this role may open, minus the parts reached from another page (Page heroes).
  const items: NavItem[] = (Object.keys(SECTIONS) as Section[])
    .filter((s) => can(admin.role, s) && !("menu" in SECTIONS[s] && SECTIONS[s].menu === false))
    .map((key) => ({ key, label: SECTIONS[key].label, href: SECTIONS[key].href, group: SECTIONS[key].group }));
  const groups = Object.entries(GROUPS).map(([key, label]) => ({ key, label }));
  const first = admin.name?.trim().split(/\s+/)[0];
  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  return (
    <div className="min-h-svh">
      <header className="admin-header">
        <div className="admin-header-row">
          <Link href="/admin/" className="admin-header-brand aura-rise">
            <Image src="/brand/in2it-ebs-logo-pale.png" alt="In2IT EBS" width={1364} height={425} priority />
            <span>Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="admin-who aura-rise" style={{ "--i": 1 } as React.CSSProperties}>
              <b>{admin.name || admin.email}</b>
              <small>{admin.role}</small>
            </div>
            <Link
              href="/"
              target="_blank"
              className="aura-glass-circle aura-press aura-rise"
              style={{ "--i": 2 } as React.CSSProperties}
              aria-label="View the website"
              title="View the website"
            >
              <ExternalLink size={19} strokeWidth={1.9} aria-hidden />
            </Link>
            <form action={signOut} className="aura-rise" style={{ "--i": 3 } as React.CSSProperties}>
              <button type="submit" className="aura-glass-circle aura-press" aria-label="Sign out" title="Sign out">
                <LogOut size={19} strokeWidth={1.9} aria-hidden />
              </button>
            </form>
            <span className="admin-avatar aura-rise" style={{ "--i": 4 } as React.CSSProperties} aria-hidden>
              {initials(admin)}
            </span>
          </div>
        </div>
        <div className="admin-greeting aura-rise" style={{ "--i": 2 } as React.CSSProperties}>
          <h2>
            {greeting()}
            {first ? (
              <>
                , <em>{first}</em>
              </>
            ) : null}
          </h2>
          <p>{today} · Converged Intelligence</p>
        </div>
      </header>

      <div className="admin-panel">
        <div className="admin-panel-inner">
          <aside className="admin-side aura-glass">
            <AdminNav items={items} variant="side" groups={groups} />
            <div className="admin-side-foot">
              <p className="truncate font-semibold text-foreground">{admin.name || admin.email}</p>
              <p className="capitalize">{admin.role}</p>
            </div>
          </aside>
          <main className="min-w-0">{children}</main>
        </div>
      </div>

      <AdminNav items={items} variant="pill" />
    </div>
  );
}
