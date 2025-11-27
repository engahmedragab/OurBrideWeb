/**
 * useApi Hook
 * 
 * Custom hook for handling API calls with loading, error, and data states.
 * 
 * @example
 * ```tsx
 * const { data, loading, error, execute } = useApi(serviceService.getById);
 * 
 * useEffect(() => {
 *   execute(serviceId);
 * }, [serviceId]);
 * ```
 */

import { useState, useCallback } from 'react';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseApiReturn<T, P extends any[] = any[]> extends UseApiState<T> {
  execute: (...args: P) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T, P extends any[] = any[]>(
  apiFunction: (...args: P) => Promise<T>
): UseApiReturn<T, P> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: P) => {
      setState({ data: null, loading: true, error: null });
      try {
        const result = await apiFunction(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An error occurred');
        setState({ data: null, loading: false, error });
        return null;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

