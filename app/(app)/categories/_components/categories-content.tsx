"use client";

import { useState, useSyncExternalStore } from "react";
import ColumnManagerButton from "@/components/buttons/column-manager-button";
import ColumnManagerModal from "@/components/modals/column-manager-modal";
import {
  useColumnVisibility,
  type ColumnVisibility,
} from "@/lib/hooks/useColumnVisibility";
import CategoriesTable from "@/components/tables/categories-table";
import { usePullToRefreshLoading } from "@/lib/contexts/pull-to-refresh-context";
import { TableRowSkeleton } from "@/components/skeletons/generic-skeletons";

interface Category {
  id: string;
  name: string;
  createdAt: Date;
  subcategories: Array<{ id: string }>;
  _count: {
    products: number;
  };
}

interface CategoriesPageContentProps {
  initialCategories: Category[];
}

export default function CategoriesPageContent({
  initialCategories,
}: CategoriesPageContentProps) {
  const [showColumnManager, setShowColumnManager] = useState(false);
  const isLoading = usePullToRefreshLoading();

  // Column visibility hook
  const defaultColumns: ColumnVisibility[] = [
    {
      id: "name",
      label: "Name",
      description: "The category name",
      visible: true,
      essential: true,
      sortable: true,
    },
    {
      id: "products",
      label: "Products",
      description: "Number of products in this category",
      visible: true,
      essential: true,
      sortable: true,
    },
    {
      id: "subcategories",
      label: "Subcategories",
      description: "Number of subcategories in this category",
      visible: false,
      essential: false,
      sortable: true,
      mobileHidden: true,
    },
    {
      id: "created",
      label: "Created",
      description: "Date when the category was created",
      visible: false,
      essential: false,
      sortable: true,
      mobileHidden: true,
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
    tableId: "categories",
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
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-base md:text-lg font-semibold text-(--text-primary)">
          Categories ({initialCategories.length})
        </h2>
        <ColumnManagerButton
          onClick={() => setShowColumnManager(true)}
          isCustomized={isCustomizedWithHydration}
        />
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: Math.max(3, initialCategories.length) }).map(
            (_, i) => (
              <TableRowSkeleton key={i} columns={4} />
            )
          )}
        </div>
      ) : initialCategories.length === 0 ? (
        <div className="text-center">
          <p className="text-(--text-muted)">
            No categories yet. Create one to get started!
          </p>
        </div>
      ) : (
        <CategoriesTable
          categories={initialCategories}
          visibleColumns={visibleColumns}
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
