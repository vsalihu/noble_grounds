import { Camera, CheckCircle2, MessageCircle, Scissors } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ScrollReveal } from "@/components/sections/ScrollReveal";
import { AnimatedDivider } from "@/components/ui/AnimatedDivider";
import { GlassCard } from "@/components/ui/GlassCard";

const steps = [
  {
    title: "Request quote",
    text: "Send the property area and service needed.",
    icon: MessageCircle,
  },
  {
    title: "Share photos",
    text: "Photos help show lawn size, access, and condition.",
    icon: Camera,
  },
  {
    title: "Professional cut",
    text: "The mowing is handled with a clean, careful finish.",
    icon: Scissors,
  },
  {
    title: "Presentable result",
    text: "The property looks cared for again.",
    icon: CheckCircle2,
  },
];

export function AnimatedProcess({
  title = "A simple route to a sharper lawn.",
}: {
  title?: string;
}) {
  return (
    <Section className="py-16 md:py-24">
      <Container>
        <ScrollReveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage-700">
            How it works
          </p>
          <h2 className="text-balance mt-3 font-serif text-5xl font-semibold leading-[0.98] text-noble-green-950 md:text-6xl">
            {title}
          </h2>
        </ScrollReveal>
        <AnimatedDivider className="my-8" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <ScrollReveal key={step.title} delay={index * 0.05}>
                <GlassCard className="h-full p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgb(18_50_38_/_0.16)]">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-serif text-5xl font-semibold text-earth-700/45">
                      0{index + 1}
                    </span>
                    <span className="flex size-12 items-center justify-center rounded-md bg-noble-green-800 text-ivory">
                      <Icon className="size-5" />
                    </span>
                  </div>
                  <h3 className="mt-6 font-serif text-3xl font-semibold text-noble-green-950">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-noble-green-700">
                    {step.text}
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
