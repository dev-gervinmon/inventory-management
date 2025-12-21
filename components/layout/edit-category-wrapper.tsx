"use client";

import { useState } from "react";
import SideBar from "@/components/layout/sidebar";
import SubcategoriesList from "@/components/list/subcategories-list";
import AddSubcategoryForm from "@/components/forms/add-subcategory-form";
import EditCategoryForm from "@/components/forms/edit-category-form";
import DeleteCategoryButton from "@/components/buttons/delete/delete-category-button";
import ConfirmationModal from "@/components/modals/confirmation-modal";
import MessageBanner from "@/components/common/message-banner";
import { SecondaryButton } from "@/components/buttons/nav-button";
import { deleteCategory } from "@/lib/actions/categories";
import { useMessage } from "@/lib/hooks/useMessage";
import { UI_TIMING } from "@/lib/constants/forms";
import { formatErrorMessage } from "@/lib/utils/subcategories";

interface EditCategoryWrapperProps {
  category: {
    id: string;
    name: string;
    subcategories: Array<{
      id: string;
      name: string;
      createdAt: Date;
      categoryId: string;
    }>;
  };
  editSubcategory: (formData: FormData) => Promise<{
    success: boolean;
    error?: string;
  }>;
}

export default function EditCategoryWrapper({
  category,
  editSubcategory,
}: EditCategoryWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { message, showSuccess, showError, clearMessage } = useMessage({
    autoClose: true,
    timeout: UI_TIMING.MESSAGE_TIMEOUT_MS,
  });

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    clearMessage();

    try {
      const formData = new FormData();
      formData.append("id", category.id);

      const response = await deleteCategory(formData);

      if (response.success) {
        setIsModalOpen(false);
        showSuccess("Category deleted successfully!");
        sessionStorage.setItem("deletedCategoryId", category.id);
      } else {
        showError(response.error || "Failed to delete category");
      }
    } catch (error) {
      showError(formatErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

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
          {/* Left Column: Forms */}
          <div className="lg:col-span-1 space-y-8">
            {/* Edit Category Form */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm sticky top-8 z-0">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Edit Category
              </h2>
              <EditCategoryForm
                categoryId={category.id}
                categoryName={category.name}
              />

              {/* Delete Button - Outside of form */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <DeleteCategoryButton
                  categoryId={category.id}
                  categoryName={category.name}
                  onDelete={() => setIsModalOpen(true)}
                />
              </div>
            </div>

            {/* Add New Subcategory Form */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm sticky top-80 z-0">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Add New Subcategory
              </h2>
              <AddSubcategoryForm categoryId={category.id} />
            </div>
          </div>

          {/* Right Column: Subcategories List */}
          <div className="lg:col-span-2">
            {/* Subcategories List */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Subcategories ({category.subcategories.length})
              </h2>

              {category.subcategories.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No subcategories yet. Create one using the form on the left.
                </p>
              ) : (
                <SubcategoriesList
                  subcategories={category.subcategories}
                  categoryId={category.id}
                  formAction={editSubcategory}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal rendered at page level - outside any sticky containers */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${category.name}"? All subcategories will also be deleted. This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
      <MessageBanner message={message} />
    </div>
  );
}
