# Component Architecture Diagrams

## 1. Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Pages (app/)                             │
│                      Server Components                           │
│          (Data fetching, Layout, Route segments)                │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ↓ (pass data & server actions as props)
┌─────────────────────────────────────────────────────────────────┐
│             Client Wrappers (components/clients/)                │
│         "use client" - Complex State Management                 │
│     (Form state, Modals, Navigation, Validation, Context)      │
└────────────┬─────────────────────────────┬──────────────────────┘
             │                             │
             ↓                             ↓
    ┌─────────────────┐         ┌──────────────────┐
    │ Page Wrappers   │         │ Container Logic  │
    │  (composition)  │         │  (state mgmt)    │
    └────────┬────────┘         └────────┬─────────┘
             │                           │
             ↓                           ↓
┌─────────────────────────────────────────────────────────────────┐
│        Loading Wrappers (components/wrappers/)                   │
│     Cross-cutting concerns, Loading States, Composition         │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│         Base Components (all other components/)                  │
│              Pure UI, No State, Reusable                         │
│    (buttons, forms, modals, tables, common, etc.)               │
└─────────────────────────────────────────────────────────────────┘
```

## 2. Add Product Flow

```
Page Component (Server)
└── app/add-product/page.tsx
    │
    ├─ Fetch: categories
    ├─ Import: AddProductClient
    └─ Pass: categories, addProduct (server action)
         │
         ↓
    Client Wrapper
    └── AddProductClient ("use client")
        │
        ├─ Hook: useFormErrors() - Error tracking
        ├─ Hook: useMessage() - Toast feedback
        ├─ State: isSubmitting, isSuccessModalOpen, createdProductId
        │
        ├─ Render: PageLayout
        │   ├─ StickyFormHeader (submit button, title)
        │   ├─ ProductFormContext.Provider
        │   │   ├─ AddProductForm (left column)
        │   │   └─ ProductFormSidebar (right column)
        │   ├─ SuccessModal (auto-redirect to edit)
        │   └─ MessageBanner (error messages)
        │
        └─ Actions:
           ├─ handleFormSubmit() → call server action
           ├─ redirectToEditPage() → push to /inventory/[id]/edit
           └─ handleReset() → reset form & errors
```

## 3. Edit Product Flow

```
Page Component (Server)
└── app/inventory/[id]/edit-product/page.tsx
    │
    ├─ Fetch: product, categories
    ├─ Import: ProductEditClient
    └─ Pass: product, editProduct, deleteProduct (server actions)
         │
         ↓
    Client Wrapper
    └── ProductEditClient ("use client")
        │
        ├─ Hook: useFormErrors() - Error tracking
        ├─ Hook: useMessage() - Toast feedback
        ├─ State: isDirty, isNavigationBlocked, isDeleting
        │         isSubmitting, isSuccessModalOpen
        │
        ├─ Effects:
        │   ├─ Track form changes (mark dirty)
        │   ├─ Warn before page unload if dirty
        │   └─ Block navigation if unsaved changes
        │
        ├─ Render: PageLayout
        │   ├─ MessageBanner (feedback)
        │   ├─ StickyFormHeader (submit, reset buttons)
        │   ├─ ProductFormContext.Provider
        │   │   ├─ ProductForm (left column - children prop)
        │   │   └─ ProductInfoSidebar (right column)
        │   ├─ SuccessModal (auto-close after 2.5s)
        │   ├─ ConfirmationModal (delete confirmation)
        │   └─ ConfirmationModal (unsaved changes warning)
        │
        └─ Actions:
           ├─ handleFormSubmit() → call server action
           ├─ handleDeleteProduct() → confirm, delete, redirect
           ├─ handleNavigationBlock() → show confirmation
           └─ handleReset() → reset form & errors
```

## 4. Category Edit Flow

```
Page Component (Server)
└── app/categories/[id]/page.tsx
    │
    ├─ Fetch: category with subcategories
    ├─ Import: EditCategoryWrapper
    └─ Pass: category, editSubcategory (server action)
         │
         ↓
    Page Wrapper (Composition)
    └── EditCategoryWrapper
        │
        ├─ Hook: useMessage() - Toast feedback
        ├─ State: isModalOpen, isDeleting, activeTab
        │
        ├─ Render:
        │   ├─ PageLayout
        │   │   └─ PullToRefreshWrapper
        │   │       ├─ Header (back button, title, description)
        │   │       │
        │   │       ├─ Mobile Tabs (Edit | Add)
        │   │       │   ├─ Mobile Forms (show one based on activeTab)
        │   │       │   │   ├─ EditCategoryFormWithDeleteWrapper (if Edit tab)
        │   │       │   │   └─ AddSubcategoryFormWrapper (if Add tab)
        │   │       │   │
        │   │       │   └─ Desktop View (both visible)
        │   │       │       ├─ EditCategoryFormWithDeleteWrapper
        │   │       │       │   ├─ EditCategoryFormWrapper
        │   │       │       │   │   └─ EditCategoryForm
        │   │       │       │   └─ DeleteCategoryButton
        │   │       │       │
        │   │       │       └─ AddSubcategoryFormWrapper
        │   │       │           └─ AddSubcategoryForm
        │   │       │
        │   │       ├─ Subcategories List (2/3 width on desktop)
        │   │       │   └─ SubcategoriesListWrapper
        │   │       │       └─ SubcategoriesList
        │   │       │
        │   │       ├─ ConfirmationModal (delete category)
        │   │       └─ MessageBanner (feedback)
        │   │
        │   └─ Actions:
        │       ├─ handleConfirmDelete() → delete, redirect
        │       └─ setActiveTab() → toggle mobile view
        │
        └─ Component Hierarchy:
           EditCategoryWrapper
           ├── EditCategoryFormWithDeleteWrapper
           │   ├── EditCategoryFormWrapper
           │   │   └── EditCategoryForm
           │   └── DeleteCategoryButton
           ├── AddSubcategoryFormWrapper
           │   └── AddSubcategoryForm
           └── SubcategoriesListWrapper
               └── SubcategoriesList
```

## 5. Component Dependency Tree

```
                         ┌─── lib/ (utilities, hooks, actions)
                         │
                         ↓
        ┌────────────────────────────────────────────┐
        │        Reusable Base Components            │
        │                                             │
        │  buttons/  forms/  common/  tables/       │
        │  modals/   charts/ filters/ empty-states/│
        │  skeletons/ list/  states/                │
        └────┬──────────────────────────────────────┘
             │
             ↑ (uses)
             │
        ┌────────────────────────────────────┐
        │    Wrapper Components              │
        │  (Loading states, Composition)     │
        │  components/wrappers/              │
        └────┬─────────────────────────────────┘
             │
             ↑ (composes with)
             │
        ┌────────────────────────────────────┐
        │    Client Wrappers                 │
        │  (State Management)                │
        │  components/clients/               │
        └────┬─────────────────────────────────┘
             │
             ↑ (wraps)
             │
        ┌────────────────────────────────────┐
        │    Page Components                 │
        │  (Route segments)                  │
        │  app/**/*.tsx                      │
        └────────────────────────────────────┘
```

## 6. State Management Layers

```
┌──────────────────────────────────────────────────────────────┐
│         Page Level Context (if needed)                        │
│  e.g., NavigationTransitionProvider, CategoryPageWrapper     │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│      Client Wrapper Context                                   │
│  ProductFormContext - Provides form state to children        │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│    Component Internal State (hooks)                           │
│  useState, useRef, useCallback, useEffect                    │
│  Custom hooks: useFormErrors, useMessage, usePullToRefresh  │
└──────────────────────────────────────────────────────────────┘
```

## 7. Common Import Patterns

### In a Server Page Component:
```tsx
// Data & actions
import prisma from "@/lib/db/prisma";
import { someAction } from "@/lib/actions/";
import { getCurrentUser } from "@/lib/auth/auth";

// Client wrapper
import SomeClient from "@/components/clients/some-client";

// Server component layout
import PageLayout from "@/components/layout/page-layout";
```

### In a Client Wrapper:
```tsx
// React & Next.js
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// Custom hooks
import { useMessage } from "@/lib/hooks/useMessage";
import { useFormErrors } from "@/lib/hooks/useFormErrors";

// Context
import { MyContext } from "@/lib/contexts/my-context";

// Base components
import { SomeForm } from "@/components/forms/";
import SomeModal from "@/components/modals/";
import PageLayout from "@/components/layout/page-layout";
```

### In a Base Component (UI):
```tsx
// No hooks (usually) unless needed for local state
// No "use client" (unless hooks needed)
// No server actions (pass as props)

import Link from "next/link";
import { SomeIcon } from "lucide-react";
import Button from "@/components/buttons/button";
```

---

## Best Practices from This Architecture

1. **Unidirectional Dependencies**: Components only depend on components below them in the hierarchy
2. **Single Responsibility**: Each layer has a clear purpose
3. **Composition Over Props**: Complex layouts use composition, not prop drilling
4. **Context for Form State**: ProductFormContext makes form state available without drilling
5. **Server Actions as Props**: Client components receive server actions as props, not import them
6. **Isolated Page Logic**: Page-specific components live in `app/**/_components/`
7. **Reusable Wrappers**: Loading wrappers can be applied to any component
8. **Clear Module Boundaries**: Easy to find components by their purpose

---

**Last Updated:** December 2025
