"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { loadSiteConfig, type SiteConfig } from "@/components/chat/site-config";

const DISMISSED = "in2it-announcement-dismissed";

/**
 * The announcement an editor turns on in /admin/settings: a small card in the bottom-left corner, so
 * it never pushes the page or the fixed header around. Dismissing it hides that text for the visit.
 */
export function Announcement() {
  const [item, setItem] = useState<SiteConfig["announcement"] | null>(null);

  useEffect(() => {
    loadSiteConfig().then((c) => {
      const a = c?.announcement;
      if (!a?.enabled || !a.text) return;
      try {
        if (sessionStorage.getItem(DISMISSED) === a.text) return;
      } catch {}
      setItem(a);
    });
  }, []);

  if (!item) return null;
  return (
    <aside
      role="status"
      data-announcement
      className="fixed bottom-5 left-5 z-40 flex max-w-[min(360px,calc(100vw-7rem))] items-start gap-3 rounded-surface border border-border-subtle bg-surface px-4 py-3 text-sm shadow-glass"
    >
      <p className="text-foreground">
        {item.text}{" "}
        {item.linkUrl ? (
          <Link href={item.linkUrl} className="font-semibold text-action underline-offset-2 hover:underline">
            {item.linkLabel || "Learn more"}
          </Link>
        ) : null}
      </p>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => {
          try {
            sessionStorage.setItem(DISMISSED, item.text);
          } catch {}
          setItem(null);
        }}
        className="shrink-0 rounded-full p-1 text-foreground-muted hover:text-foreground"
      >
        <X size={16} aria-hidden />
      </button>
    </aside>
  );
}
