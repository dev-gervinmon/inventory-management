import { Loader2 } from "lucide-react";

interface FormButtonProps {
  type: "submit" | "button" | "reset";
  label: string;
  variant?: "primary" | "secondary" | "edit" | "delete";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function FormButton({
  type,
  label,
  variant = "primary",
  size = "md",
  disabled = false,
  isLoading = false,
  onClick,
  className = "",
}: FormButtonProps) {
  const sizeClass = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-3",
  };

  const variantClass = {
    primary:
      "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 active:from-purple-800 active:to-purple-900 disabled:from-purple-400 disabled:to-purple-500",
    secondary:
      "bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200 hover:border-gray-400 active:bg-gray-300 disabled:bg-gray-50 disabled:text-gray-400",
    edit: "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 disabled:bg-gray-100 disabled:text-gray-400",
    delete:
      "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-gray-400 disabled:text-gray-200",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-100 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md cursor-pointer flex items-center justify-center gap-2 ${sizeClass[size]} ${variantClass[variant]} ${className}`}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      <span>{label}</span>
    </button>
  );
}
