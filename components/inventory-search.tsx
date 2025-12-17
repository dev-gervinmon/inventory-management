"use client";

import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";

export default function InventorySearch({
  q,
  totalCount,
  resultsCount,
}: {
  q: string;
  totalCount: number;
  resultsCount: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = (formData.get("q") as string) || "";

    startTransition(() => {
      if (searchQuery.trim()) {
        router.push(`/inventory?q=${encodeURIComponent(searchQuery)}`);
      } else {
        router.push("/inventory");
      }
    });
  };

  const handleClearSearch = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    startTransition(() => {
      router.push("/inventory");
    });
  };

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <form className="flex gap-0" onSubmit={handleSearch}>
          <div className="flex-1 flex items-center px-6 py-4 border-r border-gray-200 relative">
            <svg
              className="w-5 h-5 text-gray-400 mr-3"
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
              ref={inputRef}
              name="q"
              placeholder="Search by product name, SKU..."
              defaultValue={q}
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none pr-8"
            />
            {q && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2 p-2 hover:bg-gray-200 rounded-md transition-all duration-200 cursor-pointer"
                title="Clear search"
              >
                <svg
                  className="w-5 h-5 text-gray-400 hover:text-gray-700 transition-colors"
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
          <button
            type="submit"
            disabled={isPending}
            className="px-8 py-4 bg-linear-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-700 hover:to-purple-800 active:from-purple-800 active:to-purple-900 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Searching...
              </span>
            ) : (
              "Search"
            )}
          </button>
        </form>
      </div>

      {/* Compact Info Bar */}
      {q && (
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
              Found <strong>{resultsCount}</strong> of{" "}
              <strong>{totalCount}</strong> product
              {totalCount !== 1 ? "s" : ""} matching &quot;
              <strong className="text-purple-700">{q}</strong>&quot;
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
