"use client";

import clsx from "clsx";
import { useEffect, useId, useRef, useState } from "react";

/* ────────────────────────────────────────────── */
/* Types */
/* ────────────────────────────────────────────── */

export interface TrendIndicatorProps {
  direction: "up" | "down" | "flat";
  percentage: number;
  label?: string;
  size?: "sm" | "md";
  isLoading?: boolean;
}

/* ────────────────────────────────────────────── */
/* Component */
/* ────────────────────────────────────────────── */

export default function TrendIndicator({
  direction,
  percentage,
  label,
  size = "sm",
  isLoading = false,
}: TrendIndicatorProps) {
  const id = useId(); // prevents SVG gradient collisions
  const prevValue = useRef<number | null>(null);
  const [animate, setAnimate] = useState(false);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (
      prefersReducedMotion ||
      isLoading ||
      direction === "flat" ||
      prevValue.current === null ||
      prevValue.current === percentage
    ) {
      prevValue.current = percentage;
      return;
    }

    const timer = setTimeout(() => setAnimate(false), 300);
    // Defer setAnimate to avoid synchronous setState in effect
    setTimeout(() => setAnimate(true), 0);

    prevValue.current = percentage;
    return () => clearTimeout(timer);
  }, [percentage, direction, isLoading, prefersReducedMotion]);

  const formattedPercentage =
    direction === "flat"
      ? "0%"
      : `${percentage > 0 ? "+" : ""}${percentage.toFixed(2)}%`;

  const ariaLabel =
    direction === "flat"
      ? "No change"
      : `${
          direction === "up" ? "Increase" : "Decrease"
        } of ${formattedPercentage}`;

  const styles = {
    up: {
      color: "text-green-700 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/40",
      ring: "ring-green-300/50",
      icon: <ArrowUp size={size} gradientId={`up-gradient-${id}`} />,
    },
    down: {
      color: "text-red-700 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-900/40",
      ring: "ring-red-300/50",
      icon: <ArrowDown size={size} gradientId={`down-gradient-${id}`} />,
    },
    flat: {
      color: "text-gray-600 dark:text-gray-400",
      bg: "bg-gray-100 dark:bg-gray-800",
      ring: "ring-gray-300/50",
      icon: <FlatLine size={size} gradientId={`flat-gradient-${id}`} />,
    },
  };

  const style = styles[direction];

  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border text-xs font-medium",
        "transition-all",
        size === "sm" ? "px-2 py-0.5" : "px-3 py-1 text-sm",
        style.bg,
        style.color,
        animate && !prefersReducedMotion && `ring-2 ${style.ring}`,
        isLoading && "opacity-60"
      )}
      style={{ minWidth: size === "sm" ? 70 : 90 }}
    >
      <span
        aria-hidden
        className={clsx(
          "flex items-center justify-center transition-transform",
          animate &&
            !prefersReducedMotion &&
            (direction === "up"
              ? "-translate-y-0.5"
              : direction === "down"
              ? "translate-y-0.5"
              : "")
        )}
      >
        {style.icon}
      </span>

      <span className="tabular-nums tracking-tight">{formattedPercentage}</span>

      {label && (
        <span className="hidden sm:inline ml-1 text-(--text-muted) font-normal">
          {label}
        </span>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────── */
/* Icons */
/* ────────────────────────────────────────────── */

function ArrowUp({
  size,
  gradientId,
}: {
  size: "sm" | "md";
  gradientId: string;
}) {
  return (
    <svg
      width={size === "sm" ? 16 : 20}
      height={size === "sm" ? 16 : 20}
      viewBox="0 0 20 20"
      fill="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="20" x2="20" y2="0">
          <stop stopColor="#22c55e" />
          <stop offset="1" stopColor="#16a34a" />
        </linearGradient>
      </defs>
      <path
        d="M10 16V4M10 4l-5 5M10 4l5 5"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowDown({
  size,
  gradientId,
}: {
  size: "sm" | "md";
  gradientId: string;
}) {
  return (
    <svg
      width={size === "sm" ? 16 : 20}
      height={size === "sm" ? 16 : 20}
      viewBox="0 0 20 20"
      fill="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="20" y2="20">
          <stop stopColor="#ef4444" />
          <stop offset="1" stopColor="#b91c1c" />
        </linearGradient>
      </defs>
      <path
        d="M10 4v12M10 16l-5-5M10 16l5-5"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FlatLine({
  size,
  gradientId,
}: {
  size: "sm" | "md";
  gradientId: string;
}) {
  return (
    <svg
      width={size === "sm" ? 16 : 20}
      height={size === "sm" ? 16 : 20}
      viewBox="0 0 20 20"
      fill="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="10" x2="20" y2="10">
          <stop stopColor="#a3a3a3" />
          <stop offset="1" stopColor="#525252" />
        </linearGradient>
      </defs>
      <path
        d="M4 10h12"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
