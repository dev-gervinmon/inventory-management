"use client";

import NavigationOverlay from "@/components/layout/navigation-overlay";
import { NavigationTransitionProvider } from "@/lib/contexts/navigation-transition-context";
import { ReactNode } from "react";

interface EditProductPageWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper for Edit Product Page
 * Provides navigation transition context and overlay
 */
export default function EditProductPageWrapper({
  children,
}: EditProductPageWrapperProps) {
  return (
    <NavigationTransitionProvider>
      <NavigationOverlay overlayMessage="Going back to Inventory">
        {children}
      </NavigationOverlay>
    </NavigationTransitionProvider>
  );
}
