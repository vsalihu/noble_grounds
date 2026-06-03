export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "overflow-hidden rounded-2xl border border-border-soft bg-ivory p-5 shadow-[var(--shadow-soft)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      <div className="h-4 w-24 animate-pulse rounded-full bg-sage-200" />
      <div className="mt-5 h-8 w-2/3 animate-pulse rounded-md bg-sage-100" />
      <div className="mt-4 grid gap-2">
        <div className="h-3 animate-pulse rounded-full bg-sage-100" />
        <div className="h-3 w-4/5 animate-pulse rounded-full bg-sage-100" />
      </div>
    </div>
  );
}
