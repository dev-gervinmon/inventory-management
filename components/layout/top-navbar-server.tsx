// components/layout/top-navbar-server.tsx
import { UserButton } from "@stackframe/stack";
import { BarChart3 } from "lucide-react";
import NotificationButtonWrapper from "../wrappers/notification-button-wrapper";

export default function TopNavBarServer() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="w-full h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 min-w-0">
          <BarChart3 className="w-8 h-8 shrink-0 text-purple-600" />
          <span className="hidden lg:block text-xl font-semibold truncate select-none text-gray-900 dark:text-white">
            Inventory App
          </span>
        </div>

        <div className="flex items-center gap-4 min-w-0 justify-end">
          <NotificationButtonWrapper />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
