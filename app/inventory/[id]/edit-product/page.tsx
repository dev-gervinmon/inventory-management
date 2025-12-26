"use server";

import PageLayout from "@/components/layout/page-layout";
import EditProductPageWrapper from "../edit-product-page-wrapper";
import NotFoundPage from "@/components/layout/not-found-page";
import { getCurrentUser } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import { editProduct, deleteProduct } from "@/lib/actions/products";
import ProductEditClient from "@/components/clients/product-edit-client";
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
    return (
      <NotFoundPage
        entityId={id}
        entityName="Product"
        storageKey="deletedProductId"
        redirectPath="/inventory"
        backButtonLabel="Back to Inventory"
        sidebarPath="/inventory"
      />
    );
  }

  if (product.userId !== user.id) {
    throw new Error("Unauthorized");
  }

  return (
    <PageLayout currentPath="/inventory">
      <EditProductPageWrapper>
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
            categories={categories}
          />
        </ProductEditClient>
      </EditProductPageWrapper>
    </PageLayout>
  );
}
