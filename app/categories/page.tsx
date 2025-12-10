"use server";

import SideBar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { deleteCategory } from "@/lib/actions/categories";

export default async function CategoriesPage() {
  const user = await getCurrentUser();

  const categories = await prisma.category.findMany({
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
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-500">
                      <Link
                        href={`/categories/${category.id}`}
                        className="text-orange-600 hover:text-orange-900 mr-4"
                      >
                        Edit
                      </Link>
                      <form action={deleteCategory} className="inline">
                        <input type="hidden" name="id" value={category.id} />
                        <button
                          type="submit"
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
