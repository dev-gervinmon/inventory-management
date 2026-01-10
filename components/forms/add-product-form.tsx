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

  const inputBaseClass =
    "w-full px-4 py-3 rounded-xl text-sm transition bg-(--surface-elevated)/30 text-(--text-primary) placeholder:text-(--text-muted) border border-(--border-subtle) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40 focus-visible:border-(--border-strong) disabled:opacity-60 disabled:cursor-not-allowed";
  const inputErrorClass = "border-(--danger)/40 bg-(--danger)/10";

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
      noValidate
      onSubmit={onSubmit ? handleSubmit : undefined}
      className="space-y-4 sm:space-y-6 md:space-y-8"
    >
      {/* Basic Information Section */}
      <div className="bg-(--surface-elevated)/10 rounded-2xl border border-(--border-strong) p-4 sm:p-6 md:p-8">
        <div className="mb-4 sm:mb-5 md:mb-6">
          <h2 className="text-base sm:text-lg md:text-lg font-semibold text-(--text-primary)">
            Basic Information
          </h2>
          <p className="text-xs sm:text-sm text-(--text-muted) mt-1">
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
              className={`${inputBaseClass} ${
                formErrors.name ? inputErrorClass : ""
              }`}
            />
          </FormField>
        </div>
      </div>

      {/* Pricing & Inventory Section */}
      <div className="bg-(--surface-elevated)/10 rounded-2xl border border-(--border-strong) p-4 sm:p-6 md:p-8">
        <div className="mb-4 sm:mb-5 md:mb-6">
          <h2 className="text-base sm:text-lg md:text-lg font-semibold text-(--text-primary)">
            Pricing & Inventory
          </h2>
          <p className="text-xs sm:text-sm text-(--text-muted) mt-1">
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
                className={`${inputBaseClass} ${
                  formErrors.price ? inputErrorClass : ""
                }`}
              />
            </FormField>

            <FormField
              id="unitCost"
              label="Unit Cost"
              error={formErrors.unitCost}
              hint="Optional • used for Total Value (at cost)"
            >
              <input
                type="number"
                id="unitCost"
                name="unitCost"
                step="0.01"
                min="0"
                placeholder="0.00"
                disabled={isSubmitting}
                className={`${inputBaseClass} ${
                  formErrors.unitCost ? inputErrorClass : ""
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
                className={`${inputBaseClass} ${
                  formErrors.quantity ? inputErrorClass : ""
                }`}
              />
            </FormField>
          </div>

          <div className="border-t border-(--border-subtle) pt-4 sm:pt-5 md:pt-6">
            <h3 className="text-xs sm:text-sm md:text-sm font-semibold text-(--text-primary) mb-3 sm:mb-4 md:mb-4">
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
                  className={`${inputBaseClass} ${
                    formErrors.sku ? inputErrorClass : ""
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
                  className={`${inputBaseClass} ${
                    formErrors.lowStockAt ? inputErrorClass : ""
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
