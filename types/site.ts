export type CustomerAudience =
  | "homeowners"
  | "landlords"
  | "businesses"
  | "estate agents";

export type SiteConfig = {
  name: string;
  domain: string;
  location: string;
  service: string;
  serviceDescription: string;
  email: string;
  phone: string;
  whatsapp: string;
  ogImage: string;
  locale: string;
  audiences: readonly CustomerAudience[];
  serviceAreas: readonly string[];
  navigation: readonly {
    label: string;
    href: string;
  }[];
};
