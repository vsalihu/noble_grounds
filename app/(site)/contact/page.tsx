import { Mail, MessageCircle, Phone } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { PageHero } from "@/components/sections/PageHero";
import { QuoteForm } from "@/components/sections/QuoteForm";
import { siteConfig } from "@/data/site";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Contact Noble Grounds for a Grass Mowing Quote",
  description:
    "Request a quote from Noble Grounds for premium grass mowing, lawn mowing and grass cutting in Leverington, Wisbech and nearby villages.",
  path: "/contact",
  ogTitle: "Request a Grass Mowing Quote | Noble Grounds",
  ogDescription:
    "Contact Noble Grounds for quote-only grass mowing, landlord lawn care, estate agent mowing and business grounds mowing around Wisbech.",
  keywords: [
    "grass mowing quote Leverington",
    "lawn mowing quote Wisbech",
    "contact lawn care Wisbech",
  ],
});

const contactCards = [
  {
    title: "Call",
    text: "Speak directly about the property, access, and service needed.",
    href: `tel:${siteConfig.phone}`,
    action: siteConfig.phone,
    icon: Phone,
  },
  {
    title: "WhatsApp",
    text: "Send lawn photos, address area, and preferred mowing frequency.",
    href: `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`,
    action: "Send photos",
    icon: MessageCircle,
  },
  {
    title: "Email",
    text: "Share details for homes, rentals, businesses, or estate agent work.",
    href: `mailto:${siteConfig.email}`,
    action: siteConfig.email,
    icon: Mail,
  },
];

export default function ContactPage() {
  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <PageHero eyebrow="Contact" title="Request a quote for premium grass mowing.">
        No online booking and no fixed price list. Send the property details and
        Noble Grounds will respond with the next step for your mowing quote.
      </PageHero>
      <Section className="pt-0">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-4 self-start">
            {contactCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <FadeIn key={card.title} delay={index * 0.04}>
                  <Card className="p-5">
                    <Icon className="size-7 text-earth-700" />
                    <h2 className="mt-5 font-serif text-3xl font-semibold text-noble-green-950">
                      {card.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-noble-green-700">
                      {card.text}
                    </p>
                    <Button href={card.href} variant="secondary" className="mt-5">
                      {card.action}
                    </Button>
                  </Card>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn delay={0.08}>
            <Card className="p-5 md:p-6">
              <h2 className="font-serif text-4xl font-semibold text-noble-green-950">
                Quote request
              </h2>
              <p className="mt-3 text-sm leading-7 text-noble-green-700">
                Send the details needed for a quote. There is no online booking;
                Noble Grounds will respond with the next step.
              </p>
              <div className="mt-6">
                <QuoteForm />
              </div>
            </Card>
          </FadeIn>
        </Container>
      </Section>
    </main>
  );
}
