"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const pathname = usePathname();

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border-soft/70 bg-cream/90 backdrop-blur-xl">
      <Container className="flex min-h-20 items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3"
          onClick={closeMenu}
          aria-label="Noble Grounds home"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-noble-green-800 text-ivory shadow-[0_12px_30px_rgb(18_50_38_/_0.2)] transition duration-200 group-hover:bg-noble-green-900">
            <Leaf className="size-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-serif text-2xl leading-none font-semibold text-noble-green-900">
              Noble Grounds
            </span>
            <span className="mt-1 hidden text-xs font-medium uppercase tracking-[0.16em] text-sage-700 min-[390px]:block">
              Premium mowing
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main navigation">
          {siteConfig.navigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "rounded-md px-3 py-3 text-sm font-semibold transition",
                  isActive
                    ? "bg-sage-100 text-noble-green-950 shadow-[inset_0_0_0_1px_rgb(220_228_207)]"
                    : "text-noble-green-700 hover:bg-sage-100 hover:text-noble-green-900",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button href="/contact" variant="grass" className="min-h-11 px-4">
            Request Quote
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex size-12 items-center justify-center rounded-md border border-border-soft bg-ivory text-noble-green-900 shadow-[0_10px_26px_rgb(22_38_30_/_0.08)] transition active:scale-[0.97] xl:hidden"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </Container>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, height: 0, y: -8 }}
            animate={
              shouldReduceMotion ? undefined : { opacity: 1, height: "auto", y: 0 }
            }
            exit={shouldReduceMotion ? undefined : { opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border-soft/70 bg-cream xl:hidden"
          >
            <Container className="py-4">
              <nav className="grid gap-2" aria-label="Mobile navigation">
                {siteConfig.navigation.map((item, index) => {
                  const isActive = pathname === item.href;

                  return (
                    <motion.div
                      key={item.href}
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                      transition={{ duration: 0.22, delay: index * 0.025 }}
                    >
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={[
                          "block rounded-md border px-4 py-4 text-base font-semibold shadow-[0_10px_26px_rgb(22_38_30_/_0.05)] transition",
                          isActive
                            ? "border-sage-500 bg-sage-100 text-noble-green-950"
                            : "border-border-soft bg-ivory text-noble-green-800",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        onClick={closeMenu}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <Button href="/contact" variant="grass" className="mt-4" onClick={closeMenu}>
                Request Quote
              </Button>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
