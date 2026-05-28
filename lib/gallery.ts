import { createClient } from "@supabase/supabase-js";
import type { GalleryProjectWithImages } from "@/types/supabase";

export const galleryBucket = "gallery";
export const maxGalleryImageSize = 5 * 1024 * 1024;

export function createSafeGalleryFileName(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "jpg";
  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${Date.now()}-${baseName || "gallery-image"}.${extension}`;
}

export function createGalleryStoragePath(fileName: string, projectId?: string) {
  return projectId
    ? `gallery/${projectId}/${createSafeGalleryFileName(fileName)}`
    : `gallery/${createSafeGalleryFileName(fileName)}`;
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

  const { data, error } = await supabase
    .from("gallery_projects")
    .select("*, gallery_images(*)")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return ((data ?? []) as GalleryProjectWithImages[]).map((project) => ({
    ...project,
    gallery_images: sortGalleryImages(project.gallery_images ?? []),
    before_images: sortGalleryImages(
      (project.gallery_images ?? []).filter((image) => image.phase === "before"),
    ),
    after_images: sortGalleryImages(
      (project.gallery_images ?? []).filter((image) => image.phase === "after"),
    ),
  }));
}

export function sortGalleryImages(images: GalleryProjectWithImages["gallery_images"]) {
  return [...images].sort((a, b) => {
      if (a.display_order !== b.display_order) {
        return a.display_order - b.display_order;
      }

      return b.created_at.localeCompare(a.created_at);
    });
}
