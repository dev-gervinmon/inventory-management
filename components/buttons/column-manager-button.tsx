"use client";

import { Settings } from "lucide-react";

interface ColumnManagerButtonProps {
  onClick: () => void;
  isCustomized: boolean;
  className?: string;
}

/**
 * Column Manager Button
 * Compact icon button to open column visibility modal
 *
 * Features:
 * - Simple icon-only design
 * - Color indicates customization state (gray = default, purple = customized)
 * - Touch-optimized (44px+ touch target)
 */
export default function ColumnManagerButton({
  onClick,
  isCustomized,
  className = "",
}: ColumnManagerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors duration-200 cursor-pointer hover:bg-gray-100 active:bg-gray-200 ${className}`}
      title="Manage columns"
      aria-label="Manage column visibility"
    >
      <Settings
        className={`w-5 h-5 shrink-0 transition-colors duration-200 ${
          isCustomized ? "text-purple-600" : "text-gray-400"
        }`}
      />
    </button>
  );
}
