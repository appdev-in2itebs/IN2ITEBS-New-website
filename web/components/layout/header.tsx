"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { primaryNav } from "@/content/nav";
import { serviceGroups, serviceMenuColumns } from "@/content/legacy-services";
import type { NavItem } from "@/content/types";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

/** The logo now carries "home", so the desktop row does not repeat it as a link. The full list,
 *  Home included, still drives the mobile drawer and the breadcrumb labels in lib/json-ld.ts. */
const desktopNav = primaryNav.filter((item) => item.href !== "/");

/**
 * Window event that opens the site drawer from outside the header: the homepage hero's hamburger
 * dispatches it before the first scroll, while the bar itself is still out of the way. The detail
 * carries the element focus returns to when the drawer closes.
 */
export const OPEN_MENU = "in2it:open-menu";

/**
 * How each dropdown lays out, after the existing in2itebs.com header (2026-09-19): Services is the
 * four-column mega-menu with group headings, Industries and Partners are full-width grids of
 * links, and About and Career are narrow lists under their own trigger.
 */
type MenuKind = "mega" | "grid-3" | "grid-4" | "list";
const menuKind: Record<string, MenuKind> = {
  Services: "mega",
  Industries: "grid-3",
  Partners: "grid-4",
};

export function Header() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const drawer = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  /** Where focus goes back to when the drawer was opened from the hero, and whether it was. */
  const returnFocus = useRef<HTMLElement | null>(null);
  const [heroMenu, setHeroMenu] = useState(false);
  useEffect(() => {
    const open = (event: Event) => {
      returnFocus.current = (event as CustomEvent<{ returnTo?: HTMLElement }>).detail?.returnTo ?? null;
      setHeroMenu(true);
      setMobileOpen(true);
    };
    window.addEventListener(OPEN_MENU, open);
    return () => window.removeEventListener(OPEN_MENU, open);
  }, []);
  const triggers = useRef<Record<string, HTMLAnchorElement | null>>({});
  // Hover-open menus: the trigger wrapper is stretched to the header row so the vertical path into
  // the panel never leaves it, and a diagonal path that does leave it gets a short grace timer;
  // re-entering the trigger or its panel cancels the close.
  const closeTimer = useRef<number | null>(null);
  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setExpanded(null), 160);
  };
  useEffect(
    () => () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    },
    [],
  );
  const close = () => {
    setExpanded(null);
    drawer.current?.close();
    setMobileOpen(false);
  };
  useEffect(() => {
    setExpanded(null);
    drawer.current?.close();
    setMobileOpen(false);
    setHeroMenu(false);
  }, [pathname]);
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setExpanded(null);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  useEffect(() => {
    if (!mobileOpen) return;
    drawer.current?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const mq = window.matchMedia("(min-width: 1280px)");
    const resize = () => {
      if (mq.matches) {
        drawer.current?.close();
        setMobileOpen(false);
      }
    };
    mq.addEventListener("change", resize);
    return () => {
      document.body.style.overflow = previousOverflow;
      mq.removeEventListener("change", resize);
    };
  }, [mobileOpen]);
  useEffect(() => {
    const el = header.current;
    if (!el) return;
    const update = () => {
      el.dataset.scrolled = String(window.scrollY > 20);
      // On the homepage the header stays out of the hero's way until the first scroll, then slides
      // in. `data-at-top` drives that; the CSS keeps it visible whenever something inside has focus,
      // so the keyboard can always reach the navigation.
      el.dataset.atTop = String(window.scrollY <= 20);
    };
    update();
    // The first application must not animate, or the bar paints and then slides away in front of
    // the visitor. `data-ready` turns the transition on one frame later, so only real scroll
    // changes animate. It is also why the hide keys off `data-at-top="true"` rather than the
    // attribute being absent: without JavaScript the attribute never appears and the bar stays put.
    // Two frames, not one: a single rAF still runs before the browser has painted the hidden
    // state, so the transition catches the change and the bar fades away in front of the visitor.
    // The second frame guarantees the hidden state is on screen before transitions are armed.
    let ready = 0;
    const arm = requestAnimationFrame(() => {
      ready = requestAnimationFrame(() => {
        el.dataset.ready = "true";
      });
    });
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(arm);
      cancelAnimationFrame(ready);
      window.removeEventListener("scroll", update);
    };
  }, []);
  return (
    <header
      ref={header}
      data-over-hero={pathname === "/" ? "true" : undefined}
      data-hero-menu={heroMenu && mobileOpen ? "true" : undefined}
      className="site-header fixed inset-x-0 top-0 z-40 bg-surface text-foreground shadow-sm data-[scrolled=true]:shadow-glass"
      onKeyDown={(event) => {
        if (event.key === "Escape" && expanded) {
          event.preventDefault();
          triggers.current[expanded]?.focus();
          setExpanded(null);
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setExpanded(null);
      }}
    >
      {/* Main Transparent Header Row */}
      <div className="container relative flex h-20 items-center justify-between gap-2 sm:gap-4 md:h-24">
        {/* Left Side: Circular Menu Button (Mobile/Tablet Only) + In2IT EBS Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            ref={opener}
            type="button"
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#F8FAFD] text-foreground shadow-md transition-transform hover:scale-105 xl:hidden"
          >
            <Menu size={20} className="sm:w-[22px] sm:h-[22px]" aria-hidden />
          </button>
          {/* The logo is the only "home" affordance now, so it carries the accessible name. */}
          <Link href="/" aria-label="In2IT EBS home" className="shrink-0 rounded-sm">
            <Logo priority asLink={false} variant="navy" className="h-8 w-auto sm:h-11" />
          </Link>
        </div>

        {/* Center: the flat navigation (Desktop Only) */}
        <div className="hidden items-center gap-4 self-stretch xl:flex">
          {/* Flat on the header's own white — no pill, no panel, nothing behind the links. The nav
              still spans the full row height so each trigger's hover area reaches the bottom of the
              header and a pointer travelling into the mega-menu never crosses dead space. */}
          <nav aria-label="Primary" className="flex h-full items-center gap-1.5">
            {desktopNav.map((item, index) => {
              const id = `desktop-nav-${index}`;
              const kind: MenuKind = menuKind[item.label] ?? "list";
              const active =
                item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(item.href);
              return (
                <div
                  key={item.label}
                  className={cn("flex items-center self-stretch", kind === "list" && "relative")}
                  onMouseEnter={() => {
                    if (!item.children) return;
                    cancelClose();
                    setExpanded(item.href);
                  }}
                  onMouseLeave={() => item.children && scheduleClose()}
                >
                  <Link
                    ref={(el) => {
                      if (item.children) triggers.current[item.href] = el;
                    }}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    aria-haspopup={item.children ? "true" : undefined}
                    aria-expanded={item.children ? expanded === item.href : undefined}
                    aria-controls={item.children ? id : undefined}
                    onFocus={() => setExpanded(item.children ? item.href : null)}
                    onKeyDown={(event) => {
                      if (!item.children || event.key !== "ArrowDown") return;
                      event.preventDefault();
                      setExpanded(item.href);
                      requestAnimationFrame(() => document.querySelector<HTMLElement>(`#${id} a[href]`)?.focus());
                    }}
                    className={cn(
                      "nav-link inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold transition-colors hover:text-action",
                      active && "text-action",
                    )}
                  >
                    {item.label}
                    {item.children ? (
                      <ChevronDown
                        aria-hidden
                        size={15}
                        className={`transition-transform ${expanded === item.href ? "rotate-180" : ""}`}
                      />
                    ) : null}
                  </Link>
                  {item.children && (
                    <div
                      id={id}
                      hidden={expanded !== item.href}
                      className={cn(
                        "glass-elevated absolute top-full max-h-[calc(100dvh-6.5rem)] overflow-y-auto border-t-0 [--glass-alpha-elevated:0.94]",
                        kind === "list"
                          ? "left-0 w-72 rounded-b-feature p-4"
                          : "inset-x-0 rounded-b-feature px-8 py-6 md:px-10",
                      )}
                    >
                      {kind === "mega" ? (
                        <MegaMenu onNavigate={close} />
                      ) : kind === "list" ? (
                        <LinkList items={item.children} onNavigate={close} />
                      ) : (
                        <LinkGrid items={item.children} columns={kind === "grid-4" ? 4 : 3} onNavigate={close} />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Right: the one call to action, in the site's action blue rather than the gold pill. */}
        <Link
          href="/contact/"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-action px-4 py-2 text-xs font-semibold text-on-action transition-colors hover:bg-action-hover sm:px-5 sm:text-sm"
        >
          Talk to us <span aria-hidden>↗</span>
        </Link>
      </div>
      <dialog
        ref={drawer}
        id="mobile-navigation"
        aria-labelledby="mobile-menu-title"
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const items = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              'a[href],button:not([disabled]),select:not([disabled]),input:not([disabled]),summary,[tabindex="0"]',
            ),
          ).filter((el) => el.getClientRects().length > 0);
          const first = items[0],
            last = items[items.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onClose={() => {
          setMobileOpen(false);
          setHeroMenu(false);
          const back = returnFocus.current;
          returnFocus.current = null;
          if (back?.isConnected && back.getClientRects().length) back.focus();
          else if (opener.current?.getClientRects().length) opener.current.focus();
        }}
        className="fixed inset-0 m-0 h-dvh max-h-dvh w-screen max-w-none overflow-y-auto bg-canvas p-5 text-foreground backdrop:bg-brand/60"
      >
        <div className="mb-5 flex items-center justify-between border-b border-border-subtle pb-4">
          <h2 id="mobile-menu-title" className="heading-plain text-xl font-semibold">
            Explore In2IT EBS
          </h2>
          <button
            autoFocus
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-control hover:bg-surface-subtle"
          >
            <X size={24} aria-hidden />
          </button>
        </div>
        <nav aria-label="Mobile">
          <MobileLinks items={primaryNav} onNavigate={close} />
        </nav>
        <div className="mt-6 flex flex-col gap-4 border-t border-border-subtle pt-5">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-foreground-muted">Direct Email</span>
            <a href="mailto:info@in2itebs.com" className="text-sm font-bold text-action hover:underline">
              info@in2itebs.com
            </a>
          </div>
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/contact/"
              onClick={close}
              className="glass-gold inline-flex items-center gap-1.5 px-5 py-2 text-sm font-bold rounded-full shadow-md hover:scale-105 transition-transform"
            >
              Talk to us <span aria-hidden>↗</span>
            </Link>
          </div>
        </div>
      </dialog>
    </header>
  );
}

/** One link row with the hairline the existing site draws under every dropdown item. */
function MenuLink({ item, onNavigate, className }: { item: NavItem; onNavigate: () => void; className?: string }) {
  return (
    <Link
      onClick={onNavigate}
      href={item.href}
      className={cn(
        "flex min-h-11 items-center justify-between gap-3 border-b border-border-subtle/70 py-2.5 text-[0.95rem] text-foreground-muted transition-colors hover:text-action",
        className,
      )}
    >
      {item.label}
    </Link>
  );
}

/** The narrow About / Career panel: one column of hairlined links. */
function LinkList({ items, onNavigate }: { items: NavItem[]; onNavigate: () => void }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.label}>
          <MenuLink item={item} onNavigate={onNavigate} className="last:border-b-0" />
        </li>
      ))}
    </ul>
  );
}

/** The Industries (three-up) and Partners (four-up) panels: a full-width grid of hairlined links. */
function LinkGrid({ items, columns, onNavigate }: { items: NavItem[]; columns: 3 | 4; onNavigate: () => void }) {
  return (
    <ul className={cn("grid gap-x-8", columns === 4 ? "grid-cols-4" : "grid-cols-3")}>
      {items.map((item) => (
        <li key={item.label}>
          <MenuLink item={item} onNavigate={onNavigate} className="text-base text-foreground" />
        </li>
      ))}
    </ul>
  );
}

/** Items inside a Services group; a nested item (Microsoft, Data Analytics & AI) indents its children. */
function GroupItems({ items, onNavigate, level = 0 }: { items: NavItem[]; onNavigate: () => void; level?: number }) {
  return (
    <ul className={cn(level > 0 && "ml-4")}>
      {items.map((item) => (
        <li key={item.label}>
          <Link
            onClick={onNavigate}
            href={item.href}
            className={cn(
              "flex min-h-9 items-center justify-between gap-3 py-1.5 text-[0.92rem] leading-snug transition-colors hover:text-action",
              item.children ? "font-semibold text-foreground" : "text-foreground-muted",
            )}
          >
            {item.label}
            {item.children ? <ChevronRight aria-hidden size={16} className="shrink-0 text-foreground-muted" /> : null}
          </Link>
          {item.children ? <GroupItems items={item.children} onNavigate={onNavigate} level={level + 1} /> : null}
        </li>
      ))}
    </ul>
  );
}

/** The Services mega-menu: four columns of group headings, each ruled off, with the group's items under it. */
function MegaMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-4 gap-x-8 gap-y-7">
      {serviceMenuColumns.map((column, index) => (
        <div key={index} className="space-y-7">
          {column.map((slug) => {
            const group = serviceGroups.find((candidate) => candidate.slug === slug);
            if (!group) return null;
            return (
              <div key={group.slug}>
                <Link
                  onClick={onNavigate}
                  href={group.href}
                  className="flex min-h-10 items-center border-b border-border-subtle pb-1.5 text-base font-semibold text-foreground transition-colors hover:text-action"
                >
                  {group.name}
                </Link>
                <div className="mt-2">
                  <GroupItems items={group.items} onNavigate={onNavigate} />
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function MobileLinks({ items, onNavigate, level = 0 }: { items: NavItem[]; onNavigate: () => void; level?: number }) {
  return (
    <ul className={cn("space-y-1", level > 0 && "ml-3 border-l border-border-subtle/60 pl-3.5 my-1.5 space-y-1")}>
      {items.map((item) => (
        <li key={item.label}>
          {item.children ? (
            <details className="group py-1" open={level === 0}>
              <summary className="flex min-h-11 cursor-pointer items-center justify-between py-2 text-base font-semibold text-foreground hover:text-action transition-colors list-none">
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className="hover:text-action transition-colors text-foreground font-semibold"
                >
                  {item.label}
                </Link>
                <ChevronDown
                  size={16}
                  className="text-foreground-muted group-open:rotate-180 transition-transform ml-2 shrink-0"
                />
              </summary>
              <div className="pb-1">
                <MobileLinks items={item.children} onNavigate={onNavigate} level={level + 1} />
              </div>
            </details>
          ) : (
            <Link
              href={item.href}
              onClick={onNavigate}
              className="inline-flex min-h-10 items-center text-sm font-medium text-foreground-muted hover:text-action transition-colors py-1"
            >
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
