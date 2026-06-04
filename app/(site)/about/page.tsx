import { MapPin, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHero } from "@/components/sections/PageHero";
import { QuoteBand } from "@/components/sections/QuoteBand";
import { AnimatedProcess } from "@/components/sections/AnimatedProcess";
import { ServiceAreaShowcase } from "@/components/sections/ServiceAreaShowcase";
import { ScrollReveal } from "@/components/sections/ScrollReveal";
import { fetchSiteContent } from "@/lib/cms";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About Noble Grounds Lawn Care in Leverington",
  description:
    "Noble Grounds is a local premium grass mowing and lawn care business based in Leverington, serving Wisbech and nearby villages.",
  path: "/about",
  ogTitle: "About Noble Grounds | Leverington Lawn Care",
  ogDescription:
    "Local premium grass mowing for homeowners, landlords, businesses and estate agents around Leverington and Wisbech.",
  keywords: [
    "local lawn care Leverington",
    "premium grass mowing Wisbech",
    "Leverington grass cutting business",
  ],
});

const values = [
  {
    title: "Local and practical",
    text: "Based in Leverington and focused on nearby areas, with clear communication and sensible scheduling.",
    icon: MapPin,
  },
  {
    title: "Clean finish",
    text: "Mowing that pays attention to the overall presentation, not just getting the grass shorter.",
    icon: Sparkles,
  },
  {
    title: "Professional service",
    text: "A reliable standard for homeowners, landlords, local businesses, and estate agents.",
    icon: ShieldCheck,
  },
];

export default async function AboutPage() {
  const siteContent = await fetchSiteContent();
  const intro = siteContent.about_intro;

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <PageHero
        eyebrow="About"
        title={intro?.title ?? "Local lawn care with a premium standard."}
      >
        {intro?.body ??
          "Noble Grounds is a grass mowing business based in Leverington, serving Wisbech and nearby villages with reliable, clean, and professional lawn care."}
      </PageHero>
      <Section className="pt-0">
        <Container className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <ScrollReveal>
            <div className="relative min-h-96 overflow-hidden rounded-2xl border border-border-soft bg-[linear-gradient(145deg,#071710,#123226_52%,#697a58)] shadow-[var(--shadow-lifted)]">
              <Image
                src="/images/site/overgrown-to-presentable.jpg"
                alt="A freshly mown local lawn with clean presentation"
                fill
                sizes="(min-width: 1024px) 45vw, 92vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_23_16_/_0.08),rgb(7_23_16_/_0.74))]" />
              <div className="absolute inset-8 rounded-2xl border border-ivory/15" />
              <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-ivory/15 bg-ivory/12 p-5 text-ivory backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-200">
                  Leverington based
                </p>
                <p className="mt-2 font-serif text-4xl font-semibold leading-none">
                  Local work, premium presentation.
                </p>
              </div>
            </div>
          </ScrollReveal>
          <div className="grid gap-4">
            {values.map((value, index) => {
              const Icon = value.icon;

              return (
                <ScrollReveal key={value.title} delay={index * 0.05}>
                  <GlassCard className="p-6">
                    <Icon className="size-7 text-earth-700" />
                    <h2 className="mt-5 font-serif text-3xl font-semibold text-noble-green-950">
                      {value.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-noble-green-700">
                      {value.text}
                    </p>
                  </GlassCard>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </Section>
      <AnimatedProcess title="A clear process for a cleaner result." />
      <ServiceAreaShowcase />
      <QuoteBand />
    </main>
  );
}
