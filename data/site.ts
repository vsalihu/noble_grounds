export const siteConfig = {
  name: "Noble Grounds",
  domain: "https://noblegrounds.co.uk",
  location: "Leverington, Wisbech",
  service: "premium grass mowing",
  serviceDescription:
    "Premium grass mowing and lawn presentation for homeowners, landlords, businesses, and estate agents around Leverington and Wisbech.",
  email: "contact@noblegrounds.co.uk",
  phone: "+44 7881 702750",
  whatsapp: "+44 7881 702750",
  ogImage: "/images/og-noble-grounds.svg",
  locale: "en_GB",
  audiences: ["homeowners", "landlords", "businesses", "estate agents"],
  serviceAreas: [
    "Leverington",
    "Wisbech",
    "Parson Drove",
    "Gorefield",
    "Newton",
    "Tydd St Giles",
    "Sutton Bridge",
    "Long Sutton",
  ],
  navigation: [
    { label: "Services", href: "/services" },
    { label: "Prices", href: "/prices" },
    { label: "Gallery", href: "/gallery" },
    { label: "About", href: "/about" },
    { label: "Reviews", href: "/reviews" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export const localSeoKeywords = [
  "grass mowing Leverington",
  "lawn mowing Wisbech",
  "grass cutting Wisbech",
  "lawn care Leverington",
  "garden maintenance Wisbech",
  "landlord lawn care Wisbech",
  "estate agent lawn mowing Wisbech",
  "business grounds mowing Wisbech",
] as const;
