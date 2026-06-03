import { Loader2 } from "lucide-react";

export function LoadingSpinner({
  label = "Loading",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={["flex items-center gap-3 text-sm font-semibold text-noble-green-800", className]
        .filter(Boolean)
        .join(" ")}
      role="status"
    >
      <Loader2 className="size-4 animate-spin text-sage-700" />
      <span>{label}</span>
    </div>
  );
}
