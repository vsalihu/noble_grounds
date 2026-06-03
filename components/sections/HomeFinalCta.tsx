import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { ScrollReveal } from "@/components/sections/ScrollReveal";
import { siteConfig } from "@/data/site";

export function HomeFinalCta() {
  return (
    <section className="pb-20 md:pb-24">
      <Container>
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl bg-noble-green-950 p-6 text-ivory shadow-[var(--shadow-lifted)] md:p-10 lg:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_10%,rgb(220_228_207_/_0.18),transparent_24rem),radial-gradient(circle_at_82%_55%,rgb(183_150_115_/_0.20),transparent_22rem),linear-gradient(135deg,rgb(255_255_255_/_0.08),transparent_48%)]" />
            <div className="absolute -right-20 -top-20 size-64 rounded-full border border-ivory/10" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage-200">
                  Clear quote, clean finish
                </p>
                <h2 className="mt-4 font-serif text-5xl font-semibold leading-[0.96] md:text-7xl">
                  Send a few lawn photos and get a clear quote.
                </h2>
                <p className="mt-5 text-base leading-8 text-sage-200">
                  Use the quote form for details, or send photos by WhatsApp if
                  that is quicker. Noble Grounds will reply with the next step.
                </p>
              </div>
              <div className="grid gap-3 min-[430px]:grid-cols-2 lg:min-w-80 lg:grid-cols-1">
                <Button href="/contact" variant="grass">
                  Request Quote
                  <ArrowRight className="ml-2 size-4" />
                </Button>
                <Button
                  href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`}
                  variant="secondary"
                >
                  <MessageCircle className="mr-2 size-4" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
