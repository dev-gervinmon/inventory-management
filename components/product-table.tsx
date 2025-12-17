"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SerializedProduct } from "@/app/src/utils/product";
import { bulkDeleteProducts } from "@/lib/actions/products";
import {
  getStockStatus,
  formatPrice,
  formatProductDate,
} from "@/lib/utils/products";

export default function ProductTable({
  products,
}: {
  products: SerializedProduct[];
}) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSelectAll = () => {
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(products.map((p) => p.id)));
    }
  };

  const handleSelectProduct = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) {
      alert("Please select at least one product");
      return;
    }

    if (
      !confirm(
        `Delete ${selectedIds.size} product(s)? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await bulkDeleteProducts(Array.from(selectedIds));
      setSelectedIds(new Set());
      router.refresh();
    } catch (error) {
      alert("Failed to delete products");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <input
          type="checkbox"
          checked={selectedIds.size > 0 && selectedIds.size === products.length}
          onChange={handleSelectAll}
          title="Select all products"
          className="w-4 h-4 cursor-pointer"
        />

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {selectedIds.size} selected
            </span>
            <button
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isDeleting ? "Deleting..." : "Delete Selected"}
            </button>
          </div>
        )}
      </div>

      {products.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">No products found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300 bg-gray-100">
                <th className="px-6 py-4 text-left"></th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Categories
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => {
                const status = getStockStatus(
                  Number(product.quantity),
                  product.lowStockAt
                );

                const handleRowClick = () => {
                  router.push(`/inventory/${product.id}/edit-product`);
                };

                const isSelected = selectedIds.has(product.id);

                return (
                  <tr
                    key={product.id}
                    onClick={handleRowClick}
                    className={`transition border-b border-gray-200 cursor-pointer ${
                      isSelected
                        ? "bg-blue-50"
                        : index % 2 === 0
                        ? "bg-white hover:bg-blue-50"
                        : "bg-gray-50 hover:bg-blue-50"
                    } hover:border-blue-200`}
                  >
                    {/* Checkbox Column */}
                    <td
                      className="px-6 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectProduct(product.id)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </td>

                    {/* Product Name + Image */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatProductDate(product.createdAt)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {product.sku || "-"}
                    </td>

                    {/* Categories */}
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {product.categories && product.categories.length > 0 ? (
                          <>
                            {product.categories.slice(0, 2).map((cat) => (
                              <span
                                key={cat.id}
                                className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium"
                              >
                                {cat.name}
                              </span>
                            ))}
                            {product.categories.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                                +{product.categories.length - 2}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-500 text-xs">-</span>
                        )}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatPrice(product.price)}
                    </td>

                    {/* Stock Quantity */}
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="font-medium">{product.quantity}</span>
                      {product.lowStockAt && (
                        <p className="text-xs text-gray-500">
                          Low at {product.lowStockAt}
                        </p>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
