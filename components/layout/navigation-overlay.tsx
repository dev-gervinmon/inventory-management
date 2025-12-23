"use client";

import { useNavigationTransition } from "@/lib/contexts/navigation-transition-context";
import { ReactNode } from "react";

interface NavigationOverlayProps {
  children: ReactNode;
  overlayMessage?: string;
}

/**
 * Navigation Overlay Component
 * Shows an overlay with loading state during page navigation
 * Prevents user interaction while loading
 *
 * @param children - Page content to wrap
 * @param overlayMessage - Custom message to show during loading
 */
export default function NavigationOverlay({
  children,
  overlayMessage = "Loading...",
}: NavigationOverlayProps) {
  const { isNavigating } = useNavigationTransition();

  return (
    <div className="relative">
      {children}

      {/* Navigation Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-auto">
          <div className="flex flex-col items-center gap-4">
            {/* Loading Spinner */}
            <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin" />
            <p className="text-sm font-medium text-gray-700">
              {overlayMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
