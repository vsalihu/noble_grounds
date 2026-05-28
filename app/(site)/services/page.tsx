import { Building2, CalendarCheck, Home, KeyRound, Scissors, Store } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/sections/PageHero";
import { QuoteBand } from "@/components/sections/QuoteBand";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Grass Mowing Services in Leverington and Wisbech",
  description:
    "Premium grass mowing, lawn mowing and grass cutting in Leverington and Wisbech for homeowners, landlords, businesses and estate agents.",
  path: "/services",
  ogTitle: "Premium Grass Mowing Services | Noble Grounds",
  ogDescription:
    "Residential lawn mowing, landlord lawn care, business grounds mowing and estate agent property presentation around Leverington and Wisbech.",
  keywords: [
    "residential lawn mowing Leverington",
    "landlord lawn care Wisbech",
    "estate agent lawn mowing Wisbech",
    "business grounds mowing Wisbech",
  ],
});

const services = [
  {
    title: "Residential lawn mowing",
    text: "Regular lawn mowing for homeowners who want a neat, reliable finish without chasing a casual gardener.",
    icon: Home,
  },
  {
    title: "Landlord property lawn care",
    text: "Grass cutting for occupied homes, between-tenancy tidies, and rental properties that need to remain presentable.",
    icon: KeyRound,
  },
  {
    title: "Business premises mowing",
    text: "Professional grass mowing for small business frontages, offices, yards, and customer-facing premises.",
    icon: Store,
  },
  {
    title: "Estate agent presentation",
    text: "Tidy lawns and sharper kerb appeal before photographs, viewings, valuations, and property handovers.",
    icon: Building2,
  },
  {
    title: "Regular maintenance",
    text: "Planned mowing schedules for lawns that need consistent attention through the growing season.",
    icon: CalendarCheck,
  },
  {
    title: "One-off cuts",
    text: "Single visits for overgrown grass, seasonal resets, sale preparation, or catching up after a missed cut.",
    icon: Scissors,
  },
];

export default function ServicesPage() {
  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <PageHero eyebrow="Services" title="Premium mowing for homes and professional properties.">
        Grass mowing in Leverington and lawn mowing across Wisbech, delivered
        with a clean finish, reliable communication, and a professional standard.
      </PageHero>
      <Section className="pt-0">
        <Container>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <FadeIn key={service.title} delay={index * 0.04}>
                  <Card className="group h-full p-5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgb(22_38_30_/_0.12)]">
                    <div className="flex size-12 items-center justify-center rounded-md bg-noble-green-800 text-ivory">
                      <Icon className="size-5" />
                    </div>
                    <h2 className="mt-6 font-serif text-3xl leading-none font-semibold text-noble-green-950">
                      {service.title}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-noble-green-700">
                      {service.text}
                    </p>
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        </Container>
      </Section>
      <QuoteBand title="Request a mowing quote" />
    </main>
  );
}
