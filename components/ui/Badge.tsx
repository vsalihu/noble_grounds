import type { HTMLAttributes, ReactNode } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  icon?: ReactNode;
};

export function Badge({ children, className = "", icon, ...props }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex min-h-9 items-center gap-2 rounded-md border border-sage-200 bg-sage-200/55 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-noble-green-800",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}
