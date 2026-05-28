"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { QuoteErrors, QuotePayload } from "@/lib/validation";

type QuoteResponse = {
  ok: boolean;
  message?: string;
  errors?: QuoteErrors;
};

const initialForm: QuotePayload = {
  name: "",
  phone: "",
  email: "",
  area: "",
  customerType: "",
  service: "",
  message: "",
  website: "",
  startedAt: "",
};

const inputClass =
  "min-h-[3.25rem] w-full rounded-md border border-border-soft bg-ivory px-4 py-3 text-base text-noble-green-950 shadow-[0_10px_24px_rgb(22_38_30_/_0.04)] outline-none transition placeholder:text-sage-700/70 focus:border-sage-500 focus:bg-white focus:shadow-[0_14px_34px_rgb(22_38_30_/_0.08)]";

const errorClass = "text-sm font-medium text-earth-700";

export function QuoteForm() {
  const [form, setForm] = useState<QuotePayload>(() => ({
    ...initialForm,
    startedAt: String(Date.now()),
  }));
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<QuoteErrors>({});

  const successMessage = useMemo(
    () =>
      "Your quote request has been sent. Noble Grounds will get back to you soon.",
    [],
  );

  function updateField(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
      form: undefined,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as QuoteResponse;

      if (!response.ok || !payload.ok) {
        setErrors(
          payload.errors ?? {
            form: "Something went wrong sending your quote request. Please try again.",
          },
        );
        return;
      }

      setSubmitted(true);
    } catch {
      setErrors({
        form: "Something went wrong sending your quote request. Please call, WhatsApp, or try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setForm({
      ...initialForm,
      startedAt: String(Date.now()),
    });
    setErrors({});
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <div
        className="rounded-lg border border-sage-200 bg-sage-100 p-6 text-noble-green-950"
        role="status"
      >
        <CheckCircle2 className="size-10 text-noble-green-800" />
        <h2 className="mt-5 font-serif text-4xl font-semibold">Request sent</h2>
        <p className="mt-3 text-sm leading-7 text-noble-green-700">
          {successMessage}
        </p>
        <Button className="mt-6" variant="secondary" onClick={resetForm}>
          Send another request
        </Button>
      </div>
    );
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
      <input
        className="hidden"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={form.website}
        onChange={updateField}
        aria-hidden="true"
      />
      <input type="hidden" name="startedAt" value={form.startedAt} readOnly />

      {errors.form ? (
        <div
          className="rounded-md border border-earth-200 bg-earth-200/35 px-4 py-3 text-sm font-medium text-earth-700"
          role="alert"
        >
          {errors.form}
        </div>
      ) : null}

      <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
        Full name
        <input
          className={inputClass}
          name="name"
          autoComplete="name"
          value={form.name}
          onChange={updateField}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name ? (
          <span id="name-error" className={errorClass}>
            {errors.name}
          </span>
        ) : null}
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Phone number
          <input
            className={inputClass}
            name="phone"
            autoComplete="tel"
            inputMode="tel"
            value={form.phone}
            onChange={updateField}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone ? (
            <span id="phone-error" className={errorClass}>
              {errors.phone}
            </span>
          ) : null}
        </label>

        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Email
          <input
            className={inputClass}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={form.email}
            onChange={updateField}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email ? (
            <span id="email-error" className={errorClass}>
              {errors.email}
            </span>
          ) : null}
        </label>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
        Property address or area
        <input
          className={inputClass}
          name="area"
          autoComplete="street-address"
          value={form.area}
          onChange={updateField}
          aria-invalid={Boolean(errors.area)}
          aria-describedby={errors.area ? "area-error" : undefined}
        />
        {errors.area ? (
          <span id="area-error" className={errorClass}>
            {errors.area}
          </span>
        ) : null}
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Customer type
          <select
            className={inputClass}
            name="customerType"
            value={form.customerType}
            onChange={updateField}
            aria-invalid={Boolean(errors.customerType)}
            aria-describedby={
              errors.customerType ? "customer-type-error" : undefined
            }
          >
            <option value="" disabled>
              Select one
            </option>
            <option>Homeowner</option>
            <option>Landlord</option>
            <option>Business</option>
            <option>Estate agent</option>
          </select>
          {errors.customerType ? (
            <span id="customer-type-error" className={errorClass}>
              {errors.customerType}
            </span>
          ) : null}
        </label>

        <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
          Service needed
          <select
            className={inputClass}
            name="service"
            value={form.service}
            onChange={updateField}
            aria-invalid={Boolean(errors.service)}
            aria-describedby={errors.service ? "service-error" : undefined}
          >
            <option value="" disabled>
              Select one
            </option>
            <option>Regular mowing</option>
            <option>One-off cut</option>
            <option>Property presentation</option>
            <option>Not sure yet</option>
          </select>
          {errors.service ? (
            <span id="service-error" className={errorClass}>
              {errors.service}
            </span>
          ) : null}
        </label>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-noble-green-800">
        Message
        <textarea
          className={`${inputClass} min-h-40 resize-y`}
          name="message"
          value={form.message}
          onChange={updateField}
          placeholder="Tell us about lawn size, access, condition, and preferred frequency."
        />
      </label>

      <Button type="submit" className="mt-1" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Sending request
          </>
        ) : (
          "Send Quote Request"
        )}
      </Button>
    </form>
  );
}
