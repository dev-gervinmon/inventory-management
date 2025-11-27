import ProductForm from "@/components/product-form";
import SideBar from "@/components/sidebar";
import { createProduct } from "@/lib/actions/products";
import { getCurrentUser } from "@/lib/auth";

export default async function AddProductPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen">
      <SideBar currentPath="/add-product" />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Add Product
              </h1>
              <p className="text-sm text-gray-500">
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
