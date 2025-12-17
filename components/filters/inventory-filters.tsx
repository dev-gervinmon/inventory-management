"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState, useMemo } from "react";
import {
  SORT_OPTIONS,
  STOCK_STATUS_OPTIONS,
  INPUT_CLASS,
  INPUT_FOCUS_PURPLE,
  INPUT_FOCUS_BLUE,
  BADGE_COLORS,
  FILTER_LIST_MAX_HEIGHT_CLASS,
} from "@/lib/constants/filters";
import { buildFilterUrl } from "@/lib/utils/filters";

interface InventoryFiltersProps {
  categories: Array<{
    id: string;
    name: string;
    subcategories: Array<{ id: string; name: string }>;
  }>;
  currentCategories?: string[];
  currentSubcategories?: string[];
  currentStatus?: string;
  currentSort?: string;
}

export default function InventoryFilters({
  categories,
  currentCategories = [],
  currentSubcategories = [],
  currentStatus,
  currentSort,
}: InventoryFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [categorySearch, setCategorySearch] = useState("");
  const [subcategorySearch, setSubcategorySearch] = useState("");

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categories;
    const search = categorySearch.toLowerCase();
    return categories.filter((cat) => cat.name.toLowerCase().includes(search));
  }, [categories, categorySearch]);

  // Get available subcategories from selected categories or all if none selected
  const availableSubcategories = useMemo(() => {
    const subs =
      currentCategories.length > 0
        ? categories
            .filter((cat) => currentCategories.includes(cat.id))
            .flatMap((cat) => cat.subcategories)
        : categories.flatMap((cat) => cat.subcategories);

    // Filter by search
    if (!subcategorySearch.trim()) return subs;
    const search = subcategorySearch.toLowerCase();
    return subs.filter((sub) => sub.name.toLowerCase().includes(search));
  }, [categories, currentCategories, subcategorySearch]);

  const handleCategoryChange = (categoryId: string) => {
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId];

    const params = buildFilterUrl({
      categories: newCategories,
      subcategories: currentSubcategories,
      status: currentStatus as
        | "all"
        | "in-stock"
        | "low-stock"
        | "out-of-stock"
        | undefined,
      sort: currentSort as
        | "newest"
        | "oldest"
        | "name-asc"
        | "name-desc"
        | "price-high"
        | "price-low"
        | "stock-low"
        | "quantity-high"
        | undefined,
    });

    startTransition(() => {
      router.push(`/inventory?${params.toString()}`);
    });
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    const newSubcategories = currentSubcategories.includes(subcategoryId)
      ? currentSubcategories.filter((id) => id !== subcategoryId)
      : [...currentSubcategories, subcategoryId];

    const params = buildFilterUrl({
      categories: currentCategories,
      subcategories: newSubcategories,
      status: currentStatus as
        | "all"
        | "in-stock"
        | "low-stock"
        | "out-of-stock"
        | undefined,
      sort: currentSort as
        | "newest"
        | "oldest"
        | "name-asc"
        | "name-desc"
        | "price-high"
        | "price-low"
        | "stock-low"
        | "quantity-high"
        | undefined,
    });

    startTransition(() => {
      router.push(`/inventory?${params.toString()}`);
    });
  };

  const handleStatusChange = (value: string) => {
    const params = buildFilterUrl({
      categories: currentCategories,
      subcategories: currentSubcategories,
      status: (value || undefined) as
        | "all"
        | "in-stock"
        | "low-stock"
        | "out-of-stock"
        | undefined,
      sort: currentSort as
        | "newest"
        | "oldest"
        | "name-asc"
        | "name-desc"
        | "price-high"
        | "price-low"
        | "stock-low"
        | "quantity-high"
        | undefined,
    });

    startTransition(() => {
      router.push(`/inventory?${params.toString()}`);
    });
  };

  const handleSortChange = (value: string) => {
    const params = buildFilterUrl({
      categories: currentCategories,
      subcategories: currentSubcategories,
      status: currentStatus as
        | "all"
        | "in-stock"
        | "low-stock"
        | "out-of-stock"
        | undefined,
      sort: (value || "newest") as
        | "newest"
        | "oldest"
        | "name-asc"
        | "name-desc"
        | "price-high"
        | "price-low"
        | "stock-low"
        | "quantity-high",
    });

    startTransition(() => {
      router.push(`/inventory?${params.toString()}`);
    });
  };

  const handleClearFilters = () => {
    startTransition(() => {
      router.push("/inventory");
    });
  };

  const hasActiveFilters =
    currentCategories.length > 0 ||
    currentSubcategories.length > 0 ||
    currentStatus ||
    (currentSort && currentSort !== "newest");

  const selectedCategoryNames = categories
    .filter((cat) => currentCategories.includes(cat.id))
    .map((cat) => cat.name);

  const selectedSubcategoryNames = categories
    .flatMap((cat) => cat.subcategories)
    .filter((sub) => currentSubcategories.includes(sub.id))
    .map((sub) => sub.name);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filters & Sorting</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            disabled={isPending}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors disabled:text-gray-400"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">Categories</h4>
            {filteredCategories.length > 0 && (
              <span className="text-xs text-gray-500">
                {currentCategories.length}/{filteredCategories.length}
              </span>
            )}
          </div>

          {/* Category Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories..."
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              disabled={isPending}
              className={`${INPUT_CLASS} ${INPUT_FOCUS_PURPLE}`}
            />
            {categorySearch && (
              <button
                onClick={() => setCategorySearch("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Categories List */}
          <div
            className={`space-y-2 ${FILTER_LIST_MAX_HEIGHT_CLASS} overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50`}
          >
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition"
                >
                  <input
                    type="checkbox"
                    checked={currentCategories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    disabled={isPending}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 accent-purple-600 disabled:opacity-50"
                  />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      {category.name}
                    </span>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                      {category.subcategories.length}
                    </span>
                  </div>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                {categorySearch
                  ? "No categories match your search"
                  : "No categories available"}
              </p>
            )}
          </div>
        </div>

        {/* Subcategories */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">
              Subcategories
            </h4>
            {availableSubcategories.length > 0 && (
              <span className="text-xs text-gray-500">
                {currentSubcategories.length}/{availableSubcategories.length}
              </span>
            )}
          </div>

          {/* Subcategory Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search subcategories..."
              value={subcategorySearch}
              onChange={(e) => setSubcategorySearch(e.target.value)}
              disabled={isPending}
              className={`${INPUT_CLASS} ${INPUT_FOCUS_BLUE}`}
            />
            {subcategorySearch && (
              <button
                onClick={() => setSubcategorySearch("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Subcategories List */}
          <div
            className={`space-y-2 ${FILTER_LIST_MAX_HEIGHT_CLASS} overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50`}
          >
            {availableSubcategories.length > 0 ? (
              availableSubcategories.map((subcategory) => (
                <label
                  key={subcategory.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition"
                >
                  <input
                    type="checkbox"
                    checked={currentSubcategories.includes(subcategory.id)}
                    onChange={() => handleSubcategoryChange(subcategory.id)}
                    disabled={isPending}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 accent-blue-600 disabled:opacity-50"
                  />
                  <span className="text-sm text-gray-700">
                    {subcategory.name}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                {subcategorySearch
                  ? "No subcategories match your search"
                  : currentCategories.length > 0
                  ? "No subcategories for selected categories"
                  : "Select categories to see subcategories"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Status and Sort Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        {/* Stock Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Status
          </label>
          <select
            value={currentStatus || ""}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isPending}
            className={`${INPUT_CLASS} ${INPUT_FOCUS_PURPLE}`}
          >
            <option value="">All Items</option>
            {STOCK_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={currentSort || "newest"}
            onChange={(e) => handleSortChange(e.target.value)}
            disabled={isPending}
            className={`${INPUT_CLASS} ${INPUT_FOCUS_PURPLE}`}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
          {selectedCategoryNames.map((name) => (
            <span
              key={name}
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${BADGE_COLORS.category}`}
            >
              📁 {name}
            </span>
          ))}
          {selectedSubcategoryNames.map((name) => (
            <span
              key={name}
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${BADGE_COLORS.subcategory}`}
            >
              📂 {name}
            </span>
          ))}
          {currentStatus && (
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${BADGE_COLORS.status}`}
            >
              📊 {currentStatus.replace("-", " ")}
            </span>
          )}
          {currentSort && currentSort !== "newest" && (
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${BADGE_COLORS.sort}`}
            >
              🔄 Sort: {currentSort.replace("-", " ")}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
