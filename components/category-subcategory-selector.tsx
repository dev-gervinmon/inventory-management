"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import CloseButton from "./close-button";

interface Subcategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

interface ExtendedSubcategory extends Subcategory {
  categoryName: string;
  categoryId: string;
}

export default function CategorySubcategorySelector({
  categories,
  initialCategoryIds = [],
  initialSubcategoryIds = [],
}: {
  categories: Category[];
  initialCategoryIds?: string[];
  initialSubcategoryIds?: string[];
}) {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(initialCategoryIds)
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState<
    Set<string>
  >(new Set(initialSubcategoryIds));
  const [searchQuery, setSearchQuery] = useState("");

  // Get all categories and subcategories as flat list with category names
  const allItems = useMemo(() => {
    const items: Array<{
      id: string;
      name: string;
      type: "category" | "subcategory";
      categoryId?: string;
      categoryName?: string;
      searchText: string;
    }> = [];

    categories.forEach((cat) => {
      items.push({
        id: cat.id,
        name: cat.name,
        type: "category",
        searchText: cat.name.toLowerCase(),
      });

      cat.subcategories.forEach((sub) => {
        items.push({
          id: sub.id,
          name: sub.name,
          type: "subcategory",
          categoryId: cat.id,
          categoryName: cat.name,
          searchText: `${sub.name.toLowerCase()} ${cat.name.toLowerCase()}`,
        });
      });
    });

    return items;
  }, [categories]);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return allItems;

    const query = searchQuery.toLowerCase();
    return allItems.filter((item) => item.searchText.includes(query));
  }, [allItems, searchQuery]);

  // Group filtered items by category
  const groupedItems = useMemo(() => {
    const grouped = new Map<string, Array<ExtendedSubcategory>>();

    filteredItems.forEach((item) => {
      if (item.type === "category") {
        if (!grouped.has(item.id)) {
          grouped.set(item.id, []);
        }
      } else if (item.type === "subcategory") {
        const catId = item.categoryId!;
        if (!grouped.has(catId)) {
          grouped.set(catId, []);
        }
        grouped.get(catId)!.push({
          id: item.id,
          name: item.name,
          categoryId: catId,
          categoryName: item.categoryName!,
        });
      }
    });

    return grouped;
  }, [filteredItems]);

  // Calculate visible subcategories based on selected categories
  const visibleSubcategories = useMemo(() => {
    return categories
      .filter((cat) => selectedCategories.has(cat.id))
      .flatMap((cat) =>
        cat.subcategories.map((sub) => ({
          ...sub,
          categoryName: cat.name,
          categoryId: cat.id,
        }))
      );
  }, [selectedCategories, categories]);

  const visibleSubcategoryIds = useMemo(
    () => new Set(visibleSubcategories.map((sub) => sub.id)),
    [visibleSubcategories]
  );

  const validSelectedSubcategories = useMemo(
    () =>
      new Set(
        Array.from(selectedSubcategories).filter((id) =>
          visibleSubcategoryIds.has(id)
        )
      ),
    [selectedSubcategories, visibleSubcategoryIds]
  );

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const updated = new Set(prev);
      if (updated.has(categoryId)) {
        updated.delete(categoryId);
      } else {
        updated.add(categoryId);
      }
      return updated;
    });
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    setSelectedSubcategories((prev) => {
      const updated = new Set(prev);
      if (updated.has(subcategoryId)) {
        updated.delete(subcategoryId);
      } else {
        updated.add(subcategoryId);
      }
      return updated;
    });
  };

  const removeCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const updated = new Set(prev);
      updated.delete(categoryId);
      return updated;
    });
  };

  const removeSubcategory = (subcategoryId: string) => {
    setSelectedSubcategories((prev) => {
      const updated = new Set(prev);
      updated.delete(subcategoryId);
      return updated;
    });
  };

  const selectedCategoryNames = useMemo(() => {
    return categories
      .filter((cat) => selectedCategories.has(cat.id))
      .map((cat) => ({ id: cat.id, name: cat.name }));
  }, [selectedCategories, categories]);

  const selectedSubcategoryNames = useMemo(() => {
    return visibleSubcategories.filter((sub) =>
      validSelectedSubcategories.has(sub.id)
    );
  }, [validSelectedSubcategories, visibleSubcategories]);

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Search Categories & Subcategories
        </label>
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
            placeholder="Search categories, subcategories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
          {searchQuery && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <CloseButton
                onClick={() => setSearchQuery("")}
                variant="gray"
                title="Clear search"
              />
            </div>
          )}
        </div>
      </div>

      {/* Selected Items as Pills */}
      {(selectedCategoryNames.length > 0 ||
        selectedSubcategoryNames.length > 0) && (
        <div className="space-y-3">
          {/* Selected Categories Pills */}
          {selectedCategoryNames.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Selected Categories
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedCategoryNames.map((cat) => (
                  <div
                    key={cat.id}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-100 to-purple-50 border border-purple-300 rounded-full text-sm font-medium text-purple-900"
                  >
                    {cat.name}
                    <div className="ml-1 -mr-1">
                      <CloseButton
                        onClick={() => removeCategory(cat.id)}
                        variant="purple"
                        size="sm"
                        title="Remove category"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Subcategories Pills */}
          {selectedSubcategoryNames.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Selected Subcategories
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedSubcategoryNames.map((sub) => (
                  <div
                    key={sub.id}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-100 to-blue-50 border border-blue-300 rounded-full text-sm font-medium text-blue-900"
                  >
                    <span>{sub.name}</span>
                    <span className="text-xs opacity-75">
                      in {sub.categoryName}
                    </span>
                    <div className="ml-1 -mr-1">
                      <CloseButton
                        onClick={() => removeSubcategory(sub.id)}
                        variant="blue"
                        size="sm"
                        title="Remove subcategory"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Categories & Subcategories List */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {searchQuery
            ? "Search Results"
            : "Available Categories & Subcategories"}
        </label>

        {categories.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-600">
              No categories available.{" "}
              <Link
                href="/categories/new"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Create one
              </Link>
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-600">
              No categories or subcategories match &quot;{searchQuery}&quot;
            </p>
          </div>
        ) : (
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              {Array.from(groupedItems.entries()).map(
                ([categoryId, subcategories]) => {
                  const category = categories.find((c) => c.id === categoryId);
                  if (!category) return null;

                  const isCategorySelected = selectedCategories.has(categoryId);

                  return (
                    <div
                      key={categoryId}
                      className="border-b border-gray-200 last:border-b-0"
                    >
                      {/* Category Header */}
                      <div
                        className={`px-6 py-4 ${
                          isCategorySelected
                            ? "bg-purple-50 border-l-4 border-l-purple-600"
                            : "bg-white hover:bg-gray-50"
                        } cursor-pointer transition`}
                      >
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isCategorySelected}
                            onChange={() => handleCategoryChange(categoryId)}
                            className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                          />
                          <span className="font-semibold text-gray-900">
                            {category.name}
                          </span>
                          {subcategories.length > 0 && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {subcategories.length} subcategory
                              {subcategories.length !== 1 ? "ies" : ""}
                            </span>
                          )}
                        </label>
                      </div>

                      {/* Subcategories */}
                      {subcategories.length > 0 && (
                        <div className="bg-gray-50 border-t border-gray-200">
                          {subcategories.map((subcategory) => {
                            const isSubSelected =
                              validSelectedSubcategories.has(subcategory.id);
                            return (
                              <div
                                key={subcategory.id}
                                className={`px-6 py-3 border-t border-gray-200 first:border-t-0 ${
                                  isSubSelected
                                    ? "bg-blue-50"
                                    : "hover:bg-white"
                                } transition`}
                              >
                                <label className="flex items-center gap-3 cursor-pointer ml-8">
                                  <input
                                    type="checkbox"
                                    checked={isSubSelected}
                                    onChange={() =>
                                      handleSubcategoryChange(subcategory.id)
                                    }
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                  />
                                  <span className="text-sm text-gray-700">
                                    {subcategory.name}
                                  </span>
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hidden inputs for form submission */}
      {Array.from(selectedCategories).map((id) => (
        <input key={`cat-${id}`} type="hidden" name="categoryIds" value={id} />
      ))}
      {Array.from(validSelectedSubcategories).map((id) => (
        <input
          key={`subcat-${id}`}
          type="hidden"
          name="subcategoryIds"
          value={id}
        />
      ))}
    </div>
  );
}
