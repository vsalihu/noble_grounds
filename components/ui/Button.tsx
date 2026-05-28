import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

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
    "bg-noble-green-800 text-ivory shadow-[0_14px_34px_rgb(18_50_38_/_0.22)] hover:-translate-y-0.5 hover:bg-noble-green-900 hover:shadow-[0_18px_42px_rgb(18_50_38_/_0.26)]",
  secondary:
    "border border-border-soft bg-ivory text-noble-green-800 shadow-[0_10px_28px_rgb(22_38_30_/_0.06)] hover:-translate-y-0.5 hover:border-sage-500 hover:bg-cream hover:shadow-[0_16px_36px_rgb(22_38_30_/_0.1)]",
  ghost: "text-noble-green-800 hover:bg-sage-200/45 hover:text-noble-green-950",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const classes = [
    "inline-flex min-h-12 w-full items-center justify-center rounded-md px-5 py-3 text-center text-sm font-semibold transition duration-200 ease-out active:translate-y-0 active:scale-[0.98] min-[430px]:w-auto",
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
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } =
    props as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button className={classes} type={type} {...buttonProps}>
      {children}
    </button>
  );
}
