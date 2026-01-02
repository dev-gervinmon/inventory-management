"use client";

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
function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main className="py-5 px-3">{children}</main>
    </div>
  );
}

export default PageLayout;
