"use server";

import Link from "next/link";
import ImageUploadField from "./image-upload-field";

export default async function ProductForm({
  id,
  name = "",
  price = null,
  quantity = null,
  sku = null,
  lowStockAt = null,
  image = null,
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
  btnAction?: string;
  formAction: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form action={formAction} className="space-y-6">
          {id && <input type="hidden" name="id" value={id} />}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
            />
          </div>

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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
              />
            </div>
          </div>

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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
            />
          </div>

          <ImageUploadField defaultUrl={image || ""} />

          <div className="flex gap-5">
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              {btnAction} product
            </button>
            <Link
              href="/inventory"
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
