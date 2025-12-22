import { useState, useCallback } from "react";

interface UseDataFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  retry: () => Promise<void>;
}

/**
 * Hook for managing data fetching with error handling
 * Provides loading, error, and retry states
 *
 * @example
 * const { data, loading, error, retry } = useDataFetch(
 *   () => fetch('/api/products').then(r => r.json()),
 *   {
 *     retries: 3,
 *     onError: (error) => console.log('Failed:', error)
 *   }
 * );
 *
 * if (loading) return <Skeleton />;
 * if (error) return <ErrorState onRetry={retry} />;
 * return <ProductsList data={data} />;
 */
export function useDataFetch<T>(
  fetchFn: () => Promise<T>,
  options?: {
    retries?: number;
    retryDelay?: number;
    onError?: (error: Error) => void;
    onSuccess?: (data: T) => void;
  }
): UseDataFetchReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { retries = 3, retryDelay = 1000, onError, onSuccess } = options || {};

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result = await fetchFn();
        setData(result);
        onSuccess?.(result);
        setLoading(false);
        return;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));

        if (attempt < retries) {
          // Wait before retrying
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }

    setError(lastError);
    onError?.(lastError!);
    setLoading(false);
  }, [fetchFn, retries, retryDelay, onError, onSuccess]);

  return {
    data,
    loading,
    error,
    retry: fetchData,
  };
}
