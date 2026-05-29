"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { GalleryComparisonForm } from "@/components/admin/GalleryComparisonForm";
import { GalleryComparisonManager } from "@/components/admin/GalleryComparisonManager";
import { GalleryProjectForm } from "@/components/admin/GalleryProjectForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { GalleryProjectWithComparisons } from "@/types/supabase";

type ProjectWorkspaceProps = {
  project: GalleryProjectWithComparisons;
  isDeleting: boolean;
  onClose: () => void;
  onDelete: () => void;
  onChanged: () => Promise<void>;
};

export function ProjectWorkspace({
  project,
  isDeleting,
  onClose,
  onDelete,
  onChanged,
}: ProjectWorkspaceProps) {
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [isAddingPair, setIsAddingPair] = useState(false);

  return (
    <div className="grid gap-6">
      <Card className="p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage-700">
              Open project
            </p>
            <h2 className="mt-2 font-serif text-5xl font-semibold text-noble-green-950">
              {project.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-noble-green-700">
              {project.address}
              {project.location ? ` / ${project.location}` : ""}
            </p>
            <p className="mt-2 text-sm font-semibold text-sage-700">
              {project.gallery_comparisons.length} before/after pair
              {project.gallery_comparisons.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="grid gap-2 min-[430px]:grid-cols-2 md:min-w-80">
            <Button type="button" variant="secondary" onClick={onClose}>
              <X className="mr-2 size-4" />
              Close Project
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditingProject((current) => !current)}
            >
              <Pencil className="mr-2 size-4" />
              Edit Details
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsAddingPair((current) => !current)}
            >
              <Plus className="mr-2 size-4" />
              Add Pair
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onDelete}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 size-4" />
              {isDeleting ? "Deleting" : "Delete Project"}
            </Button>
          </div>
        </div>
      </Card>

      {isEditingProject ? (
        <Card className="p-5 md:p-6">
          <h3 className="font-serif text-4xl font-semibold text-noble-green-950">
            Edit project details
          </h3>
          <div className="mt-6">
            <GalleryProjectForm
              project={project}
              onSaved={async () => {
                setIsEditingProject(false);
                await onChanged();
              }}
              onCancel={() => setIsEditingProject(false)}
            />
          </div>
        </Card>
      ) : null}

      {isAddingPair ? (
        <Card className="p-5 md:p-6">
          <h3 className="font-serif text-4xl font-semibold text-noble-green-950">
            Add before/after pair
          </h3>
          <p className="mt-3 text-sm leading-7 text-noble-green-700">
            Choose one before image and one after image. Text fields are optional.
          </p>
          <div className="mt-6">
            <GalleryComparisonForm
              project={project}
              onSaved={async () => {
                setIsAddingPair(false);
                await onChanged();
              }}
              onCancel={() => setIsAddingPair(false)}
            />
          </div>
        </Card>
      ) : null}

      <Card className="p-5 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="font-serif text-4xl font-semibold text-noble-green-950">
              Existing before/after pairs
            </h3>
            <p className="mt-3 text-sm leading-7 text-noble-green-700">
              Lower display order numbers appear first on the public gallery.
            </p>
          </div>
          <Button type="button" onClick={() => setIsAddingPair(true)}>
            <Plus className="mr-2 size-4" />
            Add Pair
          </Button>
        </div>
        <div className="mt-6">
          <GalleryComparisonManager
            project={project}
            comparisons={project.gallery_comparisons}
            onChanged={onChanged}
          />
        </div>
      </Card>
    </div>
  );
}
