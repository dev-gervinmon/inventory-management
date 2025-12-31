import * as React from "react";
import Link from "next/link";

type ButtonProps = {
  asChild?: boolean;
  href?: string;
  variant?: "default" | "outline";
  size?: "default" | "lg";
  className?: string;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export function Button({
  asChild = false,
  href,
  variant = "default",
  size = "default",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold transition-all rounded-xl";

  const variants = {
    default:
      "bg-(--brand) text-white hover:brightness-110 shadow-lg shadow-(--brand)/30",
    outline:
      "border border-(--border-strong) bg-transparent hover:bg-(--surface-elevated)",
  };

  const sizes = {
    default: "px-4 py-2 text-sm",
    lg: "px-8 py-3 text-lg",
  };

  const classes = [base, variants[variant], sizes[size], className].join(" ");

  // ---------- AS CHILD (LINK / ANCHOR) ----------
  if (asChild) {
    if (!href) {
      throw new Error("Button with asChild requires an href prop.");
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
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
