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
  },
  {
    title: "Rental properties",
    text: "Dependable presentation for landlords managing occupied or vacant homes.",
    icon: KeyRound,
  },
  {
    title: "Business grounds",
    text: "Professional first impressions for small commercial premises and frontages.",
    icon: Store,
  },
  {
    title: "Estate agents",
    text: "Tidy kerb appeal for listings, viewings, and property handovers.",
    icon: Building2,
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

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <ScrollReveal key={service.title} delay={index * 0.05}>
                <GlassCard className="group h-full p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgb(18_50_38_/_0.15)]">
                  <div className="flex size-12 items-center justify-center rounded-md bg-noble-green-800 text-ivory transition duration-200 group-hover:bg-noble-green-900">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-6 font-serif text-3xl leading-none font-semibold text-noble-green-950">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-noble-green-700">
                    {service.text}
                  </p>
                  <div className="mt-6 h-28 rounded-md border border-earth-200 bg-[linear-gradient(135deg,rgb(220_228_207_/_0.9),rgb(251_248_241_/_0.92)_42%,rgb(183_150_115_/_0.28))]" />
                </GlassCard>
              </ScrollReveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
