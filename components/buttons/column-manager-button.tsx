"use client";

import { Settings } from "lucide-react";
import TouchOptimizedIconButton from "@/components/buttons/touch-optimized-icon-button";

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
    <TouchOptimizedIconButton
      onClick={onClick}
      label="Manage columns"
      variant="secondary"
      size="md"
      className={className}
      icon={
        <Settings
          className={`w-5 h-5 shrink-0 ${
            isCustomized ? "text-(--brand)" : "text-(--text-muted)"
          }`}
        />
      }
    />
  );
}
