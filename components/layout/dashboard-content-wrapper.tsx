"use client";

/**
 * Dashboard Content Wrapper
 * Client component that wraps dashboard content with pull-to-refresh functionality
 * Handles async data refresh with loading state tracking via useTransition hook
 *
 * @example
 * <DashboardContentWrapper>
 *   <DashboardContent />
 * </DashboardContentWrapper>
 */

import React, { ReactNode, useTransition } from "react";
import PullToRefreshContainer from "@/components/layout/pull-to-refresh-container";
import { useRouter } from "next/navigation";

interface DashboardContentWrapperProps {
  children: ReactNode;
}

export default function DashboardContentWrapper({
  children,
}: DashboardContentWrapperProps) {
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
