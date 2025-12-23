"use client";

import { createContext, useContext, ReactNode } from "react";

interface PullToRefreshContextType {
  isLoading: boolean;
}

const PullToRefreshContext = createContext<
  PullToRefreshContextType | undefined
>(undefined);

export function PullToRefreshProvider({
  children,
  isLoading,
}: {
  children: ReactNode;
  isLoading: boolean;
}) {
  return (
    <PullToRefreshContext.Provider value={{ isLoading }}>
      {children}
    </PullToRefreshContext.Provider>
  );
}

export function usePullToRefreshLoading() {
  const context = useContext(PullToRefreshContext);
  if (context === undefined) {
    throw new Error(
      "usePullToRefreshLoading must be used within PullToRefreshProvider"
    );
  }
  return context.isLoading;
}
