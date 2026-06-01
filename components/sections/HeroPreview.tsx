import { ArrowRight, CheckCircle2, Leaf, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/ui/FadeIn";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export function HeroPreview() {
  return (
    <Section className="premium-grain overflow-hidden pt-8 md:pt-12">
      <Container className="relative grid gap-10 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-14">
        <FadeIn className="max-w-2xl">
          <Badge icon={<Leaf className="size-3.5" />}>
            Leverington, Wisbech and nearby villages
          </Badge>

          <h1 className="text-balance mt-6 font-serif text-[3.25rem] leading-[0.92] font-semibold text-noble-green-950 min-[430px]:text-6xl md:text-7xl xl:text-8xl">
            Refined grass mowing for properties that need to look cared for.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-noble-green-700 min-[430px]:text-lg">
            Noble Grounds provides premium lawn mowing for homeowners,
            landlords, businesses, and estate agents who want a clean finish,
            reliable visits, and local accountability.
          </p>

          <div className="mt-8 flex flex-col gap-3 min-[430px]:flex-row">
            <Button href="/contact" variant="grass">
              Request a Quote
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Button>
            <Button href="/services" variant="secondary">
              View Services
            </Button>
          </div>

          <div className="mt-8 grid gap-3 text-sm text-noble-green-800 sm:grid-cols-3">
            {["Local to Leverington", "Quote-only service", "Professional presentation"].map(
              (item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-sage-700" />
                  <span>{item}</span>
                </div>
              ),
            )}
          </div>
        </FadeIn>

        <FadeIn delay={0.08} className="min-w-0">
          <div className="relative min-h-[25rem] overflow-hidden rounded-lg border border-border-soft bg-noble-green-800 shadow-[var(--shadow-lifted)] md:min-h-[34rem]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgb(220_228_207_/_0.42),transparent_24rem),linear-gradient(145deg,#0b2118_0%,#123226_48%,#697a58_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent,rgb(7_23_16_/_0.34))]" />
            <div className="absolute inset-x-6 bottom-6 rounded-md border border-white/15 bg-ivory/92 p-5 shadow-[0_20px_50px_rgb(7_23_16_/_0.24)] backdrop-blur md:inset-x-8 md:bottom-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage-700">
                    Preview
                  </p>
                  <p className="mt-2 font-serif text-3xl leading-none font-semibold text-noble-green-950">
                    Neat edges. Even finish. Reliable visits.
                  </p>
                </div>
                <MapPin className="size-6 shrink-0 text-earth-700" />
              </div>
            </div>
            <div className="absolute left-7 top-8 h-32 w-32 rounded-full border border-white/20 bg-white/10 blur-sm" />
            <div className="absolute right-8 top-10 h-44 w-28 rounded-full bg-sage-200/20 blur-2xl" />
            <div className="absolute right-7 top-7 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ivory backdrop-blur">
              Wisbech area
            </div>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
