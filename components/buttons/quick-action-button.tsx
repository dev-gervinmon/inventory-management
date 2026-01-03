import { Button } from "@/components/buttons/button";

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
  const isPrimary = variant === "primary";

  return (
    <Button
      asChild
      href={href}
      variant={isPrimary ? "default" : "outline"}
      className={[
        "min-h-11 gap-2 px-4 py-3",
        "rounded-lg",
        !isPrimary && "bg-glass text-(--text-secondary)",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <>
        {icon}
        {label}
      </>
    </Button>
  );
}
