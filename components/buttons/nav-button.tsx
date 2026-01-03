import { Button } from "@/components/buttons/button";

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
  const sizeMap = {
    sm: "sm" as const,
    md: "default" as const,
    lg: "lg" as const,
  };

  return (
    <Button
      asChild
      href={href}
      variant="default"
      size={sizeMap[size]}
      className={["rounded-lg", className].filter(Boolean).join(" ")}
    >
      {label}
    </Button>
  );
}

export function SecondaryButton({
  href,
  label,
  size = "md",
  className = "",
  variant = "default",
}: SecondaryButtonProps) {
  const sizeMap = {
    sm: "sm" as const,
    md: "default" as const,
    lg: "lg" as const,
  };

  return (
    <Button
      asChild
      href={href}
      variant={variant === "subtle" ? "subtle" : "outline"}
      size={sizeMap[size]}
      className={[
        "rounded-lg",
        variant === "default" && "bg-glass text-(--text-primary)",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </Button>
  );
}
