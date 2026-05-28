import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/sections/PageHero";
import { GalleryProjectGrid } from "@/components/gallery/GalleryProjectGrid";
import { fetchGalleryProjects } from "@/lib/gallery";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";
import type { GalleryProjectWithImages } from "@/types/supabase";

export const metadata = createMetadata({
  title: "Grass Mowing Gallery for Leverington and Wisbech",
  description:
    "Grouped Noble Grounds project gallery for premium grass mowing, lawn care and property presentation work in Leverington, Wisbech and nearby areas.",
  path: "/gallery",
  ogTitle: "Grouped Grass Mowing Gallery | Noble Grounds",
  ogDescription:
    "Address-based project sections for lawn mowing, grass cutting and property presentation around Leverington and Wisbech.",
  keywords: [
    "grass mowing gallery Wisbech",
    "lawn care gallery Leverington",
    "property presentation Wisbech",
  ],
});

export const revalidate = 60;

const placeholderProjects: GalleryProjectWithImages[] = [
  {
    id: "placeholder-residential",
    title: "Front lawn refresh",
    address: "Leverington, Wisbech",
    location: "Leverington",
    customer_type: "Residential",
    description:
      "A clean project section for future before-and-after lawn presentation photos.",
    is_featured: true,
    display_order: 0,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    gallery_images: [1, 2, 3, 4].map((item) => ({
      id: `placeholder-residential-${item}`,
      project_id: "placeholder-residential",
      image_url: "",
      storage_path: "",
      title: `Residential placeholder ${item}`,
      description: null,
      location: "Leverington",
      alt_text:
        item <= 2
          ? "Future before lawn mowing project photo in Leverington"
          : "Future after lawn mowing project photo in Leverington",
      phase: item <= 2 ? "before" : "after",
      is_featured: item === 1,
      display_order: item,
      created_at: "2026-01-01T00:00:00.000Z",
    })),
  },
  {
    id: "placeholder-business",
    title: "Business frontage maintenance",
    address: "Wisbech area",
    location: "Wisbech",
    customer_type: "Business",
    description:
      "A grouped project layout ready for commercial mowing and frontage photos.",
    is_featured: false,
    display_order: 1,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    gallery_images: [1, 2, 3, 4].map((item) => ({
      id: `placeholder-business-${item}`,
      project_id: "placeholder-business",
      image_url: "",
      storage_path: "",
      title: `Business placeholder ${item}`,
      description: null,
      location: "Wisbech",
      alt_text:
        item <= 2
          ? "Future before business grounds mowing project photo in Wisbech"
          : "Future after business grounds mowing project photo in Wisbech",
      phase: item <= 2 ? "before" : "after",
      is_featured: item === 1,
      display_order: item,
      created_at: "2026-01-01T00:00:00.000Z",
    })),
  },
];

export default async function GalleryPage() {
  const projects = await fetchGalleryProjects();
  const projectsWithImages = projects.filter(
    (project) => project.gallery_images.length > 0,
  );
  const visibleProjects =
    projectsWithImages.length > 0 ? projectsWithImages : placeholderProjects;
  const hasRealProjects = projectsWithImages.length > 0;

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ])}
      />
      <PageHero eyebrow="Gallery" title="Project gallery, organised by address and finish.">
        {hasRealProjects
          ? "Browse Noble Grounds project sections grouped by address or location, with photos kept together for each lawn or property."
          : "Project photos will be added soon. The gallery is now structured by address or project so future work stays organised and easy to browse."}
      </PageHero>
      <Section className="pt-0">
        <Container>
          <GalleryProjectGrid projects={visibleProjects} />
        </Container>
      </Section>
    </main>
  );
}
