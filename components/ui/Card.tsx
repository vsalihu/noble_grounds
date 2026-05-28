import type { HTMLAttributes } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={[
        "rounded-lg border border-border-soft bg-surface shadow-[0_18px_50px_rgb(22_38_30_/_0.08)] transition duration-200 ease-out",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
