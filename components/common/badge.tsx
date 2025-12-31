import * as React from "react";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement>;

export function Badge({ className = "", ...props }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-4 py-1.5",
        "text-xs font-semibold tracking-wide",
        "bg-(--brand)/10 text-(--brand)",
        "border border-(--brand)/20",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
