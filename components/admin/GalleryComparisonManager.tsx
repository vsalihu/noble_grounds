"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ChevronsUp, Pencil, Trash2 } from "lucide-react";
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
  const [orderingId, setOrderingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const sortedComparisons = [...comparisons].sort((a, b) => {
    if (a.display_order !== b.display_order) {
      return a.display_order - b.display_order;
    }

    return b.created_at.localeCompare(a.created_at);
  });

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

  async function updateComparisonOrder(
    comparison: GalleryComparison,
    displayOrder: number,
  ) {
    if (!supabase) {
      setError("Supabase is not configured yet.");
      return;
    }

    setOrderingId(comparison.id);
    setError("");

    const updateError = await saveComparisonOrder(comparison.id, displayOrder);

    if (updateError) {
      setError(updateError.message);
      setOrderingId(null);
      return;
    }

    setOrderingId(null);
    await onChanged();
  }

  async function moveComparison(comparison: GalleryComparison, direction: "up" | "down") {
    const currentIndex = sortedComparisons.findIndex((item) => item.id === comparison.id);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const target = sortedComparisons[targetIndex];

    if (!target) {
      return;
    }

    if (!supabase) {
      setError("Supabase is not configured yet.");
      return;
    }

    setOrderingId(comparison.id);
    setError("");

    const firstError = await saveComparisonOrder(comparison.id, target.display_order);
    const secondError = await saveComparisonOrder(target.id, comparison.display_order);

    if (firstError || secondError) {
      setError(firstError?.message ?? secondError?.message ?? "Could not update order.");
      setOrderingId(null);
      return;
    }

    setOrderingId(null);
    await onChanged();
  }

  async function saveComparisonOrder(comparisonId: string, displayOrder: number) {
    if (!supabase) {
      return { message: "Supabase is not configured yet." };
    }

    const { error: updateError } = await supabase
      .from("gallery_comparisons")
      .update({ display_order: displayOrder })
      .eq("id", comparisonId);

    return updateError;
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
        {sortedComparisons.map((comparison, index) => (
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
                  <p className="mt-1 text-sm font-semibold text-sage-700">
                    Display order: {comparison.display_order}
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
                  onClick={() => void updateComparisonOrder(comparison, -999)}
                  disabled={orderingId === comparison.id || index === 0}
                >
                  <ChevronsUp className="mr-2 size-4" />
                  Set first
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => void moveComparison(comparison, "up")}
                  disabled={orderingId === comparison.id || index === 0}
                >
                  <ArrowUp className="mr-2 size-4" />
                  Move up
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => void moveComparison(comparison, "down")}
                  disabled={
                    orderingId === comparison.id ||
                    index === sortedComparisons.length - 1
                  }
                >
                  <ArrowDown className="mr-2 size-4" />
                  Move down
                </Button>
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
