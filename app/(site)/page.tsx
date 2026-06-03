import { Award, CheckCircle2, ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { HomeHero } from "@/components/sections/HomeHero";
import { TrustHighlights } from "@/components/sections/TrustHighlights";
import { WhoWeHelp } from "@/components/sections/WhoWeHelp";
import { StickyStorySection } from "@/components/sections/StickyStorySection";
import { FeaturedComparisons } from "@/components/sections/FeaturedComparisons";
import { ReviewsPreview } from "@/components/sections/ReviewsPreview";
import { ServiceAreaShowcase } from "@/components/sections/ServiceAreaShowcase";
import { HomeFinalCta } from "@/components/sections/HomeFinalCta";
import { ScrollReveal } from "@/components/sections/ScrollReveal";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { fetchSiteContent } from "@/lib/cms";
import { fetchGalleryProjectsWithComparisons } from "@/lib/gallery";
import { fetchReviews } from "@/lib/reviews";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

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

export const revalidate = 60;

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

export default async function Home() {
  const [reviews, galleryProjects, siteContent] = await Promise.all([
    fetchReviews(),
    fetchGalleryProjectsWithComparisons(),
    fetchSiteContent(),
  ]);
  const homeIntro = siteContent.home_intro;

  return (
    <main>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }])} />
      <HomeHero content={siteContent.home_hero} />
      <TrustHighlights />
      {homeIntro ? (
        <Section className="py-12 md:py-16">
          <Container>
            <ScrollReveal>
              <GlassCard className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage-700">
                    {homeIntro.subtitle ?? "Noble Grounds"}
                  </p>
                  <h2 className="mt-3 font-serif text-4xl font-semibold leading-none text-noble-green-950 md:text-5xl">
                    {homeIntro.title}
                  </h2>
                  {homeIntro.body ? (
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-noble-green-700">
                      {homeIntro.body}
                    </p>
                  ) : null}
                </div>
                {homeIntro.button_label && homeIntro.button_href ? (
                  <Button href={homeIntro.button_href} variant="secondary">
                    {homeIntro.button_label}
                  </Button>
                ) : null}
              </GlassCard>
            </ScrollReveal>
          </Container>
        </Section>
      ) : null}
      <WhoWeHelp />
      <StickyStorySection />
      <FeaturedComparisons projects={galleryProjects} />

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
                  <GlassCard className="group h-full p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lifted)]">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-sage-100 text-noble-green-900">
                      <Icon className="size-6" />
                    </div>
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

      <ReviewsPreview reviews={reviews} />
      <ServiceAreaShowcase />
      <HomeFinalCta />
    </main>
  );
}
