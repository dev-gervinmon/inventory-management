"use server";

import SideBar from "@/components/layout/sidebar";
import SubcategoriesList from "@/components/forms/subcategories-list";
import AddSubcategoryForm from "@/components/forms/add-subcategory-form";
import DeleteCategoryButton from "@/components/buttons/delete/delete-category-button";
import { editCategory } from "@/lib/actions/categories";
import { editSubcategory } from "@/lib/actions/subcategories";
import { getCurrentUser } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { SecondaryButton } from "@/components/buttons/nav-button";
import FormButton from "@/components/buttons/form-button";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await getCurrentUser();
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
          <div className="mb-4">
            <SecondaryButton
              href="/categories"
              label="← Back to Categories"
              variant="subtle"
            />
          </div>
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
                  <FormButton
                    type="submit"
                    label="Update Category"
                    variant="primary"
                  />
                  <SecondaryButton href="/categories" label="Cancel" />
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
                <SubcategoriesList
                  subcategories={category.subcategories}
                  categoryId={category.id}
                  formAction={editSubcategory}
                />
              )}
            </div>

            {/* Add New Subcategory */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Add New Subcategory
              </h2>
              <AddSubcategoryForm categoryId={category.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
