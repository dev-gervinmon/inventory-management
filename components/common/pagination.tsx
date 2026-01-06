import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsStart: number;
  itemsEnd: number;
  totalItems: number;
  entityName?: string;
}

/**
 * Mobile-Responsive Pagination Component
 *
 * Features:
 * - Responsive text: "1 of 5" on mobile → "Showing 1-10 of 45 items" on desktop
 * - Smart page number display: current page only on mobile → all pages on desktop
 * - Touch-optimized buttons: 36px on mobile → 44px+ on desktop
 * - Flexible layout: stacks on mobile, horizontal on desktop
 * - Full accessibility with ARIA labels
 *
 * @example
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={(page) => setCurrentPage(page)}
 *   itemsStart={1}
 *   itemsEnd={10}
 *   totalItems={100}
 *   entityName="products"
 * />
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsStart,
  itemsEnd,
  totalItems,
  entityName = "items",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      // Scroll to top for better UX
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Smart page number display
  // Mobile: show only current page
  // Tablet: show current ± 1
  // Desktop: show all pages (with dots if > 7)
  const getVisiblePages = () => {
    const all = Array.from({ length: totalPages }, (_, i) => i + 1);

    // If 7 or fewer pages, show all
    if (totalPages <= 7) {
      return all;
    }

    // Show with ellipsis for larger page counts
    const delta = 1; // pages to show on either side of current
    const range = [];

    // Always show first page
    range.push(1);

    // Show dots if gap exists
    if (currentPage - delta > 2) {
      range.push("...");
    }

    // Show range around current page
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Show dots if gap exists
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    // Always show last page
    range.push(totalPages);

    return range;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-glass rounded-2xl border border-(--border-strong)">
      {/* Items Info - Responsive Text */}
      <div className="text-xs sm:text-sm text-(--text-muted) font-medium order-2 sm:order-1">
        <span className="sm:hidden">
          {currentPage} of {totalPages}
        </span>
        <span className="hidden sm:inline">
          Showing{" "}
          <span className="text-(--text-primary) font-bold">{itemsStart}</span>{" "}
          to <span className="text-(--text-primary) font-bold">{itemsEnd}</span>{" "}
          of{" "}
          <span className="text-(--text-primary) font-bold">{totalItems}</span>{" "}
          {entityName}
        </span>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 order-1 sm:order-2">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage <= 1}
          className={`flex items-center justify-center gap-0 sm:gap-1.5 px-2.5 sm:px-3 py-2 sm:py-2 h-9 sm:h-10 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${
            currentPage <= 1
              ? "text-(--text-muted) bg-(--surface-elevated)/20 border border-(--border-subtle) cursor-not-allowed opacity-60"
              : "text-(--text-secondary) bg-glass border border-(--border-subtle) hover:bg-(--surface-elevated)/40 hover:border-(--border-strong) active:bg-(--surface-elevated)/60 shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40"
          }`}
          aria-label="Previous page"
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page Numbers - Responsive Display */}
        {/* Mobile/Tablet (<1024px): hide page numbers if 5+ pages to prevent overflow. Desktop (1024px+): show all pages */}
        <div
          className={`${
            totalPages >= 5 ? "hidden lg:flex" : "hidden sm:flex"
          } items-center gap-0.5 sm:gap-1`}
        >
          {visiblePages.map((page, key) => {
            const isCurrentPage = page === currentPage;
            const isDots = page === "...";

            if (isDots) {
              return (
                <span
                  key={key}
                  className="px-1.5 sm:px-2 py-2 h-9 sm:h-10 flex items-center text-xs sm:text-sm text-(--text-muted)"
                >
                  ⋯
                </span>
              );
            }

            const pageNum = page as number;

            return (
              <button
                key={key}
                onClick={() => handlePageClick(pageNum)}
                className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40 ${
                  isCurrentPage
                    ? "bg-(--brand) text-(--text-inverted) shadow-lg shadow-(--brand)/25"
                    : "text-(--text-secondary) bg-glass border border-(--border-subtle) hover:bg-(--surface-elevated)/40 hover:border-(--border-strong) active:bg-(--surface-elevated)/60 shadow-sm cursor-pointer"
                }`}
                aria-label={`Go to page ${pageNum}`}
                aria-current={isCurrentPage ? "page" : undefined}
                title={`Go to page ${pageNum}`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          className={`flex items-center justify-center gap-0 sm:gap-1.5 px-2.5 sm:px-3 py-2 sm:py-2 h-9 sm:h-10 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${
            currentPage >= totalPages
              ? "text-(--text-muted) bg-(--surface-elevated)/20 border border-(--border-subtle) cursor-not-allowed opacity-60"
              : "text-(--text-secondary) bg-glass border border-(--border-subtle) hover:bg-(--surface-elevated)/40 hover:border-(--border-strong) active:bg-(--surface-elevated)/60 shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40"
          }`}
          aria-label="Next page"
          title="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4 shrink-0" />
        </button>
      </div>

      {/* Empty space for desktop layout balance */}
      <div className="hidden sm:block w-20" />
    </div>
  );
}
