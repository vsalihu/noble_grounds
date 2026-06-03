"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  initClarity,
  trackContactPageVisit,
  trackPhoneClick,
  trackRequestQuoteClick,
  trackServicePageVisit,
  trackViewGalleryClick,
  trackWhatsAppClick,
} from "@/lib/analytics";

export function ClarityProvider() {
  const pathname = usePathname();

  useEffect(() => {
    initClarity(process.env.NEXT_PUBLIC_CLARITY_ID);
  }, []);

  useEffect(() => {
    if (pathname === "/contact") {
      trackContactPageVisit();
    }

    if (pathname === "/services") {
      trackServicePageVisit();
    }
  }, [pathname]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest("a");

      if (!link) {
        return;
      }

      const href = link.getAttribute("href") ?? "";

      if (href.startsWith("tel:")) {
        trackPhoneClick();
        return;
      }

      if (href.includes("wa.me")) {
        trackWhatsAppClick();
        return;
      }

      if (href === "/contact") {
        trackRequestQuoteClick();
        return;
      }

      if (href === "/gallery") {
        trackViewGalleryClick();
      }
    }

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
