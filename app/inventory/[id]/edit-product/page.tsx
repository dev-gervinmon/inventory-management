"use server";

import SideBar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import prisma from "../../../../lib/prisma";
import { editProduct } from "@/lib/actions/products";
import ProductForm from "@/components/product-form";
import { redirect } from "next/navigation";

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
    },
  });

  if (!product) {
    redirect("/inventory");
  }

  if (product.userId !== user.id) {
    throw new Error("Unauthorized");
  }

  return (
    <div className="min-h-screen">
      <SideBar currentPath={`/inventory/${product.id}/edit-product`} />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Edit Product
              </h1>
              <p className="text-sm text-gray-500">
                Edit existing product in your inventory
              </p>
            </div>
          </div>
        </div>

        <ProductForm
          id={product.id}
          name={product.name}
          price={Number(product.price)}
          quantity={product.quantity}
          sku={product.sku}
          lowStockAt={product.lowStockAt}
          image={product.imageUrl}
          categoryIds={product.categories.map((c) => c.id)}
          btnAction="Edit"
          formAction={editProduct}
        />
      </main>
    </div>
  );
}
