import ProductTableContent from "@/app/inventory/product-table-content";
import AddProductButton from "@/components/buttons/add-product-button";
import PageLayout from "@/components/layout/page-layout";
import PullToRefreshWrapper from "@/components/layout/pull-to-refresh-wrapper";
import { getCurrentUser } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import { serializeProduct } from "../src/utils/product";

export default async function InventoryPage() {
  const user = await getCurrentUser();
  const userId = user.id;

  // Fetch all products for the user (client-side filtering/sorting/pagination)
  const itemsRaw = await prisma.product.findMany({
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
  });

  const items = itemsRaw.map(serializeProduct);

  return (
    <PageLayout currentPath="/inventory">
      <PullToRefreshWrapper>
        {/* Header Section */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Inventory
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-0.5 sm:mt-1">
                Manage your products and track inventory levels
              </p>
            </div>
            <div className="w-full sm:w-auto">
              <AddProductButton className="w-full sm:w-auto justify-center sm:justify-start" />
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Product Table Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
            <ProductTableContent products={items} />
          </div>
        </div>
      </PullToRefreshWrapper>
    </PageLayout>
  );
}
