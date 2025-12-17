import { Product, Category, Subcategory } from "@/app/generated/prisma/client";

export interface SerializedProduct {
  id: string;
  userId: string;
  name: string;
  sku: string | null;
  price: number;
  quantity: number;
  lowStockAt: number | null;
  imageUrl: string | null;
  categories?: { id: string; name: string }[];
  subcategories?: { id: string; name: string; categoryName: string }[];
  createdAt: string;
  updatedAt: string;
}

export function serializeProduct(
  product: Product & { categories?: Category[]; subcategories?: (Subcategory & { category: Category })[] }
): SerializedProduct {
  return {
    ...product,
    price: Number(product.price),
    quantity: Number(product.quantity),
    lowStockAt: product.lowStockAt ? Number(product.lowStockAt) : null,
    categories: product.categories?.map((c) => ({ id: c.id, name: c.name })),
    subcategories: product.subcategories?.map((s) => ({
      id: s.id,
      name: s.name,
      categoryName: s.category.name,
    })),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}
