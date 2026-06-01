import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "grass";

type BaseProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
};

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonAsLink = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-noble-green-800 text-ivory shadow-[0_14px_34px_rgb(18_50_38_/_0.22)] hover:-translate-y-0.5 hover:bg-noble-green-950 hover:text-white hover:shadow-[0_18px_42px_rgb(18_50_38_/_0.26)]",
  secondary:
    "border border-border-soft bg-ivory text-noble-green-900 shadow-[0_10px_28px_rgb(22_38_30_/_0.06)] hover:-translate-y-0.5 hover:border-sage-500 hover:bg-cream hover:text-noble-green-950 hover:shadow-[0_16px_36px_rgb(22_38_30_/_0.1)]",
  outline:
    "border border-noble-green-800/30 bg-transparent text-noble-green-900 hover:-translate-y-0.5 hover:border-noble-green-800 hover:bg-noble-green-800 hover:text-ivory",
  ghost:
    "text-noble-green-900 hover:bg-sage-200/45 hover:text-noble-green-950",
  danger:
    "border border-earth-700/35 bg-ivory text-earth-700 shadow-[0_10px_28px_rgb(128_100_71_/_0.08)] hover:-translate-y-0.5 hover:border-earth-700 hover:bg-earth-700 hover:text-ivory hover:shadow-[0_16px_36px_rgb(128_100_71_/_0.16)]",
  grass:
    "button-grass bg-noble-green-900 text-ivory shadow-[0_18px_44px_rgb(7_23_16_/_0.28)] hover:-translate-y-0.5 hover:bg-noble-green-950 hover:text-white hover:shadow-[0_24px_60px_rgb(7_23_16_/_0.34)]",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const classes = [
    "button-premium relative inline-flex min-h-12 w-full items-center justify-center rounded-md px-5 py-3 text-center text-sm font-semibold transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:saturate-75 min-[430px]:w-auto",
    `button-variant-${variant}`,
    variants[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in props && props.href) {
    const linkProps = props as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };

    return (
      <Link className={classes} {...linkProps}>
        <span className="button-premium-label">{children}</span>
      </Link>
    );
  }

  const { type = "button", ...buttonProps } =
    props as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button className={classes} type={type} {...buttonProps}>
      <span className="button-premium-label">{children}</span>
    </button>
  );
}
