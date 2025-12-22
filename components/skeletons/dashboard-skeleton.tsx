/**
 * Dashboard Skeleton Component
 * Mobile-optimized loading state for dashboard page
 * Matches the structure of dashboard/page.tsx
 */

import { Skeleton } from "./skeleton";

export function DashboardHeaderSkeleton() {
  return (
    <div className="mb-4 sm:mb-8">
      {/* Title and subtitle */}
      <div className="mb-3 sm:mb-6">
        <Skeleton className="h-5 sm:h-8 w-24 sm:w-40 mb-2 sm:mb-3" />
        <Skeleton className="h-2 sm:h-4 w-40 sm:w-64" />
      </div>

      {/* Quick action buttons skeleton */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
        <Skeleton className="h-9 sm:h-10 w-full sm:w-32" />
        <Skeleton className="h-9 sm:h-10 w-full sm:w-36" />
        <Skeleton className="h-9 sm:h-10 w-full sm:w-40" />
      </div>
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton className="h-3 sm:h-4 w-20 sm:w-28 mb-2 sm:mb-3" />
          <Skeleton className="h-5 sm:h-8 md:h-10 w-16 sm:w-24" />
          <Skeleton className="h-2 sm:h-3 w-24 sm:w-40 mt-3 sm:mt-4" />
        </div>
        <Skeleton className="h-8 sm:h-12 md:h-14 w-8 sm:w-12 md:w-14 rounded-lg shrink-0 ml-2" />
      </div>
    </div>
  );
}

export function DashboardMetricsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 mb-6 sm:mb-10">
      {[1, 2, 3, 4].map((i) => (
        <MetricCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6">
      <Skeleton className="h-4 sm:h-5 w-40 sm:w-48 mb-4 md:mb-6" />
      <Skeleton className="w-full h-56" />
    </div>
  );
}

export function ChartRowSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-8 mb-6 sm:mb-10">
      {/* Main chart - takes 2 cols on desktop */}
      <div className="lg:col-span-2">
        <ChartSkeleton />
      </div>

      {/* Stock status - hidden on smaller screens */}
      <div className="hidden lg:block">
        <ChartSkeleton />
      </div>
    </div>
  );
}

export function AlertActivityItemSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <Skeleton className="w-4 h-4 sm:w-5 sm:h-5 rounded-full shrink-0" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-3 sm:h-4 w-32 sm:w-40 mb-2" />
          <Skeleton className="h-2 sm:h-3 w-24 sm:w-32" />
        </div>
      </div>
    </div>
  );
}

export function AlertsActivityTabsSkeleton() {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Tab navigation skeleton - visible on mobile/tablet */}
      <div className="lg:hidden flex space-x-2 sm:space-x-4">
        <Skeleton className="h-10 sm:h-11 w-32 sm:w-40 rounded-lg" />
        <Skeleton className="h-10 sm:h-11 w-32 sm:w-40 rounded-lg" />
      </div>

      {/* Items container */}
      <div className="space-y-2 sm:space-y-3">
        {[1, 2, 3].map((i) => (
          <AlertActivityItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <>
      <DashboardHeaderSkeleton />
      <DashboardMetricsSkeleton />
      <ChartRowSkeleton />
      <AlertsActivityTabsSkeleton />
    </>
  );
}
