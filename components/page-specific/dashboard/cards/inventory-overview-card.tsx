import { Badge } from "@/components/common/badge";
import { Card } from "@/components/common/card";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface InventoryOverviewCardProps {
  totalProducts: number;
  inStockCount: number;
  inStockPercentage: number;
  lowStockCount: number;
  lowStockPercentage: number;
  outOfStockCount: number;
  outOfStockPercentage: number;
  criticalStockCount: number;
}

export default function InventoryOverviewCard(
  props: InventoryOverviewCardProps
) {
  const {
    totalProducts,
    inStockCount,
    inStockPercentage,
    lowStockCount,
    lowStockPercentage,
    outOfStockCount,
    outOfStockPercentage,
    criticalStockCount,
  } = props;

  const healthStatus =
    criticalStockCount > 0
      ? "critical"
      : lowStockCount > 0
      ? "warning"
      : "healthy";

  const badgeTone =
    healthStatus === "critical"
      ? ("danger" as const)
      : healthStatus === "warning"
      ? ("warning" as const)
      : ("success" as const);

  const badgeText =
    totalProducts === 0
      ? "Empty"
      : healthStatus === "critical"
      ? `${outOfStockCount} out • ${lowStockCount} low`
      : healthStatus === "warning"
      ? `${lowStockCount} low`
      : "Healthy";

  const statusLine =
    totalProducts === 0
      ? "No products tracked yet"
      : `In ${inStockPercentage}% • Low ${lowStockPercentage}% • Out ${outOfStockPercentage}%`;

  return (
    <Card className="border-(--border-strong) bg-glass p-3 sm:p-5 flex flex-col h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={
                healthStatus === "healthy"
                  ? "inline-flex items-center justify-center w-9 h-9 rounded-full border bg-(--success)/10 text-(--success) border-(--success)/20"
                  : healthStatus === "warning"
                  ? "inline-flex items-center justify-center w-9 h-9 rounded-full border bg-(--warning)/10 text-(--warning) border-(--warning)/20"
                  : "inline-flex items-center justify-center w-9 h-9 rounded-full border bg-(--danger)/10 text-(--danger) border-(--danger)/20"
              }
            >
              {healthStatus === "healthy" ? (
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              ) : healthStatus === "warning" ? (
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              ) : (
                <XCircle className="h-5 w-5" aria-hidden="true" />
              )}
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-semibold tracking-tight text-(--text-primary)">
                Inventory Overview
              </h3>
              <p className="text-xs text-(--text-muted)">{statusLine}</p>
            </div>
          </div>
        </div>

        <Badge tone={badgeTone}>{badgeText}</Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
        <Metric
          label="In stock"
          value={inStockCount}
          subtitle={`${inStockPercentage}%`}
          tone="success"
        />
        <Metric
          label="Low stock"
          value={lowStockCount}
          subtitle={`${lowStockPercentage}%`}
          tone="warning"
        />
        <Metric
          label="Out of stock"
          value={outOfStockCount}
          subtitle={`${outOfStockPercentage}%`}
          tone="danger"
        />
        <Metric
          label="Total"
          value={totalProducts}
          subtitle="Products"
          tone="neutral"
        />
      </div>

      <p className="mt-4 text-xs text-(--text-muted)">
        {totalProducts === 0
          ? "Add products to start tracking inventory health."
          : healthStatus === "healthy"
          ? "Everything looks good at a glance."
          : "Review low/out-of-stock items to reduce risk."}
      </p>
    </Card>
  );
}

function Metric({
  label,
  value,
  subtitle,
  tone,
}: {
  label: string;
  value: number;
  subtitle: string;
  tone: "success" | "warning" | "danger" | "neutral";
}) {
  const valueTone: Record<
    "success" | "warning" | "danger" | "neutral",
    string
  > = {
    success: "text-(--success)",
    warning: "text-(--warning)",
    danger: "text-(--danger)",
    neutral: "text-(--text-primary)",
  };

  return (
    <div className="rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/30 px-3 py-3">
      <div className="text-[11px] font-semibold text-(--text-muted)">
        {label}
      </div>
      <div
        className={["mt-1 text-xl sm:text-2xl font-bold", valueTone[tone]].join(
          " "
        )}
      >
        {value}
      </div>
      <div className="mt-0.5 text-[11px] text-(--text-muted)">{subtitle}</div>
    </div>
  );
}
