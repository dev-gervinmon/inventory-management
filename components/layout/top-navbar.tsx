import { ReactNode } from "react";
import { UserButton } from "@stackframe/stack";
import { BarChart3, Menu } from "lucide-react";
import NotificationButtonWrapper from "../wrappers/notification-button-wrapper";

interface TopNavBarProps {
  children?: ReactNode;
  onMobileMenu?: () => void;
}

/**
 * TopNavBar Component
 * Provides a sticky, full-width top navigation bar for global actions and navigation.
 * Place your navigation links, logo, notification button, user menu, etc. as children.
 */
export default function TopNavBar({ onMobileMenu }: TopNavBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="w-full h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Hamburger (mobile) + Logo + Title */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Hamburger only on mobile */}
          <button
            className="lg:hidden p-2 mr-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150 shadow-sm"
            aria-label="Open menu"
            onClick={onMobileMenu}
          >
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200 transition-transform duration-200 group-hover:scale-110" />
          </button>
          <BarChart3 className="w-8 h-8 shrink-0 text-purple-600" />
          <span className="hidden lg:block text-xl font-semibold truncate select-none text-gray-900 dark:text-white">
            Inventory App
          </span>
        </div>
        {/* Right: User button at absolute right */}
        <div className="flex items-center gap-4 min-w-0 justify-end">
          <NotificationButtonWrapper />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
