import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { PageTransition } from "@/components/layout/PageTransition";
import { JsonLd } from "@/components/seo/JsonLd";
import { localBusinessJsonLd, serviceJsonLd } from "@/lib/seo";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <JsonLd data={[localBusinessJsonLd(), serviceJsonLd()]} />
      <PageTransition>{children}</PageTransition>
      <Footer />
      <MobileCtaBar />
    </>
  );
}
