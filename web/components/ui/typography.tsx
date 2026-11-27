import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Letter-spaced caps category label (e.g. "AT A GLANCE"). */
export function Eyebrow({
  children,
  className,
  onDark,
}: {
  children: ReactNode;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span className={cn("label-caps inline-block", onDark ? "text-gold-on-brand" : "text-gold", className)}>
      {children}
    </span>
  );
}

/** Newsreader italic accent word inside a headline. */
export function Accent({ children }: { children: ReactNode }) {
  return <em className="accent">{children}</em>;
}

/** Display / heading text in Newsreader. Pass an accent via <Accent> in children. */
export function Headline({
  children,
  level = 2,
  className,
  plain = false,
}: {
  children: ReactNode;
  level?: 1 | 2 | 3;
  className?: string;
  plain?: boolean;
}) {
  const sizes = { 1: "text-display", 2: "text-h2", 3: "text-h3" } as const;
  const Tag = `h${level}` as unknown as "h1";
  return (
    <Tag className={cn("font-display font-bold", sizes[level], plain && "heading-plain", className)}>{children}</Tag>
  );
}

export function Lead({ children, className, onDark }: { children: ReactNode; className?: string; onDark?: boolean }) {
  return (
    <p
      className={cn(
        "max-w-[70ch] text-lg leading-relaxed md:text-xl",
        onDark ? "text-brand-muted" : "text-foreground-muted",
        className,
      )}
    >
      {children}
    </p>
  );
}

/**
 * Eyebrow + headline + optional lead, composed.
 *
 * `split` (owner's review, 27 Nov 2026: no empty right half): on large screens the headline takes
 * the left of the row and the lead the right, bottom-aligned, so a section opens across the full
 * width instead of in a narrow column on the left. Below `lg` it stacks as before.
 */
export function SectionHeading({
  eyebrow,
  children,
  lead,
  className,
  onDark,
  level = 2,
  plain,
  split,
}: {
  eyebrow?: string;
  children: ReactNode;
  lead?: ReactNode;
  className?: string;
  onDark?: boolean;
  level?: 1 | 2 | 3;
  plain?: boolean;
  split?: boolean;
}) {
  if (split && lead) {
    return (
      <div className={cn("grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-x-12", className)}>
        <div className="flex flex-col gap-5 lg:col-span-7">
          {eyebrow ? <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow> : null}
          <Headline
            level={level}
            plain={plain}
            className={level === 3 ? (onDark ? "text-on-brand" : "text-foreground") : undefined}
          >
            {children}
          </Headline>
        </div>
        <div className="lg:col-span-5">
          <Lead onDark={onDark}>{lead}</Lead>
        </div>
      </div>
    );
  }
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {eyebrow ? <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow> : null}
      {/* h1/h2 take no colour: the site-wide `main h1, main h2` gradient paints them, and
          `.theme-on-brand` swaps in the on-brand gradient. Only h3 carries a colour role. */}
      <Headline
        level={level}
        plain={plain}
        className={level === 3 ? (onDark ? "text-on-brand" : "text-foreground") : undefined}
      >
        {children}
      </Headline>
      {lead ? <Lead onDark={onDark}>{lead}</Lead> : null}
    </div>
  );
}
