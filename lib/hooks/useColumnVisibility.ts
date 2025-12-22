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
  description?: string; // Help text for the column
  isFavorited?: boolean; // Whether column is starred as favorite
  toggleCount?: number; // Track how many times toggled
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
    const storedMetadata = localStorage.getItem(
      `${storageKey}_metadata_${tableId}`
    );

    let metadata: Record<
      string,
      { isFavorited?: boolean; toggleCount?: number }
    > = {};
    if (storedMetadata) {
      try {
        metadata = JSON.parse(storedMetadata);
      } catch (error) {
        console.error("Failed to parse column metadata:", error);
      }
    }

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
          isFavorited: metadata[col.id]?.isFavorited ?? false,
          toggleCount: metadata[col.id]?.toggleCount ?? 0,
        }));
      } catch (error) {
        console.error("Failed to parse column visibility config:", error);
        return defaultColumns.map((col) => ({
          ...col,
          isFavorited: metadata[col.id]?.isFavorited ?? false,
          toggleCount: metadata[col.id]?.toggleCount ?? 0,
        }));
      }
    }

    return defaultColumns.map((col) => ({
      ...col,
      isFavorited: metadata[col.id]?.isFavorited ?? false,
      toggleCount: metadata[col.id]?.toggleCount ?? 0,
    }));
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
      const metadata: Record<
        string,
        { isFavorited?: boolean; toggleCount?: number }
      > = {};

      newColumns.forEach((col) => {
        config[col.id] = col.visible;
        metadata[col.id] = {
          isFavorited: col.isFavorited,
          toggleCount: col.toggleCount,
        };
      });

      localStorage.setItem(`${storageKey}_${tableId}`, JSON.stringify(config));
      localStorage.setItem(
        `${storageKey}_metadata_${tableId}`,
        JSON.stringify(metadata)
      );
    },
    [tableId, storageKey]
  );

  // Toggle visibility of a single column
  const toggleColumn = useCallback(
    (columnId: string) => {
      setColumns((prev) => {
        const updated = prev.map((col) =>
          col.id === columnId
            ? {
                ...col,
                visible: !col.visible,
                toggleCount: (col.toggleCount ?? 0) + 1,
              }
            : col
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

  // Toggle favorite/star status of a column
  const toggleFavorite = useCallback(
    (columnId: string) => {
      setColumns((prev) => {
        const updated = prev.map((col) =>
          col.id === columnId ? { ...col, isFavorited: !col.isFavorited } : col
        );
        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage]
  );

  // Reset to defaults
  const resetDefaults = useCallback(() => {
    setColumns(defaultColumns);
    // Only remove from localStorage in the browser
    if (typeof window !== "undefined") {
      localStorage.removeItem(`${storageKey}_${tableId}`);
      localStorage.removeItem(`${storageKey}_metadata_${tableId}`);
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
    toggleFavorite,
    showAll,
    hideNonEssential,
    resetDefaults,
    hiddenCount,
    isCustomized,
    isLoading,
  };
}
