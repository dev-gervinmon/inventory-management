"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export interface TrendIndicatorProps {
  direction: "up" | "down" | "flat";
  percentage: number;
  label?: string;
  size?: "sm" | "md";
  isLoading?: boolean;
}

export default function TrendIndicator({
  direction,
  percentage,
  label,
  size = "sm",
  isLoading = false,
}: TrendIndicatorProps) {
  const prevValue = useRef<number | null>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (
      !isLoading &&
      prevValue.current !== null &&
      prevValue.current !== percentage &&
      direction !== "flat"
    ) {
      const startAnimation = setTimeout(() => setAnimate(true), 0);
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => {
        clearTimeout(startAnimation);
        clearTimeout(timer);
      };
    }

    prevValue.current = percentage;
  }, [percentage, direction, isLoading]);

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

  const formattedPercentage =
    direction === "flat" ? "0%" : `${percentage > 0 ? "+" : ""}${percentage}%`;

  return (
    <div
      aria-live="polite"
      className={clsx(
        "inline-flex items-center gap-1 rounded-full font-medium transition-all",
        style.bg,
        style.color,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        animate && "scale-105 ring-2 ring-current/20",
        isLoading && "opacity-60"
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

      <span>{formattedPercentage}</span>

      {label && (
        <span className="hidden sm:inline ml-1 text-gray-500">{label}</span>
      )}
    </div>
  );
}
