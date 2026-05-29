import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/layout/Container";
import { ScrollReveal } from "@/components/sections/ScrollReveal";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export function PageHero({ eyebrow, title, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden pb-12 pt-10 md:pt-16 lg:pb-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgb(154_170_131_/_0.22),transparent_24rem),radial-gradient(circle_at_86%_20%,rgb(183_150_115_/_0.16),transparent_22rem)]" />
      <Container className="relative grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
        <ScrollReveal className="max-w-3xl">
          <Badge>{eyebrow}</Badge>
          <h1 className="text-balance mt-6 font-serif text-5xl leading-[0.96] font-semibold text-noble-green-950 min-[430px]:text-6xl md:text-7xl">
            {title}
          </h1>
          <div className="mt-6 max-w-2xl text-base leading-8 text-noble-green-700 min-[430px]:text-lg">
            {children}
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.08} className="hidden lg:block">
          <div className="relative min-h-72 overflow-hidden rounded-2xl border border-border-soft bg-[linear-gradient(145deg,#071710,#123226_52%,#9aaa83)] shadow-[var(--shadow-lifted)]">
            <div className="absolute inset-6 rounded-2xl border border-ivory/15" />
            <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-ivory/15 bg-ivory/12 p-5 text-ivory backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-200">
                Noble Grounds
              </p>
              <p className="mt-2 font-serif text-3xl font-semibold leading-none">
                Clean, local, quote-only lawn care.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
