"use client";

import { useMemo, useState } from "react";
import type { GalleryProjectWithComparisons } from "@/types/supabase";
import { GalleryProjectCard } from "@/components/gallery/GalleryProjectCard";

const filters = ["All", "Residential", "Landlord", "Business", "Estate Agent"];

export function GalleryProjectGrid({
  projects,
}: {
  projects: GalleryProjectWithComparisons[];
}) {
  const [activeFilter, setActiveFilter] = useState("All");
  const visibleProjects = useMemo(
    () =>
      activeFilter === "All"
        ? projects
        : projects.filter((project) => project.customer_type === activeFilter),
    [activeFilter, projects],
  );

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-3">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`min-h-11 shrink-0 rounded-md border px-4 text-sm font-semibold transition ${
              activeFilter === filter
                ? "border-sage-500 bg-noble-green-800 text-ivory"
                : "border-border-soft bg-ivory text-noble-green-800"
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-8">
        {visibleProjects.map((project) => (
          <GalleryProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
