import { MapPin, Navigation } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ScrollReveal } from "@/components/sections/ScrollReveal";
import { siteConfig } from "@/data/site";

export function ServiceAreaShowcase() {
  const areas = [...siteConfig.serviceAreas, "Nearby villages"];

  return (
    <Section className="py-16 md:py-24">
      <Container>
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl bg-noble-green-900 p-6 text-ivory shadow-[var(--shadow-lifted)] md:p-8 lg:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgb(220_228_207_/_0.18),transparent_24rem),radial-gradient(circle_at_82%_38%,rgb(183_150_115_/_0.18),transparent_22rem),linear-gradient(135deg,rgb(255_255_255_/_0.08),transparent)]" />
            <div className="absolute -right-16 -top-16 size-56 rounded-full border border-ivory/10" />
            <div className="relative grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
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
                <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-ivory/15 bg-ivory/10 px-4 py-3 text-sm font-semibold backdrop-blur">
                  <Navigation className="size-4 text-earth-200" />
                  Quote requests welcome across nearby Fenland villages.
                </div>
              </div>
              <div className="grid gap-3 min-[430px]:grid-cols-2 lg:grid-cols-3">
                {areas.map((area, index) => (
                  <div
                    key={area}
                    className={`group flex min-h-20 items-center gap-3 rounded-2xl border border-ivory/15 bg-ivory/10 px-4 py-4 text-sm font-semibold backdrop-blur transition hover:-translate-y-1 hover:bg-ivory/15 ${
                      index === 0 ? "lg:col-span-2" : ""
                    }`}
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ivory/10">
                      <MapPin className="size-4 text-earth-200" />
                    </span>
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
