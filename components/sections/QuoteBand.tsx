import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/ui/FadeIn";

type QuoteBandProps = {
  title?: string;
  text?: string;
};

export function QuoteBand({
  title = "Ready to request a quote?",
  text = "Send a few details about the lawn, access, condition, and preferred frequency. Photos by WhatsApp are welcome.",
}: QuoteBandProps) {
  return (
    <section className="pb-20 md:pb-24">
      <Container>
        <FadeIn>
          <div className="relative overflow-hidden rounded-lg bg-noble-green-900 p-6 text-ivory shadow-[var(--shadow-lifted)] md:flex md:items-center md:justify-between md:gap-8 md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgb(220_228_207_/_0.16),transparent_22rem)]" />
            <div className="relative max-w-2xl">
              <h2 className="font-serif text-4xl leading-tight font-semibold">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-sage-200">{text}</p>
            </div>
            <Button
              href="/contact"
              className="relative mt-6 bg-ivory text-noble-green-900 hover:bg-cream md:mt-0"
            >
              Request a Quote
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
