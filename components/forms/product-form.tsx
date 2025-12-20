"use client";

import ImageUploadField from "@/components/common/image-upload-field";
import CategorySubcategorySelector from "./category-subcategory-selector";
import Tabs, { TabPanel } from "@/components/common/tabs";
import FormField from "./form-field";
import { useProductFormContext } from "@/lib/contexts/product-form-context";
import { Package, DollarSign, Tag, Image as ImageIcon } from "lucide-react";

interface Category {
  id: string;
  name: string;
  subcategories: Array<{
    id: string;
    name: string;
  }>;
}

export default function ProductForm({
  id,
  name = "",
  price = null,
  quantity = null,
  sku = null,
  lowStockAt = null,
  image = null,
  categoryIds = [],
  subcategoryIds = [],
  formAction,
  categories = [],
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
  formAction: (formData: FormData) => void | Promise<void>;
  categories?: Category[];
}) {
  const { formErrors, isSubmitting, onSubmit } = useProductFormContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      const formData = new FormData(e.currentTarget);
      await onSubmit(formData);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: <Package className="w-4 h-4" /> },
    {
      id: "inventory",
      label: "Inventory",
      icon: <DollarSign className="w-4 h-4" />,
    },
    { id: "media", label: "Media", icon: <ImageIcon className="w-4 h-4" /> },
    {
      id: "categories",
      label: "Categories",
      icon: <Tag className="w-4 h-4" />,
    },
  ];

  return (
    <form
      onSubmit={onSubmit ? handleSubmit : undefined}
      action={onSubmit ? undefined : formAction}
      className="space-y-8"
    >
      {id && <input type="hidden" name="id" value={id} />}

      <Tabs tabs={tabs} defaultTabId="basic">
        {/* Tab 1: Basic Information */}
        <TabPanel tabId="basic">
          <div className="space-y-6">
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
                defaultValue={name || ""}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                  formErrors.name
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
            </FormField>
          </div>
        </TabPanel>

        {/* Tab 2: Inventory & Pricing */}
        <TabPanel tabId="inventory">
          <div className="space-y-6">
            {/* Pricing & Inventory */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Pricing & Inventory
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    placeholder="0.0"
                    defaultValue={
                      price !== null && price !== undefined ? price : undefined
                    }
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
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
                    defaultValue={
                      quantity !== null && quantity !== undefined
                        ? quantity
                        : undefined
                    }
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      formErrors.quantity
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                </FormField>
              </div>
            </div>

            {/* Additional Details */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Additional Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    defaultValue={sku || ""}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
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
                    defaultValue={
                      lowStockAt !== null && lowStockAt !== undefined
                        ? lowStockAt
                        : undefined
                    }
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      formErrors.lowStockAt
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                </FormField>
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Tab 3: Media */}
        <TabPanel tabId="media">
          <div className="space-y-6">
            <ImageUploadField defaultUrl={image || ""} />
          </div>
        </TabPanel>

        {/* Tab 4: Categories */}
        <TabPanel tabId="categories">
          <div className="space-y-6">
            <CategorySubcategorySelector
              categories={categories}
              initialCategoryIds={categoryIds}
              initialSubcategoryIds={subcategoryIds}
            />
          </div>
        </TabPanel>
      </Tabs>
    </form>
  );
}
