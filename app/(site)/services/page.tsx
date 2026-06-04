import {
  Building2,
  CalendarCheck,
  Home,
  KeyRound,
  Leaf,
  Scissors,
  Store,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { GlassCard } from "@/components/ui/GlassCard";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/sections/PageHero";
import { QuoteBand } from "@/components/sections/QuoteBand";
import { AnimatedProcess } from "@/components/sections/AnimatedProcess";
import { WhoWeHelp } from "@/components/sections/WhoWeHelp";
import { ScrollReveal } from "@/components/sections/ScrollReveal";
import { fetchActiveServices, fetchSiteContent } from "@/lib/cms";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";
import type { EditableService } from "@/types/supabase";

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

const fallbackServices = [
  {
    title: "Residential lawn mowing",
    text: "Regular lawn mowing for homeowners who want a neat, reliable finish without chasing a casual gardener.",
    icon: Home,
    imageUrl: "/images/site/overgrown-to-presentable.jpg",
  },
  {
    title: "Landlord property lawn care",
    text: "Grass cutting for occupied homes, between-tenancy tidies, and rental properties that need to remain presentable.",
    icon: KeyRound,
    imageUrl: "/images/site/landlord-property-lawn-care.jpg",
  },
  {
    title: "Business premises mowing",
    text: "Professional grass mowing for small business frontages, offices, yards, and customer-facing premises.",
    icon: Store,
    imageUrl: "/images/site/business-premises-mowing.jpg",
  },
  {
    title: "Estate agent presentation",
    text: "Tidy lawns and sharper kerb appeal before photographs, viewings, valuations, and property handovers.",
    icon: Building2,
    imageUrl: "/images/site/estate-agent-presentation.jpg",
  },
  {
    title: "Regular maintenance",
    text: "Planned mowing schedules for lawns that need consistent attention through the growing season.",
    icon: CalendarCheck,
    imageUrl: "/images/site/regular-maintenance.jpg",
  },
  {
    title: "One-off cuts",
    text: "Single visits for overgrown grass, seasonal resets, sale preparation, or catching up after a missed cut.",
    icon: Scissors,
    imageUrl: "/images/site/one-off-cuts.jpg",
  },
];

const iconMap = {
  building: Building2,
  calendar: CalendarCheck,
  home: Home,
  key: KeyRound,
  leaf: Leaf,
  scissors: Scissors,
  store: Store,
};

function getServiceCards(editableServices: EditableService[]) {
  if (!editableServices.length) {
    return fallbackServices.map((service) => ({
      title: service.title,
      text: service.text,
      icon: service.icon,
      imageUrl: service.imageUrl,
    }));
  }

  return editableServices.map((service) => ({
    title: service.title,
    text: service.description,
    icon:
      iconMap[(service.icon_key ?? "scissors") as keyof typeof iconMap] ??
      Scissors,
    imageUrl: service.image_url,
  }));
}

export default async function ServicesPage() {
  const [editableServices, siteContent] = await Promise.all([
    fetchActiveServices(),
    fetchSiteContent(),
  ]);
  const services = getServiceCards(editableServices);
  const intro = siteContent.services_intro;

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <PageHero
        eyebrow="Services"
        title={intro?.title ?? "Premium mowing for homes and professional properties."}
      >
        {intro?.body ??
          "Grass mowing in Leverington and lawn mowing across Wisbech, delivered with a clean finish, reliable communication, and a professional standard."}
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
          <div className="grid items-stretch gap-5 md:grid-cols-2">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <ScrollReveal key={service.title} delay={index * 0.04}>
                  <GlassCard className="group flex h-full flex-col overflow-hidden p-0 transition duration-300 hover:shadow-[0_28px_80px_rgb(18_50_38_/_0.15)] md:hover:-translate-y-1">
                    {service.imageUrl ? (
                      <div className="relative min-h-[220px] overflow-hidden border-b border-earth-200 md:min-h-[260px] lg:min-h-[300px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={service.imageUrl}
                          alt={`${service.title} service example`}
                          className="h-full min-h-[220px] w-full object-cover object-center transition duration-500 md:min-h-[260px] md:group-hover:scale-[1.03] lg:min-h-[300px]"
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    ) : (
                      <div className="min-h-[220px] border-b border-earth-200 bg-[linear-gradient(135deg,rgb(220_228_207_/_0.86),rgb(255_253_247_/_0.92),rgb(183_150_115_/_0.22))] md:min-h-[260px] lg:min-h-[300px]" />
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-noble-green-800 text-ivory shadow-[0_14px_34px_rgb(18_50_38_/_0.16)]">
                          <Icon className="size-5" />
                        </div>
                        <h2 className="font-serif text-3xl leading-none font-semibold text-noble-green-950">
                          {service.title}
                        </h2>
                      </div>
                      <p className="mt-5 text-sm leading-7 text-noble-green-700">
                        {service.text}
                      </p>
                    </div>
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
