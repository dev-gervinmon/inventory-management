import * as React from "react";

type BadgeTone = "brand" | "neutral" | "success" | "warning" | "danger";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

export function Badge({
  tone = "brand",
  className = "",
  ...props
}: BadgeProps) {
  const tones: Record<BadgeTone, string> = {
    brand: "bg-(--brand)/10 text-(--brand) border-(--brand)/20",
    neutral:
      "bg-(--surface-elevated)/40 text-(--text-secondary) border-(--border-subtle)",
    success: "bg-(--success)/10 text-(--success) border-(--success)/20",
    warning: "bg-(--warning)/10 text-(--warning) border-(--warning)/20",
    danger: "bg-(--danger)/10 text-(--danger) border-(--danger)/20",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-4 py-1.5",
        "text-xs font-semibold tracking-wide",
        tones[tone],
        "border",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
