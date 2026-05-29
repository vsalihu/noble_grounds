import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  GalleryComparison,
  GalleryImage,
  GalleryImagePhase,
  GalleryProjectWithComparisons,
  GalleryProjectWithImages,
} from "@/types/supabase";

export const galleryBucket = "gallery";
export const maxGalleryImageSize = 5 * 1024 * 1024;

export type GalleryComparisonInput = {
  projectId: string;
  beforeFile: File;
  afterFile: File;
  title?: string;
  description?: string;
  location?: string;
  altText?: string;
  isFeatured: boolean;
  displayOrder: number;
};

export type GalleryComparisonUpdateInput = {
  comparison: GalleryComparison;
  beforeFile?: File | null;
  afterFile?: File | null;
  title?: string;
  description?: string;
  location?: string;
  altText?: string;
  isFeatured: boolean;
  displayOrder: number;
};

export function createSafeGalleryFileName(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "jpg";
  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${baseName || "gallery-image"}.${extension}`;
}

export function createGalleryStoragePath(fileName: string, projectId?: string) {
  return projectId
    ? `gallery/${projectId}/${Date.now()}-${createSafeGalleryFileName(fileName)}`
    : `gallery/${Date.now()}-${createSafeGalleryFileName(fileName)}`;
}

export function createComparisonStoragePath({
  projectId,
  folder,
  side,
  fileName,
}: {
  projectId: string;
  folder: string;
  side: "before" | "after";
  fileName: string;
}) {
  return `gallery/${projectId}/comparisons/${folder}/${side}-${createSafeGalleryFileName(fileName)}`;
}

export async function fetchGalleryProjectsWithComparisons(): Promise<
  GalleryProjectWithComparisons[]
> {
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

  const { data: projects, error: projectsError } = await supabase
    .from("gallery_projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (projectsError) {
    console.warn("Gallery projects fetch returned no data.", projectsError.message);
    return [];
  }

  if (!projects || projects.length === 0) {
    console.warn("Gallery projects fetch succeeded but no projects were found.");
    return [];
  }

  const projectIds = projects.map((project) => project.id);
  const { data: comparisons, error: comparisonsError } = await supabase
    .from("gallery_comparisons")
    .select("*")
    .in("project_id", projectIds)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (comparisonsError) {
    console.warn(
      "Gallery comparisons fetch returned no data.",
      comparisonsError.message,
    );
    return [];
  }

  const normalisedComparisons = ((comparisons ?? []) as GalleryComparison[]).map(
    normaliseComparisonUrls,
  );

  return (projects as GalleryProjectWithComparisons[])
    .map((project) => ({
      ...project,
      gallery_comparisons: sortGalleryComparisons(
        normalisedComparisons.filter(
          (comparison) => comparison.project_id === project.id,
        ),
      ),
    }))
    .filter((project) => project.gallery_comparisons.length > 0);
}

export async function fetchGalleryProjects(): Promise<GalleryProjectWithImages[]> {
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

  const { data: projects, error: projectsError } = await supabase
    .from("gallery_projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (projectsError || !projects || projects.length === 0) {
    return [];
  }

  const projectIds = projects.map((project) => project.id);
  const { data: images } = await supabase
    .from("gallery_images")
    .select("*")
    .in("project_id", projectIds)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  const normalisedImages: GalleryImage[] = ((images ?? []) as GalleryImage[]).map(
    (image) => ({
      ...image,
      image_url: image.image_url || getPublicGalleryUrl(image.storage_path),
      phase: image.phase === "before" ? "before" : ("after" as GalleryImagePhase),
    }),
  );

  return (projects as GalleryProjectWithImages[])
    .map((project) => {
      const galleryImages = sortGalleryImages(
        normalisedImages.filter((image) => image.project_id === project.id),
      );

      return {
        ...project,
        gallery_images: galleryImages,
        before_images: galleryImages.filter((image) => image.phase === "before"),
        after_images: galleryImages.filter((image) => image.phase === "after"),
      };
    })
    .filter((project) => project.gallery_images.length > 0);
}

export async function uploadGalleryComparison(
  supabase: SupabaseClient,
  input: GalleryComparisonInput,
) {
  const beforeValidation = validateGalleryFile(input.beforeFile);
  const afterValidation = validateGalleryFile(input.afterFile);

  if (beforeValidation || afterValidation) {
    return { data: null, error: beforeValidation ?? afterValidation };
  }

  const folder = `${Date.now()}`;
  const beforeStoragePath = createComparisonStoragePath({
    projectId: input.projectId,
    folder,
    side: "before",
    fileName: input.beforeFile.name,
  });
  const afterStoragePath = createComparisonStoragePath({
    projectId: input.projectId,
    folder,
    side: "after",
    fileName: input.afterFile.name,
  });

  const beforeUpload = await supabase.storage
    .from(galleryBucket)
    .upload(beforeStoragePath, input.beforeFile, {
      cacheControl: "3600",
      upsert: false,
    });

  if (beforeUpload.error) {
    return { data: null, error: beforeUpload.error.message };
  }

  const afterUpload = await supabase.storage
    .from(galleryBucket)
    .upload(afterStoragePath, input.afterFile, {
      cacheControl: "3600",
      upsert: false,
    });

  if (afterUpload.error) {
    await supabase.storage.from(galleryBucket).remove([beforeStoragePath]);
    return { data: null, error: afterUpload.error.message };
  }

  const beforeImageUrl = getClientPublicUrl(supabase, beforeStoragePath);
  const afterImageUrl = getClientPublicUrl(supabase, afterStoragePath);

  const insert = await supabase
    .from("gallery_comparisons")
    .insert({
      project_id: input.projectId,
      before_image_url: beforeImageUrl,
      before_storage_path: beforeStoragePath,
      after_image_url: afterImageUrl,
      after_storage_path: afterStoragePath,
      title: cleanOptional(input.title),
      description: cleanOptional(input.description),
      location: cleanOptional(input.location),
      alt_text: cleanOptional(input.altText),
      is_featured: input.isFeatured,
      display_order: input.displayOrder || 0,
    })
    .select("*")
    .single();

  if (insert.error) {
    await supabase.storage
      .from(galleryBucket)
      .remove([beforeStoragePath, afterStoragePath]);
    return { data: null, error: insert.error.message };
  }

  return { data: insert.data as GalleryComparison, error: null };
}

export async function updateGalleryComparison(
  supabase: SupabaseClient,
  input: GalleryComparisonUpdateInput,
) {
  const uploadedPaths: string[] = [];
  let beforeImageUrl = input.comparison.before_image_url;
  let beforeStoragePath = input.comparison.before_storage_path;
  let afterImageUrl = input.comparison.after_image_url;
  let afterStoragePath = input.comparison.after_storage_path;

  if (input.beforeFile) {
    const validationError = validateGalleryFile(input.beforeFile);

    if (validationError) {
      return { data: null, error: validationError };
    }

    beforeStoragePath = createComparisonStoragePath({
      projectId: input.comparison.project_id,
      folder: `${input.comparison.id}-${Date.now()}`,
      side: "before",
      fileName: input.beforeFile.name,
    });

    const upload = await supabase.storage
      .from(galleryBucket)
      .upload(beforeStoragePath, input.beforeFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (upload.error) {
      return { data: null, error: upload.error.message };
    }

    uploadedPaths.push(beforeStoragePath);
    beforeImageUrl = getClientPublicUrl(supabase, beforeStoragePath);
  }

  if (input.afterFile) {
    const validationError = validateGalleryFile(input.afterFile);

    if (validationError) {
      await supabase.storage.from(galleryBucket).remove(uploadedPaths);
      return { data: null, error: validationError };
    }

    afterStoragePath = createComparisonStoragePath({
      projectId: input.comparison.project_id,
      folder: `${input.comparison.id}-${Date.now()}`,
      side: "after",
      fileName: input.afterFile.name,
    });

    const upload = await supabase.storage
      .from(galleryBucket)
      .upload(afterStoragePath, input.afterFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (upload.error) {
      await supabase.storage.from(galleryBucket).remove(uploadedPaths);
      return { data: null, error: upload.error.message };
    }

    uploadedPaths.push(afterStoragePath);
    afterImageUrl = getClientPublicUrl(supabase, afterStoragePath);
  }

  const update = await supabase
    .from("gallery_comparisons")
    .update({
      before_image_url: beforeImageUrl,
      before_storage_path: beforeStoragePath,
      after_image_url: afterImageUrl,
      after_storage_path: afterStoragePath,
      title: cleanOptional(input.title),
      description: cleanOptional(input.description),
      location: cleanOptional(input.location),
      alt_text: cleanOptional(input.altText),
      is_featured: input.isFeatured,
      display_order: input.displayOrder || 0,
    })
    .eq("id", input.comparison.id)
    .select("*")
    .single();

  if (update.error) {
    await supabase.storage.from(galleryBucket).remove(uploadedPaths);
    return { data: null, error: update.error.message };
  }

  const oldPaths = [
    input.beforeFile ? input.comparison.before_storage_path : null,
    input.afterFile ? input.comparison.after_storage_path : null,
  ].filter(Boolean) as string[];

  if (oldPaths.length > 0) {
    await supabase.storage.from(galleryBucket).remove(oldPaths);
  }

  return { data: update.data as GalleryComparison, error: null };
}

export async function deleteGalleryComparison(
  supabase: SupabaseClient,
  comparison: GalleryComparison,
) {
  const paths = [
    comparison.before_storage_path,
    comparison.after_storage_path,
  ].filter(Boolean);

  if (paths.length > 0) {
    const storageDelete = await supabase.storage.from(galleryBucket).remove(paths);

    if (storageDelete.error) {
      return { error: storageDelete.error.message };
    }
  }

  const rowDelete = await supabase
    .from("gallery_comparisons")
    .delete()
    .eq("id", comparison.id);

  if (rowDelete.error) {
    return { error: rowDelete.error.message };
  }

  return { error: null };
}

export function sortGalleryComparisons(comparisons: GalleryComparison[]) {
  return [...comparisons].sort((a, b) => {
    if (a.display_order !== b.display_order) {
      return a.display_order - b.display_order;
    }

    return b.created_at.localeCompare(a.created_at);
  });
}

export function sortGalleryImages(images: GalleryProjectWithImages["gallery_images"]) {
  return [...images].sort((a, b) => {
    if (a.display_order !== b.display_order) {
      return a.display_order - b.display_order;
    }

    return b.created_at.localeCompare(a.created_at);
  });
}

function normaliseComparisonUrls(comparison: GalleryComparison) {
  return {
    ...comparison,
    before_image_url:
      comparison.before_image_url ||
      getPublicGalleryUrl(comparison.before_storage_path),
    after_image_url:
      comparison.after_image_url ||
      getPublicGalleryUrl(comparison.after_storage_path),
  };
}

function getPublicGalleryUrl(storagePath: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl || !storagePath) {
    return "";
  }

  return `${supabaseUrl}/storage/v1/object/public/${galleryBucket}/${storagePath}`;
}

function getClientPublicUrl(supabase: SupabaseClient, storagePath: string) {
  const {
    data: { publicUrl },
  } = supabase.storage.from(galleryBucket).getPublicUrl(storagePath);

  return publicUrl;
}

function validateGalleryFile(file: File) {
  if (!file.type.startsWith("image/")) {
    return "Choose image files only.";
  }

  if (file.size > maxGalleryImageSize) {
    return "Choose images under 5MB.";
  }

  return "";
}

function cleanOptional(value?: string) {
  const cleaned = value?.trim();
  return cleaned ? cleaned : null;
}
