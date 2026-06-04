import { ArrowRight, Camera, CheckCircle2, Leaf, MessageCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Container } from "@/components/layout/Container";
import { ScrollReveal } from "@/components/sections/ScrollReveal";
import { siteConfig } from "@/data/site";
import type { SiteContent } from "@/types/supabase";

const trustChips = ["Quote-only", "Photo quotes", "Local service"];

export function HomeHero({ content }: { content?: SiteContent }) {
  const title =
    content?.title ?? "Premium mowing for lawns that need to look cared for.";
  const subtitle =
    content?.subtitle ??
    "A quote-only grass mowing service for homes, landlords, businesses, and estate agents across Leverington, Wisbech, and nearby villages.";
  const buttonLabel = content?.button_label ?? "Request Quote";
  const buttonHref = content?.button_href ?? "/contact";

  return (
    <GradientBackground className="pt-8 md:pt-12">
      <Container className="grid min-h-[calc(100svh-5rem)] gap-10 pb-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-14 lg:pb-20">
        <ScrollReveal className="max-w-3xl">
          <Badge icon={<Leaf className="size-3.5" />}>
            Leverington, Wisbech and nearby areas
          </Badge>
          <h1 className="text-balance mt-6 font-serif text-[3.35rem] font-semibold leading-[0.9] text-noble-green-950 min-[430px]:text-7xl md:text-8xl xl:text-[6.9rem]">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-noble-green-700 min-[430px]:text-lg">
            {subtitle}
          </p>

          <div className="mt-8 grid gap-3 min-[430px]:grid-cols-2 md:flex">
            <Button href={buttonHref} variant="grass">
              {buttonLabel}
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Button>
            <Button
              href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`}
              variant="secondary"
            >
              <MessageCircle className="mr-2 size-4" aria-hidden="true" />
              WhatsApp
            </Button>
            <Button href="/gallery" variant="outline">
              View Gallery
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {trustChips.map((chip) => (
              <span
                key={chip}
                className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border-soft bg-white/70 px-3 text-sm font-semibold text-noble-green-800 shadow-[0_10px_28px_rgb(22_38_30_/_0.06)] backdrop-blur"
              >
                <CheckCircle2 className="size-4 text-sage-700" />
                {chip}
              </span>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08} className="min-w-0">
          <div className="relative min-h-[48rem] overflow-hidden rounded-3xl border border-noble-green-900/10 bg-noble-green-900 shadow-[0_32px_90px_rgb(7_23_16_/_0.24)] md:min-h-[47rem] lg:min-h-[43rem]">
            <div className="absolute inset-0 bg-[linear-gradient(145deg,#071710,#123226_45%,#6f7d59_100%)]" />
            <div className="absolute inset-6 rounded-3xl border border-ivory/15 bg-[radial-gradient(circle_at_28%_16%,rgb(255_253_247_/_0.22),transparent_14rem),linear-gradient(155deg,rgb(255_255_255_/_0.04),transparent)]" />
            <div className="absolute -right-20 top-20 size-64 rounded-full border border-ivory/10" />
            <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-[linear-gradient(180deg,transparent,rgb(7_23_16_/_0.76))]" />

            <div className="absolute left-5 top-5 rounded-xl border border-ivory/15 bg-ivory/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ivory backdrop-blur">
              Noble Grounds
            </div>

            {content?.image_url ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={content.image_url}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_23_16_/_0.18),rgb(7_23_16_/_0.82))]" />
              </>
            ) : null}

            <div className="absolute inset-x-5 bottom-5 md:inset-x-8 md:bottom-8">
              <GlassCard className="group overflow-hidden p-4 md:p-5">
                <div className="relative aspect-[16/9] min-h-[220px] overflow-hidden rounded-2xl border border-border-soft md:min-h-[280px]">
                  <Image
                    src="/images/site/quote-photos.jpg"
                    alt="A lawn photo being taken on a phone for a Noble Grounds quote"
                    fill
                    sizes="(min-width: 1024px) 46vw, 90vw"
                    className="object-cover object-center transition duration-500 md:group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_54%,rgb(7_23_16_/_0.26))]" />
                  <div className="absolute left-4 top-4 flex size-12 items-center justify-center rounded-xl bg-ivory/90 text-noble-green-900 shadow-[0_16px_36px_rgb(7_23_16_/_0.18)] backdrop-blur">
                    <Camera className="size-5" />
                  </div>
                </div>

                <div className="p-2 pt-6 md:p-3 md:pt-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-earth-700">
                    Photo-friendly quotes
                  </p>
                  <p className="mt-3 max-w-2xl font-serif text-4xl font-semibold leading-none text-noble-green-950 md:text-5xl">
                    Send the lawn. Get a clear quote.
                  </p>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-noble-green-700 md:text-base md:leading-8">
                    Upload photos through the quote form or send them by
                    WhatsApp so the lawn can be assessed properly before a
                    quote is prepared.
                  </p>

                  <div className="mt-5 grid gap-2 text-sm font-semibold text-noble-green-800 min-[430px]:grid-cols-3">
                    {["Photo-friendly quotes", "Fast response", "No obligation"].map(
                      (item) => (
                        <span
                          key={item}
                          className="inline-flex min-h-10 items-center gap-2 rounded-md bg-sage-100 px-3"
                        >
                          <CheckCircle2 className="size-4 text-sage-700" />
                          {item}
                        </span>
                      ),
                    )}
                  </div>

                  <div className="mt-6 grid gap-3 min-[430px]:grid-cols-2 md:flex">
                    <Button href="/contact" variant="grass">
                      Request Quote
                      <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`}
                      variant="secondary"
                    >
                      <MessageCircle className="mr-2 size-4" aria-hidden="true" />
                      WhatsApp Us
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </GradientBackground>
  );
}
