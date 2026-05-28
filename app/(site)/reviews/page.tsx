import { Quote, Star } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";
import { PageHero } from "@/components/sections/PageHero";
import { QuoteBand } from "@/components/sections/QuoteBand";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Reviews for Grass Mowing in Leverington and Wisbech",
  description:
    "Placeholder customer feedback for Noble Grounds premium lawn mowing, grass cutting and lawn care in Leverington and Wisbech.",
  path: "/reviews",
  ogTitle: "Noble Grounds Reviews | Lawn Mowing Wisbech",
  ogDescription:
    "Review-style placeholders for homeowners, landlords, businesses and estate agents using premium mowing services around Wisbech.",
  keywords: [
    "lawn mowing reviews Wisbech",
    "grass cutting reviews Leverington",
    "landlord lawn care Wisbech",
  ],
});

const reviews = [
  {
    name: "Homeowner in Leverington",
    text: "The lawn was left very tidy and the communication was clear. A professional finish without any fuss.",
  },
  {
    name: "Wisbech landlord",
    text: "Helpful for keeping a rental garden presentable between visits. Reliable and straightforward to deal with.",
  },
  {
    name: "Local business owner",
    text: "The frontage looks much smarter after regular mowing. It makes a noticeable difference for customers arriving.",
  },
  {
    name: "Estate agent contact",
    text: "Useful when a property needs to look neat before photographs or viewings. The result was clean and presentable.",
  },
];

export default function ReviewsPage() {
  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Reviews", path: "/reviews" },
        ])}
      />
      <PageHero eyebrow="Reviews" title="Calm, realistic feedback from the people we serve.">
        Placeholder testimonials for now, written to reflect the customers
        Noble Grounds is built for: homeowners, landlords, businesses, and
        estate agents.
      </PageHero>
      <Section className="pt-0">
        <Container>
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((review, index) => (
              <FadeIn key={review.name} delay={index * 0.04}>
                <Card className="h-full p-5">
                  <div className="flex items-center justify-between gap-4">
                    <Quote className="size-8 text-earth-700" />
                    <div className="flex gap-1 text-sage-700">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star key={starIndex} className="size-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="mt-6 text-base leading-8 text-noble-green-800">
                    {review.text}
                  </p>
                  <p className="mt-6 text-sm font-semibold text-noble-green-950">
                    {review.name}
                  </p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>
      <QuoteBand />
    </main>
  );
}
