"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { ImageUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createGalleryStoragePath, galleryBucket, maxGalleryImageSize } from "@/lib/gallery";
import { supabase } from "@/lib/supabase/client";
import type { GalleryProject } from "@/types/supabase";

type ProjectImageUploadFormProps = {
  project: GalleryProject;
  onUploaded: () => Promise<void>;
};

const inputClass =
  "min-h-[3.25rem] w-full rounded-md border border-border-soft bg-ivory px-4 py-3 text-base text-noble-green-950 outline-none transition focus:border-sage-500 focus:bg-white";

export function ProjectImageUploadForm({
  project,
  onUploaded,
}: ProjectImageUploadFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [altText, setAltText] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState("0");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);
    setError("");

    const invalidFile = selectedFiles.find(
      (file) => !file.type.startsWith("image/") || file.size > maxGalleryImageSize,
    );

    if (invalidFile) {
      setError("Choose image files only, each under 5MB.");
      setFiles([]);
      return;
    }

    setFiles(selectedFiles);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!supabase) {
      setError("Supabase is not configured yet.");
      return;
    }

    if (files.length === 0) {
      setError("Choose at least one image.");
      return;
    }

    if (!title.trim() || !altText.trim()) {
      setError("Title and alt text are required.");
      return;
    }

    setIsUploading(true);
    const uploadedPaths: string[] = [];

    for (const [index, file] of files.entries()) {
      const storagePath = createGalleryStoragePath(file.name, project.id);
      const { error: uploadError } = await supabase.storage
        .from(galleryBucket)
        .upload(storagePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        await supabase.storage.from(galleryBucket).remove(uploadedPaths);
        setError(uploadError.message);
        setIsUploading(false);
        return;
      }

      uploadedPaths.push(storagePath);

      const {
        data: { publicUrl },
      } = supabase.storage.from(galleryBucket).getPublicUrl(storagePath);

      const suffix = files.length > 1 ? ` ${index + 1}` : "";
      const { error: insertError } = await supabase.from("gallery_images").insert({
        project_id: project.id,
        image_url: publicUrl,
        storage_path: storagePath,
        title: `${title.trim()}${suffix}`,
        description: description.trim() || null,
        location: project.location ?? project.address,
        alt_text: files.length > 1 ? `${altText.trim()} ${index + 1}` : altText.trim(),
        is_featured: isFeatured && index === 0,
        display_order: (Number(displayOrder) || 0) + index,
      });

      if (insertError) {
        await supabase.storage.from(galleryBucket).remove(uploadedPaths);
        setError(insertError.message);
        setIsUploading(false);
        return;
      }
    }

    setFiles([]);
    setTitle("");
    setDescription("");
    setAltText("");
    setIsFeatured(false);
    setDisplayOrder("0");
    setMessage("Images uploaded to this project.");
    setIsUploading(false);
    event.currentTarget.reset();
    await onUploaded();
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      {error ? <div className="rounded-md border border-earth-200 bg-earth-200/35 px-4 py-3 text-sm font-medium text-earth-700" role="alert">{error}</div> : null}
      {message ? <div className="rounded-md border border-sage-200 bg-sage-100 px-4 py-3 text-sm font-medium text-noble-green-800" role="status">{message}</div> : null}

      <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
        Images for {project.title}
        <input className={inputClass} type="file" accept="image/*" multiple onChange={handleFileChange} />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
        Image title
        <input className={inputClass} value={title} onChange={(event) => setTitle(event.target.value)} />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
        Description
        <textarea className={`${inputClass} min-h-24 resize-y`} value={description} onChange={(event) => setDescription(event.target.value)} />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
        Alt text
        <input className={inputClass} value={altText} onChange={(event) => setAltText(event.target.value)} />
      </label>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Display order
          <input className={inputClass} type="number" inputMode="numeric" value={displayOrder} onChange={(event) => setDisplayOrder(event.target.value)} />
        </label>
        <label className="flex min-h-12 items-center gap-3 self-end rounded-md border border-border-soft bg-ivory px-4 py-3 text-sm font-semibold text-noble-green-800">
          <input type="checkbox" checked={isFeatured} onChange={(event) => setIsFeatured(event.target.checked)} />
          Feature first image
        </label>
      </div>
      <Button type="submit" disabled={isUploading}>
        {isUploading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <ImageUp className="mr-2 size-4" />}
        {isUploading ? "Uploading" : "Upload to project"}
      </Button>
    </form>
  );
}
