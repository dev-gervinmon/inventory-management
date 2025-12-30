"use client";

import { ANALYTICS_PERIODS, AnalyticsPeriod } from "@/lib/domain/period";
import clsx from "clsx";

interface PeriodSelectorProps {
  value: AnalyticsPeriod;
  onChange: (value: AnalyticsPeriod) => void;
}

export default function PeriodSelector({
  value,
  onChange,
}: PeriodSelectorProps) {
  return (
    <div className="inline-flex rounded-md border bg-background p-1">
      {ANALYTICS_PERIODS.map((period) => (
        <button
          key={period}
          onClick={() => onChange(period)}
          className={clsx(
            "px-3 py-1 text-xs font-medium rounded transition",
            value === period
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted"
          )}
        >
          {period}
        </button>
      ))}
    </div>
  );
}
