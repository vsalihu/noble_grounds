"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ExternalLink, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusMessage } from "@/components/ui/StatusMessage";
import {
  createQuotePhotoSignedUrls,
  deleteQuoteEnquiry,
  quoteStatusLabels,
  quoteStatuses,
  updateQuoteEnquiryStatus,
} from "@/lib/quote-enquiries";
import { supabase } from "@/lib/supabase/client";
import type { QuoteEnquiry, QuoteEnquiryStatus } from "@/types/supabase";

type QuoteEnquiryManagerProps = {
  enquiries: QuoteEnquiry[];
  onChanged: () => Promise<void>;
};

type Filter = "all" | QuoteEnquiryStatus;

type PhotoLink = {
  storagePath: string;
  signedUrl: string;
  error: string | null;
};

const statusClasses: Record<QuoteEnquiryStatus, string> = {
  new: "bg-sage-100 text-noble-green-900 border-sage-200",
  contacted: "bg-cream text-noble-green-800 border-border-soft",
  quoted: "bg-earth-200/45 text-earth-700 border-earth-200",
  completed: "bg-noble-green-900 text-ivory border-noble-green-900",
  archived: "bg-noble-green-100 text-noble-green-700 border-border-soft",
};

export function QuoteEnquiryManager({
  enquiries,
  onChanged,
}: QuoteEnquiryManagerProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [photoLinks, setPhotoLinks] = useState<Record<string, PhotoLink[]>>({});

  const filteredEnquiries = useMemo(() => {
    const cleanedQuery = query.trim().toLowerCase();

    return enquiries.filter((enquiry) => {
      const status = normaliseStatus(enquiry.status);
      const matchesStatus = filter === "all" || status === filter;
      const haystack = [
        enquiry.full_name,
        enquiry.phone,
        enquiry.email,
        enquiry.property_area,
        enquiry.customer_type,
        enquiry.service_needed,
        enquiry.message,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!cleanedQuery || haystack.includes(cleanedQuery));
    });
  }, [enquiries, filter, query]);

  async function handleStatusChange(enquiry: QuoteEnquiry, status: QuoteEnquiryStatus) {
    if (!supabase) {
      setError("Supabase is not configured yet.");
      return;
    }

    setBusyId(enquiry.id);
    setError("");
    setMessage("");

    const result = await updateQuoteEnquiryStatus(supabase, enquiry.id, status);

    if (result.error) {
      setError(result.error);
      setBusyId(null);
      return;
    }

    setMessage("Quote enquiry status updated.");
    setBusyId(null);
    await onChanged();
  }

  async function handleDelete(enquiry: QuoteEnquiry) {
    if (!supabase) {
      setError("Supabase is not configured yet.");
      return;
    }

    if (
      !window.confirm(
        `Delete quote enquiry from "${enquiry.full_name}"? Any attached quote photos will also be removed where possible.`,
      )
    ) {
      return;
    }

    setBusyId(enquiry.id);
    setError("");
    setMessage("");

    const result = await deleteQuoteEnquiry(supabase, enquiry);

    if (result.error) {
      setError(result.error);
      setBusyId(null);
      return;
    }

    setMessage("Quote enquiry deleted.");
    setBusyId(null);
    await onChanged();
  }

  async function handleViewPhotos(enquiry: QuoteEnquiry) {
    if (!supabase) {
      setError("Supabase is not configured yet.");
      return;
    }

    const storagePaths = enquiry.photo_storage_paths ?? [];

    if (storagePaths.length === 0) {
      return;
    }

    setBusyId(enquiry.id);
    setError("");
    const links = await createQuotePhotoSignedUrls(supabase, storagePaths);
    setPhotoLinks((current) => ({
      ...current,
      [enquiry.id]: links,
    }));
    setBusyId(null);
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-serif text-4xl font-semibold text-noble-green-950">
            Quote Enquiries
          </h2>
          <p className="mt-2 text-sm leading-7 text-noble-green-700">
            Track incoming quote requests, view attached lawn photos, and move
            each enquiry through the workflow.
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={() => void onChanged()}>
          Refresh
        </Button>
      </div>

      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
      {message ? <StatusMessage tone="success">{message}</StatusMessage> : null}

      <GlassCard className="grid gap-4 p-4 md:p-5">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-sage-700" />
          <span className="sr-only">Search quote enquiries</span>
          <input
            className="min-h-12 w-full rounded-md border border-border-soft bg-ivory py-3 pl-11 pr-4 text-base text-noble-green-950 outline-none transition placeholder:text-sage-700/70 focus:border-sage-500 focus:bg-white"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, phone, area, service..."
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {(["all", ...quoteStatuses] as Filter[]).map((status) => (
            <button
              key={status}
              type="button"
              className={`min-h-11 shrink-0 rounded-md border px-4 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 ${
                filter === status
                  ? "border-noble-green-900 bg-noble-green-900 text-ivory"
                  : "border-border-soft bg-ivory text-noble-green-800 hover:border-sage-500"
              }`}
              onClick={() => setFilter(status)}
            >
              {status === "all" ? "All" : quoteStatusLabels[status]}
            </button>
          ))}
        </div>
      </GlassCard>

      {enquiries.length === 0 ? (
        <EmptyState
          title="No quote enquiries yet"
          text="New quote requests from the contact form will appear here once customers submit them."
        />
      ) : filteredEnquiries.length === 0 ? (
        <EmptyState
          title="No matching enquiries"
          text="Try a different search term or status filter."
        />
      ) : (
        <div className="grid gap-4">
          {filteredEnquiries.map((enquiry) => {
            const status = normaliseStatus(enquiry.status);
            const isExpanded = expandedId === enquiry.id;
            const photos = enquiry.photo_storage_paths ?? [];

            return (
              <GlassCard key={enquiry.id} className="overflow-hidden p-0">
                <div className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:p-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-3xl font-semibold text-noble-green-950">
                        {enquiry.full_name}
                      </h3>
                      <StatusBadge status={status} />
                    </div>
                    <p className="mt-2 text-sm leading-7 text-noble-green-700">
                      {enquiry.property_area} / {enquiry.customer_type} /{" "}
                      {enquiry.service_needed}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-earth-700">
                      {formatDate(enquiry.created_at)} / {photos.length} photo
                      {photos.length === 1 ? "" : "s"}
                    </p>
                  </div>

                  <div className="grid gap-2 min-[430px]:grid-cols-2 md:min-w-72">
                    <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-sage-700 min-[430px]:col-span-2">
                      Status
                      <select
                        className="min-h-11 rounded-md border border-border-soft bg-ivory px-3 text-sm font-semibold normal-case tracking-normal text-noble-green-900 outline-none focus:border-sage-500"
                        value={status}
                        onChange={(event) =>
                          void handleStatusChange(
                            enquiry,
                            event.target.value as QuoteEnquiryStatus,
                          )
                        }
                        disabled={busyId === enquiry.id}
                      >
                        {quoteStatuses.map((quoteStatus) => (
                          <option key={quoteStatus} value={quoteStatus}>
                            {quoteStatusLabels[quoteStatus]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        setExpandedId((current) =>
                          current === enquiry.id ? null : enquiry.id,
                        )
                      }
                    >
                      <ChevronDown
                        className={`mr-2 size-4 transition ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                      Details
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => void handleDelete(enquiry)}
                      disabled={busyId === enquiry.id}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Delete
                    </Button>
                  </div>
                </div>

                {isExpanded ? (
                  <div className="border-t border-border-soft bg-cream/70 p-5 md:p-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Detail label="Phone" value={enquiry.phone} />
                      <Detail label="Email" value={enquiry.email || "Not provided"} />
                      <Detail label="Property area" value={enquiry.property_area} />
                      <Detail label="Customer type" value={enquiry.customer_type} />
                      <Detail label="Service needed" value={enquiry.service_needed} />
                      <Detail label="Source" value={enquiry.source || "website"} />
                    </div>
                    <div className="mt-4">
                      <Detail
                        label="Message"
                        value={enquiry.message || "No message provided."}
                      />
                    </div>

                    <div className="mt-5 rounded-lg border border-border-soft bg-ivory p-4">
                      <div className="flex flex-col gap-3 min-[430px]:flex-row min-[430px]:items-center min-[430px]:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-noble-green-900">
                            Uploaded photos
                          </p>
                          <p className="mt-1 text-xs leading-5 text-sage-700">
                            Private links are generated for admin viewing and
                            expire after 15 minutes.
                          </p>
                        </div>
                        {photos.length > 0 ? (
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => void handleViewPhotos(enquiry)}
                            disabled={busyId === enquiry.id}
                          >
                            {photoLinks[enquiry.id] ? "Refresh Links" : "View Photos"}
                          </Button>
                        ) : null}
                      </div>

                      {photos.length === 0 ? (
                        <p className="mt-4 text-sm text-noble-green-700">
                          No photos were uploaded with this enquiry.
                        </p>
                      ) : photoLinks[enquiry.id] ? (
                        <div className="mt-4 grid gap-3 min-[430px]:grid-cols-2">
                          {photoLinks[enquiry.id].map((photo, index) => (
                            <PhotoLinkCard
                              key={photo.storagePath}
                              photo={photo}
                              index={index}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="mt-4 text-sm text-noble-green-700">
                          {photos.length} private photo
                          {photos.length === 1 ? "" : "s"} attached.
                        </p>
                      )}
                    </div>
                  </div>
                ) : null}
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: QuoteEnquiryStatus }) {
  return (
    <span
      className={`rounded-md border px-2 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${statusClasses[status]}`}
    >
      {quoteStatusLabels[status]}
    </span>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-700">
        {label}
      </p>
      <p className="mt-1 break-words text-sm leading-6 text-noble-green-800">
        {value}
      </p>
    </div>
  );
}

function PhotoLinkCard({ photo, index }: { photo: PhotoLink; index: number }) {
  if (photo.error || !photo.signedUrl) {
    return (
      <div className="rounded-md border border-earth-200 bg-earth-200/30 p-3 text-sm text-earth-700">
        Photo {index + 1}: {photo.error || "Could not create a signed link."}
      </div>
    );
  }

  return (
    <a
      className="group flex min-h-12 items-center justify-between gap-3 rounded-md border border-border-soft bg-white px-4 py-3 text-sm font-semibold text-noble-green-900 transition hover:border-sage-500"
      href={photo.signedUrl}
      target="_blank"
      rel="noreferrer"
    >
      View photo {index + 1}
      <ExternalLink className="size-4 transition group-hover:translate-x-0.5" />
    </a>
  );
}

function normaliseStatus(status: string): QuoteEnquiryStatus {
  return quoteStatuses.includes(status as QuoteEnquiryStatus)
    ? (status as QuoteEnquiryStatus)
    : "new";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/London",
  }).format(new Date(value));
}
