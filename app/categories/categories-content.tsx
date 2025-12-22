"use client";

import { useState } from "react";
import ColumnManagerButton from "@/components/buttons/column-manager-button";
import ColumnManagerModal from "@/components/modals/column-manager-modal";
import {
  useColumnVisibility,
  type ColumnVisibility,
} from "@/lib/hooks/useColumnVisibility";
import CategoriesTable from "@/components/tables/categories-table";

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

  // Column visibility hook
  const defaultColumns: ColumnVisibility[] = [
    {
      id: "name",
      label: "Name",
      visible: true,
      essential: true,
      sortable: true,
    },
    {
      id: "products",
      label: "Products",
      visible: true,
      essential: true,
      sortable: true,
    },
    {
      id: "subcategories",
      label: "Subcategories",
      visible: false,
      essential: false,
      sortable: true,
      mobileHidden: true,
    },
    {
      id: "created",
      label: "Created",
      visible: false,
      essential: false,
      sortable: true,
      mobileHidden: true,
    },
  ];

  const { columns, visibleColumns, toggleColumn, showAll, isCustomized } =
    useColumnVisibility({
      tableId: "categories",
      defaultColumns,
    });

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
        <h2 className="text-base md:text-lg font-semibold text-gray-900">
          Categories ({initialCategories.length})
        </h2>
        <ColumnManagerButton
          onClick={() => setShowColumnManager(true)}
          isCustomized={isCustomized}
        />
      </div>
      {initialCategories.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500">
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
        hiddenCount={columns.filter((col) => !col.visible).length}
      />
    </>
  );
}
