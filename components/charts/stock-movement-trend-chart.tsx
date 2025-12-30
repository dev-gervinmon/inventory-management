import { StockMovementTrend } from "@/lib/domain/stock-movement";

interface Props {
  data: StockMovementTrend[];
}

export default function StockMovementTrendChart({ data }: Props) {
  return (
    <div className="h-48">
      <p className="text-center text-gray-500 mt-16">
        [Trend Chart Placeholder]
      </p>
    </div>
  );
}
