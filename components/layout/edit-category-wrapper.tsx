"use client";

import { useState } from "react";
import { PencilIcon, Plus } from "lucide-react";
import MobileSidebar from "@/components/layout/mobile-sidebar";
import PullToRefreshWrapper from "@/components/layout/pull-to-refresh-wrapper";
import SubcategoriesListWrapper from "@/components/layout/subcategories-list-wrapper";
import AddSubcategoryFormWrapper from "@/components/layout/add-subcategory-form-wrapper";
import EditCategoryFormWithDeleteWrapper from "@/components/layout/edit-category-form-with-delete-wrapper";
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
  const [activeTab, setActiveTab] = useState<"edit" | "add">("edit");
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
      <MobileSidebar currentPath="/categories" />
      <main className="md:ml-64 px-4 sm:px-6 md:px-8 py-2 sm:py-4 md:py-8 pt-20 sm:pt-24 md:pt-8">
        <PullToRefreshWrapper>
          <div className="mb-6 sm:mb-8 relative z-0">
            <div className="mb-3 sm:mb-4">
              <SecondaryButton
                href="/categories"
                label="← Back to Categories"
                variant="subtle"
              />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              {category.name}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2">
              Manage category details and subcategories
            </p>
          </div>

          {/* Main Form and Subcategories in 2 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Left Column: Forms - Tabs on Mobile, Vertical on Desktop */}
            <div className="lg:col-span-1">
              {/* Mobile Tabs - Hidden on desktop */}
              <div className="lg:hidden mb-4">
                <div className="flex gap-1 border-b border-gray-200 bg-white rounded-t-xl">
                  <button
                    onClick={() => setActiveTab("edit")}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                      activeTab === "edit"
                        ? "text-purple-600 bg-purple-50 border-b-2 border-purple-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    title="Edit category details"
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("add")}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                      activeTab === "add"
                        ? "text-purple-600 bg-purple-50 border-b-2 border-purple-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    title="Add new subcategory"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Forms Container */}
              <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:hidden">
                {/* Edit Category Form - with fade transition */}
                {activeTab === "edit" && (
                  <div className="animate-fade bg-white rounded-b-xl lg:rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm static md:sticky md:top-8 z-0">
                    <h2 className="hidden lg:block text-base sm:text-lg md:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                      Edit Category
                    </h2>
                    <EditCategoryFormWithDeleteWrapper
                      categoryId={category.id}
                      categoryName={category.name}
                      onDelete={() => setIsModalOpen(true)}
                    />
                  </div>
                )}

                {/* Add New Subcategory Form - with fade transition */}
                {activeTab === "add" && (
                  <div className="animate-fade bg-white rounded-b-xl lg:rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm static md:sticky md:top-8 z-0">
                    <h2 className="hidden lg:block text-base sm:text-lg md:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                      Add New Subcategory
                    </h2>
                    <AddSubcategoryFormWrapper categoryId={category.id} />
                  </div>
                )}
              </div>

              {/* Desktop View: Show both forms vertically */}
              <div className="hidden lg:block space-y-8">
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm static md:sticky md:top-8 z-0">
                  <h2 className="text-base sm:text-lg md:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                    Edit Category
                  </h2>
                  <EditCategoryFormWithDeleteWrapper
                    categoryId={category.id}
                    categoryName={category.name}
                    onDelete={() => setIsModalOpen(true)}
                  />
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
                  <h2 className="text-base sm:text-lg md:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                    Add New Subcategory
                  </h2>
                  <AddSubcategoryFormWrapper categoryId={category.id} />
                </div>
              </div>
            </div>

            {/* Right Column: Subcategories List */}
            <div className="lg:col-span-2">
              {/* Subcategories List */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
                <h2 className="text-base sm:text-lg md:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                  Subcategories ({category.subcategories.length})
                </h2>

                <SubcategoriesListWrapper
                  subcategories={category.subcategories}
                  categoryId={category.id}
                  formAction={editSubcategory}
                />
              </div>
            </div>
          </div>
        </PullToRefreshWrapper>
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
