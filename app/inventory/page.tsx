import Pagination from "@/components/pagination";
import ProductTable from "@/components/product-table";
import InventorySearch from "@/components/inventory-search";
import InventoryFilters from "@/components/inventory-filters";
import EmptyState from "@/components/empty-state";
import AddProductButton from "@/components/add-product-button";
import SideBar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { serializeProduct } from "../src/utils/product";
import { Prisma } from "@/app/generated/prisma/client";
import { PAGE_SIZE } from "@/lib/constants/filters";
import { parseArrayParam, isValidSort } from "@/lib/utils/filters";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    category?: string | string[];
    subcategory?: string | string[];
    status?: string;
    sort?: string;
  }>;
}) {
  const user = await getCurrentUser();
  const userId = user.id;

  const params = await searchParams;
  const q = (params.q ?? "").trim();

  // Convert single values to arrays for consistent handling
  const categoryIds = parseArrayParam(params.category);
  const subcategoryIds = parseArrayParam(params.subcategory);

  const stockStatus = params.status;
  const sortBy = isValidSort(params.sort) ? params.sort : "newest";

  const page = Math.max(1, Number(params.page ?? 1));

  // Build where clause with all filters - supporting multiple categories/subcategories
  const where: Prisma.ProductWhereInput = {
    userId,
    ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
    ...(categoryIds.length > 0
      ? {
          categories: {
            some: {
              id: { in: categoryIds },
            },
          },
        }
      : {}),
    ...(subcategoryIds.length > 0
      ? {
          subcategories: {
            some: {
              id: { in: subcategoryIds },
            },
          },
        }
      : {}),
  };

  // Add stock status filter - for now filter by out-of-stock and in-stock
  if (stockStatus === "out-of-stock") {
    where.quantity = 0;
  } else if (stockStatus === "in-stock") {
    where.quantity = { gt: 0 };
  }
  // low-stock will be filtered client-side after fetch due to Prisma limitations

  // Build orderBy based on sort parameter
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  switch (sortBy) {
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "name-asc":
      orderBy = { name: "asc" };
      break;
    case "name-desc":
      orderBy = { name: "desc" };
      break;
    case "price-low":
      orderBy = { price: "asc" };
      break;
    case "price-high":
      orderBy = { price: "desc" };
      break;
    case "stock-low":
      orderBy = { quantity: "asc" };
      break;
    case "quantity-high":
      orderBy = { quantity: "desc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }

  const [totalCount, itemsRaw, allCategories] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        categories: true,
        subcategories: {
          include: {
            category: true,
          },
        },
      },
    }),
    prisma.category.findMany({
      include: { subcategories: true },
      orderBy: { name: "asc" },
    }),
  ]);

  let items = itemsRaw.map(serializeProduct);

  // Filter low-stock items post-fetch if needed
  if (stockStatus === "low-stock") {
    items = items.filter(
      (item) => item.quantity > 0 && item.quantity <= (item.lowStockAt || 0)
    );
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-linear-to-r from-gray-50 to-gray-100">
      <SideBar currentPath="/inventory" />
      <main className="ml-64 p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Inventory
              </h1>
              <p className="text-base text-gray-600 mt-2">
                Manage your products and track inventory levels
              </p>
            </div>
            <AddProductButton />
          </div>
        </div>

        <div className="space-y-6">
          {/* Search Bar */}
          <InventorySearch
            q={q}
            totalCount={totalCount}
            resultsCount={items.length}
          />

          {/* Filters */}
          <InventoryFilters
            categories={allCategories}
            currentCategories={categoryIds}
            currentSubcategories={subcategoryIds}
            currentStatus={stockStatus}
            currentSort={sortBy}
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
                  q: q || "",
                  category: categoryIds.join(","),
                  subcategory: subcategoryIds.join(","),
                  status: stockStatus || "",
                  sort: sortBy,
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
