import { Camera, MessageCircle, ShieldCheck, Sprout } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ScrollReveal } from "@/components/sections/ScrollReveal";
import { GlassCard } from "@/components/ui/GlassCard";

const highlights = [
  {
    label: "Local service",
    text: "Leverington, Wisbech and nearby villages.",
    icon: Sprout,
  },
  {
    label: "Quote-only pricing",
    text: "Every lawn is assessed properly.",
    icon: ShieldCheck,
  },
  {
    label: "Before/after portfolio",
    text: "Gallery built around visible results.",
    icon: Camera,
  },
  {
    label: "WhatsApp friendly",
    text: "Send photos for a clearer quote.",
    icon: MessageCircle,
  },
];

export function TrustHighlights() {
  return (
    <section className="-mt-6 pb-10 md:-mt-10 md:pb-14">
      <Container>
        <ScrollReveal>
          <GlassCard className="grid gap-px overflow-hidden bg-noble-green-900/10 p-px md:grid-cols-4">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="bg-ivory/82 p-5">
                  <Icon className="size-6 text-earth-700" />
                  <p className="mt-4 text-sm font-semibold text-noble-green-950">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-noble-green-700">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </GlassCard>
        </ScrollReveal>
      </Container>
    </section>
  );
}
