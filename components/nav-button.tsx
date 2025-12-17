import Link from "next/link";

interface PrimaryButtonProps {
  href: string;
  label: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

interface SecondaryButtonProps {
  href: string;
  label: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "default" | "subtle";
}

export function PrimaryButton({
  href,
  label,
  size = "md",
  className = "",
}: PrimaryButtonProps) {
  const sizeClass = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-3",
  };

  return (
    <Link
      href={href}
      className={`inline-block text-center bg-linear-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg ${sizeClass[size]} ${className}`}
    >
      {label}
    </Link>
  );
}

export function SecondaryButton({
  href,
  label,
  size = "md",
  className = "",
  variant = "default",
}: SecondaryButtonProps) {
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
    <Link
      href={href}
      className={`inline-block text-center font-semibold rounded-lg transition-all duration-200 ${sizeClass[size]} ${variantClass[variant]} ${className}`}
    >
      {label}
    </Link>
  );
}
