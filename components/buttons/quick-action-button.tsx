import Link from "next/link";

interface QuickActionButtonProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export default function QuickActionButton({
  href,
  label,
  icon,
  variant = "secondary",
  className = "",
}: QuickActionButtonProps) {
  const baseClass =
    "inline-flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg min-h-[44px]";

  const variantClass = {
    primary:
      "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800",
    secondary:
      "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400",
  };

  return (
    <Link
      href={href}
      className={`${baseClass} ${variantClass[variant]} ${className}`}
    >
      {icon}
      {label}
    </Link>
  );
}
