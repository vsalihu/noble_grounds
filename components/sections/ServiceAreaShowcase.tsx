import { MapPin } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ScrollReveal } from "@/components/sections/ScrollReveal";
import { siteConfig } from "@/data/site";

export function ServiceAreaShowcase() {
  return (
    <Section className="py-16 md:py-24">
      <Container>
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-2xl bg-noble-green-900 p-6 text-ivory shadow-[var(--shadow-lifted)] md:p-8 lg:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgb(220_228_207_/_0.18),transparent_24rem),linear-gradient(135deg,rgb(255_255_255_/_0.08),transparent)]" />
            <div className="relative grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage-200">
                  Service areas
                </p>
                <h2 className="mt-3 font-serif text-5xl font-semibold leading-[0.98] md:text-6xl">
                  Local routes, polished results.
                </h2>
                <p className="mt-5 text-sm leading-7 text-sage-200">
                  Noble Grounds is focused on Leverington, Wisbech and nearby
                  villages, keeping the service practical, responsive and local.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {siteConfig.serviceAreas.map((area) => (
                  <div
                    key={area}
                    className="flex items-center gap-3 rounded-md border border-ivory/15 bg-ivory/10 px-4 py-4 text-sm font-semibold backdrop-blur"
                  >
                    <MapPin className="size-4 text-earth-200" />
                    {area}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
