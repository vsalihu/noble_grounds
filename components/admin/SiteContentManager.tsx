"use client";

import { FormEvent, useState } from "react";
import { ImagePlus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusMessage } from "@/components/ui/StatusMessage";
import {
  deleteCmsImage,
  siteContentSections,
  uploadCmsImage,
  upsertSiteContent,
} from "@/lib/cms";
import { supabase } from "@/lib/supabase/client";
import type { SiteContent } from "@/types/supabase";

type SiteContentManagerProps = {
  sections: SiteContent[];
  onChanged: () => Promise<void>;
};

const inputClass =
  "min-h-[3.25rem] w-full rounded-md border border-border-soft bg-ivory px-4 py-3 text-base text-noble-green-950 outline-none transition focus:border-sage-500 focus:bg-white";

export function SiteContentManager({ sections, onChanged }: SiteContentManagerProps) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function getSection(sectionKey: string) {
    return sections.find((section) => section.section_key === sectionKey) ?? null;
  }

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="font-serif text-4xl font-semibold text-noble-green-950">
          Site Content
        </h2>
        <p className="mt-2 text-sm leading-7 text-noble-green-700">
          Edit key page introductions without changing code. Empty fields fall
          back to the current website copy.
        </p>
      </div>

      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
      {message ? <StatusMessage tone="success">{message}</StatusMessage> : null}

      <div className="grid gap-4">
        {siteContentSections.map((item) => {
          const section = getSection(item.key);
          const isEditing = editingKey === item.key;

          return (
            <GlassCard key={item.key} className="p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sage-700">
                    {item.label}
                  </p>
                  <h3 className="mt-2 font-serif text-3xl font-semibold text-noble-green-950">
                    {section?.title || "Using fallback content"}
                  </h3>
                  {section?.body ? (
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-noble-green-700">
                      {section.body}
                    </p>
                  ) : null}
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditingKey(isEditing ? null : item.key)}
                >
                  <Pencil className="mr-2 size-4" />
                  {isEditing ? "Close" : "Edit"}
                </Button>
              </div>

              {isEditing ? (
                <div className="mt-5 border-t border-border-soft pt-5">
                  <SiteContentForm
                    sectionKey={item.key}
                    section={section}
                    onError={setError}
                    onSaved={async () => {
                      setEditingKey(null);
                      setMessage("Site content saved.");
                      await onChanged();
                    }}
                  />
                </div>
              ) : null}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

function SiteContentForm({
  sectionKey,
  section,
  onSaved,
  onError,
}: {
  sectionKey: string;
  section: SiteContent | null;
  onSaved: () => Promise<void>;
  onError: (message: string) => void;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState(section?.image_url ?? null);
  const [imageStoragePath, setImageStoragePath] = useState(
    section?.image_storage_path ?? null,
  );

  async function handleImageUpload(file: File | null) {
    if (!file || !supabase) {
      return;
    }

    setIsSaving(true);
    const result = await uploadCmsImage(supabase, sectionKey, file);

    if (result.error || !result.data) {
      onError(result.error ?? "Image upload failed.");
      setIsSaving(false);
      return;
    }

    if (imageStoragePath) {
      await deleteCmsImage(supabase, imageStoragePath);
    }

    setImageUrl(result.data.imageUrl);
    setImageStoragePath(result.data.imageStoragePath);
    setIsSaving(false);
  }

  async function handleImageDelete() {
    if (!supabase) {
      onError("Supabase is not configured yet.");
      return;
    }

    setIsSaving(true);
    const result = await deleteCmsImage(supabase, imageStoragePath);

    if (result.error) {
      onError(result.error);
      setIsSaving(false);
      return;
    }

    setImageUrl(null);
    setImageStoragePath(null);
    setIsSaving(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      onError("Supabase is not configured yet.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    setIsSaving(true);
    const result = await upsertSiteContent(supabase, {
      sectionKey,
      title: String(formData.get("title") ?? ""),
      subtitle: String(formData.get("subtitle") ?? ""),
      body: String(formData.get("body") ?? ""),
      buttonLabel: String(formData.get("buttonLabel") ?? ""),
      buttonHref: String(formData.get("buttonHref") ?? ""),
      imageUrl,
      imageStoragePath,
    });

    if (result.error) {
      onError(result.error);
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    await onSaved();
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Title
          <input className={inputClass} name="title" defaultValue={section?.title ?? ""} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Subtitle
          <input
            className={inputClass}
            name="subtitle"
            defaultValue={section?.subtitle ?? ""}
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
        Body
        <textarea
          className={`${inputClass} min-h-32 resize-y`}
          name="body"
          defaultValue={section?.body ?? ""}
        />
      </label>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Button label
          <input
            className={inputClass}
            name="buttonLabel"
            defaultValue={section?.button_label ?? ""}
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Button link
          <input
            className={inputClass}
            name="buttonHref"
            defaultValue={section?.button_href ?? ""}
            placeholder="/contact"
          />
        </label>
      </div>

      <div className="rounded-lg border border-border-soft bg-cream p-4">
        <p className="text-sm font-semibold text-noble-green-800">Section image</p>
        {imageUrl ? (
          <div className="mt-3 grid gap-3 min-[430px]:grid-cols-[1fr_auto] min-[430px]:items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt=""
              className="h-32 w-full rounded-md object-cover"
            />
            <Button type="button" variant="danger" onClick={() => void handleImageDelete()}>
              <Trash2 className="mr-2 size-4" />
              Delete Image
            </Button>
          </div>
        ) : null}
        <label className="mt-3 inline-flex min-h-11 cursor-pointer items-center rounded-md border border-border-soft bg-ivory px-4 text-sm font-semibold text-noble-green-900">
          <ImagePlus className="mr-2 size-4" />
          Upload image
          <input
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => void handleImageUpload(event.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving" : "Save Content"}
      </Button>
    </form>
  );
}
