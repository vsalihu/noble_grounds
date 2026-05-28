import type { ElementType, HTMLAttributes } from "react";

type SectionProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
};

export function Section({
  as: Component = "section",
  className = "",
  ...props
}: SectionProps) {
  return (
    <Component
      className={["py-16 min-[430px]:py-18 md:py-24 lg:py-28", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
