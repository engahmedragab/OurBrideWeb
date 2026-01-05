import { useQuery } from '@tanstack/react-query'
import {
  getServiceBook,
  type ServiceBooksQuery,
} from '@/services/api/serviceBooksApi'
import type { ServiceBookResponse } from '@/types/responses'
import { isAuthenticated } from '@/auth/utils/token'

/**
 * Hook to fetch service book
 */
export const useServiceBook = (
  query?: ServiceBooksQuery & { enabled?: boolean }
) => {
  const { enabled = true, ...queryParams } = query || {}
  const authenticated = isAuthenticated()

  return useQuery<ServiceBookResponse | null>({
    queryKey: ['serviceBook', queryParams],
    queryFn: async () => {
      return await getServiceBook(queryParams)
    },
    enabled: enabled && authenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
