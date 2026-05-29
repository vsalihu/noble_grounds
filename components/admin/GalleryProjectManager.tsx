"use client";

import { useState } from "react";
import { ImagePlus, Pencil, Trash2 } from "lucide-react";
import { GalleryComparisonForm } from "@/components/admin/GalleryComparisonForm";
import { GalleryComparisonManager } from "@/components/admin/GalleryComparisonManager";
import { GalleryProjectForm } from "@/components/admin/GalleryProjectForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { galleryBucket } from "@/lib/gallery";
import { supabase } from "@/lib/supabase/client";
import type { GalleryProject, GalleryProjectWithComparisons } from "@/types/supabase";

type GalleryProjectManagerProps = {
  projects: GalleryProjectWithComparisons[];
  selectedProjectId: string | null;
  onSelectProject: (projectId: string) => void;
  onChanged: () => Promise<void>;
};

export function GalleryProjectManager({
  projects,
  selectedProjectId,
  onSelectProject,
  onChanged,
}: GalleryProjectManagerProps) {
  const [editingProject, setEditingProject] = useState<GalleryProject | null>(null);
  const [mode, setMode] = useState<"upload" | "manage">("upload");
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) ?? projects[0] ?? null;

  async function deleteProject(project: GalleryProjectWithComparisons) {
    if (!supabase) {
      setError("Supabase is not configured yet.");
      return;
    }

    if (!window.confirm(`Delete "${project.title}" and every before/after pair?`)) {
      return;
    }

    setDeletingProjectId(project.id);
    setError("");

    const paths = project.gallery_comparisons.flatMap((comparison) => [
      comparison.before_storage_path,
      comparison.after_storage_path,
    ]);

    if (paths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from(galleryBucket)
        .remove(paths);

      if (storageError) {
        setError(storageError.message);
        setDeletingProjectId(null);
        return;
      }
    }

    const { error: deleteError } = await supabase
      .from("gallery_projects")
      .delete()
      .eq("id", project.id);

    if (deleteError) {
      setError(deleteError.message);
      setDeletingProjectId(null);
      return;
    }

    setDeletingProjectId(null);
    await onChanged();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Card className="p-5 md:p-6">
        <h2 className="font-serif text-4xl font-semibold text-noble-green-950">
          Project sections
        </h2>
        <p className="mt-3 text-sm leading-7 text-noble-green-700">
          Step 1: create or select the address/project. Step 2: upload a
          before/after pair. Step 3: manage or replace pairs.
        </p>

        {error ? (
          <div className="mt-5 rounded-md border border-earth-200 bg-earth-200/35 px-4 py-3 text-sm font-medium text-earth-700" role="alert">
            {error}
          </div>
        ) : null}

        <div className="mt-6 grid gap-4">
          {projects.length === 0 ? (
            <div className="rounded-md border border-border-soft bg-cream p-4 text-sm text-noble-green-700">
              No projects yet. Create the first project/address section.
            </div>
          ) : null}

          {projects.map((project) => {
            const isSelected = selectedProject?.id === project.id;

            return (
              <div
                key={project.id}
                className={`rounded-lg border p-4 transition ${
                  isSelected ? "border-sage-500 bg-sage-100/50" : "border-border-soft bg-ivory"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-3xl font-semibold text-noble-green-950">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-sm text-noble-green-700">
                      {project.address}
                      {project.location ? ` / ${project.location}` : ""}
                    </p>
                    <p className="mt-2 text-sm text-sage-700">
                      {project.customer_type ?? "No type"} /{" "}
                      {project.gallery_comparisons.length} comparison
                      {project.gallery_comparisons.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  {project.is_featured ? (
                    <span className="rounded-md bg-sage-100 px-2 py-1 text-xs font-semibold text-noble-green-800">
                      Featured
                    </span>
                  ) : null}
                </div>
                <div className="mt-4 grid gap-2 min-[430px]:grid-cols-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      onSelectProject(project.id);
                      setMode("upload");
                    }}
                  >
                    <ImagePlus className="mr-2 size-4" />
                    Add pair
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      onSelectProject(project.id);
                      setMode("manage");
                    }}
                  >
                    Manage pairs
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setEditingProject(project)}
                  >
                    <Pencil className="mr-2 size-4" />
                    Edit project
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => void deleteProject(project)}
                    disabled={deletingProjectId === project.id}
                  >
                    <Trash2 className="mr-2 size-4" />
                    {deletingProjectId === project.id ? "Deleting" : "Delete project"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-6">
        <Card className="p-5 md:p-6">
          <h2 className="font-serif text-4xl font-semibold text-noble-green-950">
            {editingProject ? "Edit project" : "Create project"}
          </h2>
          <div className="mt-6">
            <GalleryProjectForm
              key={editingProject?.id ?? "new-project"}
              project={editingProject}
              onSaved={async () => {
                setEditingProject(null);
                await onChanged();
              }}
              onCancel={editingProject ? () => setEditingProject(null) : undefined}
            />
          </div>
        </Card>

        <Card className="p-5 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-serif text-4xl font-semibold text-noble-green-950">
                Before/after pairs
              </h2>
              <p className="mt-3 text-sm leading-7 text-noble-green-700">
                {selectedProject
                  ? `Selected: ${selectedProject.title}`
                  : "Create a project before adding comparisons."}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={mode === "upload" ? "primary" : "secondary"}
                onClick={() => setMode("upload")}
              >
                Add
              </Button>
              <Button
                type="button"
                variant={mode === "manage" ? "primary" : "secondary"}
                onClick={() => setMode("manage")}
              >
                Manage
              </Button>
            </div>
          </div>

          <div className="mt-6">
            {!selectedProject ? (
              <div className="rounded-md border border-border-soft bg-cream p-4 text-sm text-noble-green-700">
                No project selected.
              </div>
            ) : mode === "upload" ? (
              <GalleryComparisonForm project={selectedProject} onSaved={onChanged} />
            ) : (
              <GalleryComparisonManager
                project={selectedProject}
                comparisons={selectedProject.gallery_comparisons}
                onChanged={onChanged}
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
