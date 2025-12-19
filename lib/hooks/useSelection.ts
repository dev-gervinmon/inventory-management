import { useState, useCallback, useMemo } from "react";

interface UseSelectionOptions {
  initialSelected?: string[];
}

export function useSelection(options: UseSelectionOptions = {}) {
  const { initialSelected = [] } = options;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(initialSelected)
  );

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const toggleMany = useCallback((ids: string[]) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      ids.forEach((id) => {
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
      });
      return newSet;
    });
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const count = useMemo(() => selectedIds.size, [selectedIds]);

  const getSelected = useCallback(() => Array.from(selectedIds), [selectedIds]);

  return {
    selectedIds,
    setSelectedIds,
    toggle,
    toggleMany,
    selectAll,
    deselectAll,
    isSelected,
    count,
    getSelected,
    hasSelected: count > 0,
    isEmpty: count === 0,
  };
}
