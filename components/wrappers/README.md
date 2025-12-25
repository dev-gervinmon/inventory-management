# Wrappers Directory

This directory contains wrapper components that add functionality to base components, primarily:

- Loading states (from `usePullToRefreshLoading`)
- Form state management
- Additional UI layers (modals, overlays)

## File Structure & Relationships

### Form Wrappers

These components wrap forms with loading states and skeleton fallbacks:

- **`edit-category-form-wrapper.tsx`**

  - Wraps: `EditCategoryForm` component
  - Purpose: Shows loading skeleton while data loads
  - Props: `categoryId`, `categoryName`

- **`edit-category-form-with-delete-wrapper.tsx`**

  - Wraps: `EditCategoryForm` + `DeleteCategoryButton`
  - Purpose: Form with delete button, shows loading skeleton
  - Props: `categoryId`, `categoryName`, `onDelete`

- **`add-subcategory-form-wrapper.tsx`**
  - Wraps: `AddSubcategoryForm` component
  - Purpose: Shows loading skeleton while data loads
  - Props: `categoryId`

### List Wrappers

- **`subcategories-list-wrapper.tsx`**
  - Wraps: `SubcategoriesList` component
  - Purpose: Shows loading skeleton, empty state, or list
  - Props: `subcategories`, `categoryId`, `formAction`

### Page Wrappers

- **`edit-category-wrapper.tsx`**
  - Main container for category editing page
  - Composition: Combines edit form, delete button, and subcategories list
  - Manages: Modal states, form submission, deletion flow
  - Props: `category`, `editSubcategory` action
  - Used in: `app/categories/[id]/page.tsx`

## Naming Convention

- Suffix with `-wrapper` to indicate this is a wrapper/container component
- Wrappers handle loading states and composition
- Actual form/list components live in `components/forms/` or `components/list/`
