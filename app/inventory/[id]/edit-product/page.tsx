"use server";

import SideBar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import prisma from "../../../../lib/prisma";
import { editProduct } from "@/lib/actions/products";
import ProductForm from "@/components/product-form";
import { redirect } from "next/navigation";
import Link from "next/link";

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

  if (!product) {
    redirect("/inventory");
  }

  if (product.userId !== user.id) {
    throw new Error("Unauthorized");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SideBar currentPath={`/inventory/${product.id}/edit-product`} />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/inventory"
              className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              ← Back
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-base text-gray-600 mt-2">
                Update product details and inventory information
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
          subcategoryIds={product.subcategories.map((s) => s.id)}
          btnAction="Edit"
          formAction={editProduct}
        />
      </main>
    </div>
  );
}
