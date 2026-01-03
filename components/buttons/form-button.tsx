import { Button } from "@/components/buttons/button";

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
  const sizeMap = {
    sm: "sm" as const,
    md: "default" as const,
    lg: "lg" as const,
  };

  const variantMap = {
    primary: "default" as const,
    secondary: "outline" as const,
    edit: "outline" as const,
    delete: "destructive" as const,
  };

  return (
    <Button
      type={type}
      variant={variantMap[variant]}
      size={sizeMap[size]}
      disabled={disabled}
      isLoading={isLoading}
      onClick={onClick}
      className={[
        "rounded-lg",
        // Preserve the common "form" feel without bespoke colors
        "gap-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span>{label}</span>
    </Button>
  );
}
