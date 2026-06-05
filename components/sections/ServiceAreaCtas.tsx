"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  trackServiceAreaPageViewed,
  trackServiceAreaQuoteClicked,
  trackServiceAreaWhatsAppClicked,
  trackViewGalleryClick,
} from "@/lib/analytics";
import { useEffect } from "react";

type ServiceAreaCtasProps = {
  whatsappHref: string;
  className?: string;
};

export function ServiceAreaViewTracker() {
  useEffect(() => {
    trackServiceAreaPageViewed();
  }, []);

  return null;
}

export function ServiceAreaCtas({ whatsappHref, className = "" }: ServiceAreaCtasProps) {
  return (
    <div
      className={[
        "grid gap-3 min-[430px]:grid-cols-2 md:flex md:flex-wrap",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Button
        href="/contact"
        variant="grass"
        onClick={() => trackServiceAreaQuoteClicked()}
      >
        Request Quote
        <ArrowRight className="ml-2 size-4" aria-hidden="true" />
      </Button>
      <Button
        href={whatsappHref}
        variant="secondary"
        onClick={() => trackServiceAreaWhatsAppClicked()}
      >
        <MessageCircle className="mr-2 size-4" aria-hidden="true" />
        WhatsApp
      </Button>
      <Button
        href="/gallery"
        variant="outline"
        onClick={() => trackViewGalleryClick()}
      >
        View Gallery
      </Button>
    </div>
  );
}
