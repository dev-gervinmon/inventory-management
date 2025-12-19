import ProductTable from "@/components/tables/product-table";
import AddProductButton from "@/components/buttons/add-product-button";
import SideBar from "@/components/layout/sidebar";
import { getCurrentUser } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import { serializeProduct } from "../src/utils/product";

export default async function InventoryPage() {
  const user = await getCurrentUser();
  const userId = user.id;

  // Fetch all products for the user (client-side filtering/sorting/pagination)
  const [totalCount, itemsRaw] = await Promise.all([
    prisma.product.count({ where: { userId } }),
    prisma.product.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        categories: true,
        subcategories: {
          include: {
            category: true,
          },
        },
      },
    }),
  ]);

  const items = itemsRaw.map(serializeProduct);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SideBar currentPath="/inventory" />
      <main className="ml-64 p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Inventory ({totalCount})
              </h1>
              <p className="text-base text-gray-600 mt-2">
                Manage your products and track inventory levels
              </p>
            </div>
            <AddProductButton />
          </div>
        </div>

        <div className="space-y-6">
          {/* Product Table */}
          <ProductTable products={items} />
        </div>
      </main>
    </div>
  );
}
