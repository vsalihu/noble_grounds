"use client";

import { FormEvent, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { deletePriceFactor, savePriceFactor } from "@/lib/cms";
import { supabase } from "@/lib/supabase/client";
import type { PriceFactor } from "@/types/supabase";

type PriceFactorsManagerProps = {
  factors: PriceFactor[];
  onChanged: () => Promise<void>;
};

const inputClass =
  "min-h-[3.25rem] w-full rounded-md border border-border-soft bg-ivory px-4 py-3 text-base text-noble-green-950 outline-none transition focus:border-sage-500 focus:bg-white";

export function PriceFactorsManager({
  factors,
  onChanged,
}: PriceFactorsManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleDelete(factor: PriceFactor) {
    if (!supabase) {
      setError("Supabase is not configured yet.");
      return;
    }

    const confirmed = window.confirm(`Delete "${factor.title}" from price factors?`);

    if (!confirmed) {
      return;
    }

    const result = await deletePriceFactor(supabase, factor);

    if (result.error) {
      setError(result.error);
      return;
    }

    setMessage("Price factor deleted.");
    await onChanged();
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-serif text-4xl font-semibold text-noble-green-950">
            Price Factors
          </h2>
          <p className="mt-2 text-sm leading-7 text-noble-green-700">
            Edit the reasons shown on the quote-only prices page.
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
          Add Factor
        </Button>
      </div>

      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
      {message ? <StatusMessage tone="success">{message}</StatusMessage> : null}

      {isCreating ? (
        <GlassCard className="p-5">
          <h3 className="font-serif text-3xl font-semibold text-noble-green-950">
            New price factor
          </h3>
          <div className="mt-5">
            <PriceFactorForm
              onError={setError}
              onSaved={async () => {
                setIsCreating(false);
                setMessage("Price factor saved.");
                await onChanged();
              }}
            />
          </div>
        </GlassCard>
      ) : null}

      {factors.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {factors.map((factor) => {
            const isEditing = editingId === factor.id;

            return (
              <GlassCard key={factor.id} className="p-5">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-md bg-sage-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-noble-green-800">
                    {factor.is_active ? "Active" : "Hidden"}
                  </span>
                  <span className="rounded-md bg-cream px-2.5 py-1 text-xs font-semibold text-noble-green-700">
                    Order {factor.display_order}
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-3xl font-semibold text-noble-green-950">
                  {factor.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-noble-green-700">
                  {factor.description}
                </p>
                <div className="mt-5 grid gap-2 min-[430px]:grid-cols-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEditingId(isEditing ? null : factor.id);
                      setIsCreating(false);
                    }}
                  >
                    <Pencil className="mr-2 size-4" />
                    {isEditing ? "Close" : "Edit"}
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => void handleDelete(factor)}
                  >
                    <Trash2 className="mr-2 size-4" />
                    Delete
                  </Button>
                </div>

                {isEditing ? (
                  <div className="mt-5 border-t border-border-soft pt-5">
                    <PriceFactorForm
                      factor={factor}
                      onError={setError}
                      onSaved={async () => {
                        setEditingId(null);
                        setMessage("Price factor saved.");
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
          title="No editable price factors yet"
          text="Add factors here when you want to replace the fallback pricing cards."
        />
      )}
    </div>
  );
}

function PriceFactorForm({
  factor,
  onSaved,
  onError,
}: {
  factor?: PriceFactor;
  onSaved: () => Promise<void>;
  onError: (message: string) => void;
}) {
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      onError("Supabase is not configured yet.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    setIsSaving(true);

    const result = await savePriceFactor(
      supabase,
      {
        title: String(formData.get("title") ?? ""),
        description: String(formData.get("description") ?? ""),
        isActive: formData.get("isActive") === "on",
        displayOrder: Number(formData.get("displayOrder") ?? 0),
      },
      factor?.id,
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
      <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
        Title
        <input
          className={inputClass}
          name="title"
          defaultValue={factor?.title ?? ""}
          required
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
        Description
        <textarea
          className={`${inputClass} min-h-32 resize-y`}
          name="description"
          defaultValue={factor?.description ?? ""}
          required
        />
      </label>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Display order
          <input
            className={inputClass}
            name="displayOrder"
            type="number"
            defaultValue={factor?.display_order ?? 0}
          />
        </label>
        <label className="flex min-h-[3.25rem] items-center gap-3 self-end rounded-md border border-border-soft bg-ivory px-4 py-3 text-sm font-semibold text-noble-green-800">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={factor?.is_active ?? true}
            className="size-5 accent-noble-green-800"
          />
          Show on website
        </label>
      </div>
      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving" : "Save Factor"}
      </Button>
    </form>
  );
}
