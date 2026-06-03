"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  const pathname = usePathname();
  const easing: [number, number, number, number] = [0.22, 1, 0.36, 1];

  return (
    <div className="relative overflow-x-clip">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={
            shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 14, filter: "blur(6px)" }
          }
          animate={
            shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }
          }
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: -4, filter: "blur(3px)" }
          }
          transition={{
            duration: shouldReduceMotion ? 0.18 : 0.34,
            ease: easing,
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {!shouldReduceMotion ? (
        <motion.div
          key={`page-sweep-${pathname}`}
          className="pointer-events-none fixed inset-x-0 top-20 z-40 h-24 bg-[linear-gradient(100deg,transparent,rgb(18_50_38_/_0.08),rgb(251_248_241_/_0.28),transparent)] blur-xl"
          aria-hidden="true"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: [0, 1, 0], y: [-10, 0, 12] }}
          transition={{ duration: 0.42, ease: easing }}
        />
      ) : null}
    </div>
  );
}
