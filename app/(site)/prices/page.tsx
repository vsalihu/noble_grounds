import { Accessibility, CalendarDays, Leaf, Ruler, Trash2 } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/sections/PageHero";
import { QuoteBand } from "@/components/sections/QuoteBand";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Grass Mowing Prices and Quotes in Wisbech",
  description:
    "Quote-only grass mowing prices for Leverington and Wisbech, based on lawn size, access, condition, mowing frequency and waste handling.",
  path: "/prices",
  ogTitle: "Quote-Only Grass Mowing Prices | Noble Grounds",
  ogDescription:
    "Find out what affects lawn mowing and grass cutting quotes in Leverington, Wisbech and nearby villages.",
  keywords: [
    "grass cutting prices Wisbech",
    "lawn mowing quote Wisbech",
    "grass mowing quote Leverington",
  ],
});

const factors = [
  { title: "Lawn size", text: "The total area and layout of the grass.", icon: Ruler },
  { title: "Access", text: "Gates, parking, rear access, and equipment movement.", icon: Accessibility },
  { title: "Condition", text: "Grass height, wet areas, edges, and first-cut effort.", icon: Leaf },
  { title: "Frequency", text: "Regular mowing is priced differently from one-off visits.", icon: CalendarDays },
  { title: "Waste handling", text: "Whether cuttings are left, binned, or removed.", icon: Trash2 },
];

export default function PricesPage() {
  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Prices", path: "/prices" },
        ])}
      />
      <PageHero eyebrow="Prices" title="Quote-only pricing, tailored to the property.">
        Noble Grounds does not publish fixed prices or online booking slots.
        Every grass cutting quote is based on the lawn, access, condition,
        frequency, and waste handling needed.
      </PageHero>
      <Section className="pt-0">
        <Container>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {factors.map((factor, index) => {
              const Icon = factor.icon;

              return (
                <FadeIn key={factor.title} delay={index * 0.04}>
                  <Card className="h-full p-5">
                    <Icon className="size-7 text-earth-700" />
                    <h2 className="mt-5 font-serif text-3xl font-semibold text-noble-green-950">
                      {factor.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-noble-green-700">
                      {factor.text}
                    </p>
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        </Container>
      </Section>
      <QuoteBand
        title="Send details for an accurate quote"
        text="A few photos, the address or area, and the type of service needed are usually enough to start."
      />
    </main>
  );
}
