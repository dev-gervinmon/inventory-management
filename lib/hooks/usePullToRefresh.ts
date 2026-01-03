/**
 * Pull-to-Refresh Hook
 * Detects when user pulls down on mobile and triggers refresh action
 *
 * Features:
 * - Mobile-only: Desktop automatically disabled
 * - Scroll-aware: Only triggers at top of page
 * - Resistance: Natural deceleration as you pull
 * - Performance: Passive event listeners for smooth 60fps
 *
 * @example
 * const { containerRef, isPulling, progress, shouldTrigger, isRefreshing }
 *   = usePullToRefresh({ onRefresh: () => refetch(), triggerDistance: 80 })
 */

import { useState, useCallback, useRef, useEffect } from "react";

// Configuration constants
const PTR_HOOK_CONFIG = {
  DEFAULT_TRIGGER_DISTANCE: 80, // pixels
  DEFAULT_RESISTANCE: 0.7, // 0-1, lower = more resistance
} as const;

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  triggerDistance?: number; // pixels to pull before triggering
  resistance?: number; // friction as you pull (0-1)
}

interface PullToRefreshState {
  isPulling: boolean;
  pullDistance: number;
  isRefreshing: boolean;
}

export function usePullToRefresh({
  onRefresh,
  triggerDistance = PTR_HOOK_CONFIG.DEFAULT_TRIGGER_DISTANCE,
  resistance = PTR_HOOK_CONFIG.DEFAULT_RESISTANCE,
}: UsePullToRefreshOptions) {
  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    pullDistance: 0,
    isRefreshing: false,
  });

  const startYRef = useRef(0);
  const touchStartedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isRefreshingRef = useRef(false);
  useEffect(() => {
    isRefreshingRef.current = state.isRefreshing;
  }, [state.isRefreshing]);

  // Calculate progress percentage (0-100)
  const progress = Math.min((state.pullDistance / triggerDistance) * 100, 100);
  const shouldTrigger = state.pullDistance >= triggerDistance;

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (isRefreshingRef.current) return;

    // Only start pull-to-refresh if scrolled to top of page
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    if (scrollTop !== 0) return;

    if (e.touches.length !== 1) return;

    startYRef.current = e.touches[0].clientY;
    touchStartedRef.current = true;
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!touchStartedRef.current) return;

      // Only process if scrolled to top of page
      const scrollTop =
        window.scrollY || document.documentElement.scrollTop || 0;
      if (scrollTop !== 0) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - startYRef.current;

      // Only process if moving downward
      if (diff > 0) {
        // Prevent the browser's native overscroll / pull-to-refresh
        if (e.cancelable) e.preventDefault();

        // Apply resistance for natural feel
        const resistedDistance = Math.min(
          diff * resistance,
          triggerDistance * 1.5
        );
        setState((prev) => ({
          ...prev,
          isPulling: true,
          pullDistance: resistedDistance,
        }));
      } else if (state.isPulling || state.pullDistance !== 0) {
        setState((prev) => ({
          ...prev,
          isPulling: false,
          pullDistance: 0,
        }));
      }
    },
    [resistance, triggerDistance, state.isPulling, state.pullDistance]
  );

  const handleTouchEnd = useCallback(async () => {
    touchStartedRef.current = false;

    if (shouldTrigger && !state.isRefreshing) {
      setState((prev) => ({
        ...prev,
        isRefreshing: true,
        isPulling: false,
      }));

      try {
        await onRefresh();
      } catch (error) {
        console.error("Pull-to-refresh error:", error);
      }

      // Reset after refresh completes
      setState({
        isPulling: false,
        pullDistance: 0,
        isRefreshing: false,
      });
    } else {
      // Reset if didn't reach trigger distance
      setState({
        isPulling: false,
        pullDistance: 0,
        isRefreshing: false,
      });
    }
  }, [shouldTrigger, state.isRefreshing, onRefresh]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if device is touch-capable
    const isTouchDevice = () =>
      (typeof window !== "undefined" &&
        ("ontouchstart" in window || navigator.maxTouchPoints > 0)) ||
      false;

    if (!isTouchDevice()) return;

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, {
      passive: true,
    });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    containerRef,
    isPulling: state.isPulling,
    pullDistance: state.pullDistance,
    progress,
    shouldTrigger,
    isRefreshing: state.isRefreshing,
  };
}
