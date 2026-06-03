"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusMessage } from "@/components/ui/StatusMessage";

type ReviewFormErrors = {
  form?: string;
};

const inputClass =
  "min-h-[3.25rem] w-full rounded-md border border-border-soft bg-ivory px-4 py-3 text-base text-noble-green-950 shadow-[0_10px_24px_rgb(22_38_30_/_0.04)] outline-none transition placeholder:text-sage-700/70 focus:border-sage-500 focus:bg-white focus:shadow-[0_14px_34px_rgb(22_38_30_/_0.08)]";

export function PublicReviewForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<ReviewFormErrors>({});
  const [rating, setRating] = useState(5);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: String(formData.get("customerName") ?? ""),
          customerType: String(formData.get("customerType") ?? ""),
          location: String(formData.get("location") ?? ""),
          rating,
          reviewText: String(formData.get("reviewText") ?? ""),
          website: String(formData.get("website") ?? ""),
        }),
      });

      const payload = (await response.json()) as {
        ok: boolean;
        message?: string;
        errors?: ReviewFormErrors;
      };

      if (!response.ok || !payload.ok) {
        setErrors(
          payload.errors ?? {
            form: "Something went wrong submitting your review. Please try again.",
          },
        );
        return;
      }

      setSubmitted(true);
      event.currentTarget.reset();
      setRating(5);
    } catch {
      setErrors({
        form: "Something went wrong submitting your review. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        className="rounded-lg border border-sage-200 bg-sage-100 p-6 text-noble-green-950"
        role="status"
      >
        <CheckCircle2 className="size-10 text-noble-green-800" />
        <h2 className="mt-5 font-serif text-4xl font-semibold">Review submitted</h2>
        <p className="mt-3 text-sm leading-7 text-noble-green-700">
          Thank you. Your review has been submitted and will appear after approval.
        </p>
        <Button className="mt-6" variant="secondary" onClick={() => setSubmitted(false)}>
          Leave another review
        </Button>
      </div>
    );
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <input
        className="hidden"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {errors.form ? <StatusMessage tone="error">{errors.form}</StatusMessage> : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Customer name
          <input className={inputClass} name="customerName" maxLength={120} required />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Customer type
          <select className={inputClass} name="customerType">
            <option value="">Select one</option>
            <option>Homeowner</option>
            <option>Landlord</option>
            <option>Business</option>
            <option>Estate Agent</option>
          </select>
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr]">
        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Rating
          <select
            className={inputClass}
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Location
          <input
            className={inputClass}
            name="location"
            maxLength={120}
            placeholder="Leverington, Wisbech..."
          />
        </label>
      </div>

      <div className="flex gap-1 text-sage-700" aria-label={`${rating} star rating`}>
        {Array.from({ length: rating }).map((_, index) => (
          <Star key={index} className="size-5 fill-current" />
        ))}
      </div>

      <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
        Review
        <textarea
          className={`${inputClass} min-h-36 resize-y`}
          name="reviewText"
          maxLength={700}
          required
          placeholder="Share a short review of the service."
        />
      </label>

      <p className="text-sm leading-6 text-sage-700">
        Reviews are checked before being published. Contact details are not
        required for reviews.
      </p>

      <Button type="submit" variant="grass" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Submitting review
          </>
        ) : (
          "Submit Review"
        )}
      </Button>
    </form>
  );
}
