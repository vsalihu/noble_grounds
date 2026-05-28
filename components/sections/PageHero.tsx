import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/ui/FadeIn";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export function PageHero({ eyebrow, title, children }: PageHeroProps) {
  return (
    <Section className="premium-grain pb-10 pt-10 md:pt-16 lg:pb-12">
      <Container>
        <FadeIn className="max-w-3xl">
          <Badge>{eyebrow}</Badge>
          <h1 className="text-balance mt-6 font-serif text-5xl leading-[0.96] font-semibold text-noble-green-950 min-[430px]:text-6xl md:text-7xl">
            {title}
          </h1>
          <div className="mt-6 max-w-2xl text-base leading-8 text-noble-green-700 min-[430px]:text-lg">
            {children}
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
