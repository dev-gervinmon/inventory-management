"use server";

import SideBar from "@/components/layout/sidebar";
import DeleteCategoryButton from "@/components/buttons/delete/delete-category-button";
import { getCurrentUser } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import { PrimaryButton } from "@/components/buttons/nav-button";
import {
  formatCategoryDate,
  getCategorySubcategoryLabel,
  getEmptyStateMessage,
} from "@/lib/utils/categories";
import Link from "next/link";

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
            <div className="space-y-0">
              {categories.map((category: (typeof categories)[number]) => (
                <details
                  key={category.id}
                  className="border-b border-gray-200 last:border-b-0 group"
                >
                  <summary className="px-6 py-4 cursor-pointer hover:bg-linear-to-r hover:from-purple-50 hover:to-purple-50 hover:shadow-sm transition-all duration-200 flex items-center justify-between group-hover:border-l-4 group-hover:border-l-purple-600 group-hover:pl-5">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-sm text-gray-400 group-hover:text-purple-600 transition-colors">
                        ▶
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 group-hover:text-purple-700 transition-colors">
                            {category.name}
                          </p>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            {category._count.products} products
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {getCategorySubcategoryLabel(
                            category.subcategories.length
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 group-hover:text-purple-600 transition-colors">
                      {formatCategoryDate(category.createdAt)}
                    </div>
                  </summary>

                  <div className="bg-gray-50 px-6 py-4 space-y-2">
                    {category.subcategories.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        {getEmptyStateMessage("subcategories")}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {category.subcategories.map(
                          (sub: (typeof category.subcategories)[number]) => (
                            <div
                              key={sub.id}
                              className="flex items-center justify-between bg-white p-3 rounded border border-gray-200"
                            >
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {sub.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatCategoryDate(sub.createdAt)}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-3 border-t bg-gray-50 flex gap-2">
                    <Link
                      href={`/categories/${category.id}`}
                      className="px-4 py-2 bg-linear-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Edit
                    </Link>
                    <DeleteCategoryButton
                      categoryId={category.id}
                      categoryName={category.name}
                    />
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
