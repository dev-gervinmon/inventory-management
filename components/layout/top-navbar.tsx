"use client";

import { ReactNode } from "react";
import { UserButton } from "@stackframe/stack";
import { BarChart3 } from "lucide-react";

interface TopNavBarProps {
  children?: ReactNode;
}

/**
 * TopNavBar Component
 * Provides a sticky, full-width top navigation bar for global actions and navigation.
 * Place your navigation links, logo, notification button, user menu, etc. as children.
 */
export default function TopNavBar({ children }: TopNavBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo or navigation links */}
        <div className="flex items-center gap-4 min-w-0">
          {/* Temporary logo: BarChart3 icon */}
          <BarChart3 className="w-8 h-8 shrink-0 text-purple-600" />
        </div>
        {/* Center: Custom content */}
        <div className="flex-1 flex justify-center items-center min-w-0">
          {/* App title for large screens */}
          <span className="hidden lg:block text-xl font-semibold truncate select-none text-gray-900 dark:text-white">
            Inventory App
          </span>
          {children}
        </div>
        {/* Right: Actions (notifications, user menu, etc.) */}
        <div className="flex items-center gap-4 min-w-0 justify-end">
          {/* User button: rightmost, image only */}
          <UserButton />
        </div>
      </div>
    </header>
  );
}
