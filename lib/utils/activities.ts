/**
 * Utility functions for activity formatting and display
 */

import { ACTION_TYPE_MAP } from "@/lib/constants/activities";
import type { ActionType } from "@/lib/types/activities";

/**
 * Format action type for display with label, emoji, and color
 */
export function formatActionType(actionType: ActionType) {
  return (
    ACTION_TYPE_MAP[actionType] || {
      label: actionType,
      emoji: "📋",
      color: "bg-gray-100 text-gray-700",
    }
  );
}

/**
 * Format date for relative display (e.g., "2 hours ago")
 * Falls back to absolute date for older entries (> 7 days)
 */
export function formatActivityDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
}
