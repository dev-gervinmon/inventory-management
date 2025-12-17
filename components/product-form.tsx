"use server";

import ImageUploadField from "./common/image-upload-field";
import CategorySubcategorySelector from "./forms/category-subcategory-selector";
import FormButton from "./buttons/form-button";
import { SecondaryButton } from "./buttons/nav-button";
import prisma from "@/lib/db/prisma";

export default async function ProductForm({
  id,
  name = "",
  price = null,
  quantity = null,
  sku = null,
  lowStockAt = null,
  image = null,
  categoryIds = [],
  subcategoryIds = [],
  btnAction = "Add",
  formAction,
}: {
  id?: string;
  name?: string | null;
  price?: number | null;
  quantity?: number | null;
  sku?: string | null;
  lowStockAt?: number | null;
  image?: string | null;
  categoryIds?: string[];
  subcategoryIds?: string[];
  btnAction?: string;
  formAction: (formData: FormData) => void | Promise<void>;
}) {
  const categories = await prisma.category.findMany({
    include: {
      subcategories: {
        orderBy: { name: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });
  return (
    <div className="max-w-6xl">
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <form action={formAction} className="space-y-8">
          {id && <input type="hidden" name="id" value={id} />}

          {/* Product Name - Full Width */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Basic Information
            </h2>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Enter product name"
                defaultValue={name || ""}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* 2 Column Layout: Form Fields on Left, Image on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Form Fields */}
            <div className="lg:col-span-2 space-y-8">
              {/* Pricing & Inventory */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Pricing & Inventory
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Price *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      step="0.01"
                      min="0"
                      required
                      placeholder="0.0"
                      defaultValue={price || ""}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Quantity *
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="0"
                      required
                      placeholder="0"
                      defaultValue={quantity || ""}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Additional Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="sku"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      SKU (optional)
                    </label>
                    <input
                      type="text"
                      id="sku"
                      name="sku"
                      placeholder="Enter SKU"
                      defaultValue={sku || ""}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lowStockAt"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Low Stock At (optional)
                    </label>
                    <input
                      type="number"
                      id="lowStockAt"
                      name="lowStockAt"
                      min="0"
                      placeholder="Enter low stock threshold"
                      defaultValue={lowStockAt || ""}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="lg:col-span-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Product Image
              </h2>
              <ImageUploadField defaultUrl={image || ""} />
            </div>
          </div>

          {/* Categories & Subcategories - Full Width */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Categories
            </h2>
            <CategorySubcategorySelector
              categories={categories}
              initialCategoryIds={categoryIds}
              initialSubcategoryIds={subcategoryIds}
            />
          </div>

          {/* Submit Buttons */}
          <div className="border-t border-gray-200 pt-8 flex gap-4">
            <FormButton
              type="submit"
              label={`${btnAction} product`}
              variant="primary"
              size="lg"
            />
            <SecondaryButton href="/inventory" label="Cancel" size="lg" />
          </div>
        </form>
      </div>
    </div>
  );
}
