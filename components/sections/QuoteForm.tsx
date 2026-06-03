"use client";

import { CheckCircle2, Loader2, UploadCloud, X } from "lucide-react";
import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/Button";
import { StatusMessage } from "@/components/ui/StatusMessage";
import {
  trackQuotePhotoUploadCompleted,
  trackQuotePhotoUploadStarted,
  trackQuoteStarted,
  trackQuoteSubmitted,
} from "@/lib/analytics";
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
const maxPhotos = 4;
const maxPhotoSize = 5 * 1024 * 1024;
const allowedPhotoTypes = ["image/jpeg", "image/png", "image/webp"];

type SelectedPhoto = {
  file: File;
  previewUrl: string;
};

type UploadState = "idle" | "uploading" | "uploaded" | "failed";

export function QuoteForm() {
  const [form, setForm] = useState<QuotePayload>(() => ({
    ...initialForm,
    startedAt: String(Date.now()),
  }));
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const [isDraggingPhotos, setIsDraggingPhotos] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const photosRef = useRef<SelectedPhoto[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasTrackedQuoteStart = useRef(false);

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

    if (!hasTrackedQuoteStart.current) {
      hasTrackedQuoteStart.current = true;
      trackQuoteStarted();
    }
  }

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(
    () => () => {
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    },
    [],
  );

  function addPhotoFiles(files: File[]) {
    if (files.length > 0) {
      trackQuotePhotoUploadStarted();
    }

    setErrors((current) => ({ ...current, form: undefined }));
    setUploadState("idle");

    if (files.length + photos.length > maxPhotos) {
      setErrors((current) => ({
        ...current,
        form: `Too many images. Upload up to ${maxPhotos} lawn photos.`,
      }));
      return;
    }

    const unsupportedFile = files.find((file) => !allowedPhotoTypes.includes(file.type));

    if (unsupportedFile) {
      setErrors((current) => ({
        ...current,
        form: `${unsupportedFile.name} is not supported. Use JPEG, PNG, or WebP images only.`,
      }));
      return;
    }

    const oversizedFile = files.find((file) => file.size > maxPhotoSize);

    if (oversizedFile) {
      setErrors((current) => ({
        ...current,
        form: `${oversizedFile.name} is too large. Each photo must be under 5MB.`,
      }));
      return;
    }

    setPhotos((current) => [
      ...current,
      ...files.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    addPhotoFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((current) => {
      const photo = current[index];
      if (photo) {
        URL.revokeObjectURL(photo.previewUrl);
      }

      return current.filter((_, photoIndex) => photoIndex !== index);
    });
    setUploadState("idle");
  }

  function handlePhotoDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDraggingPhotos(false);
    addPhotoFiles(Array.from(event.dataTransfer.files ?? []));
  }

  function openPhotoBrowser() {
    fileInputRef.current?.click();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setUploadState(photos.length > 0 ? "uploading" : "idle");

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        body: createQuoteFormData(form, photos.map((photo) => photo.file)),
      });

      const payload = (await response.json()) as QuoteResponse;

      if (!response.ok || !payload.ok) {
        setErrors(
          payload.errors ?? {
            form: "Something went wrong sending your quote request. Please try again.",
          },
        );
      setUploadState("failed");
        return;
      }

      setUploadState(photos.length > 0 ? "uploaded" : "idle");
      trackQuoteSubmitted();
      if (photos.length > 0) {
        trackQuotePhotoUploadCompleted();
      }
      setSubmitted(true);
      photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
      setPhotos([]);
    } catch {
      setUploadState("failed");
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
    setUploadState("idle");
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
        <StatusMessage tone="error">
          {errors.form}
        </StatusMessage>
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

      <div className="grid gap-4 rounded-2xl border border-border-soft bg-[linear-gradient(135deg,#fffdf7,#f5efe1)] p-4 shadow-[0_18px_50px_rgb(22_38_30_/_0.08)] md:p-5">
        <div className="flex flex-col gap-3 min-[430px]:flex-row min-[430px]:items-start min-[430px]:justify-between">
          <div>
            <p className="text-sm font-semibold text-noble-green-800">
              Optional lawn photos
            </p>
            <p className="mt-1 max-w-lg text-sm leading-6 text-sage-700">
              Optional: Upload photos of your lawn to help us provide a faster
              and more accurate quote.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-earth-700">
              <span className="rounded-md bg-earth-200/40 px-2 py-1">
                Up to 4 images
              </span>
              <span className="rounded-md bg-earth-200/40 px-2 py-1">
                Max 5MB each
              </span>
            </div>
          </div>
          <PhotoUploadStatus state={uploadState} />
        </div>

        <div
          className={`group grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed p-5 text-center transition md:p-7 ${
            isDraggingPhotos
              ? "border-sage-600 bg-sage-100/80"
              : "border-sage-300/70 bg-ivory/70 hover:border-sage-500 hover:bg-white"
          } ${photos.length >= maxPhotos || isSubmitting ? "cursor-not-allowed opacity-70" : ""}`}
          role="button"
          tabIndex={0}
          aria-label="Upload optional lawn photos"
          onClick={() => {
            if (photos.length < maxPhotos && !isSubmitting) {
              openPhotoBrowser();
            }
          }}
          onKeyDown={(event) => {
            if ((event.key === "Enter" || event.key === " ") && photos.length < maxPhotos && !isSubmitting) {
              event.preventDefault();
              openPhotoBrowser();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            if (photos.length < maxPhotos && !isSubmitting) {
              setIsDraggingPhotos(true);
            }
          }}
          onDragLeave={() => setIsDraggingPhotos(false)}
          onDrop={handlePhotoDrop}
        >
          <input
            ref={fileInputRef}
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handlePhotoChange}
            disabled={photos.length >= maxPhotos || isSubmitting}
          />
          <div className="flex size-12 items-center justify-center rounded-xl bg-noble-green-900 text-ivory shadow-[0_14px_34px_rgb(18_50_38_/_0.22)]">
            <UploadCloud className="size-5" />
          </div>
          <p className="mt-4 text-base font-semibold text-noble-green-950">
            Drag photos here or tap to browse
          </p>
          <p className="mt-2 text-sm leading-6 text-sage-700">
            JPEG, PNG, or WebP. {Math.max(0, maxPhotos - photos.length)} slot
            {maxPhotos - photos.length === 1 ? "" : "s"} remaining.
          </p>
        </div>

        {photos.length > 0 ? (
          <div className="grid gap-3 min-[430px]:grid-cols-2">
            {photos.map((photo, index) => (
              <div
                key={photo.previewUrl}
                className="overflow-hidden rounded-xl border border-border-soft bg-ivory shadow-[0_12px_28px_rgb(22_38_30_/_0.06)]"
              >
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.previewUrl}
                    alt={`Selected lawn photo ${index + 1}`}
                    className="h-36 w-full object-cover"
                  />
                  <span className="absolute left-2 top-2 rounded-md bg-ivory/90 px-2 py-1 text-xs font-semibold text-noble-green-900 shadow-soft backdrop-blur">
                    Image {index + 1}
                  </span>
                </div>
                <div className="grid gap-3 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-noble-green-950">
                      {photo.file.name}
                    </p>
                    <p className="mt-1 text-xs font-medium text-sage-700">
                      {formatFileSize(photo.file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex min-h-11 items-center justify-center rounded-md border border-border-soft bg-white px-3 text-sm font-semibold text-noble-green-900 transition hover:border-earth-300 hover:bg-earth-200/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
                    aria-label={`Remove selected photo ${index + 1}`}
                    onClick={() => removePhoto(index)}
                    disabled={isSubmitting}
                  >
                    <X className="mr-2 size-4" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <Button type="submit" variant="grass" className="mt-1" disabled={isSubmitting}>
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

function PhotoUploadStatus({ state }: { state: UploadState }) {
  if (state === "idle") {
    return (
      <span className="inline-flex min-h-9 items-center rounded-md bg-ivory px-3 text-xs font-semibold uppercase tracking-[0.12em] text-sage-700">
        Ready
      </span>
    );
  }

  const status = {
    uploading: {
      label: "Uploading",
      className: "bg-sage-100 text-noble-green-800",
      icon: <Loader2 className="mr-2 size-3.5 animate-spin" />,
    },
    uploaded: {
      label: "Uploaded",
      className: "bg-noble-green-900 text-ivory",
      icon: <CheckCircle2 className="mr-2 size-3.5" />,
    },
    failed: {
      label: "Failed",
      className: "bg-earth-200/45 text-earth-700",
      icon: <X className="mr-2 size-3.5" />,
    },
  }[state];

  return (
    <span
      className={`inline-flex min-h-9 items-center rounded-md px-3 text-xs font-semibold uppercase tracking-[0.12em] ${status.className}`}
    >
      {status.icon}
      {status.label}
    </span>
  );
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))}KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)}MB`;
}

function createQuoteFormData(form: QuotePayload, photos: File[]) {
  const formData = new FormData();

  Object.entries(form).forEach(([key, value]) => {
    formData.append(key, value);
  });

  photos.forEach((photo) => {
    formData.append("photos", photo);
  });

  return formData;
}
