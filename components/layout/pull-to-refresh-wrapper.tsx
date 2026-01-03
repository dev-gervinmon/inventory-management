"use client";

/**
 * Pull to Refresh Wrapper
 * Client component that wraps content with pull-to-refresh functionality
 * Handles async data refresh with loading state tracking via useTransition hook
 *
 * @example
 * <PullToRefreshWrapper>
 *   <PageContent />
 * </PullToRefreshWrapper>
 */

import React, { ReactNode, useEffect, useRef, useTransition } from "react";
import PullToRefreshContainer from "@/components/layout/pull-to-refresh-container";
import { PullToRefreshProvider } from "@/lib/contexts/pull-to-refresh-context";
import { useRouter } from "next/navigation";

interface PullToRefreshWrapperProps {
  children: ReactNode;
}

export default function PullToRefreshWrapper({
  children,
}: PullToRefreshWrapperProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const pendingResolveRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!isPending && pendingResolveRef.current) {
      const resolve = pendingResolveRef.current;
      pendingResolveRef.current = null;
      resolve();
    }
  }, [isPending]);

  const handleRefresh = () => {
    // Return a promise that resolves when the transition completes
    // so the pull-to-refresh hook can stay "refreshing" appropriately.
    return new Promise<void>((resolve) => {
      pendingResolveRef.current = resolve;
      startTransition(() => {
        router.refresh();
      });
    });
  };

  return (
    <PullToRefreshContainer onRefresh={handleRefresh} isLoading={isPending}>
      <PullToRefreshProvider isLoading={isPending}>
        {children}
      </PullToRefreshProvider>
    </PullToRefreshContainer>
  );
}
