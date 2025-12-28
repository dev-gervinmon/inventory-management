"use client";

import CategoryForm from "@/components/forms/category-form";
import { usePullToRefreshLoading } from "@/lib/contexts/pull-to-refresh-context";
import { Skeleton } from "@/components/skeletons/skeleton";

export default function CategoryFormWrapper() {
  const isLoading = usePullToRefreshLoading();

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Label skeleton */}
        <div>
          <Skeleton className="h-4 sm:h-5 w-24 sm:w-28 mb-2 sm:mb-3" />
          {/* Input skeleton */}
          <Skeleton className="h-10 sm:h-11 w-full" />
        </div>

        {/* Button skeleton */}
        <Skeleton className="h-10 sm:h-11 w-full" />
      </div>
    );
  }

  return <CategoryForm />;
}
