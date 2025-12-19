import { useState, useCallback, useMemo } from "react";

export type SortDirection = "asc" | "desc" | null;

interface UseSortOptions<T> {
  items: T[];
  initialSortKey?: string;
  initialDirection?: SortDirection;
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
      const aValue = (a as Record<string, unknown>)[sortKey];
      const bValue = (b as Record<string, unknown>)[sortKey];

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
