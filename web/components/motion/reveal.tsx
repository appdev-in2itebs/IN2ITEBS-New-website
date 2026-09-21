import { Children, cloneElement, isValidElement, type CSSProperties, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Visible-first rendering: essential text never depends on hydration or an observer.
 *  The `reveal` hook only hides content after `html[data-motion-ready]` is set and
 *  never while motion is paused or reduced (see globals.css). */
export function Reveal({
  children,
  className,
  delay,
  repeat,
  as = "div",
}: {
  children: ReactNode;
  /** Seconds, matching the call sites; becomes the `--reveal-delay` transition delay. */
  delay?: number;
  /** Replay the entrance every time this comes back into view, not just the first time. */
  repeat?: boolean;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  const Tag: ElementType = as;
  return (
    <Tag
      className={cn("reveal", className)}
      data-reveal-repeat={repeat ? "" : undefined}
      style={delay ? ({ "--reveal-delay": `${Math.round(delay * 1000)}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}

type StaggerItemProps = { children: ReactNode; className?: string; index?: number; repeat?: boolean };

export function Stagger({
  children,
  className,
  repeat,
}: {
  children: ReactNode;
  className?: string;
  /** Replay every item's entrance whenever the group comes back into view. */
  repeat?: boolean;
}) {
  return (
    <div className={cn("stagger", className)}>
      {Children.map(children, (child, index) =>
        isValidElement<StaggerItemProps>(child) && child.type === StaggerItem
          ? cloneElement(child, { index, repeat })
          : child,
      )}
    </div>
  );
}

export function StaggerItem({ children, className, index = 0, repeat }: StaggerItemProps) {
  return (
    <div
      className={cn("reveal", className)}
      data-reveal-repeat={repeat ? "" : undefined}
      style={{ "--reveal-delay": `${Math.min(index, 8) * 70}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
