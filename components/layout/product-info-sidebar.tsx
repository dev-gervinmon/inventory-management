"use client";

import { formatPrice, formatProductDate } from "@/lib/utils/products";
import { getStockStatus } from "@/lib/utils/products";
import FormButton from "@/components/buttons/form-button";
import { Copy } from "lucide-react";
import { useState } from "react";

interface ProductInfoSidebarProps {
  className?: string;
  productId: string;
  sku: string | null;
  price: number;
  unitCost?: number | null;
  quantity: number;
  lowStockAt: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export default function ProductInfoSidebar({
  className = "",
  productId,
  sku,
  price,
  unitCost = null,
  quantity,
  lowStockAt,
  createdAt,
  updatedAt,
  onDelete,
  isDeleting = false,
}: ProductInfoSidebarProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const stockStatus = getStockStatus(quantity, lowStockAt);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className={["space-y-4 sm:space-y-5", className].join(" ")}>
      {/* Stock Status */}
      <div className="rounded-2xl border border-(--border-strong) bg-(--surface-elevated)/10 p-4 sm:p-5">
        <div className="space-y-3 sm:space-y-4">
          <div>
            <p className="text-xs text-(--text-muted) uppercase tracking-wider font-semibold mb-2">
              Stock Status
            </p>
            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${stockStatus.color}`}
              >
                <span aria-hidden>{stockStatus.icon}</span>
                {stockStatus.label}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-(--text-primary)">
                {quantity} unit/s
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-(--border-subtle)">
            <p className="text-xs text-(--text-muted)">Low Stock Threshold</p>
            <p className="text-sm font-semibold text-(--text-primary) mt-1">
              {lowStockAt && lowStockAt > 0 ? `${lowStockAt} units` : "Not set"}
            </p>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="rounded-2xl border border-(--border-strong) bg-(--surface-elevated)/10 p-4 sm:p-5">
        <p className="text-xs text-(--text-muted) uppercase tracking-wider font-semibold mb-3">
          Price
        </p>
        <p className="text-xl sm:text-2xl font-bold text-(--text-primary)">
          {formatPrice(price)}
        </p>
        <p className="mt-2 text-xs text-(--text-muted)">
          Unit cost: {unitCost !== null ? formatPrice(unitCost) : "Not set"}
        </p>
      </div>

      {/* Product ID */}
      <div className="rounded-2xl border border-(--border-strong) bg-(--surface-elevated)/10 p-4 sm:p-5">
        <p className="text-xs text-(--text-muted) uppercase tracking-wider font-semibold mb-2">
          Product ID
        </p>
        <div className="flex items-center gap-2">
          <code className="text-xs bg-(--surface-elevated)/30 px-2 py-1 rounded-lg font-mono text-(--text-secondary) flex-1 truncate border border-(--border-subtle)">
            {productId}
          </code>
          <button
            onClick={() => copyToClipboard(productId, "id")}
            className="p-1.5 hover:bg-(--surface-elevated)/25 rounded-lg transition cursor-pointer shrink-0 text-(--text-muted) hover:text-(--text-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40"
            title="Copy product ID"
          >
            <Copy
              className={`w-4 h-4 ${
                copiedField === "id"
                  ? "text-(--success)"
                  : "text-(--text-muted)"
              }`}
            />
          </button>
        </div>
      </div>

      {/* SKU */}
      {sku && (
        <div className="rounded-2xl border border-(--border-strong) bg-(--surface-elevated)/10 p-4 sm:p-5">
          <p className="text-xs text-(--text-muted) uppercase tracking-wider font-semibold mb-2">
            SKU
          </p>
          <div className="flex items-center gap-2">
            <code className="text-sm bg-(--surface-elevated)/30 px-2 py-1 rounded-lg font-mono text-(--text-secondary) flex-1 truncate border border-(--border-subtle)">
              {sku}
            </code>
            <button
              onClick={() => copyToClipboard(sku, "sku")}
              className="p-1.5 hover:bg-(--surface-elevated)/25 rounded-lg transition cursor-pointer shrink-0 text-(--text-muted) hover:text-(--text-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40"
              title="Copy SKU"
            >
              <Copy
                className={`w-4 h-4 ${
                  copiedField === "sku"
                    ? "text-(--success)"
                    : "text-(--text-muted)"
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="rounded-2xl border border-(--border-strong) bg-(--surface-elevated)/10 p-4 sm:p-5 space-y-2 sm:space-y-3">
        <div>
          <p className="text-xs text-(--text-muted) uppercase tracking-wider font-semibold">
            Created
          </p>
          <p className="text-xs sm:text-sm text-(--text-secondary) mt-1">
            {formatProductDate(createdAt)}
          </p>
        </div>
        <div className="pt-3 border-t border-(--border-subtle)">
          <p className="text-xs text-(--text-muted) uppercase tracking-wider font-semibold">
            Last Updated
          </p>
          <p className="text-xs sm:text-sm text-(--text-secondary) mt-1">
            {formatProductDate(updatedAt)}
          </p>
        </div>
      </div>

      {/* Delete Button */}
      {onDelete && (
        <FormButton
          type="button"
          label={isDeleting ? "Deleting..." : "Delete Product"}
          variant="delete"
          size="lg"
          disabled={isDeleting}
          onClick={onDelete}
          className="w-full"
        />
      )}
    </div>
  );
}
