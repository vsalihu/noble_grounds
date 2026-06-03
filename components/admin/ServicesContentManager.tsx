"use client";

import { FormEvent, useState } from "react";
import { ImagePlus, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusMessage } from "@/components/ui/StatusMessage";
import {
  deleteCmsImage,
  deleteService,
  saveService,
  uploadCmsImage,
} from "@/lib/cms";
import { supabase } from "@/lib/supabase/client";
import type { EditableService } from "@/types/supabase";

type ServicesContentManagerProps = {
  services: EditableService[];
  onChanged: () => Promise<void>;
};

const inputClass =
  "min-h-[3.25rem] w-full rounded-md border border-border-soft bg-ivory px-4 py-3 text-base text-noble-green-950 outline-none transition focus:border-sage-500 focus:bg-white";

const iconOptions = [
  "home",
  "key",
  "store",
  "building",
  "calendar",
  "scissors",
  "leaf",
];

export function ServicesContentManager({
  services,
  onChanged,
}: ServicesContentManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleDelete(service: EditableService) {
    if (!supabase) {
      setError("Supabase is not configured yet.");
      return;
    }

    const confirmed = window.confirm(
      `Delete "${service.title}" from the public services list?`,
    );

    if (!confirmed) {
      return;
    }

    const result = await deleteService(supabase, service);

    if (result.error) {
      setError(result.error);
      return;
    }

    setMessage("Service deleted.");
    await onChanged();
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-serif text-4xl font-semibold text-noble-green-950">
            Services
          </h2>
          <p className="mt-2 text-sm leading-7 text-noble-green-700">
            Manage the service cards shown on the public services page.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          onClick={() => {
            setIsCreating((current) => !current);
            setEditingId(null);
          }}
        >
          <Plus className="mr-2 size-4" />
          Add Service
        </Button>
      </div>

      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
      {message ? <StatusMessage tone="success">{message}</StatusMessage> : null}

      {isCreating ? (
        <GlassCard className="p-5">
          <h3 className="font-serif text-3xl font-semibold text-noble-green-950">
            New service
          </h3>
          <div className="mt-5">
            <ServiceForm
              onError={setError}
              onSaved={async () => {
                setIsCreating(false);
                setMessage("Service saved.");
                await onChanged();
              }}
            />
          </div>
        </GlassCard>
      ) : null}

      {services.length ? (
        <div className="grid gap-4">
          {services.map((service) => {
            const isEditing = editingId === service.id;

            return (
              <GlassCard key={service.id} className="p-5">
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-md bg-sage-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-noble-green-800">
                        {service.is_active ? "Active" : "Hidden"}
                      </span>
                      <span className="rounded-md bg-cream px-2.5 py-1 text-xs font-semibold text-noble-green-700">
                        Order {service.display_order}
                      </span>
                    </div>
                    <h3 className="mt-3 font-serif text-3xl font-semibold text-noble-green-950">
                      {service.title}
                    </h3>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-noble-green-700">
                      {service.description}
                    </p>
                    {service.customer_type ? (
                      <p className="mt-2 text-sm font-semibold text-sage-700">
                        {service.customer_type}
                      </p>
                    ) : null}
                  </div>
                  <div className="grid gap-2 min-[430px]:grid-cols-2 md:grid-cols-1">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setEditingId(isEditing ? null : service.id);
                        setIsCreating(false);
                      }}
                    >
                      <Pencil className="mr-2 size-4" />
                      {isEditing ? "Close" : "Edit"}
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => void handleDelete(service)}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Delete
                    </Button>
                  </div>
                </div>

                {isEditing ? (
                  <div className="mt-5 border-t border-border-soft pt-5">
                    <ServiceForm
                      service={service}
                      onError={setError}
                      onSaved={async () => {
                        setEditingId(null);
                        setMessage("Service saved.");
                        await onChanged();
                      }}
                    />
                  </div>
                ) : null}
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No editable services yet"
          text="Add services here when you want to replace the fallback service cards on the public website."
        />
      )}
    </div>
  );
}

function ServiceForm({
  service,
  onSaved,
  onError,
}: {
  service?: EditableService;
  onSaved: () => Promise<void>;
  onError: (message: string) => void;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState(service?.image_url ?? null);
  const [imageStoragePath, setImageStoragePath] = useState(
    service?.image_storage_path ?? null,
  );

  async function handleImageUpload(file: File | null) {
    if (!file || !supabase) {
      return;
    }

    setIsSaving(true);
    const result = await uploadCmsImage(supabase, "services", file);

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      onError("Supabase is not configured yet.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    setIsSaving(true);

    const result = await saveService(
      supabase,
      {
        title: String(formData.get("title") ?? ""),
        description: String(formData.get("description") ?? ""),
        customerType: String(formData.get("customerType") ?? ""),
        iconKey: String(formData.get("iconKey") ?? ""),
        imageUrl,
        imageStoragePath,
        isActive: formData.get("isActive") === "on",
        displayOrder: Number(formData.get("displayOrder") ?? 0),
      },
      service?.id,
    );

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
          <input
            className={inputClass}
            name="title"
            defaultValue={service?.title ?? ""}
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Customer type
          <input
            className={inputClass}
            name="customerType"
            defaultValue={service?.customer_type ?? ""}
            placeholder="Residential, Landlord, Business..."
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
        Description
        <textarea
          className={`${inputClass} min-h-32 resize-y`}
          name="description"
          defaultValue={service?.description ?? ""}
          required
        />
      </label>

      <div className="grid gap-5 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Icon
          <select
            className={inputClass}
            name="iconKey"
            defaultValue={service?.icon_key ?? "scissors"}
          >
            {iconOptions.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Display order
          <input
            className={inputClass}
            name="displayOrder"
            type="number"
            defaultValue={service?.display_order ?? 0}
          />
        </label>
        <label className="flex min-h-[3.25rem] items-center gap-3 self-end rounded-md border border-border-soft bg-ivory px-4 py-3 text-sm font-semibold text-noble-green-800">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={service?.is_active ?? true}
            className="size-5 accent-noble-green-800"
          />
          Show on website
        </label>
      </div>

      <div className="rounded-lg border border-border-soft bg-cream p-4">
        <p className="text-sm font-semibold text-noble-green-800">
          Optional service image
        </p>
        {imageUrl ? (
          <div className="mt-3 grid gap-3 min-[430px]:grid-cols-[1fr_auto] min-[430px]:items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt=""
              className="h-32 w-full rounded-md object-cover"
            />
            <Button
              type="button"
              variant="danger"
              onClick={async () => {
                if (!supabase) {
                  onError("Supabase is not configured yet.");
                  return;
                }
                setIsSaving(true);
                await deleteCmsImage(supabase, imageStoragePath);
                setImageUrl(null);
                setImageStoragePath(null);
                setIsSaving(false);
              }}
            >
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
        {isSaving ? "Saving" : "Save Service"}
      </Button>
    </form>
  );
}
