import SideBar from "@/components/layout/sidebar";
import { getCurrentUser } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import { PrimaryButton } from "@/components/buttons/nav-button";
import { getEmptyStateMessage } from "@/lib/utils/categories";
import Link from "next/link";
import CategoriesTable from "@/components/tables/categories-table";

export default async function CategoriesPage() {
  await getCurrentUser();

  const categories = await prisma.category.findMany({
    include: {
      subcategories: {
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <SideBar currentPath="/categories" />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Categories
              </h1>
              <p className="text-sm text-gray-500">Manage product categories</p>
            </div>
            <PrimaryButton href="/categories/new" label="Add Category" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {categories.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 mb-4">
                {getEmptyStateMessage("categories")}
              </p>
              <Link
                href="/categories/new"
                className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Create First Category
              </Link>
            </div>
          ) : (
            <CategoriesTable categories={categories} />
          )}
        </div>
      </main>
    </div>
  );
}
