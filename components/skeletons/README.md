# Skeleton Components Guide

## Overview

Reusable, mobile-optimized loading state (skeleton) components for the entire app. These components are responsive and match the styling of their corresponding content components.

## Components

### Base Component

#### `Skeleton`

The base animated placeholder component used by all other skeletons.

```tsx
import { Skeleton } from "@/components/skeletons";

<Skeleton className="h-6 w-32" />
<Skeleton variant="circular" className="w-10 h-10" />
```

**Props:**

- `className?: string` - Tailwind classes for sizing/styling
- `variant?: "default" | "circular"` - Shape variant

---

### Dashboard Skeletons

#### `DashboardSkeleton`

Complete dashboard loading state - use this in the dashboard page.

```tsx
import { DashboardSkeleton } from "@/components/skeletons";

export default function Loading() {
  return <DashboardSkeleton />;
}
```

#### `DashboardHeaderSkeleton`

Title, subtitle, and quick action buttons skeleton.

#### `DashboardMetricsSkeleton`

Four metric cards in a responsive grid (2 columns mobile → 4 columns desktop).

#### `ChartRowSkeleton`

Chart and stock status section with proper responsive layout.

#### `AlertsActivityTabsSkeleton`

Alerts and activity section with tab navigation skeleton.

---

### Generic Reusable Skeletons

These can be used across any page for common UI patterns:

#### `CardSkeleton`

Versatile card skeleton for product cards, category cards, etc.

```tsx
import { CardSkeleton } from "@/components/skeletons";

<CardSkeleton image={true} lines={3} />;
```

**Props:**

- `title?: boolean` - Show title skeleton
- `lines?: number` - Number of text line skeletons
- `image?: boolean` - Show image placeholder

#### `GridSkeleton`

Grid of cards - perfect for product listings, categories, etc.

```tsx
import { GridSkeleton } from "@/components/skeletons";

<GridSkeleton count={6} columns={2} /> {/* 2 columns on mobile, auto-responsive */}
<GridSkeleton count={9} columns={3} /> {/* 3 columns on desktop */}
```

**Props:**

- `count?: number` - Number of skeleton cards (default: 6)
- `columns?: number` - Column layout: 1, 2, or 3

#### `TableRowSkeleton`

Row skeleton for table/list layouts.

```tsx
import { TableRowSkeleton } from "@/components/skeletons";

{
  [1, 2, 3].map((i) => <TableRowSkeleton key={i} columns={4} />);
}
```

**Props:**

- `columns?: number` - Number of columns

#### `ListSkeleton`

Simple list item skeletons (activities, alerts, etc.).

```tsx
import { ListSkeleton } from "@/components/skeletons";

<ListSkeleton count={5} />;
```

**Props:**

- `count?: number` - Number of items

#### `FormSkeleton`

Form page loading state with inputs and button.

```tsx
import { FormSkeleton } from "@/components/skeletons";

<FormSkeleton fields={5} />;
```

**Props:**

- `fields?: number` - Number of form fields

#### `HeaderSkeleton`

Page header skeleton (title + subtitle).

```tsx
import { HeaderSkeleton } from "@/components/skeletons";

<HeaderSkeleton />;
```

---

## Mobile Responsiveness

All skeletons are mobile-first and fully responsive:

- **Mobile**: Optimized spacing and sizing
- **Tablet (sm:)**: Slightly increased padding and text
- **Desktop (md: / lg:)**: Full spacing and layout

Example responsive sizes:

```tsx
<Skeleton className="h-6 sm:h-7 md:h-8 w-40 sm:w-48" />
```

---

## Usage Examples

### Dashboard Page

```tsx
// app/dashboard/loading.tsx
import { DashboardSkeleton } from "@/components/skeletons";

export default function Loading() {
  return <DashboardSkeleton />;
}
```

### Inventory Page

```tsx
// app/inventory/loading.tsx
import { GridSkeleton, HeaderSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="p-4 sm:p-6 md:p-8">
      <HeaderSkeleton />
      <GridSkeleton count={12} columns={2} />
    </main>
  );
}
```

### Categories Page

```tsx
// app/categories/loading.tsx
import { CardSkeleton, HeaderSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="p-4 sm:p-6 md:p-8">
      <HeaderSkeleton />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
```

### Form Page

```tsx
// app/add-product/loading.tsx
import { FormSkeleton } from "@/components/skeletons";

export default function Loading() {
  return <FormSkeleton fields={6} />;
}
```

---

## Design Principles

1. **Matches Content**: Each skeleton matches the structure of its corresponding content component
2. **Mobile-First**: Optimized for mobile, scales up for larger screens
3. **Reusable**: Components are generic enough to be used across different pages
4. **Accessible**: Uses `aria-hidden="true"` to hide from screen readers
5. **Performant**: Uses CSS animations (no JavaScript)

---

## Customization

To customize colors or animations, update the base `Skeleton` component:

```tsx
// components/skeletons/skeleton.tsx
export function Skeleton({ ... }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 ${baseClasses} ${className}`}
    />
  );
}
```

You can change:

- `bg-gray-200` → different background color
- `animate-pulse` → different Tailwind animation

---

## Future Enhancements

- [ ] Shimmer animation variant
- [ ] Dark mode skeleton colors
- [ ] Customizable animation speed
- [ ] Skeleton wrappers for async boundaries
