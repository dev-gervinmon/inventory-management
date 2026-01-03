"use client";

import { Button } from "@/components/buttons/button";
import { useNavigationTransition } from "@/lib/contexts/navigation-transition-context";

interface NavigationSecondaryButtonProps {
  href: string;
  label: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "default" | "subtle";
}

/**
 * Secondary Button with Navigation Transition
 * Tracks navigation to show loading state during page transitions
 */
export function NavigationSecondaryButton({
  href,
  label,
  size = "md",
  className = "",
  variant = "default",
}: NavigationSecondaryButtonProps) {
  const { push } = useNavigationTransition();

  const sizeMap = {
    sm: "sm" as const,
    md: "default" as const,
    lg: "lg" as const,
  };

  return (
    <Button
      type="button"
      onClick={() => push(href)}
      variant={variant === "subtle" ? "subtle" : "outline"}
      size={sizeMap[size]}
      className={[
        "rounded-lg font-semibold",
        variant === "default" && "bg-glass text-(--text-primary)",
        variant === "subtle" && "text-(--text-secondary)",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </Button>
  );
}
