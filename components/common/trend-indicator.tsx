import clsx from "clsx";

export interface TrendIndicatorProps {
  direction: "up" | "down" | "flat";
  percentage: number;
  label?: string;
  size?: "sm" | "md";
}

export default function TrendIndicator({
  direction,
  percentage,
  label,
  size = "sm",
}: TrendIndicatorProps) {
  const styles = {
    up: {
      icon: "↑",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    down: {
      icon: "↓",
      color: "text-red-600",
      bg: "bg-red-50",
    },
    flat: {
      icon: "→",
      color: "text-gray-500",
      bg: "bg-gray-100",
    },
  };

  const style = styles[direction];

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-1 rounded-full font-medium",
        style.bg,
        style.color,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      <span aria-hidden>{style.icon}</span>
      <span>{percentage}%</span>
      {label && <span className="hidden sm:inline ml-1">{label}</span>}
    </div>
  );
}
