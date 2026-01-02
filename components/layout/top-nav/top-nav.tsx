// components/layout/top-navbar-server.tsx
import NotificationButtonWrapper from "@/components/layout/top-nav/notification-button-wrapper";
import { UserButton } from "@stackframe/stack";
import MobileMenuButton from "./mobile-menu-button";

export default function TopNavBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-gray-950/95 backdrop-blur supports-backdrop-filter:bg-gray-950/80 shadow-xl">
      <div className="relative w-full h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 min-w-0">
          <MobileMenuButton />
        </div>

        <div className="flex items-center gap-3 min-w-0 justify-end">
          <div className="flex items-center gap-2 rounded-2xl bg-white/4 ring-1 ring-white/12 px-2 py-1">
            <NotificationButtonWrapper />
            <div className="h-6 w-px bg-white/10" aria-hidden />
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}
