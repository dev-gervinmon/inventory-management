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
    <div className="space-y-8">
      {/* Media Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Product Image</h2>
          <p className="text-sm text-gray-600 mt-1">
            Upload a product image for your inventory
          </p>
        </div>

        <ImageUploadField defaultUrl={image || ""} />
      </div>

      {/* Categories Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Categories & Tags
          </h2>
          <p className="text-sm text-gray-600 mt-1">
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
