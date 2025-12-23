"use client";

import EditCategoryForm from "@/components/forms/edit-category-form";
import DeleteCategoryButton from "@/components/buttons/delete/delete-category-button";
import { usePullToRefreshLoading } from "@/lib/contexts/pull-to-refresh-context";
import { Skeleton } from "@/components/skeletons/skeleton";

interface EditCategoryFormWithDeleteWrapperProps {
  categoryId: string;
  categoryName: string;
  onDelete: () => void;
}

export default function EditCategoryFormWithDeleteWrapper({
  categoryId,
  categoryName,
  onDelete,
}: EditCategoryFormWithDeleteWrapperProps) {
  const isLoading = usePullToRefreshLoading();

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Category name field */}
        <div>
          <Skeleton className="h-4 sm:h-5 w-24 sm:w-28 mb-2 sm:mb-3" />
          <Skeleton className="h-10 sm:h-11 w-full" />
        </div>

        {/* Submit button skeleton */}
        <Skeleton className="h-10 sm:h-11 w-full" />

        {/* Delete Button - with separator skeleton */}
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 space-y-4">
          <Skeleton className="h-10 sm:h-11 w-full" />
        </div>
      </div>
    );
  }

  return (
    <>
      <EditCategoryForm categoryId={categoryId} categoryName={categoryName} />

      {/* Delete Button - Outside of form */}
      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
        <DeleteCategoryButton
          categoryId={categoryId}
          categoryName={categoryName}
          onDelete={onDelete}
        />
      </div>
    </>
  );
}
