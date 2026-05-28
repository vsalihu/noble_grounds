import { JsonLd } from "@/components/seo/JsonLd";
import { HeroPreview } from "@/components/sections/HeroPreview";
import { QuoteBand } from "@/components/sections/QuoteBand";
import { ServicePreview } from "@/components/sections/ServicePreview";
import { TrustBar } from "@/components/sections/TrustBar";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Card } from "@/components/ui/Card";
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

export default function Home() {
  return (
    <main>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }])} />
      <HeroPreview />
      <TrustBar />
      <ServicePreview compact />
      <Section className="pt-4">
        <Container>
          <FadeIn>
            <Card className="grid gap-6 overflow-hidden bg-ivory p-5 md:grid-cols-[0.9fr_1.1fr] md:p-6">
              <div className="min-h-64 rounded-md bg-[linear-gradient(135deg,#123226,#697a58_55%,#e8d7c2)]" />
              <div className="self-center">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage-700">
                  Quote-only service
                </p>
                <h2 className="mt-3 font-serif text-4xl leading-tight font-semibold text-noble-green-950">
                  Built around your lawn, access, and schedule.
                </h2>
                <p className="mt-4 text-sm leading-7 text-noble-green-700">
                  Noble Grounds does not use fixed online prices or instant
                  booking. Each quote reflects the property, the current lawn
                  condition, and the level of presentation needed.
                </p>
              </div>
            </Card>
          </FadeIn>
        </Container>
      </Section>
      <QuoteBand />
    </main>
  );
}
