import Image from "next/image";
import Link from "next/link";
import { SerializedProduct } from "@/app/src/utils/product";
import DeleteProductButton from "./delete-product-button";

export default function ProductTable({
  products,
}: {
  products: SerializedProduct[];
}) {
  const getStockStatus = (quantity: number, lowStockAt?: number | null) => {
    if (quantity <= 0) {
      return { label: "Out of Stock", color: "bg-red-100 text-red-800" };
    }
    if (lowStockAt && quantity <= lowStockAt) {
      return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
    }
    return { label: "In Stock", color: "bg-green-100 text-green-800" };
  };

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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => {
                const status = getStockStatus(
                  Number(product.quantity),
                  product.lowStockAt
                );

                return (
                  <tr
                    key={product.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
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
                            {new Date(product.createdAt).toLocaleDateString()}
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
                      ₱{Number(product.price).toLocaleString()}
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

                    {/* Actions */}
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-3">
                        <Link
                          href={`/inventory/${product.id}/edit-product`}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Edit
                        </Link>
                        <DeleteProductButton productId={product.id} />
                      </div>
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
