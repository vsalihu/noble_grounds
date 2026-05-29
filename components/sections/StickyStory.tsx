import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ScrollReveal } from "@/components/sections/ScrollReveal";
import { GlassCard } from "@/components/ui/GlassCard";

const story = [
  {
    title: "Overgrown",
    text: "The first look is about access, grass condition, and what the property needs to feel presentable again.",
  },
  {
    title: "Cut with intent",
    text: "The service is focused on an even cut, tidy movement around the property, and a finish that looks controlled.",
  },
  {
    title: "Ready to be seen",
    text: "Useful for homeowners, landlords, estate agents, and businesses where first impressions matter.",
  },
];

export function StickyStory() {
  return (
    <Section className="py-16 md:py-24">
      <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ScrollReveal>
            <div className="relative min-h-[24rem] overflow-hidden rounded-2xl border border-border-soft bg-[linear-gradient(145deg,#071710,#123226_48%,#697a58)] shadow-[var(--shadow-lifted)] md:min-h-[32rem]">
              <div className="absolute inset-7 rounded-2xl border border-ivory/15" />
              <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-ivory/15 bg-ivory/12 p-5 text-ivory backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-200">
                  From overgrown to elegant
                </p>
                <p className="mt-3 font-serif text-4xl font-semibold leading-none">
                  A quieter kind of premium.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
        <div className="grid gap-5">
          {story.map((item, index) => (
            <ScrollReveal key={item.title} delay={index * 0.05}>
              <GlassCard className="p-6 md:p-8">
                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-earth-700">
                  0{index + 1}
                </span>
                <h2 className="mt-4 font-serif text-5xl font-semibold leading-none text-noble-green-950">
                  {item.title}
                </h2>
                <p className="mt-4 text-base leading-8 text-noble-green-700">
                  {item.text}
                </p>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
