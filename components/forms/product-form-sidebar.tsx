"use client";

import ImageUploadField from "@/components/common/image-upload-field";
import CategorySubcategorySelector from "./category-subcategory-selector";
import { useProductFormContext } from "@/lib/contexts/product-form-context";
import { CategoryWithSubcategories } from "@/lib/types/category";

interface ProductFormSidebarProps {
  image?: string | null;
  categoryIds?: string[];
  subcategoryIds?: string[];
  categories: CategoryWithSubcategories[];
}

export default function ProductFormSidebar({
  image,
  categoryIds,
  subcategoryIds,
  categories,
}: ProductFormSidebarProps) {
  const { isSubmitting } = useProductFormContext();

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Media Section */}
      <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
        <div className="mb-4 sm:mb-5 md:mb-6">
          <h2 className="text-base sm:text-lg md:text-lg font-semibold text-gray-900">
            Product Image
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Upload a product image for your inventory
          </p>
        </div>

        <ImageUploadField defaultUrl={image || ""} />
      </div>

      {/* Categories Section */}
      <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
        <div className="mb-4 sm:mb-5 md:mb-6">
          <h2 className="text-base sm:text-lg md:text-lg font-semibold text-gray-900">
            Categories & Tags
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Organize your product with categories and subcategories
          </p>
        </div>

        <CategorySubcategorySelector
          categories={categories}
          initialCategoryIds={categoryIds}
          initialSubcategoryIds={subcategoryIds}
        />
      </div>
    </div>
  );
}
