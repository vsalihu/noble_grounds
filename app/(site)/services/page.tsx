import { Building2, CalendarCheck, Home, KeyRound, Scissors, Store } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { GlassCard } from "@/components/ui/GlassCard";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/sections/PageHero";
import { QuoteBand } from "@/components/sections/QuoteBand";
import { AnimatedProcess } from "@/components/sections/AnimatedProcess";
import { WhoWeHelp } from "@/components/sections/WhoWeHelp";
import { ScrollReveal } from "@/components/sections/ScrollReveal";
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
        <Container className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <ScrollReveal className="lg:sticky lg:top-28 lg:self-start">
            <GlassCard className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage-700">
                Service focus
              </p>
              <h2 className="mt-3 font-serif text-5xl font-semibold leading-none text-noble-green-950">
                Mowing built around presentation.
              </h2>
              <p className="mt-5 text-sm leading-7 text-noble-green-700">
                Residential, rental, business and estate-agent lawns all need a
                different level of timing, access and finish. The service stays
                focused on clean mowing and practical communication.
              </p>
            </GlassCard>
          </ScrollReveal>
          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <ScrollReveal key={service.title} delay={index * 0.04}>
                  <GlassCard className="group h-full p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgb(18_50_38_/_0.15)]">
                    <div className="flex size-12 items-center justify-center rounded-md bg-noble-green-800 text-ivory">
                      <Icon className="size-5" />
                    </div>
                    <h2 className="mt-6 font-serif text-3xl leading-none font-semibold text-noble-green-950">
                      {service.title}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-noble-green-700">
                      {service.text}
                    </p>
                    <div className="mt-6 h-24 rounded-xl border border-earth-200 bg-[linear-gradient(135deg,rgb(220_228_207_/_0.86),rgb(255_253_247_/_0.92),rgb(183_150_115_/_0.22))]" />
                  </GlassCard>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </Section>
      <WhoWeHelp />
      <AnimatedProcess title="From enquiry to a cleaner finish." />
      <QuoteBand title="Request a mowing quote" />
    </main>
  );
}
