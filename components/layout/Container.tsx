import type { HTMLAttributes } from "react";

export type ContainerProps = HTMLAttributes<HTMLDivElement>;

export function Container({ className = "", ...props }: ContainerProps) {
  return (
    <div
      className={[
        "mx-auto w-full max-w-6xl px-5 min-[430px]:px-6 md:px-8 lg:px-10",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
