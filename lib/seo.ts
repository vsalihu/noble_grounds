import type { Metadata } from "next";
import { localSeoKeywords, siteConfig } from "@/data/site";

type PageSeo = {
  title: string;
  description: string;
  path?: string;
  keywords?: readonly string[];
  ogTitle?: string;
  ogDescription?: string;
};

export const siteUrl = siteConfig.domain.replace(/\/$/, "");

export function absoluteUrl(path = "/") {
  const normalisedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalisedPath}`;
}

export function createMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  ogTitle,
  ogDescription,
}: PageSeo): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    keywords: [...localSeoKeywords, ...keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: ogTitle ?? `${title} | ${siteConfig.name}`,
      description: ogDescription ?? description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [
        {
          url: absoluteUrl(siteConfig.ogImage),
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} premium grass mowing in ${siteConfig.location}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle ?? `${title} | ${siteConfig.name}`,
      description: ogDescription ?? description,
      images: [absoluteUrl(siteConfig.ogImage)],
    },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${siteUrl}/#localbusiness`,
    name: siteConfig.name,
    url: siteUrl,
    image: absoluteUrl(siteConfig.ogImage),
    description: siteConfig.serviceDescription,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    areaServed: siteConfig.serviceAreas.map((area) => ({
      "@type": "Place",
      name: area,
    })),
    priceRange: "Quote-only",
    knowsAbout: localSeoKeywords,
  };
}

export function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/#grass-mowing-service`,
    name: "Premium grass mowing",
    serviceType: "Grass mowing and lawn presentation",
    provider: {
      "@id": `${siteUrl}/#localbusiness`,
    },
    areaServed: siteConfig.serviceAreas.map((area) => ({
      "@type": "Place",
      name: area,
    })),
    audience: siteConfig.audiences.map((audience) => ({
      "@type": "Audience",
      audienceType: audience,
    })),
    description: siteConfig.serviceDescription,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "GBP",
      description:
        "Quote-only pricing based on lawn size, access, condition, frequency, and waste handling.",
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
