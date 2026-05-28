"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const id = useId();

  return (
    <div className="grid gap-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${id}-panel-${index}`;
        const buttonId = `${id}-button-${index}`;

        return (
          <div
            key={item.question}
            className="rounded-lg border border-border-soft bg-ivory shadow-[0_14px_40px_rgb(22_38_30_/_0.06)]"
          >
            <button
              id={buttonId}
              type="button"
              className="flex min-h-16 w-full items-center justify-between gap-4 rounded-lg px-5 py-4 text-left text-base font-semibold text-noble-green-950 transition hover:bg-sage-100/50"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              aria-expanded={isOpen}
              aria-controls={panelId}
            >
              {item.question}
              <ChevronDown
                className={`size-5 shrink-0 text-sage-700 transition ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={
                    shouldReduceMotion ? undefined : { height: "auto", opacity: 1 }
                  }
                  exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm leading-7 text-noble-green-700">
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
