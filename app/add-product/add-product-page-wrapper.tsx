"use client";

import NavigationOverlay from "@/components/layout/navigation-overlay";
import { NavigationTransitionProvider } from "@/lib/contexts/navigation-transition-context";
import { ReactNode } from "react";

interface AddProductPageWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper for Add Product Page
 * Provides navigation transition context and overlay
 */
export default function AddProductPageWrapper({
  children,
}: AddProductPageWrapperProps) {
  return (
    <NavigationTransitionProvider>
      <NavigationOverlay overlayMessage="Going back to Inventory">
        {children}
      </NavigationOverlay>
    </NavigationTransitionProvider>
  );
}
