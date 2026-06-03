import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/sections/PageHero";
import { ScrollReveal } from "@/components/sections/ScrollReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { siteConfig } from "@/data/site";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Terms of Service",
  description:
    "Terms of service for Noble Grounds quote-only grass mowing and lawn care around Leverington and Wisbech.",
  path: "/terms",
  ogTitle: "Noble Grounds Terms of Service",
  ogDescription:
    "Simple terms covering quotes, access, pricing, payment, and customer responsibilities for Noble Grounds.",
});

const terms = [
  {
    title: "Quotes",
    text: "Noble Grounds provides quote-only pricing. A quote may depend on lawn size, access, grass condition, frequency, waste handling, and the level of finish required.",
  },
  {
    title: "Service Availability",
    text: "Services are offered around Leverington, Wisbech, and nearby areas. Availability can depend on weather, diary space, property access, and the nature of the work.",
  },
  {
    title: "Customer Responsibilities",
    text: "Customers should provide accurate information, make us aware of hazards, and ensure the lawn area is reasonably clear of objects, pet waste, cables, or other obstructions.",
  },
  {
    title: "Access to Property",
    text: "If you do not need to be home, you must ensure safe access is available at the agreed time. Locked gates, blocked access, or unsafe conditions may delay the visit.",
  },
  {
    title: "Pricing",
    text: "Prices are agreed before work begins where practical. Extra work, difficult access, or significantly different conditions may require a revised quote.",
  },
  {
    title: "Payment",
    text: "Payment terms should be agreed when the quote is accepted. Work may be paused or future visits declined if payment remains outstanding.",
  },
  {
    title: "Limitation of Liability",
    text: "Noble Grounds will take reasonable care while working. We are not responsible for pre-existing damage, hidden objects, poor ground conditions, or issues not made known before work starts.",
  },
  {
    title: "Contact",
    text: `Questions about these terms can be sent to ${siteConfig.email} or discussed by phone on ${siteConfig.phone}.`,
  },
];

export default function TermsPage() {
  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Terms", path: "/terms" },
        ])}
      />
      <PageHero eyebrow="Terms" title="Clear terms for quote-only lawn care.">
        These terms explain how quotes, access, pricing, and customer
        responsibilities work for Noble Grounds.
      </PageHero>
      <Section className="pt-0">
        <Container>
          <div className="grid gap-4 md:grid-cols-2">
            {terms.map((term, index) => (
              <ScrollReveal key={term.title} delay={index * 0.03}>
                <GlassCard className="h-full p-6">
                  <h2 className="font-serif text-3xl font-semibold text-noble-green-950">
                    {term.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-noble-green-700">
                    {term.text}
                  </p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
          <p className="mt-8 text-sm leading-7 text-sage-700">
            Last updated: June 2026. These terms are designed to be practical
            for a small local service business and may be updated over time.
          </p>
        </Container>
      </Section>
    </main>
  );
}
