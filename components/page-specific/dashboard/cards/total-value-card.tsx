import { Badge } from "@/components/common/badge";
import { Card } from "@/components/common/card";
import { formatPrice } from "@/lib/utils/products";
import { Coins, TrendingUp } from "lucide-react";

interface TotalValueCardProps {
  totalRetailValue: number;
  totalCostValue: number;
  totalPotentialProfit: number;
  productsMissingCost: number;
}

export default function TotalValueCard({
  totalRetailValue,
  totalCostValue,
  totalPotentialProfit,
  productsMissingCost,
}: TotalValueCardProps) {
  const hasCostCoverage = productsMissingCost === 0;

  return (
    <Card className="border-(--border-strong) bg-glass p-3 sm:p-5 flex flex-col h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-(--border-subtle) bg-(--surface-elevated)/40">
              <Coins className="h-5 w-5 text-(--brand)" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-semibold tracking-tight text-(--text-primary)">
                Total Value
              </h3>
              <p className="text-xs text-(--text-muted)">
                Value of current inventory on hand
              </p>
            </div>
          </div>
        </div>

        <Badge tone={hasCostCoverage ? "success" : "warning"}>
          {hasCostCoverage
            ? "Cost-ready"
            : `${productsMissingCost} missing cost`}
        </Badge>
      </div>

      <div className="mt-4">
        <div className="text-xs font-semibold text-(--text-muted)">At cost</div>
        <div className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-(--text-primary)">
          {formatPrice(totalCostValue)}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
        <div className="rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/30 px-3 py-3">
          <div className="text-[11px] font-semibold text-(--text-muted)">
            Retail value
          </div>
          <div className="mt-1 text-sm sm:text-base font-bold text-(--text-primary)">
            {formatPrice(totalRetailValue)}
          </div>
        </div>

        <div className="rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/30 px-3 py-3">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-(--text-muted)">
            <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
            Potential profit
          </div>
          <div className="mt-1 text-sm sm:text-base font-bold text-(--text-primary)">
            {formatPrice(totalPotentialProfit)}
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-(--text-muted)">
        {hasCostCoverage
          ? "Cost is set for all products."
          : "Set unit cost on products to unlock accurate cost-based valuation."}
      </p>
    </Card>
  );
}
