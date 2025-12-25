"use client";

import NavigationOverlay from "@/components/layout/navigation-overlay";
import { NavigationTransitionProvider } from "@/lib/contexts/navigation-transition-context";
import { ReactNode } from "react";

interface CategoriesPageWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper for Categories Page
 * Provides navigation transition context and overlay
 */
export default function CategoriesPageWrapper({
  children,
}: CategoriesPageWrapperProps) {
  return (
    <NavigationTransitionProvider>
      <NavigationOverlay overlayMessage="Opening category...">
        {children}
      </NavigationOverlay>
    </NavigationTransitionProvider>
  );
}
