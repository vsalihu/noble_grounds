import { ArrowRight } from "lucide-react";
import { GalleryComparisonCard } from "@/components/gallery/GalleryComparisonCard";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ScrollReveal } from "@/components/sections/ScrollReveal";
import { Button } from "@/components/ui/Button";
import type {
  GalleryComparison,
  GalleryProject,
  GalleryProjectWithComparisons,
} from "@/types/supabase";

const fallbackProject: GalleryProject = {
  id: "home-fallback-project",
  title: "Leverington lawn presentation",
  address: "Leverington, Wisbech",
  location: "Leverington",
  customer_type: "Residential",
  description: null,
  is_featured: true,
  display_order: 0,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

const fallbackComparisons: GalleryComparison[] = [1, 2, 3].map((item) => ({
  id: `home-featured-placeholder-${item}`,
  project_id: fallbackProject.id,
  before_image_url: "",
  before_storage_path: "",
  after_image_url: "",
  after_storage_path: "",
  title: item === 1 ? "Tap to reveal the finish" : null,
  description: null,
  location: "Leverington",
  alt_text: "Noble Grounds lawn mowing before and after in Leverington",
  is_featured: item === 1,
  display_order: item,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
}));

export function FeaturedComparisons({
  projects,
}: {
  projects: GalleryProjectWithComparisons[];
}) {
  const featured = projects
    .flatMap((project) =>
      project.gallery_comparisons.map((comparison) => ({ project, comparison })),
    )
    .filter(({ comparison }) => comparison.is_featured)
    .slice(0, 3);
  const items =
    featured.length > 0
      ? featured
      : fallbackComparisons.map((comparison) => ({
          project: fallbackProject,
          comparison,
        }));

  return (
    <Section className="py-16 md:py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <ScrollReveal>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage-700">
              Before and after
            </p>
            <h2 className="text-balance mt-3 font-serif text-5xl font-semibold leading-[0.98] text-noble-green-950 md:text-6xl">
              Proof that the presentation changes fast.
            </h2>
            <p className="mt-5 text-base leading-8 text-noble-green-700">
              Tap a card to reveal the after image, or open it fullscreen to
              inspect the result.
            </p>
            <Button href="/gallery" className="mt-7" variant="secondary">
              View Gallery
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </ScrollReveal>
          <div className="grid gap-5 md:grid-cols-3">
            {items.map(({ project, comparison }, index) => (
              <ScrollReveal key={comparison.id} delay={index * 0.05}>
                <GalleryComparisonCard comparison={comparison} project={project} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
