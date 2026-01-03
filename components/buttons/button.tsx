import * as React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type ButtonProps = {
  asChild?: boolean;
  href?: string;
  variant?: "default" | "outline" | "subtle" | "destructive";
  size?: "sm" | "default" | "lg";
  className?: string;
  isLoading?: boolean;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export function Button({
  asChild = false,
  href,
  variant = "default",
  size = "default",
  className = "",
  isLoading = false,
  children,
  ...props
}: ButtonProps) {
  const disabledLike = Boolean(props.disabled || isLoading);

  const base =
    "inline-flex items-center justify-center font-semibold transition-all rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40 focus-visible:ring-offset-2 focus-visible:ring-offset-(--canvas)";

  const variants = {
    default:
      "bg-(--brand) text-(--text-inverted) hover:brightness-110 shadow-lg shadow-(--brand)/30",
    outline:
      "border border-(--border-strong) bg-glass text-(--text-primary) hover:bg-(--surface-elevated)",
    subtle:
      "bg-transparent text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface-elevated)",
    destructive:
      "bg-(--danger) text-(--text-inverted) hover:brightness-110 shadow-lg shadow-(--danger)/20",
  };

  const sizes = {
    sm: "min-h-10 px-3 py-2 text-sm",
    default: "min-h-11 px-4 py-2.5 text-sm",
    lg: "min-h-12 px-6 py-3 text-base",
  };

  const buttonDisabledStyles =
    "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:brightness-100";

  const linkDisabledStyles =
    "opacity-60 cursor-not-allowed pointer-events-none select-none";

  const classes = [
    base,
    buttonDisabledStyles,
    variants[variant],
    sizes[size],
    className,
  ].join(" ");

  // ---------- AS CHILD (LINK / ANCHOR) ----------
  if (asChild) {
    if (!href) {
      throw new Error("Button with asChild requires an href prop.");
    }

    // Avoid passing event handlers to Link from a Server Component.
    // When "disabled-like", render a non-interactive element instead.
    if (disabledLike) {
      return (
        <span className={[classes, linkDisabledStyles].join(" ")} aria-disabled>
          {children}
        </span>
      );
    }

    // Internal link
    if (href.startsWith("/")) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    // Anchor link (#hash or external)
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  // ---------- REGULAR BUTTON ----------
  return (
    <button className={classes} {...props} disabled={disabledLike}>
      <span className="inline-flex items-center gap-2">
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </span>
    </button>
  );
}
