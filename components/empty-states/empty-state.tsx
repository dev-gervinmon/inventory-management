/**
 * Base Empty State Component
 * Reusable empty state placeholder with icon, title, and action
 */

import { ReactNode } from "react";
import Link from "next/link";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
  compact?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  compact = false,
}: EmptyStateProps) {
  const containerClass = compact ? "py-8 sm:py-12" : "py-12 sm:py-16 md:py-20";
  const iconClass = compact
    ? "w-12 h-12 sm:w-16 sm:h-16"
    : "w-16 h-16 sm:w-24 sm:h-24";
  const titleClass = compact
    ? "text-lg sm:text-xl"
    : "text-xl sm:text-2xl md:text-3xl";

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${containerClass}`}
    >
      {/* Icon */}
      {icon && (
        <div
          className={`text-gray-300 mb-4 sm:mb-6 flex items-center justify-center ${iconClass}`}
        >
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className={`${titleClass} font-bold text-gray-900 mb-2 sm:mb-3`}>
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm sm:text-base text-gray-600 max-w-sm px-4 mb-6 sm:mb-8">
        {description}
      </p>

      {/* Action Button */}
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
