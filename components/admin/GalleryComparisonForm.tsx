"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { ImageUp, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  maxGalleryImageSize,
  updateGalleryComparison,
  uploadGalleryComparison,
} from "@/lib/gallery";
import { supabase } from "@/lib/supabase/client";
import type { GalleryComparison, GalleryProject } from "@/types/supabase";

type GalleryComparisonFormProps = {
  project: GalleryProject;
  comparison?: GalleryComparison | null;
  onSaved: () => Promise<void>;
  onCancel?: () => void;
};

const inputClass =
  "min-h-[3.25rem] w-full rounded-md border border-border-soft bg-ivory px-4 py-3 text-base text-noble-green-950 outline-none transition focus:border-sage-500 focus:bg-white";

export function GalleryComparisonForm({
  project,
  comparison,
  onSaved,
  onCancel,
}: GalleryComparisonFormProps) {
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [title, setTitle] = useState(comparison?.title ?? "");
  const [description, setDescription] = useState(comparison?.description ?? "");
  const [location, setLocation] = useState(
    comparison?.location ?? project.location ?? project.address ?? "",
  );
  const [altText, setAltText] = useState(comparison?.alt_text ?? "");
  const [isFeatured, setIsFeatured] = useState(comparison?.is_featured ?? false);
  const [displayOrder, setDisplayOrder] = useState(
    String(comparison?.display_order ?? 0),
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
    side: "before" | "after",
  ) {
    const file = event.target.files?.[0] ?? null;
    setError("");

    if (file && (!file.type.startsWith("image/") || file.size > maxGalleryImageSize)) {
      setError("Choose image files only, each under 5MB.");
      event.target.value = "";
      return;
    }

    if (side === "before") {
      setBeforeFile(file);
    } else {
      setAfterFile(file);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!supabase) {
      setError("Supabase is not configured yet.");
      return;
    }

    if (!comparison && (!beforeFile || !afterFile)) {
      setError("Choose both a before image and an after image.");
      return;
    }

    setIsSaving(true);

    const result = comparison
      ? await updateGalleryComparison(supabase, {
          comparison,
          beforeFile,
          afterFile,
          title,
          description,
          location,
          altText,
          isFeatured,
          displayOrder: Number(displayOrder) || 0,
        })
      : await uploadGalleryComparison(supabase, {
          projectId: project.id,
          beforeFile: beforeFile as File,
          afterFile: afterFile as File,
          title,
          description,
          location,
          altText,
          isFeatured,
          displayOrder: Number(displayOrder) || 0,
        });

    if (result.error) {
      setError(result.error);
      setIsSaving(false);
      return;
    }

    if (!comparison) {
      setBeforeFile(null);
      setAfterFile(null);
      setTitle("");
      setDescription("");
      setAltText("");
      setIsFeatured(false);
      setDisplayOrder("0");
      event.currentTarget.reset();
    }

    setMessage(comparison ? "Comparison updated." : "Before and after pair uploaded.");
    setIsSaving(false);
    await onSaved();
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
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

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Before image {comparison ? "(optional replacement)" : ""}
          <input
            className={inputClass}
            type="file"
            accept="image/*"
            onChange={(event) => handleFileChange(event, "before")}
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          After image {comparison ? "(optional replacement)" : ""}
          <input
            className={inputClass}
            type="file"
            accept="image/*"
            onChange={(event) => handleFileChange(event, "after")}
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
        Title optional
        <input
          className={inputClass}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Lawn transformation"
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
        Description optional
        <textarea
          className={`${inputClass} min-h-24 resize-y`}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Location optional
          <input
            className={inputClass}
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Leverington"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Alt text optional
          <input
            className={inputClass}
            value={altText}
            onChange={(event) => setAltText(event.target.value)}
            placeholder="Noble Grounds lawn mowing before and after"
          />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Display order
          <input
            className={inputClass}
            type="number"
            inputMode="numeric"
            value={displayOrder}
            onChange={(event) => setDisplayOrder(event.target.value)}
          />
        </label>
        <label className="flex min-h-12 items-center gap-3 self-end rounded-md border border-border-soft bg-ivory px-4 py-3 text-sm font-semibold text-noble-green-800">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(event) => setIsFeatured(event.target.checked)}
          />
          Featured comparison
        </label>
      </div>

      <div className="flex flex-col gap-3 min-[430px]:flex-row">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : comparison ? (
            <Save className="mr-2 size-4" />
          ) : (
            <ImageUp className="mr-2 size-4" />
          )}
          {isSaving ? "Saving" : comparison ? "Save comparison" : "Upload pair"}
        </Button>
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
