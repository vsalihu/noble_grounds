import { MapPin } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/sections/PageHero";
import { ScrollReveal } from "@/components/sections/ScrollReveal";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { serviceAreas } from "@/data/serviceAreas";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Grass Mowing Service Areas",
  description:
    "Noble Grounds provides premium grass mowing, lawn care and grass cutting across Leverington, Wisbech, Gorefield, Parson Drove, Newton, Tydd St Giles, Sutton Bridge and Long Sutton.",
  path: "/service-areas",
  ogTitle: "Noble Grounds Service Areas",
  ogDescription:
    "Local quote-only lawn mowing and grass cutting service areas around Leverington and Wisbech.",
  keywords: [
    "grass mowing service areas Wisbech",
    "lawn care service areas Leverington",
    "grass cutting near Wisbech",
  ],
});

export default function ServiceAreasPage() {
  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Service Areas", path: "/service-areas" },
        ])}
      />
      <PageHero eyebrow="Service Areas" title="Local grass mowing around Wisbech.">
        Noble Grounds provides premium, quote-only grass mowing for homes,
        landlords, estate agents and businesses across Leverington, Wisbech and
        nearby villages.
      </PageHero>
      <Section className="pt-0">
        <Container>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {serviceAreas.map((area, index) => (
              <ScrollReveal key={area.slug} delay={index * 0.03}>
                <GlassCard className="h-full p-5 transition duration-300 md:hover:-translate-y-1 md:hover:shadow-[var(--shadow-lifted)]">
                  <MapPin className="size-7 text-earth-700" />
                  <h2 className="mt-5 font-serif text-3xl font-semibold text-noble-green-950">
                    {area.name}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-noble-green-700">
                    {area.description}
                  </p>
                  <Button
                    href={`/service-areas/${area.slug}`}
                    variant="secondary"
                    className="mt-5"
                  >
                    View Area
                  </Button>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
