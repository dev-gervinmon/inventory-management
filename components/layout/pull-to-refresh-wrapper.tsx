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

import React, { ReactNode, useTransition } from "react";
import PullToRefreshContainer from "@/components/layout/pull-to-refresh-container";
import { useRouter } from "next/navigation";

interface PullToRefreshWrapperProps {
  children: ReactNode;
}

export default function PullToRefreshWrapper({
  children,
}: PullToRefreshWrapperProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = async () => {
    // Wrap router.refresh in startTransition to track loading state
    // This allows parent components to know when data refresh is complete
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <PullToRefreshContainer onRefresh={handleRefresh} isLoading={isPending}>
      {children}
    </PullToRefreshContainer>
  );
}
