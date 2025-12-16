"use server";

import SideBar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { deleteCategory } from "@/lib/actions/categories";

export default async function CategoriesPage() {
  const user = await getCurrentUser();

  const categories = await prisma.category.findMany({
    include: {
      subcategories: {
        orderBy: { createdAt: "desc" },
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
            <Link
              href="/categories/new"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Add Category
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {categories.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 mb-4">No categories yet</p>
              <Link
                href="/categories/new"
                className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Create First Category
              </Link>
            </div>
          ) : (
            <div className="space-y-0">
              {categories.map((category) => (
                <details
                  key={category.id}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-sm text-gray-400">▶</span>
                      <div>
                        <p className="font-medium text-gray-900">
                          {category.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {category.subcategories.length} subcategories
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </div>
                  </summary>

                  <div className="bg-gray-50 px-6 py-4 space-y-2">
                    {category.subcategories.length === 0 ? (
                      <p className="text-sm text-gray-500">No subcategories</p>
                    ) : (
                      <div className="space-y-2">
                        {category.subcategories.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between bg-white p-3 rounded border border-gray-200"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {sub.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(sub.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Link
                                href={`/categories/${category.id}/subcategories/${sub.id}`}
                                className="text-orange-600 hover:text-orange-900 text-sm"
                              >
                                Edit
                              </Link>
                              {/* Add delete subcategory action */}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <Link
                      href={`/categories/${category.id}/subcategories/new`}
                      className="inline-block mt-3 px-4 py-2 text-sm bg-purple-100 text-purple-600 rounded hover:bg-purple-200"
                    >
                      + Add Subcategory
                    </Link>
                  </div>

                  <div className="px-6 py-3 border-t bg-gray-50 flex gap-2">
                    <Link
                      href={`/categories/${category.id}`}
                      className="text-orange-600 hover:text-orange-900 text-sm font-medium"
                    >
                      Edit Category
                    </Link>
                    <form action={deleteCategory} className="inline">
                      <input type="hidden" name="id" value={category.id} />
                      <button
                        type="submit"
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </form>
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
