// components/layout/top-navbar-server.tsx
import NotificationButtonWrapper from "@/components/layout/top-nav/notification-button-wrapper";
import MobileMenuButton from "./mobile-menu-button";
import ThemeToggleButton from "@/components/layout/top-nav/theme-toggle-button";
import UserButtonClientOnly from "@/components/layout/top-nav/user-button-client-only";

export default function TopNavBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-glass border-b border-(--border-subtle) shadow-xl">
      <div className="relative w-full h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 min-w-0">
          <MobileMenuButton />
        </div>

        <div className="flex items-center gap-3 min-w-0 justify-end">
          <div className="flex items-center gap-2 rounded-2xl bg-(--surface-elevated)/60 ring-1 ring-(--border-subtle) px-2 py-1">
            <ThemeToggleButton />
            <NotificationButtonWrapper />
            <div className="h-6 w-px bg-(--border-subtle)" aria-hidden />
            <UserButtonClientOnly />
          </div>
        </div>
      </div>
    </header>
  );
}
