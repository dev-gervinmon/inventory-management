"use server";

import SideBar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { createSubcategory } from "@/lib/actions/subcategories";

export default async function NewSubcategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();

  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SideBar currentPath="/categories" />
        <main className="ml-64 p-8">
          <p className="text-red-600">Category not found</p>
          <Link href="/categories" className="text-purple-600 hover:underline">
            Back to Categories
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SideBar currentPath="/categories" />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <Link href="/categories" className="text-purple-600 hover:underline">
            ← Back to Categories
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 mt-4">
            Add Subcategory
          </h1>
          <p className="text-sm text-gray-500">
            Adding to: <span className="font-medium">{category.name}</span>
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md">
          <form action={createSubcategory} className="space-y-6">
            <input type="hidden" name="categoryId" value={category.id} />

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Subcategory Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="e.g., Winter Jackets"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                Create Subcategory
              </button>
              <Link
                href="/categories"
                className="flex-1 px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
