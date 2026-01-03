import { Button } from "@/components/buttons/button";

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
  const sizeClass = {
    sm: "px-4 py-2.5 text-xs sm:text-sm",
    md: "px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-base",
  };

  const weightClass = size === "md" ? "font-semibold" : "";

  if (variant === "simple") {
    return (
      <Button
        asChild
        href="/add-product"
        size="default"
        className={[
          "min-h-11 gap-2 rounded-lg",
          sizeClass[size],
          weightClass,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <>+ Add Product</>
      </Button>
    );
  }

  return (
    <Button
      asChild
      href="/add-product"
      size="default"
      className={[
        "min-h-11 gap-2 rounded-lg",
        sizeClass[size],
        weightClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
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
    </Button>
  );
}
