import { ArrowRight, Quote, Star } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ScrollReveal } from "@/components/sections/ScrollReveal";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Review } from "@/types/supabase";

export function ReviewsPreview({ reviews }: { reviews: Review[] }) {
  const featuredReviews = reviews
    .filter((review) => review.is_approved && review.is_featured)
    .slice(0, 3);

  return (
    <Section className="py-16 md:py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <ScrollReveal>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage-700">
              Customer feedback
            </p>
            <h2 className="text-balance mt-3 font-serif text-5xl font-semibold leading-[0.98] text-noble-green-950 md:text-6xl">
              Trust signals without the noise.
            </h2>
            <p className="mt-5 text-base leading-8 text-noble-green-700">
              Featured reviews appear here when real customer feedback is ready
              to publish.
            </p>
            <Button href="/reviews" className="mt-7" variant="secondary">
              View Reviews
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </ScrollReveal>

          {featuredReviews.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {featuredReviews.map((review, index) => (
                <ScrollReveal key={review.id} delay={index * 0.05}>
                  <ReviewCard review={review} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal>
              <GlassCard className="p-6 md:p-8">
                <Quote className="size-8 text-earth-700" />
                <h3 className="mt-5 font-serif text-4xl font-semibold text-noble-green-950">
                  Reviews will appear here once customers have shared their feedback.
                </h3>
                <p className="mt-4 text-sm leading-7 text-noble-green-700">
                  New reviews are checked before publishing, so only approved
                  customer feedback appears on the website.
                </p>
              </GlassCard>
            </ScrollReveal>
          )}
        </div>
      </Container>
    </Section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <GlassCard className="h-full p-6">
      <div className="flex items-center justify-between gap-4">
        <Quote className="size-7 text-earth-700" />
        <div className="flex gap-1 text-sage-700">
          {Array.from({ length: Math.min(5, Math.max(1, review.rating)) }).map(
            (_, starIndex) => (
              <Star key={starIndex} className="size-4 fill-current" />
            ),
          )}
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 text-noble-green-700">
        {review.review_text}
      </p>
      <p className="mt-5 text-sm font-semibold text-noble-green-950">
        {review.customer_name}
      </p>
      {[review.customer_type, review.location].filter(Boolean).length > 0 ? (
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-earth-700">
          {[review.customer_type, review.location].filter(Boolean).join(" / ")}
        </p>
      ) : null}
    </GlassCard>
  );
}
