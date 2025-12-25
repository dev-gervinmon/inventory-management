"use client";

import FormField from "./form-field";
import { useProductFormContext } from "@/lib/contexts/product-form-context";
import { CategoryWithSubcategories } from "@/lib/types/category";

interface AddProductFormProps {
  categories?: CategoryWithSubcategories[];
}

export default function AddProductForm({
  categories = [],
}: AddProductFormProps) {
  const { formErrors, isSubmitting, onSubmit } = useProductFormContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      const formData = new FormData(e.currentTarget);
      await onSubmit(formData);
    }
  };

  return (
    <form
      id="product-form"
      onSubmit={onSubmit ? handleSubmit : undefined}
      className="space-y-4 sm:space-y-6 md:space-y-8"
    >
      {/* Basic Information Section */}
      <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
        <div className="mb-4 sm:mb-5 md:mb-6">
          <h2 className="text-base sm:text-lg md:text-lg font-semibold text-gray-900">
            Basic Information
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Add the product name and essential details
          </p>
        </div>

        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          <FormField
            id="name"
            label="Product Name"
            required
            error={formErrors.name}
          >
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Enter product name"
              defaultValue=""
              disabled={isSubmitting}
              className={`w-full px-3 sm:px-4 md:px-4 py-2.5 sm:py-3 md:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-sm sm:text-base md:text-base ${
                formErrors.name ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
          </FormField>
        </div>
      </div>

      {/* Pricing & Inventory Section */}
      <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
        <div className="mb-4 sm:mb-5 md:mb-6">
          <h2 className="text-base sm:text-lg md:text-lg font-semibold text-gray-900">
            Pricing & Inventory
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Set the price and manage stock levels
          </p>
        </div>

        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            <FormField
              id="price"
              label="Price"
              required
              error={formErrors.price}
            >
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                disabled={isSubmitting}
                className={`w-full px-3 sm:px-4 md:px-4 py-2.5 sm:py-3 md:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-sm sm:text-base md:text-base ${
                  formErrors.price
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
            </FormField>

            <FormField
              id="quantity"
              label="Quantity"
              required
              error={formErrors.quantity}
            >
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="0"
                required
                placeholder="0"
                disabled={isSubmitting}
                className={`w-full px-3 sm:px-4 md:px-4 py-2.5 sm:py-3 md:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-sm sm:text-base md:text-base ${
                  formErrors.quantity
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
            </FormField>
          </div>

          <div className="border-t border-gray-200 pt-4 sm:pt-5 md:pt-6">
            <h3 className="text-xs sm:text-sm md:text-sm font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-4">
              Additional Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              <FormField
                id="sku"
                label="SKU"
                error={formErrors.sku}
                hint="Optional product identifier"
              >
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  placeholder="Enter SKU"
                  defaultValue=""
                  disabled={isSubmitting}
                  className={`w-full px-3 sm:px-4 md:px-4 py-2.5 sm:py-3 md:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-sm sm:text-base md:text-base ${
                    formErrors.sku
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
              </FormField>

              <FormField
                id="lowStockAt"
                label="Low Stock Alert"
                error={formErrors.lowStockAt}
                hint="Alert when quantity falls below this"
              >
                <input
                  type="number"
                  id="lowStockAt"
                  name="lowStockAt"
                  min="0"
                  placeholder="Enter threshold"
                  disabled={isSubmitting}
                  className={`w-full px-3 sm:px-4 md:px-4 py-2.5 sm:py-3 md:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-sm sm:text-base md:text-base ${
                    formErrors.lowStockAt
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
              </FormField>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
