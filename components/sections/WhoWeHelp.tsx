"use client";

import { Building2, Home, KeyRound, Store } from "lucide-react";
import { useRef, useState } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function scrollToCard(index: number) {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const target = container.children.item(index) as HTMLElement | null;

    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
    setActiveIndex(index);
  }

  function handleScroll() {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const center = container.scrollLeft + container.clientWidth / 2;
    const nextIndex = Array.from(container.children).reduce(
      (closest, child, index) => {
        const element = child as HTMLElement;
        const childCenter = element.offsetLeft + element.offsetWidth / 2;
        const distance = Math.abs(center - childCenter);

        return distance < closest.distance ? { index, distance } : closest;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    ).index;

    setActiveIndex(nextIndex);
  }

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
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="no-scrollbar mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 pr-8 md:grid md:snap-none md:grid-cols-2 md:overflow-visible md:pr-0 xl:grid-cols-4"
          aria-label="Customer types Noble Grounds helps"
        >
          {audiences.map((audience, index) => {
            const Icon = audience.icon;

            return (
              <ScrollReveal
                key={audience.title}
                delay={index * 0.05}
                className="min-w-[82vw] snap-start min-[390px]:min-w-[19rem] md:min-w-0"
              >
                <GlassCard className="h-full border-ivory/15 bg-ivory/10 p-5 text-ivory transition duration-300 md:hover:-translate-y-1 md:hover:bg-ivory/14 md:hover:shadow-[0_26px_70px_rgb(0_0_0_/_0.22)]">
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
        <div
          className="mt-5 flex items-center justify-center gap-2 md:hidden"
          aria-label="Who we help carousel position"
        >
          {audiences.map((audience, index) => (
            <button
              key={audience.title}
              type="button"
              aria-label={`Show ${audience.title}`}
              aria-current={activeIndex === index ? "true" : undefined}
              onClick={() => scrollToCard(index)}
              className={[
                "h-2.5 rounded-full transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sage-200",
                activeIndex === index
                  ? "w-7 bg-ivory"
                  : "w-2.5 bg-ivory/35 hover:bg-ivory/60",
              ].join(" ")}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
