"use client";

import { FormEvent, useState } from "react";
import { Pencil, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusMessage } from "@/components/ui/StatusMessage";
import {
  createReview,
  deleteReview,
  updateReview,
  updateReviewApproval,
} from "@/lib/reviews";
import { supabase } from "@/lib/supabase/client";
import type { Review } from "@/types/supabase";

type ReviewManagerProps = {
  reviews: Review[];
  onChanged: () => Promise<void>;
};

type ReviewFilter = "approved" | "pending" | "all";

const inputClass =
  "min-h-[3.25rem] w-full rounded-md border border-border-soft bg-ivory px-4 py-3 text-base text-noble-green-950 outline-none transition focus:border-sage-500 focus:bg-white";

export function ReviewManager({ reviews, onChanged }: ReviewManagerProps) {
  const [editing, setEditing] = useState<Review | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<ReviewFilter>("pending");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const filteredReviews = reviews.filter((review) => {
    if (filter === "approved") {
      return review.is_approved;
    }

    if (filter === "pending") {
      return !review.is_approved;
    }

    return true;
  });

  async function handleDelete(review: Review) {
    if (!supabase) {
      setError("Supabase is not configured yet.");
      return;
    }

    if (!window.confirm(`Delete review from "${review.customer_name}"?`)) {
      return;
    }

    setDeletingId(review.id);
    setError("");
    setMessage("");

    const result = await deleteReview(supabase, review.id);

    if (result.error) {
      setError(result.error);
      setDeletingId(null);
      return;
    }

    setDeletingId(null);
    setMessage("Review deleted.");
    await onChanged();
  }

  async function handleApproval(review: Review, isApproved: boolean) {
    if (!supabase) {
      setError("Supabase is not configured yet.");
      return;
    }

    setBusyId(review.id);
    setError("");
    setMessage("");

    const result = await updateReviewApproval(supabase, review.id, isApproved);

    if (result.error) {
      setError(result.error);
      setBusyId(null);
      return;
    }

    setBusyId(null);
    setMessage(isApproved ? "Review approved." : "Review moved back to pending.");
    await onChanged();
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-serif text-4xl font-semibold text-noble-green-950">
            Reviews
          </h2>
          <p className="mt-2 text-sm leading-7 text-noble-green-700">
            Add real customer reviews when available. Featured reviews can be
            shown more prominently on public pages.
          </p>
        </div>
        <Button type="button" onClick={() => setIsAdding((current) => !current)}>
          {isAdding ? "Close Form" : "Add Review"}
        </Button>
      </div>

      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
      {message ? <StatusMessage tone="success">{message}</StatusMessage> : null}

      <div className="flex flex-wrap gap-2 rounded-2xl border border-border-soft bg-white/70 p-2 shadow-[var(--shadow-soft)]">
        {(["pending", "approved", "all"] as ReviewFilter[]).map((item) => (
          <button
            key={item}
            type="button"
            className={`min-h-11 rounded-md border px-4 text-sm font-semibold capitalize transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 ${
              filter === item
                ? "border-noble-green-900 bg-noble-green-900 text-ivory"
                : "border-border-soft bg-ivory text-noble-green-800 hover:border-sage-500"
            }`}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {isAdding || editing ? (
        <GlassCard className="p-5 md:p-6">
          <ReviewForm
            key={editing?.id ?? "new-review"}
            review={editing}
            onSaved={async () => {
              setIsAdding(false);
              setEditing(null);
              setMessage(editing ? "Review updated." : "Review added.");
              await onChanged();
            }}
            onCancel={() => {
              setIsAdding(false);
              setEditing(null);
            }}
            onError={setError}
          />
        </GlassCard>
      ) : null}

      {reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          text="Reviews submitted from the website will appear here as pending until approved."
          action={
            <Button type="button" onClick={() => setIsAdding(true)}>
              Add First Review
            </Button>
          }
        />
      ) : filteredReviews.length === 0 ? (
        <EmptyState
          title="No reviews in this filter"
          text="Try another review status filter."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredReviews.map((review) => (
            <GlassCard key={review.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-3xl font-semibold text-noble-green-950">
                    {review.customer_name}
                  </p>
                  <p className="mt-1 text-sm text-sage-700">
                    {[review.customer_type, review.location].filter(Boolean).join(" / ") ||
                      "No type or location"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`rounded-md px-2 py-1 text-xs font-semibold ${
                      review.is_approved
                        ? "bg-sage-100 text-noble-green-800"
                        : "bg-earth-200/45 text-earth-700"
                    }`}
                  >
                    {review.is_approved ? "Approved" : "Pending"}
                  </span>
                  {review.is_featured ? (
                    <span className="rounded-md bg-sage-100 px-2 py-1 text-xs font-semibold text-noble-green-800">
                      Featured
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="mt-4 flex gap-1 text-sage-700">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <Star key={index} className="size-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-7 text-noble-green-700">
                {review.review_text}
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-earth-700">
                Display order {review.display_order}
              </p>
              <div className="mt-5 grid gap-2 min-[430px]:grid-cols-2">
                <Button
                  type="button"
                  variant={review.is_approved ? "secondary" : "primary"}
                  onClick={() => void handleApproval(review, !review.is_approved)}
                  disabled={busyId === review.id}
                >
                  {review.is_approved ? "Unapprove" : "Approve"}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setEditing(review)}>
                  <Pencil className="mr-2 size-4" />
                  Edit
                </Button>
                <Button
                  className="min-[430px]:col-span-2"
                  type="button"
                  variant="danger"
                  onClick={() => void handleDelete(review)}
                  disabled={deletingId === review.id}
                >
                  <Trash2 className="mr-2 size-4" />
                  {deletingId === review.id ? "Deleting" : "Delete"}
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewForm({
  review,
  onSaved,
  onCancel,
  onError,
}: {
  review?: Review | null;
  onSaved: () => Promise<void>;
  onCancel: () => void;
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
    const payload = {
      customerName: String(formData.get("customerName") ?? ""),
      customerType: String(formData.get("customerType") ?? ""),
      location: String(formData.get("location") ?? ""),
      rating: Number(formData.get("rating")) || 5,
      reviewText: String(formData.get("reviewText") ?? ""),
      isFeatured: formData.get("isFeatured") === "on",
      isApproved: review?.is_approved ?? true,
      displayOrder: Number(formData.get("displayOrder")) || 0,
    };

    setIsSaving(true);
    const result = review
      ? await updateReview(supabase, review.id, payload)
      : await createReview(supabase, payload);

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
          Customer name
          <input
            className={inputClass}
            name="customerName"
            defaultValue={review?.customer_name ?? ""}
            placeholder="Homeowner in Leverington"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Customer type
          <select
            className={inputClass}
            name="customerType"
            defaultValue={review?.customer_type ?? ""}
          >
            <option value="">Select one</option>
            <option>Homeowner</option>
            <option>Landlord</option>
            <option>Business</option>
            <option>Estate Agent</option>
          </select>
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Location
          <input
            className={inputClass}
            name="location"
            defaultValue={review?.location ?? ""}
            placeholder="Wisbech"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Rating
          <select className={inputClass} name="rating" defaultValue={review?.rating ?? 5}>
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating}
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
            defaultValue={review?.display_order ?? 0}
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
        Review text
        <textarea
          className={`${inputClass} min-h-32 resize-y`}
          name="reviewText"
          defaultValue={review?.review_text ?? ""}
        />
      </label>

      <label className="flex min-h-12 items-center gap-3 rounded-md border border-border-soft bg-ivory px-4 py-3 text-sm font-semibold text-noble-green-800">
        <input
          type="checkbox"
          name="isFeatured"
          defaultChecked={review?.is_featured ?? false}
        />
        Featured review
      </label>

      <div className="flex flex-col gap-3 min-[430px]:flex-row">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving" : review ? "Save Review" : "Add Review"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
