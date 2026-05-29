import type { HTMLAttributes } from "react";

export type GlassCardProps = HTMLAttributes<HTMLDivElement>;

export function GlassCard({ className = "", ...props }: GlassCardProps) {
  return (
    <div
      className={[
        "rounded-2xl border border-ivory/55 bg-ivory/72 shadow-[0_26px_80px_rgb(18_50_38_/_0.12)] backdrop-blur-xl",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
