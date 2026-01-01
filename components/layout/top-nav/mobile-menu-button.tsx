"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

export default function MobileMenuButton() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="fixed top-0 left-0 z-50 h-16 flex items-center px-4 lg:hidden">
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        className="lg:hidden p-2 mr-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150 shadow-sm"
      >
        {mobileOpen && (
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200 transition-transform duration-200 group-hover:scale-110" />
        )}
      </button>
    </div>
  );
}
