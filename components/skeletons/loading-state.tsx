/**
 * useLoadingState Hook
 * Helper for managing loading states in client components
 * Pairs with skeleton components for smooth UX
 */

import { ReactNode } from "react";

interface LoadingStateProps {
  isLoading: boolean;
  children: ReactNode;
  loadingSkeleton: ReactNode;
  error?: Error | null;
  errorFallback?: ReactNode;
}

/**
 * Component to conditionally render loading skeleton or content
 *
 * @example
 * import { LoadingState, GridSkeleton } from "@/components/skeletons";
 *
 * export function MyComponent({ data, isLoading }) {
 *   return (
 *     <LoadingState
 *       isLoading={isLoading}
 *       loadingSkeleton={<GridSkeleton count={6} columns={2} />}
 *       error={error}
 *       errorFallback={<ErrorMessage error={error} />}
 *     >
 *       <YourContent data={data} />
 *     </LoadingState>
 *   );
 * }
 */
export function LoadingState({
  isLoading,
  children,
  loadingSkeleton,
  error,
  errorFallback,
}: LoadingStateProps) {
  if (error && errorFallback) {
    return <>{errorFallback}</>;
  }

  if (isLoading) {
    return <>{loadingSkeleton}</>;
  }

  return <>{children}</>;
}
