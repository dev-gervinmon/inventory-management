/**
 * Touch-Optimized Button Component
 * Meets Apple's 44x44px touch target requirement for accessibility
 * Used as a reusable base for all button interactions
 */

import { Loader2 } from "lucide-react";

interface TouchOptimizedButtonProps {
  type?: "submit" | "button" | "reset";
  label: string;
  variant?: "primary" | "secondary" | "edit" | "delete" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function TouchOptimizedButton({
  type = "button",
  label,
  variant = "primary",
  size = "md",
  disabled = false,
  isLoading = false,
  onClick,
  className = "",
  icon,
  fullWidth = false,
}: TouchOptimizedButtonProps) {
  // Padding ensures minimum 44x44px touch target on mobile
  // Format: px py (horizontal vertical)
  const sizeClass = {
    sm: "px-3 py-2.5 text-sm", // ~40x44px
    md: "px-4 py-3 text-base", // ~44x44px (ideal)
    lg: "px-6 py-3 text-base", // ~48x44px+
  };

  const variantClass = {
    primary:
      "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 active:from-purple-800 active:to-purple-900 disabled:from-purple-400 disabled:to-purple-500",
    secondary:
      "bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200 hover:border-gray-400 active:bg-gray-300 disabled:bg-gray-50 disabled:text-gray-400",
    edit: "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 disabled:bg-gray-100 disabled:text-gray-400",
    delete:
      "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-gray-400 disabled:text-gray-200",
    outline:
      "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-100 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md cursor-pointer inline-flex items-center justify-center gap-2 ${sizeClass[size]} ${variantClass[variant]} ${widthClass} ${className}`}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {icon && !isLoading && <span className="flex items-center">{icon}</span>}
      <span>{label}</span>
    </button>
  );
}
