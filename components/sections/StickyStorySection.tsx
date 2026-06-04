import { Camera, CheckCircle2, ClipboardCheck, Scissors } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ScrollReveal } from "@/components/sections/ScrollReveal";
import { GlassCard } from "@/components/ui/GlassCard";

const steps = [
  {
    title: "Send photos",
    text: "Upload a few lawn photos or send them by WhatsApp so the condition and access can be judged properly.",
    icon: Camera,
  },
  {
    title: "Get a quote",
    text: "The price is based on the actual lawn, not a generic online booking slot.",
    icon: ClipboardCheck,
  },
  {
    title: "Lawn is cut",
    text: "The grass is brought back under control with a clean, practical finish.",
    icon: Scissors,
  },
  {
    title: "Property looks clean",
    text: "The result is a sharper first impression for homeowners, tenants, buyers, or visitors.",
    icon: CheckCircle2,
  },
];

export function StickyStorySection() {
  return (
    <Section className="relative overflow-hidden py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgb(154_170_131_/_0.20),transparent_24rem)]" />
      <Container className="relative grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ScrollReveal>
            <div className="relative min-h-[25rem] overflow-hidden rounded-3xl border border-border-soft bg-[linear-gradient(145deg,#071710,#123226_48%,#697a58)] shadow-[var(--shadow-lifted)] md:min-h-[34rem]">
              <Image
                src="/images/site/overgrown-to-presentable.jpg"
                alt="A lawn changing from overgrown to freshly mown"
                fill
                sizes="(min-width: 1024px) 45vw, 92vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_23_16_/_0.08),rgb(7_23_16_/_0.78))]" />
              <div className="absolute inset-7 rounded-3xl border border-ivory/18" />
              <div className="absolute -right-16 top-10 size-48 rounded-full border border-ivory/10" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-ivory/15 bg-ivory/12 p-5 text-ivory backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-200">
                  From overgrown to presentable
                </p>
                <p className="mt-3 font-serif text-5xl font-semibold leading-none">
                  Four simple steps, one cleaner lawn.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
        <div className="grid gap-5">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <ScrollReveal key={step.title} delay={index * 0.05}>
                <GlassCard className="group p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lifted)] md:p-8">
                  <div className="flex items-start gap-5">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-noble-green-900 text-ivory shadow-[0_14px_34px_rgb(18_50_38_/_0.22)]">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold uppercase tracking-[0.16em] text-earth-700">
                        0{index + 1}
                      </span>
                      <h2 className="mt-3 font-serif text-4xl font-semibold leading-none text-noble-green-950 md:text-5xl">
                        {step.title}
                      </h2>
                      <p className="mt-4 text-base leading-8 text-noble-green-700">
                        {step.text}
                      </p>
                    </div>
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
