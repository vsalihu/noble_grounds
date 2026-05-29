"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { GalleryComparisonForm } from "@/components/admin/GalleryComparisonForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { deleteGalleryComparison } from "@/lib/gallery";
import { supabase } from "@/lib/supabase/client";
import type { GalleryComparison, GalleryProject } from "@/types/supabase";

type GalleryComparisonManagerProps = {
  project: GalleryProject;
  comparisons: GalleryComparison[];
  onChanged: () => Promise<void>;
};

export function GalleryComparisonManager({
  project,
  comparisons,
  onChanged,
}: GalleryComparisonManagerProps) {
  const [editing, setEditing] = useState<GalleryComparison | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleDelete(comparison: GalleryComparison) {
    if (!supabase) {
      setError("Supabase is not configured yet.");
      return;
    }

    if (!window.confirm("Delete this before/after pair? This removes both images.")) {
      return;
    }

    setDeletingId(comparison.id);
    setError("");

    const result = await deleteGalleryComparison(supabase, comparison);

    if (result.error) {
      setError(result.error);
      setDeletingId(null);
      return;
    }

    setDeletingId(null);
    await onChanged();
  }

  if (editing) {
    return (
      <GalleryComparisonForm
        project={project}
        comparison={editing}
        onSaved={async () => {
          setEditing(null);
          await onChanged();
        }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="grid gap-5">
      {error ? (
        <div className="rounded-md border border-earth-200 bg-earth-200/35 px-4 py-3 text-sm font-medium text-earth-700" role="alert">
          {error}
        </div>
      ) : null}

      {comparisons.length === 0 ? (
        <div className="rounded-md border border-border-soft bg-cream p-4 text-sm text-noble-green-700">
          No before/after pairs in this project yet.
        </div>
      ) : null}

      <div className="grid gap-4">
        {comparisons.map((comparison) => (
          <Card key={comparison.id} className="overflow-hidden p-0">
            <div className="grid grid-cols-2 gap-px bg-border-soft">
              <ComparisonThumb src={comparison.before_image_url} alt="Before image" label="Before" />
              <ComparisonThumb src={comparison.after_image_url} alt="After image" label="After" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-serif text-2xl font-semibold text-noble-green-950">
                    {comparison.title || "Untitled comparison"}
                  </h4>
                  <p className="mt-1 text-sm text-noble-green-700">
                    {comparison.location || project.address}
                  </p>
                </div>
                {comparison.is_featured ? (
                  <span className="rounded-md bg-sage-100 px-2 py-1 text-xs font-semibold text-noble-green-800">
                    Featured
                  </span>
                ) : null}
              </div>
              {comparison.description ? (
                <p className="mt-3 text-sm leading-6 text-noble-green-700">
                  {comparison.description}
                </p>
              ) : null}
              <div className="mt-4 grid gap-2 min-[430px]:grid-cols-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditing(comparison)}
                >
                  <Pencil className="mr-2 size-4" />
                  Edit / replace
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => void handleDelete(comparison)}
                  disabled={deletingId === comparison.id}
                >
                  <Trash2 className="mr-2 size-4" />
                  {deletingId === comparison.id ? "Deleting" : "Delete pair"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ComparisonThumb({
  src,
  alt,
  label,
}: {
  src: string;
  alt: string;
  label: string;
}) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-sage-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-cover" />
      <span className="absolute left-3 top-3 rounded-md bg-ivory/90 px-2 py-1 text-xs font-semibold text-noble-green-900 shadow-soft">
        {label}
      </span>
    </div>
  );
}
