"use server";

import MobileSidebar from "@/components/layout/mobile-sidebar";
import { getCurrentUser } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import { editProduct, deleteProduct } from "@/lib/actions/products";
import { redirect } from "next/navigation";
import ProductEditClient from "@/components/forms/product-edit-client";
import ProductForm from "@/components/forms/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      categories: true,
      subcategories: true,
    },
  });

  const categories = await prisma.category.findMany({
    include: {
      subcategories: {
        orderBy: { name: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  if (!product) {
    redirect("/inventory");
  }

  if (product.userId !== user.id) {
    throw new Error("Unauthorized");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileSidebar currentPath="/inventory" />
      <main className="md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
        <ProductEditClient
          product={{
            id: product.id,
            name: product.name,
            price: Number(product.price),
            quantity: product.quantity,
            sku: product.sku,
            lowStockAt: product.lowStockAt,
            imageUrl: product.imageUrl,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            categories: product.categories,
            subcategories: product.subcategories,
          }}
          formAction={editProduct}
          deleteAction={deleteProduct}
        >
          <ProductForm
            id={product.id}
            name={product.name}
            price={Number(product.price)}
            quantity={product.quantity}
            sku={product.sku}
            lowStockAt={product.lowStockAt}
            image={product.imageUrl}
            categoryIds={product.categories.map((c) => c.id)}
            subcategoryIds={product.subcategories.map((s) => s.id)}
            formAction={editProduct}
            categories={categories}
          />
        </ProductEditClient>
      </main>
    </div>
  );
}
