import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { PageTransition } from "@/components/layout/PageTransition";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  localBusinessJsonLd,
  organizationJsonLd,
  serviceJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollToTop />
      <Header />
      <JsonLd
        data={[
          organizationJsonLd(),
          websiteJsonLd(),
          localBusinessJsonLd(),
          serviceJsonLd(),
        ]}
      />
      <PageTransition>{children}</PageTransition>
      <Footer />
      <MobileCtaBar />
    </>
  );
}
