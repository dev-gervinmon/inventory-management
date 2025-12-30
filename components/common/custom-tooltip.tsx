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
    <div className="bg-white border border-gray-200 rounded-md px-3 py-2 shadow-md text-xs w-[140px]">
      <p className="font-semibold text-gray-900 mb-1">{formatDate(label!)}</p>

      <div className="space-y-0.5">
        <div className="flex justify-between text-green-600">
          <span>In</span>
          <span className="font-semibold">{inValue}</span>
        </div>

        <div className="flex justify-between text-red-600">
          <span>Out</span>
          <span className="font-semibold">{outValue}</span>
        </div>

        <div
          className={`flex justify-between border-t pt-1 mt-1 font-semibold ${
            net >= 0 ? "text-green-700" : "text-red-700"
          }`}
        >
          <span>Net</span>
          <span>{net}</span>
        </div>
      </div>
    </div>
  );
});
