"use server";

import SideBar from "@/components/layout/sidebar";
import { getCurrentUser } from "@/lib/auth/auth";
import CategoryForm from "@/components/forms/category-form";
import { SecondaryButton } from "@/components/buttons/nav-button";

export default async function NewCategoryPage() {
  await getCurrentUser();

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
            <CategoryForm />
          </div>

          <p className="text-sm text-gray-600 mt-6">
            💡 Tip: You can add subcategories after creating the category.
          </p>
        </div>
      </main>
    </div>
  );
}
