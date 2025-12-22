/**
 * Generic Reusable Empty States
 * Can be used across different pages (inventory, categories, etc.)
 */

import { Inbox, Tag, AlertCircle } from "lucide-react";
import { EmptyState } from "./empty-state";

/**
 * Empty state for lists/inventories
 */
export function EmptyInventoryState() {
  return (
    <EmptyState
      icon={<Inbox className="w-full h-full text-gray-400" strokeWidth={1.5} />}
      title="No Items Found"
      description="You don't have any products in your inventory yet. Create one to get started."
      action={{
        label: "Add Product",
        href: "/add-product",
      }}
    />
  );
}

/**
 * Empty state for categories
 */
export function EmptyCategoriesState() {
  return (
    <EmptyState
      icon={<Tag className="w-full h-full text-gray-400" strokeWidth={1.5} />}
      title="No Categories Yet"
      description="Organize your products by creating categories. This helps you manage and filter your inventory better."
      action={{
        label: "Create Category",
        href: "/categories",
      }}
    />
  );
}

/**
 * Empty state for search results
 */
export function EmptySearchState({ query }: { query: string }) {
  return (
    <EmptyState
      icon={<Inbox className="w-full h-full text-gray-400" strokeWidth={1.5} />}
      title="No Results Found"
      description={`We couldn't find any items matching "${query}". Try adjusting your search or filters.`}
      compact={true}
    />
  );
}

/**
 * Empty state for filtered results
 */
export function EmptyFilteredState() {
  return (
    <EmptyState
      icon={<Inbox className="w-full h-full text-gray-400" strokeWidth={1.5} />}
      title="No Items Match Your Filters"
      description="Try adjusting your filters or search criteria to find what you're looking for."
      compact={true}
    />
  );
}

/**
 * Empty state for errors (generic)
 */
export function EmptyErrorState({
  title = "Something Went Wrong",
  description = "An error occurred while loading this content. Please try again.",
  action,
}: {
  title?: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <EmptyState
      icon={
        <AlertCircle className="w-full h-full text-red-400" strokeWidth={1.5} />
      }
      title={title}
      description={description}
      action={action}
      compact={true}
    />
  );
}

/**
 * Empty state for table/list items
 */
export function EmptyTableState({
  title = "No Data",
  description = "There are no items to display at the moment.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
      <Inbox className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-3 sm:mb-4" />
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-gray-500">{description}</p>
    </div>
  );
}
