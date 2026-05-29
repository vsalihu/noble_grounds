import type { ReactNode } from "react";

export function GradientBackground({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={["relative overflow-hidden", className].filter(Boolean).join(" ")}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgb(154_170_131_/_0.24),transparent_24rem),radial-gradient(circle_at_88%_22%,rgb(183_150_115_/_0.18),transparent_25rem),linear-gradient(180deg,#fbf8f1,#fffdf7_42%,#f2eadc)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.22] [background-image:linear-gradient(rgb(18_50_38_/_0.12)_1px,transparent_1px),linear-gradient(90deg,rgb(18_50_38_/_0.08)_1px,transparent_1px)] [background-size:46px_46px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}
