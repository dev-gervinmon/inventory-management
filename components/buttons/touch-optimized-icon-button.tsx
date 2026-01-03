/**
 * Touch-Optimized Icon Button
 * For small icon-only actions, ensures 44x44px minimum touch target
 * Perfect for delete, edit, close actions
 */

import React from "react";
import { Button } from "@/components/buttons/button";

interface TouchOptimizedIconButtonProps {
  icon: React.ReactNode;
  label: string; // For accessibility (aria-label)
  variant?: "primary" | "secondary" | "delete" | "edit";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function TouchOptimizedIconButton({
  icon,
  label,
  variant = "secondary",
  size = "md",
  onClick,
  disabled = false,
  className = "",
  type = "button",
}: TouchOptimizedIconButtonProps) {
  // Ensures 44x44px minimum touch target with padding
  const sizeClass = {
    sm: "p-2", // 40x40px with icon
    md: "p-2.5", // 44x44px with icon (ideal)
    lg: "p-3", // 48x48px with icon
  };

  const variantMap = {
    primary: "default" as const,
    secondary: "outline" as const,
    delete: "destructive" as const,
    edit: "outline" as const,
  };

  return (
    <Button
      type={type}
      variant={variantMap[variant]}
      size="sm"
      disabled={disabled}
      onClick={onClick}
      className={[
        "rounded-lg",
        "shadow-none",
        "active:scale-95",
        sizeClass[size],
        // Make secondary/edit icon buttons read well on glass
        (variant === "secondary" || variant === "edit") &&
          "bg-glass text-(--text-secondary)",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={label}
      title={label}
    >
      {icon}
    </Button>
  );
}
