import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Building2,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Home,
  KeyRound,
  Scissors,
  Store,
} from "lucide-react";
import { GalleryComparisonCard } from "@/components/gallery/GalleryComparisonCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import {
  ServiceAreaCtas,
  ServiceAreaViewTracker,
} from "@/components/sections/ServiceAreaCtas";
import { ScrollReveal } from "@/components/sections/ScrollReveal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { serviceAreas, getServiceArea } from "@/data/serviceAreas";
import { siteConfig } from "@/data/site";
import { fetchGalleryProjectsWithComparisons } from "@/lib/gallery";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  createMetadata,
  faqJsonLd,
} from "@/lib/seo";
import type { GalleryComparison, GalleryProject } from "@/types/supabase";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const helpCards = [
  {
    title: "Homeowners",
    text: "Regular mowing and one-off cuts for lawns that need to look cared for.",
    icon: Home,
  },
  {
    title: "Landlords",
    text: "Rental property lawn care for inspections, new tenants, and tidy handovers.",
    icon: KeyRound,
  },
  {
    title: "Estate agents",
    text: "Presentation cuts before photos, viewings, valuations, or completion.",
    icon: Building2,
  },
  {
    title: "Businesses",
    text: "Cleaner grounds and frontages for customer-facing local premises.",
    icon: Store,
  },
];

const processSteps = [
  {
    title: "Send details",
    text: "Share the property area, access notes, mowing frequency, and lawn photos if available.",
    icon: Camera,
  },
  {
    title: "Get a quote",
    text: "Noble Grounds prices the actual lawn, condition, access, and finish needed.",
    icon: ClipboardCheck,
  },
  {
    title: "Lawn is cut",
    text: "The grass is mown with a clean, practical standard for the property.",
    icon: Scissors,
  },
  {
    title: "Looks presentable",
    text: "The property has a neater first impression for owners, tenants, buyers, or visitors.",
    icon: CheckCircle2,
  },
];

const fallbackProject = (area: string): GalleryProject => ({
  id: `service-area-${area.toLowerCase().replace(/\s+/g, "-")}`,
  title: `${area} lawn presentation`,
  address: area,
  location: area,
  customer_type: "Residential",
  description: null,
  is_featured: true,
  display_order: 0,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
});

const fallbackComparison = (area: string, projectId: string): GalleryComparison => ({
  id: `service-area-${projectId}-fallback`,
  project_id: projectId,
  before_image_url: "",
  before_storage_path: "",
  after_image_url: "",
  after_storage_path: "",
  title: "Tap to reveal the finish",
  description: null,
  location: area,
  alt_text: `Noble Grounds grass mowing before and after in ${area}`,
  is_featured: true,
  display_order: 0,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
});

export function generateStaticParams() {
  return serviceAreas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const area = getServiceArea(slug);

  if (!area) {
    return {};
  }

  return createMetadata({
    title: `${area.title} | Premium Lawn Care`,
    description: area.description,
    path: `/service-areas/${area.slug}`,
    ogTitle: `${area.title} | Noble Grounds`,
    ogDescription: area.description,
    keywords: area.keywords,
  });
}

export default async function ServiceAreaPage({ params }: PageProps) {
  const { slug } = await params;
  const area = getServiceArea(slug);

  if (!area) {
    notFound();
  }

  const whatsappHref = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`;
  const galleryProjects = await fetchGalleryProjectsWithComparisons();
  const featuredItems = galleryProjects
    .flatMap((project) =>
      project.gallery_comparisons.map((comparison) => ({ project, comparison })),
    )
    .filter(({ comparison }) => comparison.is_featured)
    .slice(0, 3);
  const fallback = fallbackProject(area.name);
  const galleryItems =
    featuredItems.length > 0
      ? featuredItems
      : [
          {
            project: fallback,
            comparison: fallbackComparison(area.name, fallback.id),
          },
        ];
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(`/service-areas/${area.slug}`)}#service`,
    name: area.title,
    serviceType: "Grass mowing and lawn care",
    provider: {
      "@id": `${absoluteUrl("/")}#localbusiness`,
    },
    areaServed: {
      "@type": "Place",
      name: area.name,
    },
    description: area.description,
    offers: {
      "@type": "Offer",
      priceCurrency: "GBP",
      description:
        "Quote-only pricing based on lawn size, access, condition, frequency, and waste handling.",
    },
  };

  return (
    <main>
      <ServiceAreaViewTracker />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Service Areas", path: "/service-areas" },
            { name: area.name, path: `/service-areas/${area.slug}` },
          ]),
          serviceJsonLd,
          faqJsonLd(area.faqs),
        ]}
      />

      <section className="relative overflow-hidden pb-14 pt-10 md:pt-16 lg:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgb(154_170_131_/_0.26),transparent_25rem),radial-gradient(circle_at_86%_22%,rgb(183_150_115_/_0.18),transparent_24rem)]" />
        <Container className="relative grid gap-8 lg:grid-cols-[1fr_0.76fr] lg:items-end">
          <ScrollReveal className="max-w-3xl">
            <Badge>{area.name}</Badge>
            <h1 className="text-balance mt-6 font-serif text-5xl font-semibold leading-[0.94] text-noble-green-950 min-[430px]:text-6xl md:text-7xl">
              {area.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-noble-green-700 min-[430px]:text-lg">
              {area.description}
            </p>
            <ServiceAreaCtas whatsappHref={whatsappHref} className="mt-8" />
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <div className="relative min-h-96 overflow-hidden rounded-3xl border border-border-soft bg-noble-green-900 shadow-[var(--shadow-lifted)]">
              <Image
                src="/images/site/overgrown-to-presentable.jpg"
                alt={`Freshly mown lawn in ${area.name}`}
                fill
                sizes="(min-width: 1024px) 36vw, 92vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(7_23_16_/_0.58),rgb(18_50_38_/_0.38))]" />
              <div className="absolute inset-7 rounded-3xl border border-ivory/15" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-ivory/15 bg-ivory/12 p-5 text-ivory backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-200">
                  Local quote-only mowing
                </p>
                <p className="mt-3 font-serif text-4xl font-semibold leading-none">
                  {area.heroText}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      <Section className="pt-0">
        <Container className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <ScrollReveal className="lg:sticky lg:top-28 lg:self-start">
            <GlassCard className="p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage-700">
                Local service
              </p>
              <h2 className="mt-3 font-serif text-5xl font-semibold leading-none text-noble-green-950">
                Lawn care in {area.name}, handled properly.
              </h2>
              <p className="mt-5 text-sm leading-7 text-noble-green-700">
                Noble Grounds provides grass mowing, lawn cutting, regular
                maintenance, one-off cuts, landlord property care, estate-agent
                presentation cuts, and business premises mowing in {area.name}.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {area.nearbyAreas.map((nearby) => (
                  <span
                    key={nearby}
                    className="rounded-md border border-border-soft bg-cream px-3 py-2 text-sm font-semibold text-noble-green-800"
                  >
                    Near {nearby}
                  </span>
                ))}
              </div>
              <Button href="/services" variant="secondary" className="mt-6">
                View All Services
              </Button>
            </GlassCard>
          </ScrollReveal>

          <div className="grid gap-4 md:grid-cols-2">
            {helpCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <ScrollReveal key={card.title} delay={index * 0.04}>
                  <GlassCard className="h-full p-6 transition duration-300 md:hover:-translate-y-1 md:hover:shadow-[var(--shadow-lifted)]">
                    <Icon className="size-7 text-earth-700" />
                    <h3 className="mt-5 font-serif text-3xl font-semibold text-noble-green-950">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-noble-green-700">
                      {card.text}
                    </p>
                  </GlassCard>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section className="bg-noble-green-950 py-16 text-ivory md:py-24">
        <Container>
          <ScrollReveal className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage-200">
              How it works
            </p>
            <h2 className="mt-3 font-serif text-5xl font-semibold leading-none md:text-6xl">
              A simple route to a cleaner lawn in {area.name}.
            </h2>
          </ScrollReveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <ScrollReveal key={step.title} delay={index * 0.04}>
                  <GlassCard className="h-full border-ivory/15 bg-ivory/10 p-5 text-ivory">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-serif text-5xl font-semibold text-earth-200/70">
                        0{index + 1}
                      </span>
                      <span className="flex size-12 items-center justify-center rounded-md bg-ivory text-noble-green-900">
                        <Icon className="size-5" />
                      </span>
                    </div>
                    <h3 className="mt-6 font-serif text-3xl font-semibold">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-sage-200">
                      {step.text}
                    </p>
                  </GlassCard>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <ScrollReveal>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage-700">
                Gallery preview
              </p>
              <h2 className="mt-3 font-serif text-5xl font-semibold leading-none text-noble-green-950 md:text-6xl">
                See the difference a clean cut can make.
              </h2>
              <p className="mt-5 text-base leading-8 text-noble-green-700">
                Featured before/after cards appear here when available. Tap a
                card to reveal the after image.
              </p>
            </ScrollReveal>
            <div className="grid gap-5 md:grid-cols-3">
              {galleryItems.map(({ project, comparison }, index) => (
                <ScrollReveal key={comparison.id} delay={index * 0.05}>
                  <GalleryComparisonCard comparison={comparison} project={project} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <ScrollReveal>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage-700">
              Local FAQ
            </p>
            <h2 className="mt-3 font-serif text-5xl font-semibold leading-none text-noble-green-950 md:text-6xl">
              Questions about grass mowing in {area.name}.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <FaqAccordion items={area.faqs} />
          </ScrollReveal>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <GlassCard className="relative overflow-hidden bg-noble-green-950 p-7 text-ivory md:p-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgb(220_228_207_/_0.20),transparent_24rem),linear-gradient(135deg,rgb(255_255_255_/_0.08),transparent_50%)]" />
            <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage-200">
                  Need grass mowing in {area.name}?
                </p>
                <h2 className="mt-3 font-serif text-5xl font-semibold leading-none md:text-6xl">
                  Send a few photos and get a clear quote.
                </h2>
              </div>
              <ServiceAreaCtas whatsappHref={whatsappHref} />
            </div>
          </GlassCard>
        </Container>
      </Section>
    </main>
  );
}
