import type { ReactNode } from "react";
import { Sprout } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <GlassCard className="p-6 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-sage-100 text-noble-green-800">
        <Sprout className="size-5" />
      </div>
      <h3 className="mt-5 font-serif text-3xl font-semibold text-noble-green-950">
        {title}
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-noble-green-700">
        {text}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </GlassCard>
  );
}
