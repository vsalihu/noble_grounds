import { Building2, Home, KeyRound, Store } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ScrollReveal } from "@/components/sections/ScrollReveal";
import { GlassCard } from "@/components/ui/GlassCard";

const audiences = [
  {
    title: "Homeowners",
    text: "Regular mowing with a finish that feels cared for.",
    icon: Home,
  },
  {
    title: "Landlords",
    text: "Rental gardens kept tidy between inspections or tenancies.",
    icon: KeyRound,
  },
  {
    title: "Estate agents",
    text: "Sharper kerb appeal before photos, valuations, or viewings.",
    icon: Building2,
  },
  {
    title: "Businesses",
    text: "Frontages and grounds that look professional for visitors.",
    icon: Store,
  },
];

export function WhoWeHelp() {
  return (
    <Section className="overflow-hidden bg-noble-green-950 py-16 text-ivory md:py-24">
      <Container>
        <ScrollReveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage-200">
            Who we help
          </p>
          <h2 className="text-balance mt-3 font-serif text-5xl font-semibold leading-[0.98] md:text-6xl">
            One mowing standard, shaped around the property.
          </h2>
        </ScrollReveal>
        <div className="mt-9 flex gap-4 overflow-x-auto pb-3 md:grid md:grid-cols-2 md:overflow-visible xl:grid-cols-4">
          {audiences.map((audience, index) => {
            const Icon = audience.icon;

            return (
              <ScrollReveal
                key={audience.title}
                delay={index * 0.05}
                className="min-w-[17rem] md:min-w-0"
              >
                <GlassCard className="h-full border-ivory/15 bg-ivory/10 p-5 text-ivory">
                  <Icon className="size-7 text-earth-200" />
                  <h3 className="mt-8 font-serif text-3xl font-semibold">
                    {audience.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-sage-200">
                    {audience.text}
                  </p>
                </GlassCard>
              </ScrollReveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
