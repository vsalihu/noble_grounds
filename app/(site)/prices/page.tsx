import { Accessibility, CalendarDays, Leaf, Ruler, Trash2 } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { GlassCard } from "@/components/ui/GlassCard";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/sections/PageHero";
import { QuoteBand } from "@/components/sections/QuoteBand";
import { ScrollReveal } from "@/components/sections/ScrollReveal";
import { AnimatedDivider } from "@/components/ui/AnimatedDivider";
import { fetchActivePriceFactors, fetchSiteContent } from "@/lib/cms";
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

const fallbackFactors = [
  { title: "Lawn size", text: "The total area and layout of the grass.", icon: Ruler },
  { title: "Access", text: "Gates, parking, rear access, and equipment movement.", icon: Accessibility },
  { title: "Condition", text: "Grass height, wet areas, edges, and first-cut effort.", icon: Leaf },
  { title: "Frequency", text: "Regular mowing is priced differently from one-off visits.", icon: CalendarDays },
  { title: "Waste handling", text: "Whether cuttings are left, binned, or removed.", icon: Trash2 },
];

const factorIcons = [Ruler, Accessibility, Leaf, CalendarDays, Trash2];

export default async function PricesPage() {
  const [editableFactors, siteContent] = await Promise.all([
    fetchActivePriceFactors(),
    fetchSiteContent(),
  ]);
  const intro = siteContent.prices_intro;
  const factors = editableFactors.length
    ? editableFactors.map((factor, index) => ({
        title: factor.title,
        text: factor.description,
        icon: factorIcons[index % factorIcons.length],
      }))
    : fallbackFactors;

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Prices", path: "/prices" },
        ])}
      />
      <PageHero
        eyebrow="Prices"
        title={intro?.title ?? "Quote-only pricing, tailored to the property."}
      >
        {intro?.body ??
          "Noble Grounds does not publish fixed prices or online booking slots. Every grass cutting quote is based on the lawn, access, condition, frequency, and waste handling needed."}
      </PageHero>
      <Section className="pt-0">
        <Container>
          <ScrollReveal>
            <div className="rounded-2xl bg-noble-green-900 p-6 text-ivory shadow-[var(--shadow-lifted)] md:p-9">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage-200">
                Why no fixed price list?
              </p>
              <h2 className="mt-3 max-w-3xl font-serif text-5xl font-semibold leading-[0.98] md:text-6xl">
                Every lawn has its own access, condition and finish level.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-sage-200">
                A quick fixed price often ignores the details that decide the
                actual job: gates, grass height, edging, parking, frequency and
                how cuttings are handled.
              </p>
            </div>
          </ScrollReveal>
          <AnimatedDivider className="my-9" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {factors.map((factor, index) => {
              const Icon = factor.icon;

              return (
                <ScrollReveal key={factor.title} delay={index * 0.04}>
                  <GlassCard className="h-full p-5">
                    <Icon className="size-7 text-earth-700" />
                    <h2 className="mt-5 font-serif text-3xl font-semibold text-noble-green-950">
                      {factor.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-noble-green-700">
                      {factor.text}
                    </p>
                  </GlassCard>
                </ScrollReveal>
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
