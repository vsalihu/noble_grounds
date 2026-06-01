"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FileText, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/data/site";

const actions = [
  {
    label: "Call",
    href: `tel:${siteConfig.phone}`,
    icon: Phone,
  },
  {
    label: "WhatsApp",
    href: `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`,
    icon: MessageCircle,
  },
  {
    label: "Quote",
    href: "/contact",
    icon: FileText,
  },
];

export function MobileCtaBar() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.nav
      aria-label="Quick contact actions"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border-soft/80 bg-cream/92 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-18px_50px_rgb(22_38_30_/_0.14)] backdrop-blur-xl md:hidden"
      initial={shouldReduceMotion ? false : { y: 24, opacity: 0 }}
      animate={shouldReduceMotion ? undefined : { y: 0, opacity: 1 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          const isQuote = action.label === "Quote";

          return (
            <Link
              key={action.label}
              href={action.href}
              className={[
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-md border px-2 text-xs font-semibold shadow-[0_10px_28px_rgb(22_38_30_/_0.08)] transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500",
                isQuote
                  ? "button-grass border-noble-green-950 bg-noble-green-900 text-ivory"
                  : "border-border-soft bg-ivory text-noble-green-900",
              ].join(" ")}
            >
              <span className="button-premium-label flex-col gap-1">
                <Icon className="size-4" aria-hidden="true" />
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
