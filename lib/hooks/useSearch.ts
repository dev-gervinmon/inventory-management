import { useState, useMemo, useCallback } from "react";

interface UseSearchOptions<T> {
  searchableFields?: (keyof T)[];
}

export function useSearch<T>(items: T[], options: UseSearchOptions<T> = {}) {
  const { searchableFields } = options;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return items;
    }

    const query = searchQuery.toLowerCase();

    return items.filter((item) => {
      if (searchableFields && searchableFields.length > 0) {
        // Search specific fields
        return searchableFields.some((field) => {
          const value = item[field];
          return String(value).toLowerCase().includes(query);
        });
      } else {
        // Default: search in 'name' field if it exists
        if (typeof item === "object" && item !== null && "name" in item) {
          const name = (item as { name: unknown }).name;
          return String(name).toLowerCase().includes(query);
        }
        return false;
      }
    });
  }, [items, searchQuery, searchableFields]);

  const setSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return {
    searchQuery,
    setSearch,
    clearSearch,
    filteredItems,
    resultCount: filteredItems.length,
    hasResults: filteredItems.length > 0,
    isSearching: searchQuery.trim().length > 0,
  };
}
