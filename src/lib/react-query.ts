/**
 * React Query Configuration
 * 
 * Configured React Query client for data fetching and caching.
 * 
 * @example
 * ```tsx
 * import { queryClient } from '@/lib/react-query';
 * 
 * queryClient.invalidateQueries(['services']);
 * ```
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

export default queryClient;

