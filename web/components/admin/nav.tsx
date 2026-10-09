"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Briefcase,
  CircleHelp,
  FileText,
  Images,
  LayoutDashboard,
  LayoutTemplate,
  MessagesSquare,
  Paintbrush,
  PanelsTopLeft,
  Settings,
  UserCog,
  UserRoundSearch,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Section } from "@/lib/admin/permissions";

const ICONS: Record<Section, LucideIcon> = {
  dashboard: LayoutDashboard,
  leads: Users,
  applications: UserRoundSearch,
  openings: Briefcase,
  chats: MessagesSquare,
  site: Paintbrush,
  builder: LayoutTemplate,
  content: FileText,
  media: Images,
  assistant: Bot,
  faqs: CircleHelp,
  settings: Settings,
  pages: PanelsTopLeft,
  users: UserCog,
};

export type NavItem = { key: Section; label: string; href: string; group: string };

function isCurrent(pathname: string, href: string) {
  if (href === "/admin/") return pathname === "/admin" || pathname === "/admin/";
  return pathname === href || pathname.startsWith(href);
}

/** The sections this role may open: a glass sidebar with icon tiles on desktop, a floating pill on phones. */
export function AdminNav({
  items,
  variant,
  groups = [],
}: {
  items: NavItem[];
  variant: "side" | "pill";
  /** The menu's groups in order (sidebar only): Overview, Customers, Hiring, Website… */
  groups?: { key: string; label: string }[];
}) {
  const pathname = usePathname() ?? "";
  if (variant === "pill") {
    return (
      <nav aria-label="Admin" className="admin-pill aura-glass">
        {items.map((item) => {
          const Icon = ICONS[item.key];
          return (
            <Link key={item.key} href={item.href} aria-current={isCurrent(pathname, item.href) ? "page" : undefined}>
              <Icon strokeWidth={1.9} aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }
  // The sidebar, in groups, each under its section label (the AURA overline). Items keep one running
  // index, so the entrance still staggers down the whole menu.
  let i = 0;
  const grouped = groups.length ? groups : [{ key: "", label: "" }];
  return (
    <nav aria-label="Admin">
      {grouped.map((g) => {
        const inGroup = groups.length ? items.filter((item) => item.group === g.key) : items;
        if (!inGroup.length) return null;
        return (
          <div key={g.key} className="admin-nav-group">
            {g.label && g.key !== "overview" ? <p className="aura-overline admin-nav-label">{g.label}</p> : null}
            <div className="space-y-0.5">
              {inGroup.map((item) => {
                const Icon = ICONS[item.key];
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                    className="admin-nav-item aura-rise"
                    style={{ "--i": i++ } as React.CSSProperties}
                  >
                    <span className="aura-tile">
                      <Icon size={18} strokeWidth={2} aria-hidden />
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
