"use client";

import { FolderOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { GalleryProjectWithComparisons } from "@/types/supabase";

type ProjectCardProps = {
  project: GalleryProjectWithComparisons;
  isDeleting: boolean;
  onOpen: () => void;
  onDelete: () => void;
};

export function ProjectCard({
  project,
  isDeleting,
  onOpen,
  onDelete,
}: ProjectCardProps) {
  return (
    <Card className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-3xl font-semibold text-noble-green-950">
            {project.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-noble-green-700">
            {project.address}
            {project.location ? ` / ${project.location}` : ""}
          </p>
        </div>
        {project.is_featured ? (
          <span className="rounded-md bg-sage-100 px-2 py-1 text-xs font-semibold text-noble-green-800">
            Featured
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-sage-700">
        <span className="rounded-md border border-border-soft bg-cream px-3 py-1">
          {project.customer_type || "No type"}
        </span>
        <span className="rounded-md border border-border-soft bg-cream px-3 py-1">
          {project.gallery_comparisons.length} pair
          {project.gallery_comparisons.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-auto grid gap-2 pt-5">
        <Button type="button" onClick={onOpen}>
          <FolderOpen className="mr-2 size-4" />
          Open Project
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={onDelete}
          disabled={isDeleting}
        >
          <Trash2 className="mr-2 size-4" />
          {isDeleting ? "Deleting" : "Delete Project"}
        </Button>
      </div>
    </Card>
  );
}
