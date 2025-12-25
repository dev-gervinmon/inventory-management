import Link from "next/link";

interface AddProductButtonProps {
  variant?: "simple" | "with-icon";
  size?: "sm" | "md";
  className?: string;
}

export default function AddProductButton({
  variant = "with-icon",
  size = "md",
  className = "",
}: AddProductButtonProps) {
  const baseClass =
    "inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl min-h-[44px]";

  const sizeClass = {
    sm: "px-4 py-2.5",
    md: "px-4 sm:px-6 py-2 sm:py-3",
  };

  const fontClass = {
    sm: "text-xs sm:text-sm",
    md: "text-xs sm:text-base font-semibold",
  };

  if (variant === "simple") {
    return (
      <Link
        href="/add-product"
        className={`${baseClass} ${sizeClass[size]} ${fontClass[size]} ${className}`}
      >
        + Add Product
      </Link>
    );
  }

  return (
    <Link
      href="/add-product"
      className={`${baseClass} ${sizeClass[size]} ${fontClass[size]} ${className}`}
    >
      <svg
        className={`${size === "sm" ? "w-4 h-4" : "w-5 h-5"}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      Add Product
    </Link>
  );
}
