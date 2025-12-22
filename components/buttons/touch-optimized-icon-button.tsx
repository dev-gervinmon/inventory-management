/**
 * Touch-Optimized Icon Button
 * For small icon-only actions, ensures 44x44px minimum touch target
 * Perfect for delete, edit, close actions
 */

import React from "react";

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

  const variantClass = {
    primary:
      "text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:bg-gray-300",
    secondary:
      "text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400",
    delete:
      "text-white bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-gray-400",
    edit: "text-gray-800 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 disabled:bg-gray-100 disabled:text-gray-400",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:hover:shadow-md ${sizeClass[size]} ${variantClass[variant]} ${className}`}
    >
      {icon}
    </button>
  );
}
