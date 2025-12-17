"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { SerializedProduct } from "@/app/src/utils/product";
import DeleteProductButton from "./delete-product-button";
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {products.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">No products found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  SKU
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Categories
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Delete
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

                return (
                  <tr
                    key={product.id}
                    onClick={handleRowClick}
                    className={`cursor-pointer transition ${
                      index % 2 === 0
                        ? "bg-white hover:bg-blue-50"
                        : "bg-gray-50 hover:bg-blue-50"
                    } border-b border-gray-200 hover:border-blue-200`}
                  >
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

                    {/* Delete Action */}
                    <td
                      className="px-6 py-4 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DeleteProductButton productId={product.id} />
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
