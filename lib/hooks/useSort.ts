import { useState, useCallback, useMemo } from "react";

export type SortDirection = "asc" | "desc" | null;

interface UseSortOptions<T> {
  items: T[];
  initialSortKey?: string;
  initialDirection?: SortDirection;
}

// Helper function to get nested property values
function getNestedValue(obj: unknown, path: string): unknown {
  return path.split(".").reduce((current, part) => {
    if (current === null || current === undefined) return undefined;
    return (current as Record<string, unknown>)[part];
  }, obj);
}

// Helper function to get sortable value from an item
function getSortValue(item: Record<string, unknown>, key: string): unknown {
  // Handle special cases for array lengths
  if (key === "subcategories") {
    const subcategories = item.subcategories;
    if (Array.isArray(subcategories)) {
      return subcategories.length;
    }
  }

  // Handle nested keys like "_count.products"
  if (key.includes(".")) {
    return getNestedValue(item, key);
  }

  // Handle regular keys
  return item[key];
}

export function useSort<T extends object>({
  items,
  initialSortKey,
  initialDirection = "asc",
}: UseSortOptions<T>) {
  const [sortKey, setSortKey] = useState<string | null>(initialSortKey || null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    sortKey ? initialDirection : null
  );

  const toggleSort = useCallback(
    (key: string) => {
      if (sortKey === key) {
        // If clicking the same key, cycle: asc -> desc -> null
        if (sortDirection === "asc") {
          setSortDirection("desc");
        } else if (sortDirection === "desc") {
          setSortKey(null);
          setSortDirection(null);
        }
      } else {
        // If clicking a new key, start with asc
        setSortKey(key);
        setSortDirection("asc");
      }
    },
    [sortKey, sortDirection]
  );

  const sortedItems = useMemo(() => {
    if (!sortKey || !sortDirection) return items;

    const sorted = [...items].sort((a, b) => {
      const aValue = getSortValue(a as Record<string, unknown>, sortKey);
      const bValue = getSortValue(b as Record<string, unknown>, sortKey);

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Handle different types
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      // Fallback for other types
      return 0;
    });

    return sorted;
  }, [items, sortKey, sortDirection]);

  return {
    sortKey,
    sortDirection,
    toggleSort,
    sortedItems,
    isSorted: sortKey !== null,
  };
}
