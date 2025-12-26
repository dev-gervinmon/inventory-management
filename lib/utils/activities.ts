/**
 * Utility functions for activity formatting and display
 */

import { ACTION_TYPE_MAP } from "@/lib/constants/activities";
import type { ActionType } from "@/lib/types/activities";

export type DateGroupLabel =
  | "Today"
  | "Yesterday"
  | "This Week"
  | "Last Week"
  | "Older";

export interface GroupedItem<T> {
  date: DateGroupLabel;
  items: T[];
}

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

/**
 * Determine the date group label for a given date
 * Used for grouping items by time periods
 */
export function getDateGroupLabel(dateString: string): DateGroupLabel {
  const date = new Date(dateString);
  const now = new Date();

  // Reset time parts to compare dates
  const dateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diff = nowOnly.getTime() - dateOnly.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Today
  if (days === 0) {
    return "Today";
  }

  // Yesterday
  if (days === 1) {
    return "Yesterday";
  }

  // This week (last 7 days)
  if (days > 1 && days <= 7) {
    return "This Week";
  }

  // Last week (7-14 days ago)
  if (days > 7 && days <= 14) {
    return "Last Week";
  }

  // Older than 2 weeks
  return "Older";
}

/**
 * Group items by date periods
 * Useful for organizing activities, logs, or any time-based items
 *
 * @param items - Array of items with a `createdAt` or similar date field
 * @param dateField - The field name containing the date string (default: "createdAt")
 * @returns Array of grouped items with date labels, in chronological order
 *
 * @example
 * const activities = [...];
 * const grouped = groupItemsByDate(activities, "createdAt");
 * // Returns: [
 * //   { date: "Today", items: [...] },
 * //   { date: "Yesterday", items: [...] },
 * //   { date: "This Week", items: [...] }
 * // ]
 */
export function groupItemsByDate<T extends { createdAt: string }>(
  items: T[],
  dateField: keyof T = "createdAt" as keyof T
): GroupedItem<T>[] {
  const groups = new Map<DateGroupLabel, T[]>();

  // Initialize all possible groups in order
  const groupOrder: DateGroupLabel[] = [
    "Today",
    "Yesterday",
    "This Week",
    "Last Week",
    "Older",
  ];
  groupOrder.forEach((group) => {
    groups.set(group, []);
  });

  // Group items
  items.forEach((item) => {
    const dateString = item[dateField] as string;
    const groupLabel = getDateGroupLabel(dateString);
    groups.get(groupLabel)?.push(item);
  });

  // Convert to array and filter out empty groups, maintaining order
  return groupOrder
    .map((label) => ({
      date: label,
      items: groups.get(label) || [],
    }))
    .filter((group) => group.items.length > 0);
}
