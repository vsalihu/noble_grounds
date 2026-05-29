"use client";

import { useState } from "react";
import { AdminActionBar } from "@/components/admin/AdminActionBar";
import { GalleryProjectForm } from "@/components/admin/GalleryProjectForm";
import { ProjectCard } from "@/components/admin/ProjectCard";
import { ProjectWorkspace } from "@/components/admin/ProjectWorkspace";
import { Card } from "@/components/ui/Card";
import { galleryBucket } from "@/lib/gallery";
import { supabase } from "@/lib/supabase/client";
import type { GalleryProjectWithComparisons } from "@/types/supabase";

type GalleryProjectManagerProps = {
  projects: GalleryProjectWithComparisons[];
  selectedProjectId: string | null;
  onSelectProject: (projectId: string | null) => void;
  onChanged: () => Promise<void>;
};

export function GalleryProjectManager({
  projects,
  selectedProjectId,
  onSelectProject,
  onChanged,
}: GalleryProjectManagerProps) {
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) ?? null;

  async function deleteProject(project: GalleryProjectWithComparisons) {
    if (!supabase) {
      setError("Supabase is not configured yet.");
      return;
    }

    if (
      !window.confirm(
        `Delete "${project.title}"? This deletes every before/after pair in the project and removes the storage images.`,
      )
    ) {
      return;
    }

    setDeletingProjectId(project.id);
    setError("");
    setMessage("");

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

    if (selectedProjectId === project.id) {
      onSelectProject(null);
    }

    setDeletingProjectId(null);
    setMessage("Project deleted.");
    await onChanged();
  }

  if (selectedProject) {
    return (
      <ProjectWorkspace
        project={selectedProject}
        isDeleting={deletingProjectId === selectedProject.id}
        onClose={() => onSelectProject(null)}
        onDelete={() => void deleteProject(selectedProject)}
        onChanged={onChanged}
      />
    );
  }

  return (
    <div className="grid gap-6">
      <AdminActionBar
        isAddingProject={isAddingProject}
        onAddProject={() => {
          setIsAddingProject((current) => !current);
          setMessage("");
          setError("");
        }}
        onManageProjects={() => {
          setIsAddingProject(false);
          onSelectProject(null);
        }}
        onRefresh={() => void onChanged()}
      />

      {error ? (
        <div className="rounded-md border border-earth-200 bg-earth-200/35 px-4 py-3 text-sm font-medium text-earth-700" role="alert">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="rounded-md border border-sage-200 bg-sage-100 px-4 py-3 text-sm font-medium text-noble-green-800" role="status">
          {message}
        </div>
      ) : null}

      {isAddingProject ? (
        <Card className="p-5 md:p-6">
          <h2 className="font-serif text-4xl font-semibold text-noble-green-950">
            Add project
          </h2>
          <p className="mt-3 text-sm leading-7 text-noble-green-700">
            Create the address or project section first. You will add before/after
            pairs after opening the project.
          </p>
          <div className="mt-6">
            <GalleryProjectForm
              onSaved={async () => {
                setIsAddingProject(false);
                setMessage("Project created. Open the project card to add photos.");
                await onChanged();
              }}
              onCancel={() => setIsAddingProject(false)}
            />
          </div>
        </Card>
      ) : null}

      <section>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-serif text-4xl font-semibold text-noble-green-950">
              Projects
            </h2>
            <p className="mt-2 text-sm leading-7 text-noble-green-700">
              Open one project to upload, reorder, edit, or delete its before/after pairs.
            </p>
          </div>
          <p className="text-sm font-semibold text-sage-700">
            {projects.length} project{projects.length === 1 ? "" : "s"}
          </p>
        </div>

        {projects.length === 0 ? (
          <Card className="mt-5 p-5 text-sm leading-7 text-noble-green-700">
            No projects yet. Use Add Project to create the first gallery section.
          </Card>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isDeleting={deletingProjectId === project.id}
                onOpen={() => onSelectProject(project.id)}
                onDelete={() => void deleteProject(project)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
