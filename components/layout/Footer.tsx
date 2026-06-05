import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { serviceAreas } from "@/data/serviceAreas";
import { siteConfig } from "@/data/site";

export function Footer() {
  return (
    <footer id="contact" className="bg-noble-green-950 text-ivory">
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr_0.8fr]">
          <div>
            <div className="flex items-center gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-ivory shadow-[0_18px_42px_rgb(0_0_0_/_0.2)]">
                <Image
                  src="/images/logo.png"
                  alt=""
                  width={56}
                  height={56}
                  className="h-full w-full object-contain p-1"
                />
              </span>
              <p className="font-serif text-4xl font-semibold">Noble Grounds</p>
            </div>
            <p className="mt-4 max-w-md text-sm leading-7 text-sage-200">
              Premium grass mowing for homes, landlords, businesses, and estate
              agents across Leverington and the Wisbech area.
            </p>
          </div>

          <div id="areas">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage-200">
              Service areas
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-cream">
              {serviceAreas.map((area) => (
                <Link
                  key={area.slug}
                  href={`/service-areas/${area.slug}`}
                  className="rounded-md border border-white/10 bg-white/5 px-3 py-2"
                >
                  {area.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage-200">
              Contact
            </p>
            <div className="mt-4 grid gap-3 text-sm text-cream">
              <a className="flex items-center gap-3" href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
                <Phone className="size-4 text-sage-200" />
                {siteConfig.phone}
              </a>
              <a className="flex items-center gap-3" href={`mailto:${siteConfig.email}`}>
                <Mail className="size-4 text-sage-200" />
                {siteConfig.email}
              </a>
              <a
                className="flex items-center gap-3"
                href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`}
              >
                <MessageCircle className="size-4 text-sage-200" />
                WhatsApp quote photos
              </a>
              <span className="flex items-center gap-3">
                <MapPin className="size-4 text-sage-200" />
                {siteConfig.location}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-sage-200">
              {siteConfig.navigation.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-ivory">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-sage-200 md:flex-row md:items-center md:justify-between">
          <p>
            Copyright {new Date().getFullYear()} Noble Grounds. Premium grass
            mowing in Leverington, Wisbech.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/privacy-policy" className="hover:text-ivory">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-ivory">
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
