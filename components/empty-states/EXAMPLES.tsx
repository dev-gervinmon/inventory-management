/**
 * QUICK REFERENCE: Using Empty State Components
 *
 * Copy-paste ready examples for each page type
 */

// ============================================================================
// DASHBOARD - ALERTS & ACTIVITY (ALREADY DONE ✅)
// ============================================================================
// File: components/layout/alerts-activity-tabs.tsx
import {
  EmptyAlertsState,
  EmptyActivityState,
} from "@/components/empty-states";

// In your component:
{
  criticalStockItems.length > 0 ? (
    <div className="space-y-3">{/* Alert items */}</div>
  ) : (
    <EmptyAlertsState />
  );
}

// ============================================================================
// INVENTORY PAGE (Grid of Products)
// ============================================================================
// File: app/inventory/page.tsx
import { EmptyInventoryState } from "@/components/empty-states";

export default function InventoryPage({ products }) {
  if (products.length === 0) {
    return <EmptyInventoryState />;
  }

  return (
    <main className="p-4 sm:p-6 md:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Product cards */}
      </div>
    </main>
  );
}

// ============================================================================
// CATEGORIES PAGE
// ============================================================================
// File: app/categories/page.tsx
import { EmptyCategoriesState } from "@/components/empty-states";

export default function CategoriesPage({ categories }) {
  return (
    <main className="p-4 sm:p-6 md:p-8">
      {categories.length === 0 ? (
        <EmptyCategoriesState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Category cards */}
        </div>
      )}
    </main>
  );
}

// ============================================================================
// SEARCH RESULTS
// ============================================================================
// File: app/inventory/page.tsx (with search)
import { EmptySearchState } from "@/components/empty-states";

export default function InventoryPage({ searchResults, searchQuery }) {
  return (
    <main className="p-4 sm:p-6 md:p-8">
      {searchResults.length === 0 && searchQuery ? (
        <EmptySearchState query={searchQuery} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Product cards */}
        </div>
      )}
    </main>
  );
}

// ============================================================================
// FILTERED RESULTS
// ============================================================================
// File: components/product-list.tsx
import { EmptyFilteredState } from "@/components/empty-states";

export function ProductList({ products, filters }) {
  if (products.length === 0 && Object.keys(filters).length > 0) {
    return <EmptyFilteredState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Product cards */}
    </div>
  );
}

// ============================================================================
// TABLE WITH NO DATA
// ============================================================================
// File: components/product-table.tsx
import { EmptyTableState } from "@/components/empty-states";

export function ProductTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row) => <tr key={row.id}>{/* Table cells */}</tr>)
          ) : (
            <tr>
              <td colSpan="5">
                <EmptyTableState />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// ERROR STATE
// ============================================================================
// File: components/product-list-with-error.tsx
import { EmptyErrorState } from "@/components/empty-states";

export function ProductList({ error, products }) {
  if (error) {
    return (
      <EmptyErrorState
        title="Failed to Load Products"
        description="An error occurred while loading your products. Please try again."
        action={{ label: "Retry", href: "/inventory" }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// ============================================================================
// CUSTOM EMPTY STATE (Extend Base Component)
// ============================================================================
import { EmptyState } from "@/components/empty-states";
import { AlertTriangle } from "lucide-react";

export function EmptyOutOfStockState() {
  return (
    <EmptyState
      icon={
        <AlertTriangle
          className="w-full h-full text-orange-400"
          strokeWidth={1.5}
        />
      }
      title="All Products Out of Stock"
      description="All your products are currently out of stock. Restock them to make them available for purchase."
      action={{ label: "Restock Products", href: "/inventory" }}
    />
  );
}

// ============================================================================
// USAGE IN CLIENT COMPONENT
// ============================================================================
("use client");

import { EmptyState } from "@/components/empty-states";
import { useEffect, useState } from "react";

export function DynamicProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch products
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return products.length === 0 ? (
    <EmptyInventoryState />
  ) : (
    <div>{/* Product list */}</div>
  );
}
