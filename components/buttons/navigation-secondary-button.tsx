"use client";

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

  const sizeClass = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-3",
  };

  const variantClass = {
    default:
      "bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200 hover:border-gray-400",
    subtle: "text-gray-600 hover:text-gray-900 hover:underline",
  };

  return (
    <button
      onClick={() => push(href)}
      className={`inline-block text-center font-semibold rounded-lg transition-all duration-200 cursor-pointer ${sizeClass[size]} ${variantClass[variant]} ${className}`}
    >
      {label}
    </button>
  );
}
