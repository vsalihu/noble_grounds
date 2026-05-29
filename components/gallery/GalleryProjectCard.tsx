import { MapPin } from "lucide-react";
import { GalleryComparisonCard } from "@/components/gallery/GalleryComparisonCard";
import { GlassCard } from "@/components/ui/GlassCard";
import type { GalleryProjectWithComparisons } from "@/types/supabase";

export function GalleryProjectCard({
  project,
}: {
  project: GalleryProjectWithComparisons;
}) {
  return (
    <GlassCard className="overflow-hidden p-5 md:p-7">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          {project.is_featured ? (
            <span className="rounded-md bg-sage-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-noble-green-800">
              Featured project
            </span>
          ) : null}
          {project.customer_type ? (
            <span className="rounded-md border border-border-soft bg-cream px-3 py-1 text-xs font-semibold text-noble-green-700">
              {project.customer_type}
            </span>
          ) : null}
        </div>

        <h2 className="mt-4 font-serif text-4xl font-semibold text-noble-green-950">
          {project.title}
        </h2>

        <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-sage-700">
          <MapPin className="size-4" />
          {project.address}
          {project.location ? ` / ${project.location}` : ""}
        </p>

        {project.description ? (
          <p className="mt-4 max-w-2xl text-sm leading-7 text-noble-green-700">
            {project.description}
          </p>
        ) : null}
      </div>

      <div className="mt-7">
        {project.gallery_comparisons.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {project.gallery_comparisons.map((comparison) => (
              <GalleryComparisonCard
                key={comparison.id}
                comparison={comparison}
                project={project}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-border-soft bg-cream p-4 text-sm text-noble-green-700">
            No before/after pairs added to this project yet.
          </div>
        )}
      </div>
    </GlassCard>
  );
}
