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

export type NavItem = { key: Section; label: string; href: string };

function isCurrent(pathname: string, href: string) {
  if (href === "/admin/") return pathname === "/admin" || pathname === "/admin/";
  return pathname === href || pathname.startsWith(href);
}

/** The sections this role may open: a glass sidebar with icon tiles on desktop, a floating pill on phones. */
export function AdminNav({ items, variant }: { items: NavItem[]; variant: "side" | "pill" }) {
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
  return (
    <nav aria-label="Admin" className="space-y-0.5">
      {items.map((item, i) => {
        const Icon = ICONS[item.key];
        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
            className="admin-nav-item aura-rise"
            style={{ "--i": i } as React.CSSProperties}
          >
            <span className="aura-tile">
              <Icon size={18} strokeWidth={2} aria-hidden />
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
