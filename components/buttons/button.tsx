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

  const disabledStyles =
    "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:brightness-100";

  const classes = [
    base,
    disabledStyles,
    variants[variant],
    sizes[size],
    className,
  ].join(" ");

  // ---------- AS CHILD (LINK / ANCHOR) ----------
  if (asChild) {
    if (!href) {
      throw new Error("Button with asChild requires an href prop.");
    }

    // Internal link
    if (href.startsWith("/")) {
      return (
        <Link
          href={href}
          className={classes}
          aria-disabled={disabledLike}
          tabIndex={disabledLike ? -1 : undefined}
          onClick={(e) => {
            if (disabledLike) {
              e.preventDefault();
              return;
            }
          }}
        >
          {children}
        </Link>
      );
    }

    // Anchor link (#hash or external)
    return (
      <a
        href={href}
        className={classes}
        aria-disabled={disabledLike}
        tabIndex={disabledLike ? -1 : undefined}
        onClick={(e) => {
          if (disabledLike) {
            e.preventDefault();
            return;
          }
        }}
      >
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
