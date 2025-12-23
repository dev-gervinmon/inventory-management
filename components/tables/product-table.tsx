"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SerializedProduct } from "@/app/src/utils/product";
import { bulkDeleteProducts } from "@/lib/actions/products";
import { useSearch } from "@/lib/hooks/useSearch";
import { useSelection } from "@/lib/hooks/useSelection";
import { usePagination } from "@/lib/hooks/usePagination";
import { useSort } from "@/lib/hooks/useSort";
import SortableHeader from "@/components/common/sortable-header";
import SearchableMultiSelect from "@/components/common/searchable-multi-select";
import MessageBanner from "@/components/common/message-banner";
import { useMessage } from "@/lib/hooks/useMessage";
import ConfirmationModal from "@/components/modals/confirmation-modal";
import FormButton from "@/components/buttons/form-button";
import {
  getStockStatus,
  formatPrice,
  formatProductDate,
} from "@/lib/utils/products";

export default function ProductTable({
  products,
}: {
  products: SerializedProduct[];
}) {
  const router = useRouter();
  const { message, showSuccess, showError, clearMessage } = useMessage({
    autoClose: true,
    timeout: 5000,
  });

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Get unique categories from all products
  const categoryMap = new Map<string, { id: string; name: string }>();
  products.forEach((p) => {
    (p.categories || []).forEach((c) => {
      if (!categoryMap.has(c.id)) {
        categoryMap.set(c.id, { id: c.id, name: c.name });
      }
    });
  });
  const allCategories = Array.from(categoryMap.values());

  // Apply category and status filters
  const filteredByCategory = categoryFilter.length
    ? products.filter((p) =>
        categoryFilter.some((catId) =>
          (p.categories || []).some((c) => c.id === catId)
        )
      )
    : products;

  const filteredByStatus =
    statusFilter === "in-stock"
      ? filteredByCategory.filter((p) => p.quantity > 0)
      : statusFilter === "out-of-stock"
      ? filteredByCategory.filter((p) => p.quantity === 0)
      : statusFilter === "low-stock"
      ? filteredByCategory.filter(
          (p) => p.quantity > 0 && p.quantity <= (p.lowStockAt || 0)
        )
      : filteredByCategory;

  // Search hook
  const {
    searchQuery,
    setSearch,
    clearSearch,
    filteredItems: filteredProducts,
  } = useSearch(filteredByStatus, { searchableFields: ["name", "sku"] });

  // Sort hook
  const {
    sortKey,
    sortDirection,
    toggleSort,
    sortedItems: sortedProducts,
  } = useSort({
    items: filteredProducts,
    initialSortKey: "createdAt",
    initialDirection: "desc",
  });

  // Pagination hook
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedProducts,
    startIndex,
    endIndex,
  } = usePagination(sortedProducts, { itemsPerPage: 10 });

  // Selection hook
  const { selectedIds, toggle, selectAll, deselectAll, count } = useSelection();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      selectAll(sortedProducts.map((p) => p.id));
    } else {
      deselectAll();
    }
  };

  const handleBulkDelete = () => {
    if (count === 0) {
      showError("Please select at least one product to delete");
      return;
    }
    setIsBulkDeleteModalOpen(true);
  };

  const handleConfirmBulkDelete = async () => {
    setIsDeleting(true);
    clearMessage();

    try {
      await bulkDeleteProducts(Array.from(selectedIds));
      showSuccess(`Successfully deleted ${count} product(s)!`);
      deselectAll();
      setIsBulkDeleteModalOpen(false);
      router.refresh();
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Failed to delete products"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearFilters = () => {
    setCategoryFilter([]);
    setStatusFilter("");
    setCurrentPage(1);
  };

  const hasActiveFilters = categoryFilter.length > 0 || statusFilter;

  return (
    <div className="space-y-4">
      <MessageBanner message={message} />

      {/* Search Input */}
      <div className="relative">
        <div className="relative flex items-center">
          <svg
            className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-12 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
          {searchQuery && (
            <button
              onClick={() => {
                clearSearch();
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="bg-linear-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="text-xs text-gray-700 font-medium">
              Found <strong>{sortedProducts.length}</strong> of{" "}
              <strong>{products.length}</strong> product
              {products.length !== 1 ? "s" : ""} matching &quot;
              <strong className="text-purple-700">{searchQuery}</strong>&quot;
            </span>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Categories Filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Categories
            </label>
            <SearchableMultiSelect
              options={allCategories}
              selectedIds={categoryFilter}
              onChange={(selected) => {
                setCategoryFilter(selected);
                setCurrentPage(1);
              }}
              placeholder="Search categories..."
            />
          </div>

          {/* Stock Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Stock Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            >
              <option value="">All Items</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {count > 0 && (
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-sm font-medium text-blue-900">
            {count} product(s) selected
          </span>
          <FormButton
            type="button"
            label={`Delete Selected (${count})`}
            variant="delete"
            size="sm"
            disabled={isDeleting}
            onClick={handleBulkDelete}
          />
        </div>
      )}

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        {sortedProducts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? (
              <div>
                <p className="text-sm">No products match your search</p>
                <p className="text-xs mt-1">Try adjusting your search terms</p>
              </div>
            ) : hasActiveFilters ? (
              <div>
                <p className="text-sm">No products match your filters</p>
                <p className="text-xs mt-1">
                  Try adjusting your filter settings
                </p>
              </div>
            ) : (
              <p className="text-sm">No products found</p>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={
                      count === sortedProducts.length &&
                      sortedProducts.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                </th>
                <SortableHeader
                  label="Product"
                  sortKey="name"
                  currentSortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={toggleSort}
                />
                <SortableHeader
                  label="SKU"
                  sortKey="sku"
                  currentSortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={toggleSort}
                />
                <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                  Categories
                </th>
                <SortableHeader
                  label="Price"
                  sortKey="price"
                  currentSortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={toggleSort}
                />
                <SortableHeader
                  label="Stock"
                  sortKey="quantity"
                  currentSortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={toggleSort}
                />
                <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => {
                const status = getStockStatus(
                  Number(product.quantity),
                  product.lowStockAt
                );
                const isSelected = selectedIds.has(product.id);

                return (
                  <tr
                    key={product.id}
                    onClick={() =>
                      router.push(`/inventory/${product.id}/edit-product`)
                    }
                    className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${
                      isSelected ? "bg-purple-50" : ""
                    }`}
                  >
                    <td
                      className="px-3 sm:px-4 md:px-6 py-2 sm:py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        id={`select-${product.id}`}
                        checked={isSelected}
                        onChange={() => toggle(product.id)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </td>

                    {/* Product Name + Image */}
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 sm:w-10 h-8 sm:h-10 shrink-0 bg-gray-200 rounded-lg overflow-hidden border border-gray-300">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-semibold">
                              —
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatProductDate(product.createdAt)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4 text-xs sm:text-sm font-medium text-gray-700">
                      <code className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {product.sku || "—"}
                      </code>
                    </td>

                    {/* Categories */}
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4 text-xs sm:text-sm">
                      <div className="flex flex-wrap gap-1">
                        {product.categories && product.categories.length > 0 ? (
                          <>
                            {product.categories.slice(0, 2).map((cat) => (
                              <span
                                key={cat.id}
                                className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold"
                              >
                                {cat.name}
                              </span>
                            ))}
                            {product.categories.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                                +{product.categories.length - 2}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4 text-xs sm:text-sm font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </td>

                    {/* Stock Quantity */}
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4 text-xs sm:text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs sm:text-sm font-bold text-gray-900">
                          {product.quantity}
                        </span>
                        {product.lowStockAt && (
                          <span className="text-xs text-gray-500">
                            Low: {product.lowStockAt}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4 text-xs sm:text-sm">
                      <span
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {sortedProducts.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, sortedProducts.length)} of{" "}
            {sortedProducts.length} items
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition cursor-pointer"
            >
              ← Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-purple-600 text-white"
                        : "border border-gray-300 hover:bg-purple-50 hover:border-purple-300 hover:scale-105"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition cursor-pointer"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Delete Products"
        message={`Are you sure you want to delete ${count} product(s)? This action cannot be undone.`}
        confirmLabel="Delete All"
        isLoading={isDeleting}
      />
    </div>
  );
}
