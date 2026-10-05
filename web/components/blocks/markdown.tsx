import Link from "next/link";
import type { ReactNode } from "react";
import { safeHref } from "@/lib/builder/blocks";
import { cn } from "@/lib/utils";

/**
 * The small text format of the Rich text block: "## " sub-headings, "- " bullet lists, blank lines
 * between paragraphs, **bold**, *italic* and [links](/path/). Turned into React elements, never
 * into HTML strings, so nothing an editor types can run as code.
 */
export function Markdown({ text, onDark = false }: { text: string; onDark?: boolean }) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n\s*\n/);
  const out: ReactNode[] = [];
  blocks.forEach((block, i) => {
    const lines = block.split("\n").filter((l) => l.trim());
    if (!lines.length) return;
    if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
      out.push(
        <ul key={i} className="mt-5 space-y-2.5">
          {lines.map((l, j) => (
            <li
              key={j}
              className={cn("flex gap-3 leading-relaxed", onDark ? "text-on-brand/80" : "text-foreground-muted")}
            >
              <span
                aria-hidden
                className={cn("mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full", onDark ? "bg-gold-on-brand" : "bg-gold")}
              />
              <span>{inline(l.replace(/^\s*[-*]\s+/, ""))}</span>
            </li>
          ))}
        </ul>,
      );
      return;
    }
    const h = lines[0].match(/^(#{2,3})\s+(.*)$/);
    if (h) {
      const Tag = h[1].length === 2 ? "h3" : "h4";
      out.push(
        <Tag key={`${i}h`} className={cn("mt-8 font-bold", Tag === "h3" ? "text-h3" : "text-lg")}>
          {inline(h[2])}
        </Tag>,
      );
      if (lines.length > 1) out.push(paragraph(`${i}p`, lines.slice(1), onDark));
      return;
    }
    out.push(paragraph(i, lines, onDark));
  });
  return <>{out}</>;
}

function paragraph(key: string | number, lines: string[], onDark: boolean) {
  return (
    <p
      key={key}
      className={cn("mt-5 max-w-[70ch] leading-relaxed", onDark ? "text-on-brand/85" : "text-foreground-muted")}
    >
      {lines.map((l, j) => (
        <span key={j}>
          {j ? <br /> : null}
          {inline(l)}
        </span>
      ))}
    </p>
  );
}

/** **bold**, *italic* and [text](link), in any order; anything else stays as typed. */
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={m.index}>{m[1]}</strong>);
    else if (m[2]) out.push(<em key={m.index}>{m[2]}</em>);
    else {
      const href = safeHref(m[4]);
      out.push(
        href ? (
          <Link
            key={m.index}
            href={href}
            className="font-semibold text-action underline decoration-gold/40 underline-offset-4 hover:decoration-gold"
          >
            {m[3]}
          </Link>
        ) : (
          m[3]
        ),
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
