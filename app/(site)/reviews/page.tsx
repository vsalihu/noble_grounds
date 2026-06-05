import { ArrowRight, Quote, Star } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHero } from "@/components/sections/PageHero";
import { PublicReviewForm } from "@/components/sections/PublicReviewForm";
import { QuoteBand } from "@/components/sections/QuoteBand";
import { ScrollReveal } from "@/components/sections/ScrollReveal";
import { fetchReviews } from "@/lib/reviews";
import { breadcrumbJsonLd, createMetadata, reviewsJsonLd } from "@/lib/seo";
import type { Review } from "@/types/supabase";

export const metadata = createMetadata({
  title: "Reviews for Grass Mowing in Leverington and Wisbech",
  description:
    "Customer reviews for Noble Grounds premium lawn mowing, grass cutting and lawn care in Leverington and Wisbech.",
  path: "/reviews",
  ogTitle: "Noble Grounds Reviews | Lawn Mowing Wisbech",
  ogDescription:
    "Feedback from homeowners, landlords, businesses and estate agents using premium mowing services around Wisbech.",
  keywords: [
    "lawn mowing reviews Wisbech",
    "grass cutting reviews Leverington",
    "landlord lawn care Wisbech",
  ],
});

export const revalidate = 60;

export default async function ReviewsPage() {
  const reviews = await fetchReviews();

  return (
    <main>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Reviews", path: "/reviews" },
          ]),
          ...(reviews.length > 0 ? [reviewsJsonLd(reviews)] : []),
        ]}
      />
      <PageHero eyebrow="Reviews" title="Calm, realistic feedback from the people we serve.">
        Feedback from homeowners, landlords, businesses, and estate agents
        around Leverington, Wisbech, and nearby villages.
      </PageHero>
      <Section className="pt-0">
        <Container>
          {reviews.length === 0 ? (
            <ScrollReveal>
              <GlassCard className="relative mx-auto max-w-4xl overflow-hidden p-7 text-center md:p-10">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgb(154_170_131_/_0.22),transparent_18rem),radial-gradient(circle_at_82%_72%,rgb(183_150_115_/_0.18),transparent_20rem)]" />
                <div className="relative">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-noble-green-900 text-ivory shadow-[0_22px_54px_rgb(7_23_16_/_0.22)]">
                    <Quote className="size-8" />
                  </div>
                  <h2 className="mx-auto mt-6 max-w-2xl font-serif text-5xl font-semibold leading-none text-noble-green-950 md:text-6xl">
                    Be the First Noble Grounds Review
                  </h2>
                  <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-noble-green-700">
                    We&apos;re building our reputation one lawn at a time. If
                    we&apos;ve helped with your garden, we&apos;d love to hear
                    about your experience.
                  </p>
                  <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-7 text-sage-700">
                    Every review helps local homeowners, landlords and
                    businesses choose a reliable lawn care service.
                  </p>
                  <div className="mt-7 grid gap-3 min-[430px]:grid-cols-2 md:inline-grid md:grid-cols-2">
                    <Button href="#leave-review" variant="grass">
                      Leave a Review
                      <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                    </Button>
                    <Button href="/contact" variant="secondary">
                      Request a Quote
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {reviews.map((review, index) => (
                <ScrollReveal key={review.id} delay={index * 0.04}>
                  <GlassCard className="h-full p-6">
                    <div className="flex items-center justify-between gap-4">
                      <Quote className="size-8 text-earth-700" />
                      <div className="flex gap-1 text-sage-700">
                        {Array.from({ length: clampRating(review.rating) }).map(
                          (_, starIndex) => (
                            <Star key={starIndex} className="size-4 fill-current" />
                          ),
                        )}
                      </div>
                    </div>
                    <p className="mt-6 text-base leading-8 text-noble-green-800">
                      {review.review_text}
                    </p>
                    <p className="mt-6 text-sm font-semibold text-noble-green-950">
                      {review.customer_name}
                    </p>
                    {[review.customer_type, review.location].filter(Boolean).length > 0 ? (
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-earth-700">
                        {[review.customer_type, review.location].filter(Boolean).join(" / ")}
                      </p>
                    ) : null}
                  </GlassCard>
                </ScrollReveal>
              ))}
            </div>
          )}
        </Container>
      </Section>

      <Section id="leave-review" className="pt-0">
        <Container className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <ScrollReveal>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage-700">
              Leave a Review
            </p>
            <h2 className="mt-3 font-serif text-5xl font-semibold leading-[0.98] text-noble-green-950 md:text-6xl">
              Share feedback for Noble Grounds.
            </h2>
            <p className="mt-5 text-base leading-8 text-noble-green-700">
              Reviews are checked before being published. Please avoid private
              contact details in the review text.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <GlassCard className="p-5 md:p-7">
              <PublicReviewForm />
            </GlassCard>
          </ScrollReveal>
        </Container>
      </Section>
      <QuoteBand />
    </main>
  );
}

function clampRating(rating: Review["rating"] | number) {
  return Math.min(5, Math.max(1, Math.round(rating || 5)));
}
