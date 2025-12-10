"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { deleteProduct } from "@/lib/actions/products";
import { SerializedProduct } from "@/app/src/utils/product";

export default function ProductCard({
  product,
}: {
  product: SerializedProduct;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(() => {
      deleteProduct(product.id);
    });
  };

  const quantity = Number(product.quantity);
  const lowStockAt = Number(product.lowStockAt ?? 0);

  // Dynamic badge
  const stockStatus =
    quantity <= 0
      ? { text: "Out of Stock", class: "bg-red-100 text-red-700" }
      : quantity <= lowStockAt
      ? { text: "Low Stock", class: "bg-yellow-100 text-yellow-700" }
      : { text: "In Stock", class: "bg-green-100 text-green-700" };

  return (
    <div
      className="
        rounded-xl bg-white shadow-sm border border-gray-200 
        overflow-hidden transition-all duration-200 
        hover:shadow-md hover:scale-[1.01]
      "
    >
      {/* Image */}
      <div className="relative w-full aspect-4/5 bg-gray-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Categories */}
        {product.categories && product.categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.categories.slice(0, 2).map((category) => (
              <span
                key={category.id}
                className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium"
              >
                {category.name}
              </span>
            ))}
            {product.categories.length > 2 && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                +{product.categories.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Name + SKU */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500">SKU: {product.sku || "-"}</p>
        </div>

        {/* Price */}
        <p className="text-base font-semibold text-gray-900">
          ₱{Number(product.price).toLocaleString()}
        </p>

        {/* Stock Badge */}
        <span
          className={`
            text-xs font-medium px-2 py-1 rounded-full inline-block 
            ${stockStatus.class}
          `}
        >
          {stockStatus.text}
        </span>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3">
          <Link
            href={`/inventory/${product.id}/edit-product`}
            className="
              text-sm text-purple-600 hover:text-purple-700 
              font-medium transition
            "
          >
            Edit
          </Link>

          <button
            onClick={handleDelete}
            disabled={isPending}
            className="
              text-sm text-red-600 hover:text-red-700 font-medium 
              disabled:opacity-50 transition
            "
          >
            {isPending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
