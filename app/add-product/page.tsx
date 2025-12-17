import ProductForm from "@/components/forms/product-form";
import SideBar from "@/components/layout/sidebar";
import { createProduct } from "@/lib/actions/products";
import { getCurrentUser } from "@/lib/auth/auth";
import Link from "next/link";

export default async function AddProductPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <SideBar currentPath="/add-product" />
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
              <h1 className="text-3xl font-bold text-gray-900">Add Product</h1>
              <p className="text-base text-gray-600 mt-2">
                Add a new product to your inventory
              </p>
            </div>
          </div>
        </div>

        <ProductForm formAction={createProduct} />
      </main>
    </div>
  );
}
