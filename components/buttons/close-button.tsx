import { X } from "lucide-react";
import TouchOptimizedIconButton from "@/components/buttons/touch-optimized-icon-button";

interface CloseButtonProps {
  onClick: () => void;
  variant?: "purple" | "blue" | "gray";
  size?: "sm" | "md";
  title?: string;
}

export default function CloseButton({
  onClick,
  variant = "gray",
  size = "md",
  title = "Close",
}: CloseButtonProps) {
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  // Map legacy variants to a minimal set.
  // "blue" and "purple" both become brand-tinted.
  const mappedVariant = variant === "gray" ? "secondary" : "primary";

  return (
    <TouchOptimizedIconButton
      type="button"
      onClick={onClick}
      label={title}
      variant={mappedVariant}
      size={size}
      icon={<X className={iconSize} />}
      className={mappedVariant === "primary" ? "" : ""}
    />
  );
}
