import { memo } from "react";
import type { Payload } from "recharts/types/component/DefaultTooltipContent";

interface TooltipProps {
  active?: boolean;
  payload?: Payload<number, string>[];
  label?: string;
}

export function formatDate(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export const CustomTooltip = memo(function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps) {
  if (!active || !payload || payload.length < 2) return null;

  const inValue = payload[0]?.value ?? 0;
  const outValue = payload[1]?.value ?? 0;
  const net = inValue - outValue;

  return (
    <div className="rounded-xl border border-(--border-strong) bg-glass px-3 py-2 text-xs w-[150px]">
      <p className="font-semibold text-(--text-primary) mb-1">
        {formatDate(label!)}
      </p>

      <div className="space-y-0.5">
        <div className="flex justify-between text-(--success)">
          <span>In</span>
          <span className="font-semibold">{inValue}</span>
        </div>

        <div className="flex justify-between text-(--danger)">
          <span>Out</span>
          <span className="font-semibold">{outValue}</span>
        </div>

        <div
          className={[
            "flex justify-between border-t border-(--border-subtle) pt-1 mt-1 font-semibold",
            net >= 0 ? "text-(--success)" : "text-(--danger)",
          ].join(" ")}
        >
          <span>Net</span>
          <span>{net}</span>
        </div>
      </div>
    </div>
  );
});
