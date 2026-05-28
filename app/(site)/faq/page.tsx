import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { PageHero } from "@/components/sections/PageHero";
import { QuoteBand } from "@/components/sections/QuoteBand";
import { breadcrumbJsonLd, createMetadata, faqJsonLd } from "@/lib/seo";

export const metadata = createMetadata({
  title: "FAQ About Grass Mowing in Leverington and Wisbech",
  description:
    "Answers about Noble Grounds grass mowing, lawn care, landlord work, estate agent services and quote requests in Leverington and Wisbech.",
  path: "/faq",
  ogTitle: "Grass Mowing FAQ | Noble Grounds",
  ogDescription:
    "Answers about lawn mowing, grass cutting, landlord lawn care, estate agent mowing and quotes around Leverington and Wisbech.",
  keywords: [
    "grass mowing questions Wisbech",
    "landlord lawn care Wisbech",
    "estate agent lawn mowing Wisbech",
  ],
});

const faqs = [
  {
    question: "Do you only cut grass?",
    answer:
      "This stage of Noble Grounds is focused on premium grass mowing and lawn presentation. Broader garden maintenance can be discussed, but mowing is the core service.",
  },
  {
    question: "Do you cover Wisbech?",
    answer:
      "Yes. Noble Grounds is based in Leverington and serves Wisbech and nearby areas including Parson Drove, Gorefield, Newton, and Tydd St Giles.",
  },
  {
    question: "Do you work with landlords?",
    answer:
      "Yes. Landlord lawn care is available for occupied rentals, between-tenancy tidies, and properties that need regular presentation.",
  },
  {
    question: "Do you work with estate agents?",
    answer:
      "Yes. Estate agents can request grass cutting before photos, viewings, valuations, and handovers.",
  },
  {
    question: "Can I request a regular mowing schedule?",
    answer:
      "Yes. Regular mowing can be arranged through the growing season, subject to property access and route availability.",
  },
  {
    question: "Do you offer one-off cuts?",
    answer:
      "Yes. One-off grass cuts are available for seasonal resets, missed cuts, listing preparation, or overgrown lawns.",
  },
  {
    question: "How do I get a quote?",
    answer:
      "Use the contact page, call, email, or send photos by WhatsApp. A quote depends on the lawn size, access, condition, frequency, and waste handling.",
  },
  {
    question: "Do I need to be home?",
    answer:
      "Not always. If access is clear and the details are agreed in advance, a visit can often be completed without you being home.",
  },
  {
    question: "What affects the price?",
    answer:
      "The main factors are lawn size, access, current grass condition, mowing frequency, edging requirements, and how cuttings should be handled.",
  },
  {
    question: "Can I send photos by WhatsApp?",
    answer:
      "Yes. Photos are useful and can help provide a quicker, more accurate quote before a visit is arranged.",
  },
];

export default function FaqPage() {
  return (
    <main>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
          faqJsonLd(faqs),
        ]}
      />
      <PageHero eyebrow="FAQ" title="Straight answers before you request a quote.">
        Common questions about grass mowing in Leverington, lawn mowing in
        Wisbech, regular schedules, one-off cuts, and property presentation.
      </PageHero>
      <Section className="pt-0">
        <Container className="max-w-4xl">
          <FaqAccordion items={faqs} />
        </Container>
      </Section>
      <QuoteBand />
    </main>
  );
}
