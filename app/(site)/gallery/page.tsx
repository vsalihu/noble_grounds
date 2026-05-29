import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/sections/PageHero";
import { GalleryProjectGrid } from "@/components/gallery/GalleryProjectGrid";
import { fetchGalleryProjectsWithComparisons } from "@/lib/gallery";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";
import type { GalleryProjectWithComparisons } from "@/types/supabase";

export const metadata = createMetadata({
  title: "Before and After Grass Mowing Gallery for Leverington and Wisbech",
  description:
    "Noble Grounds before and after gallery for premium grass mowing, lawn care and property presentation work in Leverington, Wisbech and nearby areas.",
  path: "/gallery",
  ogTitle: "Before and After Grass Mowing Gallery | Noble Grounds",
  ogDescription:
    "Tap-to-flip before and after project cards for lawn mowing, grass cutting and property presentation around Leverington and Wisbech.",
  keywords: [
    "grass mowing gallery Wisbech",
    "before after lawn mowing Leverington",
    "lawn care gallery Leverington",
    "property presentation Wisbech",
  ],
});

export const revalidate = 60;

const placeholderProjects: GalleryProjectWithComparisons[] = [
  {
    id: "placeholder-residential",
    title: "Front lawn refresh",
    address: "Leverington, Wisbech",
    location: "Leverington",
    customer_type: "Residential",
    description:
      "A clean project section ready for real before-and-after lawn presentation photos.",
    is_featured: true,
    display_order: 0,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    gallery_comparisons: [1, 2, 3].map((item) => ({
      id: `placeholder-residential-${item}`,
      project_id: "placeholder-residential",
      before_image_url: "",
      before_storage_path: "",
      after_image_url: "",
      after_storage_path: "",
      title: item === 1 ? "Tap to reveal the finished cut" : null,
      description: null,
      location: "Leverington",
      alt_text: "Noble Grounds lawn mowing before and after in Leverington",
      is_featured: item === 1,
      display_order: item,
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    })),
  },
  {
    id: "placeholder-business",
    title: "Business frontage maintenance",
    address: "Wisbech area",
    location: "Wisbech",
    customer_type: "Business",
    description:
      "A grouped comparison layout ready for commercial mowing and frontage photos.",
    is_featured: false,
    display_order: 1,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    gallery_comparisons: [1, 2].map((item) => ({
      id: `placeholder-business-${item}`,
      project_id: "placeholder-business",
      before_image_url: "",
      before_storage_path: "",
      after_image_url: "",
      after_storage_path: "",
      title: null,
      description: null,
      location: "Wisbech",
      alt_text: "Noble Grounds business grounds mowing before and after in Wisbech",
      is_featured: item === 1,
      display_order: item,
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    })),
  },
];

export default async function GalleryPage() {
  const projects = await fetchGalleryProjectsWithComparisons();
  const visibleProjects = projects.length > 0 ? projects : placeholderProjects;
  const hasRealProjects = projects.length > 0;

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ])}
      />
      <PageHero eyebrow="Gallery" title="Before and after lawn transformations.">
        {hasRealProjects
          ? "Browse Noble Grounds project sections grouped by address or location. Tap each card to flip from the before photo to the finished result."
          : "Project photos will be added soon. The gallery is structured for before-and-after cards so future work stays organised and easy to browse."}
      </PageHero>
      <Section className="pt-0">
        <Container>
          <GalleryProjectGrid projects={visibleProjects} />
        </Container>
      </Section>
    </main>
  );
}
