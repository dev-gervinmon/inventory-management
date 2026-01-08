"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import ColumnManagerButton from "@/components/buttons/column-manager-button";
import ColumnManagerModal from "@/components/modals/column-manager-modal";
import {
  useColumnVisibility,
  type ColumnVisibility,
} from "@/lib/hooks/useColumnVisibility";
import CategoriesTable from "@/components/tables/categories-table";
import { usePullToRefreshLoading } from "@/lib/contexts/pull-to-refresh-context";
import { TableRowSkeleton } from "@/components/skeletons/generic-skeletons";
import FormButton from "@/components/buttons/form-button";
import CategoryDrawer, {
  type DrawerCategory,
} from "@/components/page-specific/categories/category-drawer";

interface Category {
  id: string;
  name: string;
  createdAt: Date;
  subcategories: Array<{
    id: string;
    name: string;
    createdAt: Date;
    categoryId: string;
  }>;
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
  const [categories, setCategories] = useState<DrawerCategory[]>(
    initialCategories as unknown as DrawerCategory[]
  );
  const pathname = usePathname();
  const searchParams = useSearchParams();

  type DrawerState =
    | { isOpen: false }
    | { isOpen: true; mode: "create" }
    | { isOpen: true; mode: "edit"; categoryId: string };

  const parseDrawerState = (params: URLSearchParams): DrawerState => {
    if (params.get("drawer") !== "category") return { isOpen: false };
    const mode = params.get("mode") === "edit" ? "edit" : "create";
    if (mode === "edit") {
      const id = params.get("id");
      if (!id) return { isOpen: true, mode: "create" };
      return { isOpen: true, mode: "edit", categoryId: id };
    }
    return { isOpen: true, mode: "create" };
  };

  const initialDrawerState = useMemo(
    () => parseDrawerState(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );

  const [drawer, setDrawer] = useState<DrawerState>(initialDrawerState);

  const setDrawerUrl = (next: URLSearchParams, replace: boolean) => {
    const qs = next.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    if (replace) {
      window.history.replaceState({}, "", url);
    } else {
      window.history.pushState({}, "", url);
    }
  };

  // Keep drawer state in sync with browser back/forward.
  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      setDrawer(parseDrawerState(params));
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // If Next navigation brings us here with different search params (e.g. via link),
  // sync the local drawer state.
  useEffect(() => {
    setDrawer(initialDrawerState);
  }, [initialDrawerState]);

  const selectedCategory = useMemo(() => {
    if (!drawer.isOpen || drawer.mode !== "edit") return null;
    return categories.find((c) => c.id === drawer.categoryId) ?? null;
  }, [drawer, categories]);

  const openCreateDrawer = () => {
    setDrawer({ isOpen: true, mode: "create" });
    const next = new URLSearchParams(window.location.search);
    next.set("drawer", "category");
    next.set("mode", "create");
    next.delete("id");
    setDrawerUrl(next, false);
  };

  const openEditDrawer = (categoryId: string) => {
    setDrawer({ isOpen: true, mode: "edit", categoryId });
    const next = new URLSearchParams(window.location.search);
    next.set("drawer", "category");
    next.set("mode", "edit");
    next.set("id", categoryId);
    setDrawerUrl(next, false);
  };

  const closeDrawer = () => {
    setDrawer({ isOpen: false });
    const next = new URLSearchParams(window.location.search);
    next.delete("drawer");
    next.delete("mode");
    next.delete("id");
    setDrawerUrl(next, true);
  };

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
          Categories ({categories.length})
        </h2>
        <div className="flex items-center gap-2">
          <FormButton
            type="button"
            label="Add Category"
            variant="primary"
            size="sm"
            onClick={openCreateDrawer}
          />
          <ColumnManagerButton
            onClick={() => setShowColumnManager(true)}
            isCustomized={isCustomizedWithHydration}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: Math.max(3, categories.length) }).map(
            (_, i) => (
              <TableRowSkeleton key={i} columns={4} />
            )
          )}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center">
          <p className="text-(--text-muted)">
            No categories yet. Create one to get started!
          </p>
        </div>
      ) : (
        <CategoriesTable
          categories={categories}
          visibleColumns={visibleColumns}
          onOpenCategory={openEditDrawer}
          onCategoriesChange={setCategories}
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

      <CategoryDrawer
        isOpen={drawer.isOpen}
        mode={drawer.isOpen ? drawer.mode : "create"}
        category={selectedCategory}
        onClose={closeDrawer}
        onCategoriesChange={setCategories}
      />
    </>
  );
}
