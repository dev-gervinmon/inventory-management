import { Button } from "@/components/buttons/button";
import { Plus } from "lucide-react";

interface AddProductButtonProps {
  variant?: "simple" | "with-icon";
  size?: "sm" | "md";
  className?: string;
  href?: string;
  onClick?: () => void;
}

export default function AddProductButton({
  variant = "with-icon",
  size = "md",
  className = "",
  href = "/add-product",
  onClick,
}: AddProductButtonProps) {
  const sizeClass = {
    sm: "px-4 py-2.5 text-xs sm:text-sm",
    md: "px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-base",
  };

  const weightClass = size === "md" ? "font-semibold" : "";

  if (variant === "simple") {
    return (
      <Button
        asChild={!onClick}
        href={onClick ? undefined : href}
        onClick={onClick}
        type={onClick ? "button" : undefined}
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
      asChild={!onClick}
      href={onClick ? undefined : href}
      onClick={onClick}
      type={onClick ? "button" : undefined}
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
      <Plus
        className={size === "sm" ? "h-4 w-4" : "h-5 w-5"}
        aria-hidden="true"
      />
      Add Product
    </Button>
  );
}
