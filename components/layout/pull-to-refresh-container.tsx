"use client";

/**
 * Pull-to-Refresh Container Component
 * Wraps dashboard content and handles pull-to-refresh interactions
 * Enhanced with Priority 1 visual feedback:
 * - Arrow icon with rotation feedback
 * - Color transition (gray → purple when ready)
 * - Checkmark animation on completion
 */

import React, { ReactNode, useState, useEffect, useRef } from "react";
import { usePullToRefresh } from "@/lib/hooks/usePullToRefresh";
import { RefreshCw, ArrowDown, Check } from "lucide-react";

interface PullToRefreshContainerProps {
  children: ReactNode;
  onRefresh: () => Promise<void> | void;
  triggerDistance?: number;
  isLoading?: boolean;
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

  const prevIsRefreshingRef = useRef(false);
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
        // Hide after 1000ms for better visibility
        setTimeout(() => {
          setShowCheckmark(false);
        }, 1000);
      }, 0);
    }

    prevIsRefreshingRef.current = isRefreshing;
    prevIsLoadingRef.current = isLoading;

    return () => {
      if (checkmarkTimeoutRef.current) {
        clearTimeout(checkmarkTimeoutRef.current);
      }
    };
  }, [isLoading, isRefreshing]);

  return (
    <div ref={containerRef} className="w-full">
      {/* Pull-to-Refresh Indicator - Always visible when pulling/refreshing/loading */}
      <div
        className="h-16 flex items-center justify-center bg-linear-to-b from-purple-50 to-transparent overflow-hidden"
        style={{
          maxHeight:
            isPulling || isRefreshing || isLoading || showCheckmark
              ? "64px"
              : "0",
          opacity:
            isPulling || isRefreshing || isLoading || showCheckmark ? 1 : 0,
          transition: "opacity 0.2s ease, max-height 0.3s ease",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          {/* Icon Container with enhanced animations */}
          <div className="relative w-10 h-10 flex items-center justify-center">
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
                    : progress * 1.8
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
              {showCheckmark && "Refreshed!"}
              {isLoading && !showCheckmark && "Loading data..."}
              {isRefreshing && !isLoading && !showCheckmark && "Refreshing..."}
              {!isRefreshing &&
                !isLoading &&
                !showCheckmark &&
                shouldTrigger &&
                "Release to refresh"}
              {!isRefreshing &&
                !isLoading &&
                !showCheckmark &&
                !shouldTrigger &&
                isPulling &&
                "Pull to refresh"}
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
