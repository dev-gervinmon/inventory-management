import { useState, useCallback } from "react";

/**
 * Column visibility configuration
 * Supports mobile/responsive defaults and persistence
 */
export interface ColumnVisibility {
  id: string;
  label: string;
  visible: boolean;
  essential: boolean; // Always show on mobile if true
  mobileHidden?: boolean; // Default hidden on mobile
  sortable?: boolean;
  resizable?: boolean;
}

interface UseColumnVisibilityProps {
  tableId: string;
  defaultColumns: ColumnVisibility[];
  storageKey?: string;
}

/**
 * Hook for managing table column visibility
 * Features:
 * - Persistent localStorage management
 * - Mobile/desktop responsive defaults
 * - Flexible for future extensions
 *
 * @example
 * const {
 *   columns,
 *   visibleColumns,
 *   toggleColumn,
 *   showAll,
 *   hideNonEssential,
 *   resetDefaults,
 *   hiddenCount,
 * } = useColumnVisibility({
 *   tableId: "categories",
 *   defaultColumns: [
 *     { id: "name", label: "Name", visible: true, essential: true },
 *     { id: "products", label: "Products", visible: true, essential: true },
 *     { id: "subcategories", label: "Subcategories", visible: false, essential: false, mobileHidden: true },
 *   ],
 * });
 */
export function useColumnVisibility({
  tableId,
  defaultColumns,
  storageKey = "table_column_visibility",
}: UseColumnVisibilityProps) {
  // Initialize state from localStorage directly
  const [columns, setColumns] = useState<ColumnVisibility[]>(() => {
    // Only access localStorage in the browser
    if (typeof window === "undefined") {
      return defaultColumns;
    }

    const storedConfig = localStorage.getItem(`${storageKey}_${tableId}`);

    if (storedConfig) {
      try {
        const parsedConfig = JSON.parse(storedConfig);
        // Merge with defaults to handle new columns added later
        return defaultColumns.map((col) => ({
          ...col,
          visible:
            parsedConfig[col.id] !== undefined
              ? parsedConfig[col.id]
              : col.visible,
        }));
      } catch (error) {
        console.error("Failed to parse column visibility config:", error);
        return defaultColumns;
      }
    }

    return defaultColumns;
  });
  const [isLoading] = useState(false);

  // Save to localStorage whenever columns change
  const saveToStorage = useCallback(
    (newColumns: ColumnVisibility[]) => {
      // Only save to localStorage in the browser
      if (typeof window === "undefined") {
        return;
      }

      const config: Record<string, boolean> = {};
      newColumns.forEach((col) => {
        config[col.id] = col.visible;
      });
      localStorage.setItem(`${storageKey}_${tableId}`, JSON.stringify(config));
    },
    [tableId, storageKey]
  );

  // Toggle visibility of a single column
  const toggleColumn = useCallback(
    (columnId: string) => {
      setColumns((prev) => {
        const updated = prev.map((col) =>
          col.id === columnId ? { ...col, visible: !col.visible } : col
        );
        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage]
  );

  // Show all columns
  const showAll = useCallback(() => {
    setColumns((prev) => {
      const updated = prev.map((col) => ({ ...col, visible: true }));
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // Hide non-essential columns
  const hideNonEssential = useCallback(() => {
    setColumns((prev) => {
      const updated = prev.map((col) => ({
        ...col,
        visible: col.essential,
      }));
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // Reset to defaults
  const resetDefaults = useCallback(() => {
    setColumns(defaultColumns);
    // Only remove from localStorage in the browser
    if (typeof window !== "undefined") {
      localStorage.removeItem(`${storageKey}_${tableId}`);
    }
  }, [tableId, storageKey, defaultColumns]);

  // Get only visible columns
  const visibleColumns = columns.filter((col) => col.visible);

  // Count of hidden columns
  const hiddenCount = columns.filter((col) => !col.visible).length;

  // Check if columns are in custom (non-default) state
  const isCustomized = columns.some(
    (col, idx) => col.visible !== defaultColumns[idx].visible
  );

  return {
    columns,
    visibleColumns,
    toggleColumn,
    showAll,
    hideNonEssential,
    resetDefaults,
    hiddenCount,
    isCustomized,
    isLoading,
  };
}
