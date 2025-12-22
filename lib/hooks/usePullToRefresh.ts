/**
 * Pull-to-Refresh Hook
 * Detects when user pulls down on mobile and triggers refresh
 * Desktop: Disabled automatically
 * Mobile: Works on touch devices
 */

import { useState, useCallback, useRef, useEffect } from "react";

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  triggerDistance?: number; // pixels to pull before triggering (default: 80)
  resistance?: number; // friction as you pull (0-1, default: 0.7)
}

interface PullToRefreshState {
  isPulling: boolean;
  pullDistance: number;
  isRefreshing: boolean;
}

export function usePullToRefresh({
  onRefresh,
  triggerDistance = 80,
  resistance = 0.7,
}: UsePullToRefreshOptions) {
  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    pullDistance: 0,
    isRefreshing: false,
  });

  const startYRef = useRef(0);
  const touchStartedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate progress percentage (0-100)
  const progress = Math.min((state.pullDistance / triggerDistance) * 100, 100);
  const shouldTrigger = state.pullDistance >= triggerDistance;

  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Only start if scrolled to top
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    if (scrollTop !== 0) return;

    startYRef.current = e.touches[0].clientY;
    touchStartedRef.current = true;
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!touchStartedRef.current) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - startYRef.current;

      // Only process if moving downward
      if (diff > 0) {
        // Apply resistance for natural feel
        const resistedDistance = diff * resistance;
        setState((prev) => ({
          ...prev,
          isPulling: true,
          pullDistance: resistedDistance,
        }));
      }
    },
    [resistance]
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
      passive: true,
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
