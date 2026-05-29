"use client";

import { FormEvent, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase/client";
import type { GalleryProject } from "@/types/supabase";

type GalleryProjectFormProps = {
  project?: GalleryProject | null;
  onSaved: () => Promise<void>;
  onCancel?: () => void;
};

const inputClass =
  "min-h-[3.25rem] w-full rounded-md border border-border-soft bg-ivory px-4 py-3 text-base text-noble-green-950 outline-none transition focus:border-sage-500 focus:bg-white";

export function GalleryProjectForm({
  project,
  onSaved,
  onCancel,
}: GalleryProjectFormProps) {
  const [title, setTitle] = useState(project?.title ?? "");
  const [address, setAddress] = useState(project?.address ?? "");
  const [location, setLocation] = useState(project?.location ?? "");
  const [customerType, setCustomerType] = useState(project?.customer_type ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [isFeatured, setIsFeatured] = useState(project?.is_featured ?? false);
  const [displayOrder, setDisplayOrder] = useState(String(project?.display_order ?? 0));
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!supabase) {
      setError("Supabase is not configured yet.");
      return;
    }

    if (!title.trim()) {
      setError("Project title is required.");
      return;
    }

    setIsSaving(true);

    const payload = {
      title: title.trim(),
      address: address.trim() || location.trim() || "Private location",
      location: location.trim() || null,
      customer_type: customerType || null,
      description: description.trim() || null,
      is_featured: isFeatured,
      display_order: Number(displayOrder) || 0,
    };

    const { error: saveError } = project
      ? await supabase.from("gallery_projects").update(payload).eq("id", project.id)
      : await supabase.from("gallery_projects").insert(payload);

    if (saveError) {
      setError(saveError.message);
      setIsSaving(false);
      return;
    }

    if (!project) {
      setTitle("");
      setAddress("");
      setLocation("");
      setCustomerType("");
      setDescription("");
      setIsFeatured(false);
      setDisplayOrder("0");
    }

    setMessage(project ? "Project updated." : "Project created.");
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

      <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
        Project title
        <input className={inputClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Front lawn refresh" />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
        Address or public location label
        <input className={inputClass} value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Leverington, Wisbech" />
        <span className="text-xs font-medium text-sage-700">
          Optional. Avoid full private addresses unless the customer has agreed.
        </span>
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Location
          <input className={inputClass} value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Leverington" />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Customer type
          <select className={inputClass} value={customerType} onChange={(event) => setCustomerType(event.target.value)}>
            <option value="">Select one</option>
            <option>Residential</option>
            <option>Landlord</option>
            <option>Business</option>
            <option>Estate Agent</option>
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
        Description
        <textarea className={`${inputClass} min-h-28 resize-y`} value={description} onChange={(event) => setDescription(event.target.value)} />
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Display order
          <input className={inputClass} type="number" inputMode="numeric" value={displayOrder} onChange={(event) => setDisplayOrder(event.target.value)} />
        </label>

        <label className="flex min-h-12 items-center gap-3 self-end rounded-md border border-border-soft bg-ivory px-4 py-3 text-sm font-semibold text-noble-green-800">
          <input type="checkbox" checked={isFeatured} onChange={(event) => setIsFeatured(event.target.checked)} />
          Featured project
        </label>
      </div>

      <div className="flex flex-col gap-3 min-[430px]:flex-row">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
          {project ? "Save project" : "Create project"}
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
