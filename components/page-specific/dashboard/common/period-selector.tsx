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
        "bg-(--surface-elevated)/30",
        "border-(--border-subtle)",
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
              "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40",
              isActive
                ? "bg-(--surface-elevated) text-(--text-primary) shadow-sm"
                : "text-(--text-muted) hover:bg-(--surface-elevated)/60"
            )}
          >
            {period}
          </button>
        );
      })}
    </div>
  );
}
