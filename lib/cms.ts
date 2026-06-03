import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  EditableService,
  PriceFactor,
  SiteContent,
  SiteContentSectionKey,
} from "@/types/supabase";

export const siteAssetsBucket = "site-assets";
export const maxCmsImageSize = 5 * 1024 * 1024;
export const allowedCmsImageTypes = ["image/jpeg", "image/png", "image/webp"];

export const siteContentSections: Array<{
  key: SiteContentSectionKey;
  label: string;
}> = [
  { key: "home_hero", label: "Home hero" },
  { key: "home_intro", label: "Home intro" },
  { key: "services_intro", label: "Services intro" },
  { key: "prices_intro", label: "Prices intro" },
  { key: "about_intro", label: "About intro" },
  { key: "contact_intro", label: "Contact intro" },
];

export type SiteContentInput = {
  sectionKey: string;
  title?: string;
  subtitle?: string;
  body?: string;
  buttonLabel?: string;
  buttonHref?: string;
  imageUrl?: string | null;
  imageStoragePath?: string | null;
};

export type EditableServiceInput = {
  title: string;
  description: string;
  customerType?: string;
  iconKey?: string;
  imageUrl?: string | null;
  imageStoragePath?: string | null;
  isActive: boolean;
  displayOrder: number;
};

export type PriceFactorInput = {
  title: string;
  description: string;
  isActive: boolean;
  displayOrder: number;
};

function createPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function fetchSiteContent() {
  const supabase = createPublicClient();

  if (!supabase) {
    return {};
  }

  const { data, error } = await supabase.from("site_content").select("*");

  if (error) {
    console.warn("Site content fetch returned no data.", error.message);
    return {};
  }

  return Object.fromEntries(
    ((data ?? []) as SiteContent[]).map((item) => [item.section_key, item]),
  ) as Record<string, SiteContent>;
}

export async function fetchActiveServices() {
  const supabase = createPublicClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Services content fetch returned no data.", error.message);
    return [];
  }

  return (data ?? []) as EditableService[];
}

export async function fetchActivePriceFactors() {
  const supabase = createPublicClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("price_factors")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Price factors fetch returned no data.", error.message);
    return [];
  }

  return (data ?? []) as PriceFactor[];
}

export async function upsertSiteContent(
  supabase: SupabaseClient,
  input: SiteContentInput,
) {
  const { data, error } = await supabase
    .from("site_content")
    .upsert(
      {
        section_key: input.sectionKey,
        title: cleanOptional(input.title),
        subtitle: cleanOptional(input.subtitle),
        body: cleanOptional(input.body),
        button_label: cleanOptional(input.buttonLabel),
        button_href: cleanOptional(input.buttonHref),
        image_url: input.imageUrl ?? null,
        image_storage_path: input.imageStoragePath ?? null,
      },
      { onConflict: "section_key" },
    )
    .select("*")
    .single();

  return {
    data: data as SiteContent | null,
    error: error?.message ?? null,
  };
}

export async function fetchAdminSiteContent(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .order("section_key", { ascending: true });

  return {
    data: (data ?? []) as SiteContent[],
    error: error?.message ?? null,
  };
}

export async function fetchAdminServices(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  return {
    data: (data ?? []) as EditableService[],
    error: error?.message ?? null,
  };
}

export async function fetchAdminPriceFactors(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("price_factors")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  return {
    data: (data ?? []) as PriceFactor[],
    error: error?.message ?? null,
  };
}

export async function saveService(
  supabase: SupabaseClient,
  input: EditableServiceInput,
  id?: string,
) {
  const validationError = validateTitleDescription(input.title, input.description);

  if (validationError) {
    return { data: null, error: validationError };
  }

  const row = {
    title: input.title.trim(),
    description: input.description.trim(),
    customer_type: cleanOptional(input.customerType),
    icon_key: cleanOptional(input.iconKey),
    image_url: input.imageUrl ?? null,
    image_storage_path: input.imageStoragePath ?? null,
    is_active: input.isActive,
    display_order: input.displayOrder || 0,
  };
  const query = id
    ? supabase.from("services").update(row).eq("id", id)
    : supabase.from("services").insert(row);
  const { data, error } = await query.select("*").single();

  return {
    data: data as EditableService | null,
    error: error?.message ?? null,
  };
}

export async function deleteService(supabase: SupabaseClient, service: EditableService) {
  if (service.image_storage_path) {
    await supabase.storage.from(siteAssetsBucket).remove([service.image_storage_path]);
  }

  const { error } = await supabase.from("services").delete().eq("id", service.id);
  return { error: error?.message ?? null };
}

export async function savePriceFactor(
  supabase: SupabaseClient,
  input: PriceFactorInput,
  id?: string,
) {
  const validationError = validateTitleDescription(input.title, input.description);

  if (validationError) {
    return { data: null, error: validationError };
  }

  const row = {
    title: input.title.trim(),
    description: input.description.trim(),
    is_active: input.isActive,
    display_order: input.displayOrder || 0,
  };
  const query = id
    ? supabase.from("price_factors").update(row).eq("id", id)
    : supabase.from("price_factors").insert(row);
  const { data, error } = await query.select("*").single();

  return {
    data: data as PriceFactor | null,
    error: error?.message ?? null,
  };
}

export async function deletePriceFactor(supabase: SupabaseClient, factor: PriceFactor) {
  const { error } = await supabase.from("price_factors").delete().eq("id", factor.id);
  return { error: error?.message ?? null };
}

export async function uploadCmsImage(
  supabase: SupabaseClient,
  sectionKey: string,
  file: File,
) {
  const validationError = validateCmsImage(file);

  if (validationError) {
    return { data: null, error: validationError };
  }

  const storagePath = `site-assets/${sectionKey}/${Date.now()}-${createSafeFileName(file.name)}`;
  const upload = await supabase.storage.from(siteAssetsBucket).upload(storagePath, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (upload.error) {
    return { data: null, error: upload.error.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(siteAssetsBucket).getPublicUrl(storagePath);

  return {
    data: {
      imageUrl: publicUrl,
      imageStoragePath: storagePath,
    },
    error: null,
  };
}

export async function deleteCmsImage(supabase: SupabaseClient, storagePath?: string | null) {
  if (!storagePath) {
    return { error: null };
  }

  const { error } = await supabase.storage.from(siteAssetsBucket).remove([storagePath]);
  return { error: error?.message ?? null };
}

function validateTitleDescription(title: string, description: string) {
  if (!title.trim()) {
    return "Title is required.";
  }

  if (!description.trim()) {
    return "Description is required.";
  }

  return "";
}

function validateCmsImage(file: File) {
  if (!allowedCmsImageTypes.includes(file.type)) {
    return "Choose a JPG, PNG, or WebP image.";
  }

  if (file.size > maxCmsImageSize) {
    return "Choose an image under 5MB.";
  }

  return "";
}

function createSafeFileName(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "jpg";
  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${baseName || "site-asset"}.${extension}`;
}

function cleanOptional(value?: string) {
  const cleaned = value?.trim();
  return cleaned ? cleaned : null;
}
