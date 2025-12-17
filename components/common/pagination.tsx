import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams: Record<string, string>;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams({ ...searchParams, page: String(page) });
    return `${baseUrl}?${params.toString()}`;
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-between">
      {/* Page Info */}
      <div className="text-sm text-gray-600 font-medium">
        Page <span className="text-gray-900 font-bold">{currentPage}</span> of{" "}
        <span className="text-gray-900 font-bold">{totalPages}</span>
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-center gap-2">
        <Link
          href={getPageUrl(currentPage - 1)}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
            currentPage <= 1
              ? "text-gray-400 cursor-not-allowed bg-gray-100"
              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md active:from-gray-300 active:to-gray-300"
          }`}
          aria-disabled={currentPage <= 1}
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </Link>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {visiblePages.map((page, key) => {
            const pageNumber = page as number;
            const isCurrentPage = pageNumber === currentPage;

            if (page === "...") {
              return (
                <span key={key} className="px-2 py-2 text-sm text-gray-500">
                  ...
                </span>
              );
            }

            return (
              <Link
                key={key}
                href={getPageUrl(pageNumber)}
                className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  isCurrentPage
                    ? "bg-linear-to-r from-purple-600 to-purple-700 text-white shadow-md hover:shadow-lg"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md"
                }`}
              >
                {pageNumber}
              </Link>
            );
          })}
        </div>

        <Link
          href={getPageUrl(currentPage + 1)}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
            currentPage >= totalPages
              ? "text-gray-400 cursor-not-allowed bg-gray-100"
              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md"
          }`}
          aria-disabled={currentPage >= totalPages}
        >
          Next <ChevronRight className="w-4 h-4" />
        </Link>
      </nav>

      {/* Empty space for balance */}
      <div className="w-24" />
    </div>
  );
}
