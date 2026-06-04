import { Building2, Home, KeyRound, Store } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ScrollReveal } from "@/components/sections/ScrollReveal";

const services = [
  {
    title: "Home lawns",
    text: "Clean, regular mowing for lawns that need to look cared for every week.",
    icon: Home,
    imageUrl: "/images/site/overgrown-to-presentable.jpg",
  },
  {
    title: "Rental properties",
    text: "Dependable presentation for landlords managing occupied or vacant homes.",
    icon: KeyRound,
    imageUrl: "/images/site/landlord-property-lawn-care.jpg",
  },
  {
    title: "Business grounds",
    text: "Professional first impressions for small commercial premises and frontages.",
    icon: Store,
    imageUrl: "/images/site/business-premises-mowing.jpg",
  },
  {
    title: "Estate agents",
    text: "Tidy kerb appeal for listings, viewings, and property handovers.",
    icon: Building2,
    imageUrl: "/images/site/estate-agent-presentation.jpg",
  },
];

type ServicePreviewProps = {
  compact?: boolean;
};

export function ServicePreview({ compact = false }: ServicePreviewProps) {
  return (
    <Section id="services" className={compact ? "py-14" : "pb-20 md:pb-28"}>
      <Container>
        <ScrollReveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage-700">
            Service preview
          </p>
          <h2 className="text-balance mt-3 font-serif text-4xl leading-tight font-semibold text-noble-green-950 min-[430px]:text-5xl">
            A refined mowing service for properties that need to stay presentable.
          </h2>
        </ScrollReveal>

        <div className="mt-8 grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <ScrollReveal key={service.title} delay={index * 0.05}>
                <GlassCard className="group flex h-full flex-col overflow-hidden p-0 transition duration-300 hover:shadow-[0_28px_80px_rgb(18_50_38_/_0.15)] md:hover:-translate-y-1">
                  <div className="relative min-h-[220px] overflow-hidden border-b border-earth-200 md:min-h-[260px] lg:min-h-[300px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={service.imageUrl}
                      alt={`${service.title} service example`}
                      className="h-full min-h-[220px] w-full object-cover object-center transition duration-500 md:min-h-[260px] md:group-hover:scale-[1.03] lg:min-h-[300px]"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-noble-green-800 text-ivory transition duration-200 group-hover:bg-noble-green-900">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="font-serif text-3xl leading-none font-semibold text-noble-green-950">
                        {service.title}
                      </h3>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-noble-green-700">
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
  );
}
