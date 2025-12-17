"use server";

import SideBar from "@/components/sidebar";
import SubcategoryForm from "@/components/subcategory-form";
import DeleteCategoryButton from "@/components/delete-category-button";
import { editCategory } from "@/lib/actions/categories";
import {
  createSubcategory,
  editSubcategory,
  deleteSubcategory,
} from "@/lib/actions/subcategories";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      subcategories: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!category) {
    redirect("/categories");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SideBar currentPath="/categories" />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <Link
            href="/categories"
            className="text-purple-600 hover:underline mb-4 inline-block"
          >
            ← Back to Categories
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
          <p className="text-base text-gray-600 mt-2">
            Manage category details and subcategories
          </p>
        </div>

        {/* Main Form and Subcategories in 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Category Edit */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Edit Category
              </h2>
              <form action={editCategory} className="space-y-6">
                <input type="hidden" name="id" value={category.id} />
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Category Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Enter category name"
                    defaultValue={category.name}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
                  >
                    Update Category
                  </button>
                  <Link
                    href="/categories"
                    className="px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition text-center"
                  >
                    Cancel
                  </Link>
                </div>
              </form>

              {/* Delete Button - Outside of form */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <DeleteCategoryButton categoryId={category.id} />
              </div>
            </div>
          </div>

          {/* Right Column: Subcategories */}
          <div className="lg:col-span-2 space-y-8">
            {/* Subcategories List */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Subcategories ({category.subcategories.length})
              </h2>

              {category.subcategories.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No subcategories yet. Create one below.
                </p>
              ) : (
                <div className="space-y-3">
                  {category.subcategories.map((sub) => (
                    <SubcategoryForm
                      key={sub.id}
                      subcategory={sub}
                      categoryId={category.id}
                      categoryName={category.name}
                      formAction={editSubcategory}
                      deleteAction={deleteSubcategory}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Add New Subcategory */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Add New Subcategory
              </h2>
              <form action={createSubcategory} className="space-y-4">
                <input type="hidden" name="categoryId" value={category.id} />
                <div>
                  <label
                    htmlFor="new-subcategory"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subcategory Name *
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      id="new-subcategory"
                      name="name"
                      required
                      placeholder="e.g., Winter Jackets"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
