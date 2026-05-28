import { CalendarCheck, MapPinned, ShieldCheck, Sparkles } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { Container } from "@/components/layout/Container";

const trustItems = [
  {
    label: "Local",
    text: "Based around Leverington and Wisbech",
    icon: MapPinned,
  },
  {
    label: "Reliable",
    text: "Planned visits for consistent presentation",
    icon: CalendarCheck,
  },
  {
    label: "Premium",
    text: "Clean finish without the template feel",
    icon: Sparkles,
  },
  {
    label: "Trusted",
    text: "Built for homes, landlords, and businesses",
    icon: ShieldCheck,
  },
];

export function TrustBar() {
  return (
    <section id="trust" className="py-4">
      <Container>
        <FadeIn>
          <div className="grid gap-3 rounded-lg border border-border-soft bg-ivory p-3 shadow-[0_18px_50px_rgb(22_38_30_/_0.07)] md:grid-cols-4">
            {trustItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex gap-3 rounded-md bg-cream px-4 py-4 md:block md:bg-transparent"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-sage-100 text-noble-green-800">
                    <Icon className="size-5" />
                  </span>
                  <div className="md:mt-4">
                    <p className="text-sm font-semibold text-noble-green-950">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-noble-green-700">
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
