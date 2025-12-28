"use client";

import Sidebar from "./sidebar-unified";

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
export default function PageLayout({ children, currentPath }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath={currentPath} />
      <main className="lg:ml-64 px-4 sm:px-6 md:px-8 py-2 sm:py-4 md:py-8 mt-16 sm:mt-16 lg:mt-0">
        {children}
      </main>
    </div>
  );
}
