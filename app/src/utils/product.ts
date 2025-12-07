import { Product } from "@/app/generated/prisma/client";

export interface SerializedProduct {
  id: string;
  userId: string;
  name: string;
  sku: string | null;
  price: number;
  quantity: number;
  lowStockAt: number | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export function serializeProduct(product: Product): SerializedProduct {
  return {
    ...product,
    price: Number(product.price),
    quantity: Number(product.quantity),
    lowStockAt: product.lowStockAt ? Number(product.lowStockAt) : null,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}
