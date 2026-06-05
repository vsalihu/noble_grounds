export type ServiceArea = {
  name: string;
  slug: string;
  title: string;
  description: string;
  heroText: string;
  nearbyAreas: string[];
  keywords: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

const sharedFaqs = (area: string): ServiceArea["faqs"] => [
  {
    question: `Do you provide grass mowing in ${area}?`,
    answer: `Yes. Noble Grounds provides quote-only grass mowing and lawn cutting in ${area}, with service shaped around access, lawn condition, size, and the finish needed.`,
  },
  {
    question: `Can landlords request lawn care in ${area}?`,
    answer: `Yes. Landlords can request one-off or regular lawn care for rental properties in ${area}, including between-tenancy tidies and inspection preparation.`,
  },
  {
    question: "Can estate agents request property presentation cuts?",
    answer:
      "Yes. Noble Grounds can help estate agents improve lawn presentation before photos, viewings, valuations, and handovers.",
  },
  {
    question: "Do you offer one-off cuts?",
    answer:
      "Yes. One-off cuts are available for overgrown lawns, seasonal resets, sale preparation, or catching up after missed maintenance.",
  },
  {
    question: "Can I send photos by WhatsApp?",
    answer:
      "Yes. Photos are useful for checking lawn size, access, grass condition, and likely waste handling before preparing a quote.",
  },
  {
    question: "How do I get a quote?",
    answer:
      "Use the quote form or WhatsApp. Send the area, service needed, access notes, and a few lawn photos if possible.",
  },
];

export const serviceAreas: ServiceArea[] = [
  {
    name: "Leverington",
    slug: "leverington",
    title: "Grass Mowing in Leverington",
    description:
      "Premium lawn care for homeowners, landlords, estate agents and local businesses in Leverington and nearby areas.",
    heroText:
      "Local, quote-only grass mowing in Leverington with a clean finish for homes, rentals, business frontages, and property presentation.",
    nearbyAreas: ["Wisbech", "Gorefield", "Newton", "Tydd St Giles"],
    keywords: [
      "grass mowing Leverington",
      "lawn mowing Leverington",
      "grass cutting Leverington",
      "lawn care Leverington",
      "garden maintenance Leverington",
    ],
    faqs: sharedFaqs("Leverington"),
  },
  {
    name: "Wisbech",
    slug: "wisbech",
    title: "Grass Mowing in Wisbech",
    description:
      "Premium lawn care for homeowners, landlords, estate agents and local businesses in Wisbech and nearby areas.",
    heroText:
      "Noble Grounds provides professional grass mowing in Wisbech for lawns that need reliable care, clear communication, and a presentable finish.",
    nearbyAreas: ["Leverington", "Gorefield", "Parson Drove", "Newton"],
    keywords: [
      "grass mowing Wisbech",
      "lawn mowing Wisbech",
      "grass cutting Wisbech",
      "lawn care Wisbech",
      "garden maintenance Wisbech",
    ],
    faqs: sharedFaqs("Wisbech"),
  },
  {
    name: "Gorefield",
    slug: "gorefield",
    title: "Grass Cutting in Gorefield",
    description:
      "Premium grass mowing, lawn cutting and property presentation for Gorefield homes, rentals and local premises.",
    heroText:
      "A clean, quote-only mowing service for Gorefield properties, from regular maintenance to one-off lawn resets.",
    nearbyAreas: ["Leverington", "Wisbech", "Newton", "Parson Drove"],
    keywords: [
      "grass mowing Gorefield",
      "lawn mowing Gorefield",
      "grass cutting Gorefield",
      "lawn care Gorefield",
      "garden maintenance Gorefield",
    ],
    faqs: sharedFaqs("Gorefield"),
  },
  {
    name: "Parson Drove",
    slug: "parson-drove",
    title: "Lawn Mowing in Parson Drove",
    description:
      "Quote-only lawn mowing and grass cutting for homeowners, landlords, estate agents and businesses in Parson Drove.",
    heroText:
      "Noble Grounds helps Parson Drove properties look cleaner and more presentable with practical grass mowing and lawn care.",
    nearbyAreas: ["Wisbech", "Gorefield", "Sutton Bridge", "Long Sutton"],
    keywords: [
      "grass mowing Parson Drove",
      "lawn mowing Parson Drove",
      "grass cutting Parson Drove",
      "lawn care Parson Drove",
      "garden maintenance Parson Drove",
    ],
    faqs: sharedFaqs("Parson Drove"),
  },
  {
    name: "Newton",
    slug: "newton",
    title: "Grass Mowing in Newton",
    description:
      "Premium grass mowing and lawn presentation for Newton homes, landlords, estate agents and local businesses.",
    heroText:
      "A local mowing service for Newton lawns that need a reliable cut, tidy finish, and quote based on the actual property.",
    nearbyAreas: ["Leverington", "Wisbech", "Gorefield", "Tydd St Giles"],
    keywords: [
      "grass mowing Newton",
      "lawn mowing Newton",
      "grass cutting Newton",
      "lawn care Newton",
      "garden maintenance Newton",
    ],
    faqs: sharedFaqs("Newton"),
  },
  {
    name: "Tydd St Giles",
    slug: "tydd-st-giles",
    title: "Lawn Care in Tydd St Giles",
    description:
      "Premium grass mowing and quote-only lawn care for properties in Tydd St Giles and nearby villages.",
    heroText:
      "Noble Grounds provides clean, practical mowing for Tydd St Giles lawns, from one-off cuts to regular maintenance.",
    nearbyAreas: ["Leverington", "Newton", "Wisbech", "Sutton Bridge"],
    keywords: [
      "grass mowing Tydd St Giles",
      "lawn mowing Tydd St Giles",
      "grass cutting Tydd St Giles",
      "lawn care Tydd St Giles",
      "garden maintenance Tydd St Giles",
    ],
    faqs: sharedFaqs("Tydd St Giles"),
  },
  {
    name: "Sutton Bridge",
    slug: "sutton-bridge",
    title: "Grass Mowing in Sutton Bridge",
    description:
      "Quote-only grass mowing, lawn cutting and property presentation for Sutton Bridge homes, rentals and businesses.",
    heroText:
      "A premium mowing service for Sutton Bridge properties where clean presentation and straightforward quoting matter.",
    nearbyAreas: ["Long Sutton", "Tydd St Giles", "Parson Drove", "Wisbech"],
    keywords: [
      "grass mowing Sutton Bridge",
      "lawn mowing Sutton Bridge",
      "grass cutting Sutton Bridge",
      "lawn care Sutton Bridge",
      "garden maintenance Sutton Bridge",
    ],
    faqs: sharedFaqs("Sutton Bridge"),
  },
  {
    name: "Long Sutton",
    slug: "long-sutton",
    title: "Lawn Mowing in Long Sutton",
    description:
      "Premium lawn mowing and grass cutting for homeowners, landlords, estate agents and businesses in Long Sutton.",
    heroText:
      "Noble Grounds helps Long Sutton lawns look cared for with quote-only mowing, one-off cuts, and regular maintenance.",
    nearbyAreas: ["Sutton Bridge", "Parson Drove", "Tydd St Giles", "Wisbech"],
    keywords: [
      "grass mowing Long Sutton",
      "lawn mowing Long Sutton",
      "grass cutting Long Sutton",
      "lawn care Long Sutton",
      "garden maintenance Long Sutton",
    ],
    faqs: sharedFaqs("Long Sutton"),
  },
];

export function getServiceArea(slug: string) {
  return serviceAreas.find((area) => area.slug === slug);
}
