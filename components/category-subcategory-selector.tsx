"use client";

import Link from "next/link";
import { useState, useMemo } from "react";

interface Subcategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
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

  // Calculate which subcategories are actually visible
  const visibleSubcategoryIds = useMemo(
    () => new Set(visibleSubcategories.map((sub) => sub.id)),
    [visibleSubcategories]
  );

  // Get valid selected subcategories (filter out those whose parent category is not selected)
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

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categories (optional)
        </label>
        <div className="border border-gray-300 rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
          {categories.length === 0 ? (
            <p className="text-sm text-gray-500">
              No categories available.{" "}
              <Link
                href="/categories/new"
                className="text-purple-600 hover:text-purple-700"
              >
                Create one
              </Link>
            </p>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${category.id}`}
                  name="categoryIds"
                  value={category.id}
                  checked={selectedCategories.has(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="ml-2 text-sm text-gray-700"
                >
                  {category.name}
                </label>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedCategories.size > 0 && visibleSubcategories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subcategories (optional)
          </label>
          <div className="border border-gray-300 rounded-lg p-4 space-y-3 max-h-64 overflow-y-auto bg-blue-50">
            {visibleSubcategories.map((subcategory) => (
              <div key={subcategory.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`subcategory-${subcategory.id}`}
                  name="subcategoryIds"
                  value={subcategory.id}
                  checked={validSelectedSubcategories.has(subcategory.id)}
                  onChange={() => handleSubcategoryChange(subcategory.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor={`subcategory-${subcategory.id}`}
                  className="ml-2 text-sm text-gray-700"
                >
                  <span className="font-medium">{subcategory.name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({subcategory.categoryName})
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedCategories.size === 0 && (
        <p className="text-sm text-gray-500 italic">
          Select a category above to see available subcategories
        </p>
      )}
    </div>
  );
}
