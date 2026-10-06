"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

/** "Share with someone": the phone's share sheet where there is one, otherwise copy the link. */
export function ShareJob({ title, className }: { title: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        const url = window.location.href.split("#")[0];
        try {
          if (navigator.share) {
            await navigator.share({ title, text: `${title} at In2IT EBS`, url });
            return;
          }
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch {}
      }}
    >
      {copied ? <Check size={16} aria-hidden /> : <Share2 size={16} aria-hidden />}
      {copied ? "Link copied" : "Share with someone"}
    </button>
  );
}
