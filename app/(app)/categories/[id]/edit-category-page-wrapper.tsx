"use client";

import NavigationOverlay from "@/components/layout/navigation-overlay";
import { NavigationTransitionProvider } from "@/lib/contexts/navigation-transition-context";
import { ReactNode } from "react";

interface EditCategoryPageWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper for Edit Category Page
 * Provides navigation transition context and overlay
 */
export default function EditCategoryPageWrapper({
  children,
}: EditCategoryPageWrapperProps) {
  return (
    <NavigationTransitionProvider>
      <NavigationOverlay overlayMessage="Going back to categories...">
        {children}
      </NavigationOverlay>
    </NavigationTransitionProvider>
  );
}
