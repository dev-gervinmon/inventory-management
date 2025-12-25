# Components Directory Architecture

This directory contains all reusable UI components organized by functional area. The architecture follows React best practices with clear separation of concerns.

## Directory Structure Overview

```
components/
├── buttons/              # Button components with variants
├── charts/              # Data visualization components
├── clients/             # "use client" page wrappers with state management
├── common/              # Reusable UI utilities (tabs, pagination, etc.)
├── empty-states/        # Empty/no-data state components
├── filters/             # Search and filter components
├── forms/               # Form components and form building blocks
├── layout/              # Core layout components (navbar, sidebar, etc.)
├── list/                # List/collection display components
├── modals/              # Modal dialog components
├── skeletons/           # Loading skeleton placeholder components
├── states/              # Centralized error & empty state exports
├── tables/              # Table/data grid components
└── wrappers/            # Wrapper components adding loading/state functionality
```

## Component Categories

### 🎨 **UI Components** (Reusable, stateless)

- **buttons/** - Button variants, icons, delete buttons
- **common/** - Pagination, tabs, search select, sortable headers
- **forms/** - Form inputs, field components, form builders
- **charts/** - Product charts and data visualizations
- **skeletons/** - Loading placeholders matching component layouts
- **modals/** - Reusable modal dialogs

### 🔧 **Container Components** (State management)

- **clients/** - Client-side page wrappers managing form state
- **wrappers/** - Loading state wrappers, composition helpers
- **layout/** - Page layout infrastructure (navigation, sidebars)

### 📊 **Display Components** (Data presentation)

- **tables/** - Data table components
- **list/** - List display components
- **filters/** - Search and filter UIs
- **empty-states/** - Empty/no-data state displays

### ⚠️ **State Components** (Error & empty states)

- **states/** - Central export point for error and empty states
- **common/error-state** - Base error display component

---

## Component Patterns & Usage

### Pattern 1: Base Component → Wrapper → Page

Example: Add Product Flow

```
AddProductForm (base component)
    ↓
AddProductClient ("use client" wrapper with state management)
    ↓
app/add-product/page.tsx (server page)
```

### Pattern 2: Base Component → Loading Wrapper → Container

Example: Category Editing

```
EditCategoryForm (base component)
    ↓
EditCategoryFormWrapper (shows loading skeleton)
    ↓
EditCategoryWrapper (main page container)
    ↓
app/categories/[id]/page.tsx
```

### Pattern 3: Shared Utility Components

```
Button Component (base)
    ↓
Specific button variants
    ↓
Used throughout the app
```

---

## Key Design Principles

### 1. **Separation of Concerns**

- **UI Components**: Pure presentation, no business logic
- **Container Components**: State management, logic, composition
- **Page Components**: Route-specific integration

### 2. **Client vs Server**

- **"use client" Only**: Components needing hooks, events, or context
- **Server Components**: Default for better performance, data fetching
- Located in: `components/clients/` and `app/*/_components/`

### 3. **Composition Over Inheritance**

- Build complex UIs by composing smaller components
- Wrappers provide cross-cutting concerns (loading states, modals)
- Props for customization, slots for composition

### 4. **Naming Conventions**

| Suffix     | Meaning                     | Example                    |
| ---------- | --------------------------- | -------------------------- |
| `-client`  | Client-side state wrapper   | `AddProductClient`         |
| `-wrapper` | Loading/composition wrapper | `EditCategoryFormWrapper`  |
| (none)     | Base component              | `AddProductForm`, `Button` |
| `-state`   | Error/empty state component | `DashboardErrorState`      |
| `-modal`   | Dialog/overlay component    | `ColumnManagerModal`       |
| `-button`  | Button variant              | `DeleteProductButton`      |

---

## Folder-Specific Docs

Each major folder has its own README explaining structure and patterns:

- **[buttons/README.md](./buttons/README.md)** - Button component organization
- **[clients/README.md](./clients/README.md)** - Client wrapper pattern
- **[wrappers/README.md](./wrappers/README.md)** - Loading wrapper components
- **[states/README.md](./states/README.md)** - Error and empty states

---

## Component Dependencies

### Safe Imports

✅ Can freely import from:

- `@/components/buttons`
- `@/components/common`
- `@/components/forms`
- `@/components/modals`
- `@/lib/*` (utilities, hooks, actions)

### Dependency Hierarchy

```
Page Components (app/)
    ↓
Client Wrappers (components/clients/)
    ↓
Page Wrappers (components/wrappers/)
    ↓
Base Components (components/*/ - buttons, forms, common, etc.)
    ↓
Library (lib/)
```

### Avoid Circular Imports

- Don't import page components in base components
- Don't import clients in other clients
- Use context for cross-component communication

---

## Best Practices

### Creating New Components

1. **Define clear props interface**

   ```tsx
   interface ComponentProps {
     // Required props
     title: string;
     // Optional props with defaults
     variant?: "primary" | "secondary";
     className?: string;
   }
   ```

2. **Use JSDoc for public components**

   ```tsx
   /**
    * Brief description of component
    * @param title - What this prop does
    * @param variant - Available options and defaults
    * @example
    * <MyComponent title="Hello" variant="primary" />
    */
   ```

3. **Keep components focused**

   - One responsibility per component
   - Move state management to wrappers if needed
   - Use composition for complex UIs

4. **Place in appropriate folder**
   - UI components → `common/`, `forms/`, `buttons/`, `modals/`
   - Loading wrappers → `wrappers/`
   - Page state wrappers → `clients/`
   - Error/empty states → `states/`, `empty-states/`

### Using Components

1. **Prefer composition**

   ```tsx
   // Good: Composable
   <PageLayout>
     <Content />
   </PageLayout>

   // Avoid: Too many props
   <PageLayout showNav showFooter showSidebar ... />
   ```

2. **Use constants for options**

   ```tsx
   // Good: Clear options
   <Button variant="delete" size="sm" />

   // Avoid: Magic strings
   <Button styleClass="px-4 py-2 bg-red-600" />
   ```

3. **Keep component files small**
   - Single component per file (except related variants)
   - Move logic to hooks/utils if file exceeds 300 lines
   - Extract complex JSX into sub-components

---

## Common Components Quick Reference

### Buttons

```tsx
import { FormButton } from "@/components/buttons/form-button";
import { AddProductButton } from "@/components/buttons/add-product-button";
import { TouchOptimizedButton } from "@/components/buttons/touch-optimized-button";
```

### Forms

```tsx
import { AddProductForm } from "@/components/forms/add-product-form";
import { FormField } from "@/components/forms/form-field";
```

### States

```tsx
import { EmptyInventoryState } from "@/components/states";
import { ErrorState } from "@/components/states";
import DashboardErrorState from "@/components/states/dashboard-error-state";
```

### Modals

```tsx
import ConfirmationModal from "@/components/modals/confirmation-modal";
import SuccessModal from "@/components/modals/success-modal";
```

### Layout

```tsx
import PageLayout from "@/components/layout/page-layout";
import MobileSidebar from "@/components/layout/mobile-sidebar";
```

---

## Performance Tips

1. **Use skeleton loaders** - Don't show empty screens while loading
2. **Lazy load modals** - They're not always visible
3. **Memoize expensive components** - Use `React.memo()` for pure components
4. **Keep "use client" scope small** - Only wrap components that need it
5. **Use proper loading states** - Show `usePullToRefreshLoading()` state

---

## Related Documentation

- [Next.js App Router](https://nextjs.org/docs/app)
- [React Best Practices](https://react.dev/reference/react)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Last Updated:** December 2025  
**Maintained by:** Development Team
