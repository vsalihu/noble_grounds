"use client";

import { motion, useReducedMotion } from "framer-motion";

export function AnimatedDivider({ className = "" }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={["h-px overflow-hidden bg-border-soft", className].join(" ")}>
      <motion.div
        className="h-full bg-[linear-gradient(90deg,transparent,#9aaa83,#b79673,transparent)]"
        initial={shouldReduceMotion ? false : { x: "-100%" }}
        whileInView={shouldReduceMotion ? undefined : { x: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
