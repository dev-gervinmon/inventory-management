"use client";

import Sidebar from "./sidebar-unified";
import TopNavBar from "./top-navbar";
import { useState } from "react";

interface PageLayoutProps {
  children: React.ReactNode;
  currentPath: string;
}

/**
 * PageLayout Component
 * Provides consistent layout for all pages with:
 * - Mobile/Tablet hamburger sidebar handling
 * - Desktop permanent sidebar
 * - Proper spacing and margins for all screen sizes
 * - Single source of truth for navbar spacing
 *
 * Usage:
 * <PageLayout currentPath="/inventory">
 *   <YourPageContent />
 * </PageLayout>
 */
function PageLayout({ children, currentPath }: PageLayoutProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        currentPath={currentPath}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <TopNavBar onMobileMenu={() => setMobileOpen(true)} />
      <main
        className={
          "px-4 sm:px-6 md:px-8 py-2 sm:py-4 md:py-8 mt-16 sm:mt-16 lg:mt-12"
        }
        style={{
          transition: "margin-left 0.45s cubic-bezier(0.4,0,0.2,1)",
          marginLeft:
            typeof window !== "undefined" && window.innerWidth < 1024
              ? 0
              : collapsed
              ? "5rem"
              : "10rem",
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default PageLayout;
