import AddProductClient from "@/components/clients/add-product-client";
import MobileSidebar from "@/components/layout/mobile-sidebar";
import { createProduct } from "@/lib/actions/products";
import { getCurrentUser } from "@/lib/auth/auth";
import { getAllCategories } from "@/lib/actions/categories";

export default async function AddProductPage() {
  await getCurrentUser();
  const categories = await getAllCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileSidebar currentPath="/add-product" />
      <AddProductClient formAction={createProduct} categories={categories} />
    </div>
  );
}
