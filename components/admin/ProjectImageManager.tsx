"use client";

import { FormEvent, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { galleryBucket } from "@/lib/gallery";
import { supabase } from "@/lib/supabase/client";
import type { GalleryImage } from "@/types/supabase";

type ProjectImageManagerProps = {
  images: GalleryImage[];
  onChanged: () => Promise<void>;
};

const inputClass =
  "min-h-12 w-full rounded-md border border-border-soft bg-ivory px-3 py-2 text-sm text-noble-green-950 outline-none transition focus:border-sage-500 focus:bg-white";

export function ProjectImageManager({ images, onChanged }: ProjectImageManagerProps) {
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function deleteImage(image: GalleryImage) {
    if (!supabase) {
      setError("Supabase is not configured yet.");
      return;
    }

    if (!window.confirm(`Delete "${image.title}" from this project?`)) {
      return;
    }

    setDeletingId(image.id);
    setError("");

    const { error: storageError } = await supabase.storage
      .from(galleryBucket)
      .remove([image.storage_path]);

    if (storageError) {
      setError(storageError.message);
      setDeletingId(null);
      return;
    }

    const { error: deleteError } = await supabase
      .from("gallery_images")
      .delete()
      .eq("id", image.id);

    if (deleteError) {
      setError(deleteError.message);
      setDeletingId(null);
      return;
    }

    setDeletingId(null);
    await onChanged();
  }

  async function saveImage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !editing) {
      return;
    }

    const form = new FormData(event.currentTarget);
    const { error: updateError } = await supabase
      .from("gallery_images")
      .update({
        title: String(form.get("title") ?? "").trim(),
        description: String(form.get("description") ?? "").trim() || null,
        alt_text: String(form.get("alt_text") ?? "").trim(),
        is_featured: form.get("is_featured") === "on",
        display_order: Number(form.get("display_order")) || 0,
      })
      .eq("id", editing.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setEditing(null);
    await onChanged();
  }

  return (
    <div className="grid gap-4">
      {error ? (
        <div className="rounded-md border border-earth-200 bg-earth-200/35 px-4 py-3 text-sm font-medium text-earth-700" role="alert">
          {error}
        </div>
      ) : null}

      {images.length === 0 ? (
        <div className="rounded-md border border-border-soft bg-cream p-4 text-sm text-noble-green-700">
          No images in this project yet.
        </div>
      ) : null}

      {images.map((image) => (
        <div key={image.id} className="overflow-hidden rounded-lg border border-border-soft bg-ivory">
          <div className="aspect-[4/3] overflow-hidden bg-sage-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.image_url} alt={image.alt_text} className="h-full w-full object-cover" />
          </div>
          {editing?.id === image.id ? (
            <form className="grid gap-3 p-4" onSubmit={saveImage}>
              <input className={inputClass} name="title" defaultValue={image.title} aria-label="Image title" />
              <textarea className={`${inputClass} min-h-24 resize-y`} name="description" defaultValue={image.description ?? ""} aria-label="Image description" />
              <input className={inputClass} name="alt_text" defaultValue={image.alt_text} aria-label="Image alt text" />
              <input className={inputClass} name="display_order" type="number" defaultValue={image.display_order} aria-label="Image display order" />
              <label className="flex items-center gap-2 text-sm font-semibold text-noble-green-800">
                <input type="checkbox" name="is_featured" defaultChecked={image.is_featured} />
                Featured image
              </label>
              <div className="flex flex-col gap-2 min-[430px]:flex-row">
                <Button type="submit">Save image</Button>
                <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-serif text-2xl font-semibold text-noble-green-950">{image.title}</h4>
                  <p className="mt-1 text-sm text-noble-green-700">{image.alt_text}</p>
                </div>
                {image.is_featured ? (
                  <span className="rounded-md bg-sage-100 px-2 py-1 text-xs font-semibold text-noble-green-800">
                    Featured
                  </span>
                ) : null}
              </div>
              <div className="mt-4 flex flex-col gap-2 min-[430px]:flex-row">
                <Button type="button" variant="secondary" onClick={() => setEditing(image)}>
                  <Pencil className="mr-2 size-4" />
                  Edit
                </Button>
                <Button type="button" variant="secondary" onClick={() => void deleteImage(image)} disabled={deletingId === image.id}>
                  <Trash2 className="mr-2 size-4" />
                  {deletingId === image.id ? "Deleting" : "Delete"}
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
