import SideBar from "@/components/layout/sidebar";
import { getCurrentUser } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import { getEmptyStateMessage } from "@/lib/utils/categories";
import Link from "next/link";
import CategoriesTable from "@/components/tables/categories-table";
import CategoryForm from "@/components/forms/category-form";

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
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
            <p className="text-sm text-gray-500">Manage product categories</p>
          </div>
        </div>

        {/* Main Form and Categories in 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Add Category Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm sticky top-8 z-10">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Add New Category
              </h2>
              <CategoryForm />
            </div>
          </div>

          {/* Right Column: Categories List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Categories ({categories.length})
              </h2>
              {categories.length === 0 ? (
                <div className="text-center">
                  <p className="text-gray-500">
                    {getEmptyStateMessage("categories")}
                  </p>
                </div>
              ) : (
                <CategoriesTable categories={categories} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
