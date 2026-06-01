import { ArrowRight, CheckCircle2, Leaf, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Container } from "@/components/layout/Container";
import { ScrollReveal } from "@/components/sections/ScrollReveal";

export function PremiumHero() {
  return (
    <GradientBackground className="pt-8 md:pt-12">
      <Container className="grid min-h-[calc(100svh-5rem)] gap-10 pb-16 lg:grid-cols-[0.96fr_1.04fr] lg:items-center lg:gap-14 lg:pb-20">
        <ScrollReveal className="max-w-3xl">
          <Badge icon={<Leaf className="size-3.5" />}>
            Leverington, Wisbech and nearby villages
          </Badge>
          <h1 className="text-balance mt-6 font-serif text-[3.55rem] font-semibold leading-[0.88] text-noble-green-950 min-[430px]:text-7xl md:text-8xl xl:text-[6.8rem]">
            Lawns cut with quiet precision.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-noble-green-700 min-[430px]:text-lg">
            Premium grass mowing for homes, rentals, businesses and estate agents
            that need a clean, presentable finish without a cheap garden-template
            feel.
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

          <div className="mt-8 grid gap-3 text-sm font-medium text-noble-green-800 sm:grid-cols-3">
            {["Quote-only", "Locally focused", "Photo-friendly enquiries"].map(
              (item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-sage-700" />
                  <span>{item}</span>
                </div>
              ),
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08} className="min-w-0">
          <div className="relative min-h-[31rem] overflow-hidden rounded-2xl border border-noble-green-900/10 bg-noble-green-900 shadow-[0_32px_90px_rgb(7_23_16_/_0.22)] md:min-h-[40rem]">
            <div className="absolute inset-0 bg-[linear-gradient(145deg,#071710,#123226_46%,#697a58_100%)]" />
            <div className="absolute inset-6 rounded-2xl border border-ivory/15 bg-[radial-gradient(circle_at_24%_12%,rgb(255_253_247_/_0.20),transparent_15rem),linear-gradient(155deg,rgb(255_255_255_/_0.04),transparent)]" />
            <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-[linear-gradient(180deg,transparent,rgb(7_23_16_/_0.74))]" />

            <div className="absolute left-6 top-6 rounded-md border border-ivory/15 bg-ivory/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ivory backdrop-blur">
              Noble Grounds
            </div>
            <div className="absolute right-6 top-20 h-48 w-28 rounded-full border border-ivory/15 bg-sage-200/20 blur-xl" />
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ivory/10" />

            <GlassCard className="absolute inset-x-5 bottom-5 p-5 md:inset-x-8 md:bottom-8 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-700">
                    Property presentation
                  </p>
                  <p className="mt-3 font-serif text-4xl font-semibold leading-none text-noble-green-950">
                    From overgrown to composed.
                  </p>
                </div>
                <MapPin className="size-6 shrink-0 text-earth-700" />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {["Assess", "Cut", "Present"].map((item) => (
                  <div
                    key={item}
                    className="rounded-md border border-border-soft bg-cream px-3 py-3 text-center text-xs font-semibold text-noble-green-800"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </ScrollReveal>
      </Container>
    </GradientBackground>
  );
}
