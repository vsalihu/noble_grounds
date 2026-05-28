import { createClient } from "@supabase/supabase-js";
import type {
  GalleryImage,
  GalleryImagePhase,
  GalleryProjectWithImages,
} from "@/types/supabase";

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
  const { data: images, error: imagesError } = await supabase
    .from("gallery_images")
    .select("*")
    .in("project_id", projectIds)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (imagesError) {
    console.warn("Gallery images fetch returned no data.", imagesError.message);
  }

  const normalisedImages: GalleryImage[] = ((images ?? []) as GalleryImage[]).map((image) => {
    const publicUrl = image.image_url || getPublicGalleryUrl(image.storage_path);
    const phase: GalleryImagePhase = image.phase === "before" ? "before" : "after";

    return {
      ...image,
      image_url: publicUrl,
      phase,
    };
  });

  return (projects as GalleryProjectWithImages[])
    .map((project) => {
      const galleryImages = sortGalleryImages(
        normalisedImages.filter((image) => image.project_id === project.id),
      );
      const beforeImages = sortGalleryImages(
        galleryImages.filter((image) => image.phase === "before"),
      );
      const afterImages = sortGalleryImages(
        galleryImages.filter((image) => image.phase === "after"),
      );

      return {
        ...project,
        gallery_images: galleryImages,
        before_images: beforeImages,
        after_images: afterImages,
      };
    })
    .filter((project) => project.gallery_images.length > 0);
}

export function sortGalleryImages(images: GalleryProjectWithImages["gallery_images"]) {
  return [...images].sort((a, b) => {
      if (a.display_order !== b.display_order) {
        return a.display_order - b.display_order;
      }

      return b.created_at.localeCompare(a.created_at);
    });
}

function getPublicGalleryUrl(storagePath: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl || !storagePath) {
    return "";
  }

  return `${supabaseUrl}/storage/v1/object/public/${galleryBucket}/${storagePath}`;
}
