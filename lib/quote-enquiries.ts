import type { SupabaseClient } from "@supabase/supabase-js";
import { quotePhotosBucket } from "@/lib/contact";
import type { QuoteEnquiry, QuoteEnquiryStatus } from "@/types/supabase";

export const quoteStatuses: QuoteEnquiryStatus[] = [
  "new",
  "contacted",
  "quoted",
  "completed",
  "archived",
];

export const quoteStatusLabels: Record<QuoteEnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  completed: "Completed",
  archived: "Archived",
};

export async function fetchQuoteEnquiries(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("quote_enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return {
    data: (data ?? []) as QuoteEnquiry[],
    error: error?.message ?? null,
  };
}

export async function updateQuoteEnquiryStatus(
  supabase: SupabaseClient,
  enquiryId: string,
  status: QuoteEnquiryStatus,
) {
  if (!quoteStatuses.includes(status)) {
    return { error: "Choose a valid enquiry status." };
  }

  const { error } = await supabase
    .from("quote_enquiries")
    .update({ status })
    .eq("id", enquiryId);

  return { error: error?.message ?? null };
}

export async function deleteQuoteEnquiry(
  supabase: SupabaseClient,
  enquiry: QuoteEnquiry,
) {
  const storagePaths = enquiry.photo_storage_paths ?? [];

  if (storagePaths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from(quotePhotosBucket)
      .remove(storagePaths);

    if (storageError) {
      return { error: storageError.message };
    }
  }

  const { error } = await supabase
    .from("quote_enquiries")
    .delete()
    .eq("id", enquiry.id);

  return { error: error?.message ?? null };
}

export async function createQuotePhotoSignedUrls(
  supabase: SupabaseClient,
  storagePaths: string[],
) {
  const results = await Promise.all(
    storagePaths.map(async (storagePath) => {
      const { data, error } = await supabase.storage
        .from(quotePhotosBucket)
        .createSignedUrl(storagePath, 60 * 15);

      return {
        storagePath,
        signedUrl: data?.signedUrl ?? "",
        error: error?.message ?? null,
      };
    }),
  );

  return results;
}
