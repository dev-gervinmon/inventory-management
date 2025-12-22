/**
 * Generic Reusable Skeleton Components
 * Can be used across different pages (inventory, categories, etc.)
 */

import { Skeleton } from "./skeleton";

interface SkeletonCardProps {
  title?: boolean;
  lines?: number;
  image?: boolean;
}

/**
 * Generic card skeleton - useful for product cards, category cards, etc.
 */
export function CardSkeleton({
  title = true,
  lines = 2,
  image = false,
}: SkeletonCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6">
      {/* Image placeholder if needed */}
      {image && <Skeleton className="h-40 sm:h-48 w-full mb-3 sm:mb-4" />}

      {/* Title */}
      {title && <Skeleton className="h-5 sm:h-6 w-32 sm:w-40 mb-2 sm:mb-3" />}

      {/* Content lines */}
      <div className="space-y-2 sm:space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-3 sm:h-4 ${
              i === lines - 1 ? "w-20 sm:w-24" : "w-full"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Table/List row skeleton
 */
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 border-b border-gray-200 last:border-b-0">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${
            i === 0
              ? "w-20 sm:w-24"
              : i === columns - 1
              ? "w-16 sm:w-20"
              : "flex-1"
          }`}
        />
      ))}
    </div>
  );
}

/**
 * Grid skeleton - for product grids, category grids, etc.
 */
export function GridSkeleton({
  count = 6,
  columns = 2,
}: {
  count?: number;
  columns?: number;
}) {
  const gridClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid ${gridClass} gap-3 sm:gap-4 md:gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} image={true} />
      ))}
    </div>
  );
}

/**
 * Form skeleton - for form pages with inputs
 */
export function FormSkeleton({ fields = 5 }: { fields?: number }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
      {/* Form title */}
      <Skeleton className="h-6 sm:h-7 w-40 sm:w-48 mb-6 sm:mb-8" />

      {/* Form fields */}
      <div className="space-y-4 sm:space-y-6">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i}>
            {/* Field label */}
            <Skeleton className="h-4 sm:h-5 w-24 sm:w-28 mb-2 sm:mb-3" />
            {/* Field input */}
            <Skeleton className="h-10 sm:h-11 w-full" />
          </div>
        ))}
      </div>

      {/* Submit button */}
      <Skeleton className="h-10 sm:h-11 w-24 sm:w-28 mt-6 sm:mt-8" />
    </div>
  );
}

/**
 * List skeleton - for simple lists (activities, alerts, etc.)
 */
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2 sm:space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4"
        >
          <div className="flex items-start space-x-2 sm:space-x-3">
            <Skeleton className="w-3 h-3 sm:w-4 sm:h-4 rounded-full mt-1 shrink-0" />
            <div className="flex-1 min-w-0">
              <Skeleton className="h-4 sm:h-5 w-48 sm:w-56 mb-1 sm:mb-2" />
              <Skeleton className="h-3 sm:h-4 w-32 sm:w-40" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Header skeleton - for page headers
 */
export function HeaderSkeleton() {
  return (
    <div className="mb-6 sm:mb-8">
      <Skeleton className="h-7 sm:h-8 md:h-9 w-40 sm:w-48 mb-2 sm:mb-3" />
      <Skeleton className="h-3 sm:h-4 w-56 sm:w-64" />
    </div>
  );
}
