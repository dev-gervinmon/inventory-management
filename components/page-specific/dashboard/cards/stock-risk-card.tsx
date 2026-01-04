import { StockRiskItem } from "@/lib/types/dashboard";
import Link from "next/link";
import clsx from "clsx";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/common/badge";
import { Card } from "@/components/common/card";
import { Button } from "@/components/buttons/button";

interface StockRiskCardProps {
  totalAtRisk: number;
  outOfStock: number;
  lowStock: number;
  items: StockRiskItem[];
}

export default function StockRiskCard({
  totalAtRisk,
  outOfStock,
  lowStock,
  items,
}: StockRiskCardProps) {
  const isHealthy = totalAtRisk === 0;

  const riskLevel: "high" | "medium" | "low" = isHealthy
    ? "low"
    : outOfStock > 0
    ? "high"
    : "medium";

  const severityDot = {
    out: "bg-(--danger)",
    low: "bg-(--warning)",
  } as const;

  const topItems = items.slice(0, 3);
  const remainingCount = Math.max(0, items.length - topItems.length);

  const statusParam =
    outOfStock > 0 && lowStock > 0
      ? "critical-stock"
      : outOfStock > 0
      ? "out-of-stock"
      : "low-stock";

  const ctaLabel =
    outOfStock > 0 && lowStock > 0
      ? "Review critical stock"
      : outOfStock > 0
      ? "Review out-of-stock items"
      : "Review low-stock items";

  const badgeText =
    outOfStock > 0 && lowStock > 0
      ? `${outOfStock} out • ${lowStock} low`
      : outOfStock > 0
      ? `${outOfStock} out`
      : `${lowStock} low`;

  return (
    <Card className="border-(--border-strong) bg-glass p-3 sm:p-5 flex flex-col transition-colors">
      {/* ================= Healthy State ================= */}
      {isHealthy ? (
        <div className="flex flex-col items-center justify-center text-center py-6 sm:py-8">
          <span className="mb-3 inline-flex items-center justify-center w-16 h-16 rounded-full border bg-(--success)/10 text-(--success) border-(--success)/20">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </span>

          <h4 className="text-lg sm:text-xl font-semibold text-(--text-primary)">
            Inventory Healthy
          </h4>
          <p className="mt-1 text-sm text-(--text-muted)">
            No low or out-of-stock items detected
          </p>
        </div>
      ) : (
        <>
          {/* ================= Header ================= */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={clsx(
                  "flex items-center justify-center w-9 h-9 rounded-full border",
                  outOfStock > 0
                    ? "bg-(--danger)/10 border-(--danger)/20 text-(--danger)"
                    : "bg-(--warning)/10 border-(--warning)/20 text-(--warning)"
                )}
              >
                {outOfStock > 0 ? (
                  <XCircle className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                )}
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-(--text-primary)">
                  Stock Risk Overview
                </h4>
                <p className="text-xs text-(--text-muted)">
                  Items requiring attention
                </p>
              </div>
            </div>

            <Badge tone={outOfStock > 0 ? "danger" : "warning"}>
              {badgeText}
            </Badge>
          </div>

          {/* ================= Summary ================= */}
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            {outOfStock > 0 && (
              <div className="flex items-center gap-2 bg-(--danger)/10 border border-(--danger)/20 rounded-xl px-3 py-2 flex-1">
                <XCircle
                  className="h-4 w-4 text-(--danger)"
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold text-(--danger)">
                  {outOfStock} out of stock
                </span>
              </div>
            )}
            {lowStock > 0 && (
              <div className="flex items-center gap-2 bg-(--warning)/10 border border-(--warning)/20 rounded-xl px-3 py-2 flex-1">
                <AlertTriangle
                  className="h-4 w-4 text-(--warning)"
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold text-(--warning)">
                  {lowStock} low stock
                </span>
              </div>
            )}
          </div>

          {/* ================= Critical Items ================= */}
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-semibold text-(--text-muted)">
                Top risk items
              </div>
              {remainingCount > 0 && (
                <Link
                  href={`/inventory?status=${statusParam}`}
                  className="text-xs font-semibold text-(--text-secondary) hover:text-(--text-primary) transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40 rounded-md px-1"
                >
                  +{remainingCount} more
                </Link>
              )}
            </div>

            {topItems.length > 0 ? (
              <ul className="max-h-28 overflow-y-auto divide-y divide-(--border-subtle) pr-1">
                {topItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/inventory/${item.id}/edit-product`}
                      className="flex items-start gap-2 py-2 px-2 rounded-xl transition-colors hover:bg-(--surface-elevated)/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40"
                    >
                      <span
                        className={clsx(
                          "w-2.5 h-2.5 rounded-full shrink-0 mt-1.5",
                          severityDot[item.severity]
                        )}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-(--text-primary)">
                          {item.name}
                        </div>
                        <div className="truncate text-[11px] text-(--text-muted)">
                          SKU: {item.sku || "N/A"}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="text-xs font-semibold text-(--text-secondary)">
                          {item.quantity === 0
                            ? "Out"
                            : `Low (${item.quantity})`}
                        </div>
                        <div className="text-[11px] text-(--text-muted)">
                          Low at {item.lowStockAt}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/20 px-3 py-3 text-xs text-(--text-muted)">
                Risk details are unavailable, but some items are flagged.
              </div>
            )}
          </div>

          {/* ================= CTA ================= */}
          <Button
            asChild
            href={`/inventory?status=${statusParam}`}
            variant={riskLevel === "high" ? "destructive" : "default"}
            className="mt-auto w-full"
          >
            {ctaLabel}
          </Button>
        </>
      )}
    </Card>
  );
}
