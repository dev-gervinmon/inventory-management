"use client";

/**
 * Pull-to-Refresh Container Component
 * Wraps dashboard content and handles pull-to-refresh interactions
 * Features:
 * - Arrow icon with rotation feedback based on pull distance
 * - Color transition (gray → purple → green)
 * - Checkmark animation with ping effect on completion
 * - Progress bar during pull gesture
 * - Smooth transitions and mobile-optimized performance
 */

import React, { ReactNode, useState, useEffect, useRef } from "react";
import { usePullToRefresh } from "@/lib/hooks/usePullToRefresh";
import { RefreshCw, ArrowDown, Check } from "lucide-react";

// Constants for pull-to-refresh behavior and styling
const PTR_CONFIG = {
  CONTAINER_HEIGHT: 80, // pixels
  CONTAINER_PADDING: "12px 0",
  CHECKMARK_DISPLAY_MS: 1000, // how long to show checkmark
  ICON_SIZE: 40, // pixels (w-10 h-10)
  ARROW_ROTATION_MULTIPLIER: 1.8, // rotation degrees per 1% progress
} as const;

interface PullToRefreshContainerProps {
  children: ReactNode;
  onRefresh: () => Promise<void> | void;
  triggerDistance?: number;
  isLoading?: boolean;
}

/**
 * Get status text based on current pull-to-refresh state
 */
function getStatusText(state: {
  showCheckmark: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  shouldTrigger: boolean;
  isPulling: boolean;
}): string {
  const { showCheckmark, isLoading, isRefreshing, shouldTrigger, isPulling } =
    state;

  if (showCheckmark) return "Refreshed!";
  if (isLoading) return "Loading data...";
  if (isRefreshing) return "Refreshing...";
  if (shouldTrigger) return "Release to refresh";
  if (isPulling) return "Pull to refresh";
  return "";
}

export default function PullToRefreshContainer({
  children,
  onRefresh,
  triggerDistance = 80,
  isLoading = false,
}: PullToRefreshContainerProps) {
  const { containerRef, isPulling, progress, shouldTrigger, isRefreshing } =
    usePullToRefresh({
      onRefresh,
      triggerDistance,
    });

  const prevIsLoadingRef = useRef(false);
  const checkmarkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Simpler approach: show checkmark briefly when refresh completes
  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    // Show checkmark when loading finishes (transitions from true to false)
    if (prevIsLoadingRef.current && !isLoading) {
      // Clear any existing timeout
      if (checkmarkTimeoutRef.current) {
        clearTimeout(checkmarkTimeoutRef.current);
      }

      // Defer state update using setTimeout to avoid cascading renders
      checkmarkTimeoutRef.current = setTimeout(() => {
        setShowCheckmark(true);
        // Hide after configured delay for better visibility
        setTimeout(() => {
          setShowCheckmark(false);
        }, PTR_CONFIG.CHECKMARK_DISPLAY_MS);
      }, 0);
    }

    prevIsLoadingRef.current = isLoading;

    return () => {
      if (checkmarkTimeoutRef.current) {
        clearTimeout(checkmarkTimeoutRef.current);
      }
    };
  }, [isLoading, isRefreshing]);

  return (
    <div ref={containerRef} className="w-full overflow-x-hidden">
      {/* Pull-to-Refresh Indicator - Always visible when pulling/refreshing/loading */}
      <div
        className="flex items-center justify-center bg-linear-to-b from-purple-50 to-transparent overflow-visible"
        style={{
          maxHeight:
            isPulling || isRefreshing || isLoading || showCheckmark
              ? `${PTR_CONFIG.CONTAINER_HEIGHT}px`
              : "0",
          padding:
            isPulling || isRefreshing || isLoading || showCheckmark
              ? PTR_CONFIG.CONTAINER_PADDING
              : "0",
          opacity:
            isPulling || isRefreshing || isLoading || showCheckmark ? 1 : 0,
          transition:
            "opacity 0.2s ease, max-height 0.3s ease, padding 0.3s ease",
        }}
      >
        <div className="flex flex-col items-center gap-3 py-2">
          {/* Icon Container with enhanced animations */}
          <div
            className="relative flex items-center justify-center"
            style={{
              width: PTR_CONFIG.ICON_SIZE,
              height: PTR_CONFIG.ICON_SIZE,
            }}
          >
            {/* Arrow Icon - During pulling (hidden during refresh/success) */}
            <ArrowDown
              className={`absolute w-6 h-6 transition-all duration-300 ${
                showCheckmark || isRefreshing
                  ? "opacity-0 scale-0"
                  : shouldTrigger
                  ? "text-purple-600 opacity-100 scale-100"
                  : "text-gray-400 opacity-75 scale-100"
              }`}
              style={{
                transform: `rotate(${
                  showCheckmark || isRefreshing
                    ? 0
                    : shouldTrigger
                    ? 180
                    : progress * PTR_CONFIG.ARROW_ROTATION_MULTIPLIER
                }deg)`,
              }}
            />

            {/* Spinner Icon - During refresh */}
            <RefreshCw
              className={`absolute w-6 h-6 transition-all duration-300 ${
                isRefreshing && !showCheckmark
                  ? "opacity-100 scale-100 animate-spin text-purple-600"
                  : "opacity-0 scale-0"
              }`}
            />

            {/* Checkmark - On completion with enhanced animation */}
            <div
              className={`absolute flex items-center justify-center transition-all duration-300 ${
                showCheckmark ? "opacity-100 scale-100" : "opacity-0 scale-0"
              }`}
            >
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
              <Check className="relative w-6 h-6 text-white drop-shadow-lg z-10" />
            </div>
          </div>

          {/* Enhanced Status Text */}
          <div className="flex flex-col items-center gap-1">
            <div
              className={`text-sm font-bold transition-all duration-300 ${
                showCheckmark
                  ? "text-green-600 scale-100"
                  : "text-gray-600 scale-90"
              }`}
            >
              {getStatusText({
                showCheckmark,
                isLoading,
                isRefreshing,
                shouldTrigger,
                isPulling,
              })}
            </div>

            {/* Progress indicator during pull */}
            {!isRefreshing && !showCheckmark && isPulling && (
              <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-purple-400 to-purple-600 transition-all duration-100"
                  style={{
                    width: `${Math.min(progress, 100)}%`,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 bg-white">{children}</div>
    </div>
  );
}
