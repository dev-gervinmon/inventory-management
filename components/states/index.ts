/**
 * States Index
 * Central export for all empty state and error state components
 */

// Dashboard Error State
export { default as DashboardErrorState } from "./dashboard-error-state";

// Re-export error states from common
export { ErrorState, PageError } from "@/components/common/error-state";

// Re-export empty states
export {
  EmptyState,
  EmptyAlertsState,
  EmptyActivityState,
  EmptyProductsState,
  EmptyDashboardState,
  EmptyInventoryState,
  EmptyCategoriesState,
  EmptySearchState,
  EmptyFilteredState,
  EmptyErrorState,
  EmptyTableState,
} from "@/components/empty-states";
