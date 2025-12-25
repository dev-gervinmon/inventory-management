"use client";

import NavigationOverlay from "@/components/layout/navigation-overlay";
import { NavigationTransitionProvider } from "@/lib/contexts/navigation-transition-context";
import { ReactNode } from "react";

interface InventoryPageWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper for Inventory Page
 * Provides navigation transition context and overlay
 */
export default function InventoryPageWrapper({
  children,
}: InventoryPageWrapperProps) {
  return (
    <NavigationTransitionProvider>
      <NavigationOverlay overlayMessage="Opening product...">
        {children}
      </NavigationOverlay>
    </NavigationTransitionProvider>
  );
}
