"use server";

import SideBar from "@/components/sidebar";
import { createCategory } from "@/lib/actions/categories";
import { getCurrentUser } from "@/lib/auth";
import FormButton from "@/components/form-button";
import { SecondaryButton } from "@/components/nav-button";

export default async function NewCategoryPage() {
  const user = await getCurrentUser();

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
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Category
          </h1>
          <p className="text-base text-gray-600 mt-2">
            Add a new product category to your inventory
          </p>
        </div>

        <div className="max-w-2xl">
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Category Information
            </h2>
            <form action={createCategory} className="space-y-6">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <FormButton
                  type="submit"
                  label="Create Category"
                  variant="primary"
                  size="lg"
                />
                <SecondaryButton href="/categories" label="Cancel" size="lg" />
              </div>
            </form>
          </div>

          <p className="text-sm text-gray-600 mt-6">
            💡 Tip: You can add subcategories after creating the category.
          </p>
        </div>
      </main>
    </div>
  );
}
