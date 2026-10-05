import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { SECTIONS, can, type Section } from "@/lib/admin/permissions";
import type { AdminUser } from "@/lib/admin/session";
import { signOut } from "@/app/admin/login/actions";

/** The admin portal frame: a navy sidebar with the sections this role may open, and the page. */
export function AdminShell({ admin, children }: { admin: AdminUser; children: ReactNode }) {
  const sections = (Object.keys(SECTIONS) as Section[]).filter((s) => can(admin.role, s));
  return (
    <div className="flex min-h-svh bg-canvas">
      <aside className="theme-on-brand hidden w-60 shrink-0 flex-col bg-brand text-on-brand md:flex">
        <Link href="/admin/" className="flex items-center gap-2 px-5 py-5">
          <Image src="/brand/in2it-ebs-white.svg" alt="In2IT EBS" width={120} height={30} className="h-7 w-auto" />
          <span className="text-xs font-semibold uppercase tracking-wider text-on-brand/70">Admin</span>
        </Link>
        <nav aria-label="Admin" className="flex-1 space-y-0.5 px-3">
          {sections.map((s) => (
            <Link
              key={s}
              href={SECTIONS[s].href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-on-brand/80 hover:bg-on-brand/10 hover:text-on-brand"
            >
              {SECTIONS[s].label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-on-brand/15 px-5 py-4 text-xs">
          <p className="truncate font-semibold">{admin.name || admin.email}</p>
          <p className="capitalize text-on-brand/70">{admin.role}</p>
          <div className="mt-3 flex gap-3">
            <Link href="/" className="underline-offset-2 hover:underline" target="_blank">
              View site
            </Link>
            <form action={signOut}>
              <button type="submit" className="underline-offset-2 hover:underline">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Phones: the same sections as a scrolling strip. */}
        <nav aria-label="Admin" className="theme-on-brand flex gap-1 overflow-x-auto bg-brand px-3 py-2 md:hidden">
          {sections.map((s) => (
            <Link
              key={s}
              href={SECTIONS[s].href}
              className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-on-brand/80"
            >
              {SECTIONS[s].label}
            </Link>
          ))}
          <form action={signOut}>
            <button type="submit" className="shrink-0 px-3 py-1.5 text-xs text-on-brand/80">
              Sign out
            </button>
          </form>
        </nav>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
