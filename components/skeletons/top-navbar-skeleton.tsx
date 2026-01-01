import { Skeleton } from "../skeletons/skeleton";
import { BarChart3 } from "lucide-react";
import { UserButton } from "@stackframe/stack";
import NotificationButton from "../layout/top-nav/notification-button";

/**
 * TopNavBarSkeleton
 * Skeleton placeholder for the top navigation bar during loading states.
 */
export function TopNavBarSkeleton() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="w-full h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Hamburger (mobile) + Logo + Title */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Hamburger skeleton */}
          <Skeleton className="lg:hidden h-10 w-10 rounded-lg mr-1" />
          {/* Logo */}
          <BarChart3 className="w-8 h-8 shrink-0 text-purple-600" />
          {/* Title */}
          <span className="hidden lg:block text-xl font-semibold truncate select-none text-gray-900 dark:text-white">
            Inventory App
          </span>
        </div>
        {/* Right: Notification + User button skeletons */}
        <div className="flex items-center gap-4 min-w-0 justify-end">
          {/* Notification button (real component, empty data) */}
          <NotificationButton stockItems={[]} activities={[]} />
          {/* User button (if possible, otherwise fallback to skeleton) */}
          <span className="hidden md:inline">
            <UserButton />
          </span>
          <span className="md:hidden">
            <Skeleton className="h-8 w-8 rounded-full" />
          </span>
        </div>
      </div>
    </header>
  );
}
