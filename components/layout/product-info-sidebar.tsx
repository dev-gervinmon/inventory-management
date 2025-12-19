"use client";

import { formatPrice, formatProductDate } from "@/lib/utils/products";
import { getStockStatus } from "@/lib/utils/products";
import FormButton from "@/components/buttons/form-button";
import { Copy } from "lucide-react";
import { useState } from "react";

interface ProductInfoSidebarProps {
  productId: string;
  sku: string | null;
  price: number;
  quantity: number;
  lowStockAt: number | null;
  createdAt: Date;
  updatedAt: Date;
  onDelete: () => void;
  isDeleting?: boolean;
}

export default function ProductInfoSidebar({
  productId,
  sku,
  price,
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
    <div className="lg:col-span-1 space-y-6">
      {/* Stock Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
              Stock Status
            </p>
            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-bold ${stockStatus.color}`}
              >
                {stockStatus.label}
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {quantity}
              </span>
            </div>
          </div>

          {lowStockAt && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">Low Stock Threshold</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {lowStockAt} units
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">
          Price
        </p>
        <p className="text-2xl font-bold text-gray-900">{formatPrice(price)}</p>
      </div>

      {/* Product ID */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
          Product ID
        </p>
        <div className="flex items-center gap-2">
          <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-700 flex-1 truncate">
            {productId}
          </code>
          <button
            onClick={() => copyToClipboard(productId, "id")}
            className="p-1.5 hover:bg-gray-100 rounded transition cursor-pointer"
            title="Copy product ID"
          >
            <Copy
              className={`w-4 h-4 ${
                copiedField === "id" ? "text-green-600" : "text-gray-400"
              }`}
            />
          </button>
        </div>
      </div>

      {/* SKU */}
      {sku && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
            SKU
          </p>
          <div className="flex items-center gap-2">
            <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono text-gray-700 flex-1 truncate">
              {sku}
            </code>
            <button
              onClick={() => copyToClipboard(sku, "sku")}
              className="p-1.5 hover:bg-gray-100 rounded transition cursor-pointer"
              title="Copy SKU"
            >
              <Copy
                className={`w-4 h-4 ${
                  copiedField === "sku" ? "text-green-600" : "text-gray-400"
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
            Created
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {formatProductDate(createdAt)}
          </p>
        </div>
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
            Last Updated
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {formatProductDate(updatedAt)}
          </p>
        </div>
      </div>

      {/* Delete Button */}
      <FormButton
        type="button"
        label={isDeleting ? "Deleting..." : "Delete Product"}
        variant="delete"
        size="lg"
        disabled={isDeleting}
        onClick={onDelete}
        className="w-full"
      />
    </div>
  );
}
