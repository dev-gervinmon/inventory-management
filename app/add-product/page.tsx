import AddProductClient from "@/components/forms/add-product-client";
import SideBar from "@/components/layout/sidebar";
import { createProduct } from "@/lib/actions/products";
import { getCurrentUser } from "@/lib/auth/auth";
import { getAllCategories } from "@/lib/actions/categories";

export default async function AddProductPage() {
  const user = await getCurrentUser();
  const categories = await getAllCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      <SideBar currentPath="/add-product" />
      <AddProductClient formAction={createProduct} categories={categories} />
    </div>
  );
}
