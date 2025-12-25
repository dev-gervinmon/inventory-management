"use client";

import SubcategoriesList from "@/components/list/subcategories-list";
import { usePullToRefreshLoading } from "@/lib/contexts/pull-to-refresh-context";
import { TableRowSkeleton } from "@/components/skeletons/generic-skeletons";

interface SubcategoriesListWrapperProps {
  subcategories: Array<{
    id: string;
    name: string;
    createdAt: Date;
    categoryId: string;
  }>;
  categoryId: string;
  formAction: (formData: FormData) => Promise<{
    success: boolean;
    error?: string;
  }>;
}

export default function SubcategoriesListWrapper({
  subcategories,
  categoryId,
  formAction,
}: SubcategoriesListWrapperProps) {
  const isLoading = usePullToRefreshLoading();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: Math.max(3, subcategories.length) }).map(
          (_, i) => (
            <TableRowSkeleton key={i} columns={4} />
          )
        )}
      </div>
    );
  }

  if (subcategories.length === 0) {
    return (
      <p className="text-xs sm:text-sm text-gray-500">
        No subcategories yet. Create one using the form on the left.
      </p>
    );
  }

  return (
    <SubcategoriesList
      subcategories={subcategories}
      categoryId={categoryId}
      formAction={formAction}
    />
  );
}
