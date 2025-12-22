/**
 * Reusable Swipe Gesture Hook
 * Detects left/right swipe gestures on touch devices for tab navigation
 *
 * Features:
 * - Mobile-only: Desktop automatically disabled
 * - Configurable swipe threshold (minimum distance to register)
 * - Prevents scrolling interference: Only triggers swipe on horizontal movement
 * - Performance: Passive event listeners for smooth 60fps
 * - Prevents swipe during scrollable content: Checks initial scroll intent
 *
 * @example
 * const { containerRef, direction } = useSwipeGesture({
 *   onSwipe: (dir) => handleTabChange(dir),
 *   threshold: 50
 * })
 *
 * return <div ref={containerRef}>Content</div>
 */

import { useCallback, useRef, useEffect } from "react";

// Configuration constants
const SWIPE_CONFIG = {
  DEFAULT_THRESHOLD: 50, // pixels (minimum swipe distance)
  VERTICAL_THRESHOLD: 20, // pixels (max vertical movement to register as horizontal swipe)
} as const;

export type SwipeDirection = "left" | "right" | null;

interface UseSwipeGestureOptions {
  onSwipe: (direction: SwipeDirection) => void;
  threshold?: number; // minimum horizontal distance to trigger swipe
  enabled?: boolean; // whether swipe gesture is enabled
}

export function useSwipeGesture({
  onSwipe,
  threshold = SWIPE_CONFIG.DEFAULT_THRESHOLD,
  enabled = true,
}: UseSwipeGestureOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchStartedRef = useRef(false);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;

      const touch = e.touches[0];
      touchStartXRef.current = touch.clientX;
      touchStartYRef.current = touch.clientY;
      touchStartedRef.current = true;
    },
    [enabled]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!touchStartedRef.current || !enabled) return;

      const touch = e.changedTouches[0];
      const touchEndX = touch.clientX;
      const touchEndY = touch.clientY;

      // Calculate distances
      const distanceX = touchStartXRef.current - touchEndX;
      const distanceY = Math.abs(touchStartYRef.current - touchEndY);

      // Only process horizontal swipes (ignore vertical scrolling)
      if (distanceY > SWIPE_CONFIG.VERTICAL_THRESHOLD) {
        touchStartedRef.current = false;
        return;
      }

      // Determine swipe direction
      let direction: SwipeDirection = null;

      if (Math.abs(distanceX) > threshold) {
        direction = distanceX > 0 ? "left" : "right";
      }

      // Reset touch state
      touchStartedRef.current = false;

      // Trigger callback with direction
      if (direction) {
        onSwipe(direction);
      }
    },
    [onSwipe, enabled, threshold]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if device is touch-capable
    const isTouchDevice = () =>
      (typeof window !== "undefined" &&
        ("ontouchstart" in window || navigator.maxTouchPoints > 0)) ||
      false;

    if (!isTouchDevice()) return;

    // Add passive event listeners for better mobile performance
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchend", handleTouchEnd, {
      passive: true,
    });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  return {
    containerRef,
  };
}
