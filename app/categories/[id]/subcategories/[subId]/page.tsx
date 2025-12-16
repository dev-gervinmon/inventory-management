"use server";

import SideBar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { editSubcategory } from "@/lib/actions/subcategories";
import DeleteSubcategoryButton from "@/components/delete-subcategory-button";

export default async function EditSubcategoryPage({
  params,
}: {
  params: { id: string; subId: string };
}) {
  const user = await getCurrentUser();
  const { id, subId } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
  });

  const subcategory = await prisma.subcategory.findUnique({
    where: { id: subId },
  });

  if (!category || !subcategory) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SideBar currentPath="/categories" />
        <main className="ml-64 p-8">
          <p className="text-red-600">Category or subcategory not found</p>
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
            Edit Subcategory
          </h1>
          <p className="text-sm text-gray-500">
            Category: <span className="font-medium">{category.name}</span>
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md">
          <form action={editSubcategory} className="space-y-6">
            <input type="hidden" name="id" value={subcategory.id} />
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
                defaultValue={subcategory.name}
                placeholder="e.g., Winter Jackets"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                Save Changes
              </button>
              <Link
                href="/categories"
                className="flex-1 px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium text-center"
              >
                Cancel
              </Link>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Danger Zone
            </h2>
            <DeleteSubcategoryButton
              subcategoryId={subcategory.id}
              categoryId={category.id}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
