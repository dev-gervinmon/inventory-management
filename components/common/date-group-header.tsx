import type { DateGroupLabel } from "@/lib/utils/activities";

interface DateGroupHeaderProps {
  label: DateGroupLabel;
  itemCount?: number;
}

/**
 * Reusable date group header component
 * Can be used in any page that displays grouped items by date
 * Automatically applies consistent styling and formatting
 */
export default function DateGroupHeader({
  label,
  itemCount,
}: DateGroupHeaderProps) {
  const getGroupIcon = (label: DateGroupLabel): string => {
    switch (label) {
      case "Today":
        return "📅";
      case "Yesterday":
        return "📆";
      case "This Week":
        return "📋";
      case "Last Week":
        return "📜";
      case "Older":
        return "📭";
      default:
        return "📋";
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-linear-to-r from-gray-50 to-white px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getGroupIcon(label)}</span>
          <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
          {itemCount !== undefined && (
            <span className="text-xs text-gray-500 font-medium">
              ({itemCount})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
