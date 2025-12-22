/**
 * QUICK REFERENCE: Using Skeleton Components
 *
 * Copy-paste ready examples for each page type
 */

// ============================================================================
// DASHBOARD PAGE
// ============================================================================
// File: app/dashboard/loading.tsx
import { DashboardSkeleton } from "@/components/skeletons";

export default function Loading() {
  return <DashboardSkeleton />;
}

// ============================================================================
// INVENTORY PAGE (Grid of Products)
// ============================================================================
// File: app/inventory/loading.tsx
import { GridSkeleton, HeaderSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="md:ml-64 px-4 sm:px-6 md:px-8 py-2 sm:py-4 md:py-8 pt-20 sm:pt-24 md:pt-8">
      <HeaderSkeleton />
      <div className="mb-4 sm:mb-6">
        {/* Search/filter skeleton if needed */}
      </div>
      <GridSkeleton count={12} columns={2} />
    </main>
  );
}

// ============================================================================
// CATEGORIES PAGE (List/Grid of Categories)
// ============================================================================
// File: app/categories/loading.tsx
import { CardSkeleton, HeaderSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="md:ml-64 px-4 sm:px-6 md:px-8 py-2 sm:py-4 md:py-8 pt-20 sm:pt-24 md:pt-8">
      <HeaderSkeleton />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <CardSkeleton key={i} image={false} />
        ))}
      </div>
    </main>
  );
}

// ============================================================================
// ADD PRODUCT PAGE (Form)
// ============================================================================
// File: app/add-product/loading.tsx
import { FormSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="md:ml-64 px-4 sm:px-6 md:px-8 py-2 sm:py-4 md:py-8 pt-20 sm:pt-24 md:pt-8">
      <FormSkeleton fields={6} />
    </div>
  );
}

// ============================================================================
// SETTINGS PAGE (Simple List)
// ============================================================================
// File: app/settings/loading.tsx
import { HeaderSkeleton, ListSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="md:ml-64 px-4 sm:px-6 md:px-8 py-2 sm:py-4 md:py-8 pt-20 sm:pt-24 md:pt-8">
      <HeaderSkeleton />
      <ListSkeleton count={5} />
    </main>
  );
}

// ============================================================================
// PRODUCT DETAIL PAGE (Single Card + Details)
// ============================================================================
// File: app/inventory/[id]/loading.tsx
import { CardSkeleton, HeaderSkeleton, FormSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="md:ml-64 px-4 sm:px-6 md:px-8 py-2 sm:py-4 md:py-8 pt-20 sm:pt-24 md:pt-8">
      <HeaderSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CardSkeleton image={true} lines={4} />
        <div className="lg:col-span-2">
          <FormSkeleton fields={5} />
        </div>
      </div>
    </main>
  );
}

// ============================================================================
// CUSTOM LOADING STATE IN CLIENT COMPONENT
// ============================================================================
import { useTransition } from "react";
import { GridSkeleton } from "@/components/skeletons";

export function ProductList({ products }: { products: any[] }) {
  const [isPending, startTransition] = useTransition();

  if (isPending) {
    return <GridSkeleton count={6} columns={2} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map(p => (
        <div key={p.id}>{/* Product card content */}</div>
      ))}
    </div>
  );
}

// ============================================================================
// CUSTOM LOADING STATE (Manual)
// ============================================================================
import { CardSkeleton, Skeleton } from "@/components/skeletons";

export function CustomLoading() {
  return (
    <div className="space-y-4">
      {/* Custom header */}
      <div>
        <Skeleton className="h-6 w-40 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Custom grid with mixed content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardSkeleton image={true} />
        <CardSkeleton image={false} lines={5} />
      </div>

      {/* Custom bottom section */}
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
