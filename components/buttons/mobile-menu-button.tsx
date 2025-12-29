"use client";

import { Menu } from "lucide-react";

export default function MobileMenuButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      className="lg:hidden p-2 mr-1 rounded-lg border border-gray-300
                 dark:border-gray-700 bg-white dark:bg-gray-900
                 hover:bg-gray-100 dark:hover:bg-gray-800
                 focus:outline-none focus:ring-2 focus:ring-purple-500
                 transition-all duration-150 shadow-sm"
      aria-label="Open menu"
      onClick={onOpen}
    >
      <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
    </button>
  );
}
