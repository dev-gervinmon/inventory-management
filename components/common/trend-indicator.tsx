"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

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
  const prevValue = useRef<number | null>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (prevValue.current !== null && prevValue.current !== percentage) {
      const startAnimation = setTimeout(() => setAnimate(true), 0);
      const timer = setTimeout(() => setAnimate(false), 600);
      return () => {
        clearTimeout(startAnimation);
        clearTimeout(timer);
      };
    }
    prevValue.current = percentage;
  }, [percentage]);

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
        "inline-flex items-center gap-1 rounded-full text-xs font-medium transition-all",
        style.bg,
        style.color,
        animate && "scale-105 ring-2 ring-offset-1 ring-current/20",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      <span
        className={clsx(
          "transition-transform",
          animate && direction === "up" && "-translate-y-0.5",
          animate && direction === "down" && "translate-y-0.5"
        )}
        aria-hidden
      >
        {style.icon}
      </span>
      <span>{percentage}%</span>
      {label && <span className="hidden sm:inline ml-1">{label}</span>}
    </div>
  );
}
