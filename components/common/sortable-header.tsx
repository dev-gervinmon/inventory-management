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

  return (
    <th
      className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left cursor-pointer group hover:bg-gray-100 transition ${className}`}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs md:text-sm font-semibold text-gray-900">
          {label}
        </span>
        <div className="w-4 h-4 flex items-center justify-center transition">
          {isSorted ? (
            <>
              {sortDirection === "asc" ? (
                <ArrowUp className="w-4 h-4 text-purple-600" />
              ) : (
                <ArrowDown className="w-4 h-4 text-purple-600" />
              )}
            </>
          ) : (
            <ArrowUpDown className="w-4 h-4 text-gray-300" />
          )}
        </div>
      </div>
    </th>
  );
}
