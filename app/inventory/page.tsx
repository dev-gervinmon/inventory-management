import Pagination from "@/components/pagination";
import ProductTable from "@/components/product-table";
import InventorySearch from "@/components/inventory-search";
import EmptyState from "@/components/empty-state";
import SideBar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { serializeProduct } from "../src/utils/product";
import Link from "next/link";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const user = await getCurrentUser();
  const userId = user.id;

  const params = await searchParams;
  const q = (params.q ?? "").trim();

  const pageSize = 10;
  const page = Math.max(1, Number(params.page ?? 1));

  const where = {
    userId,
    ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
  };

  const [totalCount, itemsRaw] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
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

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SideBar currentPath="/inventory" />
      <main className="ml-64 p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Inventory
              </h1>
              <p className="text-base text-gray-600 mt-2">
                Manage your products and track inventory levels
              </p>
            </div>
            <Link
              href="/add-product"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Product
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          {/* Search Bar */}
          <InventorySearch
            q={q}
            totalCount={totalCount}
            resultsCount={items.length}
          />

          {/* Product Table */}
          <ProductTable products={items} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl="/inventory"
                searchParams={{
                  q,
                  pageSize: String(pageSize),
                }}
              />
            </div>
          )}

          {/* Empty State */}
          {items.length === 0 && !q && (
            <EmptyState
              icon="box"
              title="No products yet"
              description="Start building your inventory by adding your first product."
              actionLabel="Add Your First Product"
              actionLink="/add-product"
            />
          )}
        </div>
      </main>
    </div>
  );
}
