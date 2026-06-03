import type { ReactNode } from "react";

type StatusTone = "success" | "error" | "info";

const toneClasses: Record<StatusTone, string> = {
  success: "border-sage-200 bg-sage-100 text-noble-green-800",
  error: "border-earth-200 bg-earth-200/35 text-earth-700",
  info: "border-border-soft bg-cream text-noble-green-700",
};

export function StatusMessage({
  tone = "info",
  children,
}: {
  tone?: StatusTone;
  children: ReactNode;
}) {
  return (
    <div
      className={[
        "rounded-md border px-4 py-3 text-sm font-medium leading-6",
        toneClasses[tone],
      ].join(" ")}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}
