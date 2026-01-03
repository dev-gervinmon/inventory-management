"use client";

import { ANALYTICS_PERIODS, AnalyticsPeriod } from "@/lib/domain/period";
import clsx from "clsx";
import { useEffect, useRef } from "react";

/* ────────────────────────────────────────────── */
/* Types */
/* ────────────────────────────────────────────── */

interface PeriodSelectorProps {
  value: AnalyticsPeriod;
  onChange: (value: AnalyticsPeriod) => void;
  isLoading?: boolean;
}

/* ────────────────────────────────────────────── */
/* Component */
/* ────────────────────────────────────────────── */

export default function PeriodSelector({
  value,
  onChange,
  isLoading = false,
}: PeriodSelectorProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const activeIndex = ANALYTICS_PERIODS.indexOf(value);

  useEffect(() => {
    refs.current[activeIndex]?.focus();
  }, [activeIndex]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (isLoading) return;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = (activeIndex + 1) % ANALYTICS_PERIODS.length;
      onChange(ANALYTICS_PERIODS[next]);
    }

    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prev =
        (activeIndex - 1 + ANALYTICS_PERIODS.length) % ANALYTICS_PERIODS.length;
      onChange(ANALYTICS_PERIODS[prev]);
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label="Select analytics period"
      aria-busy={isLoading}
      onKeyDown={handleKeyDown}
      className={clsx(
        "inline-flex items-center gap-1 rounded-lg border p-1",
        "bg-gray-50 dark:bg-gray-800",
        "border-gray-200 dark:border-gray-700",
        isLoading && "opacity-60 pointer-events-none"
      )}
    >
      {ANALYTICS_PERIODS.map((period, index) => {
        const isActive = value === period;

        return (
          <button
            key={period}
            ref={(el) => {
              refs.current[index] = el;
            }}
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(period)}
            disabled={isLoading}
            className={clsx(
              "relative px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md cursor-pointer",
              "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
              isActive
                ? "bg-white dark:bg-gray-900 text-purple-700 shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
          >
            {period}
          </button>
        );
      })}
    </div>
  );
}
