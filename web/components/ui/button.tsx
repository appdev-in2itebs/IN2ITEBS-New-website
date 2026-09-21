import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "on-dark";

const base =
  "group inline-flex min-h-12 items-center justify-center gap-4 rounded-full px-6 py-3 text-sm font-semibold tracking-[-0.01em] transition-[transform,background-color,color,box-shadow,border-color] duration-200 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2";

const variants: Record<Variant, string> = {
  primary:
    "btn-shimmer bg-action text-on-action shadow-glass hover:bg-action-hover hover:-translate-y-px hover:shadow-glass-hover focus-visible:ring-offset-surface",
  secondary:
    "glass text-foreground hover:border-action/40 hover:text-action hover:-translate-y-px focus-visible:ring-offset-surface",
  ghost: "text-foreground hover:bg-surface-subtle hover:text-action focus-visible:ring-offset-surface",
  "on-dark":
    "bg-on-brand text-brand shadow-glass hover:bg-brand-muted hover:-translate-y-px focus-visible:ring-brand-muted focus-visible:ring-offset-brand",
};

export function Button({
  children,
  href,
  variant = "primary",
  withArrow = false,
  className,
  external,
}: {
  children: ReactNode;
  href: string;
  variant?: Variant;
  withArrow?: boolean;
  className?: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <span>{children}</span>
      {withArrow ? (
        <ArrowUpRight
          size={16}
          strokeWidth={1.6}
          className="transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      ) : null}
    </>
  );
  const cls = cn(base, variants[variant], className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
