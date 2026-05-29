import { Award, CheckCircle2, ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { PremiumHero } from "@/components/sections/PremiumHero";
import { QuoteBand } from "@/components/sections/QuoteBand";
import { ServicePreview } from "@/components/sections/ServicePreview";
import { TrustHighlights } from "@/components/sections/TrustHighlights";
import { StickyStory } from "@/components/sections/StickyStory";
import { AnimatedProcess } from "@/components/sections/AnimatedProcess";
import { WhoWeHelp } from "@/components/sections/WhoWeHelp";
import { ServiceAreaShowcase } from "@/components/sections/ServiceAreaShowcase";
import { ScrollReveal } from "@/components/sections/ScrollReveal";
import { GalleryComparisonCard } from "@/components/gallery/GalleryComparisonCard";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";
import type { GalleryComparison, GalleryProject } from "@/types/supabase";

export const metadata = createMetadata({
  title: "Premium Grass Mowing in Leverington and Wisbech",
  description:
    "Noble Grounds provides premium grass mowing, lawn mowing and property presentation for homeowners, landlords, businesses and estate agents around Leverington and Wisbech.",
  path: "/",
  ogTitle: "Noble Grounds | Premium Grass Mowing in Leverington",
  ogDescription:
    "Quote-only lawn mowing and grass cutting for homes, rentals, businesses and estate agents in Leverington, Wisbech and nearby villages.",
  keywords: [
    "premium grass mowing Leverington",
    "lawn mowing Wisbech",
    "grass cutting Wisbech",
  ],
});

const previewProject: GalleryProject = {
  id: "home-preview-project",
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

const previewComparisons: GalleryComparison[] = [1, 2, 3].map((item) => ({
  id: `home-preview-${item}`,
  project_id: previewProject.id,
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

const reasons = [
  {
    title: "Premium finish",
    text: "The job is judged by the overall presentation, not just shorter grass.",
    icon: Award,
  },
  {
    title: "Local accountability",
    text: "Focused on Leverington, Wisbech and nearby villages.",
    icon: ShieldCheck,
  },
  {
    title: "Quote-first service",
    text: "No rushed online booking; each lawn is considered properly.",
    icon: CheckCircle2,
  },
];

export default function Home() {
  return (
    <main>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }])} />
      <PremiumHero />
      <TrustHighlights />
      <WhoWeHelp />
      <StickyStory />
      <ServicePreview compact />

      <Section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <ScrollReveal>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage-700">
                Before and after
              </p>
              <h2 className="text-balance mt-3 font-serif text-5xl font-semibold leading-[0.98] text-noble-green-950 md:text-6xl">
                A gallery designed around results.
              </h2>
              <p className="mt-5 text-base leading-8 text-noble-green-700">
                Project cards show the before image first, then flip to the
                finished cut. Real project photos can be added from the admin
                dashboard.
              </p>
              <Button href="/gallery" className="mt-7" variant="secondary">
                View Gallery
              </Button>
            </ScrollReveal>
            <div className="grid gap-5 md:grid-cols-3">
              {previewComparisons.map((comparison, index) => (
                <ScrollReveal key={comparison.id} delay={index * 0.05}>
                  <GalleryComparisonCard
                    comparison={comparison}
                    project={previewProject}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <AnimatedProcess />

      <Section className="py-16 md:py-24">
        <Container>
          <ScrollReveal className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage-700">
              Why Noble Grounds
            </p>
            <h2 className="text-balance mt-3 font-serif text-5xl font-semibold leading-[0.98] text-noble-green-950 md:text-6xl">
              Quietly premium, clearly practical.
            </h2>
          </ScrollReveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;

              return (
                <ScrollReveal key={reason.title} delay={index * 0.05}>
                  <GlassCard className="h-full p-6">
                    <Icon className="size-7 text-earth-700" />
                    <h3 className="mt-6 font-serif text-3xl font-semibold text-noble-green-950">
                      {reason.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-noble-green-700">
                      {reason.text}
                    </p>
                  </GlassCard>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <ServiceAreaShowcase />
      <QuoteBand
        title="Ready for a sharper lawn?"
        text="Send the area, a few photos if useful, and whether you need a regular service or one-off cut."
      />
    </main>
  );
}
