# States Directory

This directory contains all empty state and error state components used throughout the application.

## Structure

### Error States

- **`dashboard-error-state.tsx`** - Page-level error component for dashboard
  - Features: Wraps in PageLayout, shows error with retry button
  - Used in: `app/dashboard/page.tsx`

### Error & Empty State Components

All error and empty state components are re-exported from this directory's `index.ts` for centralized access:

**Error States** (from `@/components/common/error-state`):

- `ErrorState` - Base error state component
- `PageError` - Full-page error layout

**Empty States** (from `@/components/empty-states`):

- `EmptyState` - Base empty state component
- Dashboard-specific: `EmptyAlertsState`, `EmptyActivityState`, `EmptyProductsState`, `EmptyDashboardState`
- Generic: `EmptyInventoryState`, `EmptyCategoriesState`, `EmptySearchState`, `EmptyFilteredState`
- Utilities: `EmptyErrorState`, `EmptyTableState`, `EmptyListItemsState`

## Usage

```tsx
// Option 1: Import from states index (recommended)
import { DashboardErrorState, EmptyInventoryState } from "@/components/states";

// Option 2: Import directly
import DashboardErrorState from "@/components/states/dashboard-error-state";
import { EmptyInventoryState } from "@/components/empty-states";
```

## Design Principles

- **Separation of Concerns**: Empty/error states consolidated in one place for consistency
- **Reusability**: Generic empty states can be used across multiple features
- **Specificity**: Dashboard-specific error state for enhanced UX
- **Centralized Index**: `index.ts` provides single export point for all state components
