"use client";

import Sidebar from "@/components/layout/sidebar/sidebar";
import PullToRefreshWrapper from "@/components/layout/mobile-features/pull-to-refresh-wrapper";
import { useSidebar } from "../layout/sidebar/sidebar-context";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { isDesktopCollapsed } = useSidebar();

  return (
    <div
      className="min-h-screen bg-(--canvas)"
      style={{
        ["--sidebar-current-width" as never]: isDesktopCollapsed
          ? "var(--sidebar-width-collapsed)"
          : "var(--sidebar-width-expanded)",
      }}
    >
      <div className="grid lg:grid-cols-[auto_1fr]">
        <Sidebar />
        <main className="pt-(--top-nav-height) lg:ml-(--sidebar-current-width)">
          <div className="px-4 sm:px-6 md:px-4 pb-4">
            <div className="py-5 px-3">
              <PullToRefreshWrapper>{children}</PullToRefreshWrapper>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
