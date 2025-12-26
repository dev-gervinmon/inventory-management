"use client";

import { useDebounce } from "@/lib/hooks/useDebounce";
import { useEffect, useState } from "react";

interface ActivitySearchProps {
  onSearchChange: (query: string) => void;
  initialValue?: string;
}

/**
 * Reusable search component for activities
 * Features debouncing to reduce unnecessary re-renders
 */
export default function ActivitySearch({
  onSearchChange,
  initialValue = "",
}: ActivitySearchProps) {
  const [searchInput, setSearchInput] = useState(initialValue);
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  return (
    <div className="relative">
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search activities by product name or message..."
        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
      />
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
      {searchInput && (
        <button
          onClick={() => setSearchInput("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
