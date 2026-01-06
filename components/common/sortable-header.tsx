import { SortDirection } from "@/lib/hooks/useSort";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentSortKey: string | null;
  sortDirection: SortDirection;
  onSort: (key: string) => void;
  className?: string;
}

export default function SortableHeader({
  label,
  sortKey,
  currentSortKey,
  sortDirection,
  onSort,
  className = "",
}: SortableHeaderProps) {
  const isSorted = currentSortKey === sortKey;
  const ariaSort: React.AriaAttributes["aria-sort"] = isSorted
    ? sortDirection === "asc"
      ? "ascending"
      : "descending"
    : "none";

  return (
    <th
      aria-sort={ariaSort}
      className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left ${className}`}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="group inline-flex w-full cursor-pointer select-none items-center gap-2 rounded-lg py-1 text-left transition-colors hover:bg-(--surface-elevated)/25 active:bg-(--surface-elevated)/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40"
      >
        <span className="text-xs md:text-sm font-semibold text-(--text-primary)">
          {label}
        </span>

        <span className="ml-auto inline-flex h-4 w-4 items-center justify-center transition-opacity">
          {isSorted ? (
            sortDirection === "asc" ? (
              <ArrowUp className="h-4 w-4 text-(--brand)" />
            ) : (
              <ArrowDown className="h-4 w-4 text-(--brand)" />
            )
          ) : (
            <ArrowUpDown className="h-4 w-4 text-(--text-muted) opacity-40 group-hover:opacity-70" />
          )}
        </span>
      </button>
    </th>
  );
}
