import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/sections/PageHero";
import { ScrollReveal } from "@/components/sections/ScrollReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { siteConfig } from "@/data/site";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description:
    "Privacy policy for Noble Grounds quote requests, contact details, uploaded lawn photos, and customer data.",
  path: "/privacy-policy",
  ogTitle: "Noble Grounds Privacy Policy",
  ogDescription:
    "How Noble Grounds handles quote request details, uploaded lawn photos, and customer contact information.",
});

const sections = [
  {
    title: "Who We Are",
    text: `${siteConfig.name} is a small grass mowing business based in ${siteConfig.location}, serving local homeowners, landlords, businesses, and estate agents.`,
  },
  {
    title: "Information We Collect",
    text: "When you request a quote, we may collect your name, phone number, email address, property area, customer type, service needed, message, and optional lawn photos.",
  },
  {
    title: "Quote Requests",
    text: "Quote request details are used to understand the lawn, respond to your enquiry, arrange a quote, and provide the requested service if agreed.",
  },
  {
    title: "Uploaded Lawn Photos",
    text: "Lawn photos are optional. They help us quote more accurately and are stored privately. They are not intended for public gallery use unless you separately give permission.",
  },
  {
    title: "Customer Reviews",
    text: "Customers can submit reviews without providing contact details. If approved, the customer name, optional location, optional customer type, rating, and review text may be displayed publicly on the website.",
  },
  {
    title: "How Data Is Stored",
    text: "Website enquiries may be stored in Supabase and sent by email notification. Access is limited to authorised Noble Grounds admin users.",
  },
  {
    title: "How Data Is Used",
    text: "Your details are used for quote handling, customer communication, service planning, and basic business record keeping. We do not sell your personal information.",
  },
  {
    title: "Analytics and Website Behaviour",
    text: "We may use Microsoft Clarity to understand anonymous website behaviour such as page visits, clicks, scroll depth, heatmaps, and session recordings. This helps improve the website experience. We do not intentionally track customer names, phone numbers, emails, addresses, or uploaded photo contents as analytics events.",
  },
  {
    title: "Your Rights",
    text: "You can ask what information is held about you, request corrections, or ask for your details to be deleted where there is no valid business reason to keep them.",
  },
  {
    title: "Contact Details",
    text: `For privacy questions, contact ${siteConfig.name} at ${siteConfig.email} or ${siteConfig.phone}.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy-policy" },
        ])}
      />
      <PageHero eyebrow="Privacy" title="Simple, careful handling of customer details.">
        This policy explains how Noble Grounds handles quote requests, contact
        details, and optional lawn photos.
      </PageHero>
      <Section className="pt-0">
        <Container>
          <div className="grid gap-4 md:grid-cols-2">
            {sections.map((section, index) => (
              <ScrollReveal key={section.title} delay={index * 0.03}>
                <GlassCard className="h-full p-6">
                  <h2 className="font-serif text-3xl font-semibold text-noble-green-950">
                    {section.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-noble-green-700">
                    {section.text}
                  </p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
          <p className="mt-8 text-sm leading-7 text-sage-700">
            Last updated: June 2026. This page is general information for a
            small UK business and should be reviewed as the business grows.
          </p>
        </Container>
      </Section>
    </main>
  );
}
