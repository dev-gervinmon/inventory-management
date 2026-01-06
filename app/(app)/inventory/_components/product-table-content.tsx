"use client";

import { useState, useSyncExternalStore } from "react";
import ColumnManagerModal from "@/components/modals/column-manager-modal";
import {
  useColumnVisibility,
  type ColumnVisibility,
} from "@/lib/hooks/useColumnVisibility";
import ProductTable from "@/components/tables/product-table";
import { usePullToRefreshLoading } from "@/lib/contexts/pull-to-refresh-context";
import { TableRowSkeleton } from "@/components/skeletons/generic-skeletons";
import { SerializedProduct } from "@/app/src/utils/product";

interface ProductTableContentProps {
  products: SerializedProduct[];
  initialStatusFilter?: string;
}

export default function ProductTableContent({
  products,
  initialStatusFilter,
}: ProductTableContentProps) {
  const [showColumnManager, setShowColumnManager] = useState(false);
  const isLoading = usePullToRefreshLoading();

  // Column visibility hook
  const defaultColumns: ColumnVisibility[] = [
    {
      id: "name",
      label: "Product Name",
      description: "The product name and image",
      visible: true,
      essential: true,
      sortable: true,
    },
    {
      id: "sku",
      label: "SKU",
      description: "Stock keeping unit",
      visible: false,
      essential: false,
      sortable: true,
    },
    {
      id: "categories",
      label: "Categories",
      description: "Assigned categories",
      visible: false,
      essential: false,
      sortable: true,
      mobileHidden: true,
    },
    {
      id: "price",
      label: "Price",
      description: "Product price",
      visible: false,
      essential: false,
      sortable: true,
    },
    {
      id: "stock",
      label: "Stock Quantity",
      description: "Current inventory quantity",
      visible: false,
      essential: false,
      sortable: true,
    },
    {
      id: "status",
      label: "Status",
      description: "Stock status indicator",
      visible: false,
      essential: false,
      sortable: false,
    },
  ];

  const {
    columns,
    visibleColumns,
    toggleColumn,
    showAll,
    isCustomized,
    toggleFavorite,
  } = useColumnVisibility({
    tableId: "products",
    defaultColumns,
  });

  // Use useSyncExternalStore to safely handle localStorage without hydration mismatch
  // Server will always return false, client will read from localStorage
  const isCustomizedWithHydration = useSyncExternalStore(
    () => () => {}, // no subscription needed, value is static per session
    () => isCustomized, // client: read from hook
    () => false // server: default to false
  );

  // Toggle between Show All and Hide All (show only essentials)
  const handleToggleAllColumns = () => {
    const nonEssentialColumns = columns.filter((col) => !col.essential);
    const allNonEssentialVisible = nonEssentialColumns.every(
      (col) => col.visible
    );

    // If all non-essential columns are visible, hide them
    // Otherwise, show all columns
    if (allNonEssentialVisible) {
      nonEssentialColumns.forEach((col) => {
        if (col.visible) {
          toggleColumn(col.id);
        }
      });
    } else {
      showAll();
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: Math.max(3, products.length) }).map((_, i) => (
            <TableRowSkeleton key={i} columns={6} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center">
          <p className="text-sm text-(--text-muted)">
            No products yet. Create one to get started!
          </p>
        </div>
      ) : (
        <ProductTable
          products={products}
          visibleColumns={visibleColumns}
          isCustomized={isCustomizedWithHydration}
          onOpenColumnManager={() => setShowColumnManager(true)}
          initialStatusFilter={initialStatusFilter}
        />
      )}

      <ColumnManagerModal
        isOpen={showColumnManager}
        onClose={() => setShowColumnManager(false)}
        columns={columns}
        onToggleColumn={toggleColumn}
        onToggleAllColumns={handleToggleAllColumns}
        onToggleFavorite={toggleFavorite}
        hiddenCount={columns.filter((col) => !col.visible).length}
      />
    </>
  );
}
