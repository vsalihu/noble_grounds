import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Review } from "@/types/supabase";

export type ReviewInput = {
  customerName: string;
  customerType?: string;
  location?: string;
  rating: number;
  reviewText: string;
  isApproved?: boolean;
  isFeatured: boolean;
  displayOrder: number;
};

export type PublicReviewInput = {
  customerName: string;
  customerType?: string;
  location?: string;
  rating: number;
  reviewText: string;
  website?: string;
};

export async function fetchReviews(): Promise<Review[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("is_approved", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Reviews fetch returned no data.", error.message);
    return [];
  }

  return (data ?? []) as Review[];
}

export async function createReview(supabase: SupabaseClient, input: ReviewInput) {
  const validationError = validateReviewInput(input);

  if (validationError) {
    return { data: null, error: validationError };
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert(toReviewRow(input))
    .select("*")
    .single();

  return {
    data: data as Review | null,
    error: error?.message ?? null,
  };
}

export async function createPendingReview(input: PublicReviewInput) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const payload = normalisePublicReviewInput(input);
  const validationError = validatePublicReviewInput(payload);

  if (payload.website) {
    return { saved: false, error: null };
  }

  if (validationError) {
    return { saved: false, error: validationError };
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      saved: false,
      error: "Review submissions are not configured yet.",
    };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { error } = await supabase.from("reviews").insert({
    customer_name: payload.customerName,
    customer_type: cleanOptional(payload.customerType),
    location: cleanOptional(payload.location),
    rating: payload.rating,
    review_text: payload.reviewText,
    is_approved: false,
    is_featured: false,
    display_order: 0,
  });

  return {
    saved: !error,
    error: error?.message ?? null,
  };
}

export async function updateReview(
  supabase: SupabaseClient,
  reviewId: string,
  input: ReviewInput,
) {
  const validationError = validateReviewInput(input);

  if (validationError) {
    return { data: null, error: validationError };
  }

  const { data, error } = await supabase
    .from("reviews")
    .update(toReviewRow(input))
    .eq("id", reviewId)
    .select("*")
    .single();

  return {
    data: data as Review | null,
    error: error?.message ?? null,
  };
}

export async function deleteReview(supabase: SupabaseClient, reviewId: string) {
  const { error } = await supabase.from("reviews").delete().eq("id", reviewId);

  return { error: error?.message ?? null };
}

export async function updateReviewApproval(
  supabase: SupabaseClient,
  reviewId: string,
  isApproved: boolean,
) {
  const { error } = await supabase
    .from("reviews")
    .update({ is_approved: isApproved })
    .eq("id", reviewId);

  return { error: error?.message ?? null };
}

export function sortReviews(reviews: Review[]) {
  return [...reviews].sort((a, b) => {
    if (a.display_order !== b.display_order) {
      return a.display_order - b.display_order;
    }

    return b.created_at.localeCompare(a.created_at);
  });
}

function toReviewRow(input: ReviewInput) {
  return {
    customer_name: input.customerName.trim(),
    customer_type: cleanOptional(input.customerType),
    location: cleanOptional(input.location),
    rating: Math.min(5, Math.max(1, Math.round(input.rating || 5))),
    review_text: input.reviewText.trim(),
    is_approved: Boolean(input.isApproved),
    is_featured: input.isFeatured,
    display_order: input.displayOrder || 0,
  };
}

function validateReviewInput(input: ReviewInput) {
  const normalised = normalisePublicReviewInput(input);
  const publicError = validatePublicReviewInput(normalised);

  if (publicError) {
    return publicError;
  }

  return "";
}

function normalisePublicReviewInput(input: PublicReviewInput) {
  return {
    customerName: cleanString(input.customerName, 120),
    customerType: cleanString(input.customerType, 80),
    location: cleanString(input.location, 120),
    rating: Math.min(5, Math.max(1, Math.round(input.rating || 5))),
    reviewText: cleanString(input.reviewText, 700),
    website: cleanString(input.website, 200),
  };
}

function validatePublicReviewInput(input: ReturnType<typeof normalisePublicReviewInput>) {
  if (!input.customerName) {
    return "Customer name is required.";
  }

  if (!input.reviewText) {
    return "Review text is required.";
  }

  if (input.rating < 1 || input.rating > 5) {
    return "Rating must be between 1 and 5.";
  }

  return "";
}

function cleanOptional(value?: string) {
  const cleaned = value?.trim();
  return cleaned ? cleaned : null;
}

function cleanString(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}
