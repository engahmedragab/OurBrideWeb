import { useQuery } from '@tanstack/react-query'
import {
  getServiceLines,
  type ServiceBooksQuery,
} from '@/services/api/serviceBooksApi'
import type { ServiceLineResponse } from '@/types/responses'
import { isAuthenticated } from '@/auth/utils/token'

/**
 * Hook to fetch all service lines
 */
export const useServiceLines = (
  query?: ServiceBooksQuery & { enabled?: boolean }
) => {
  const { enabled = true, ...queryParams } = query || {}
  const authenticated = isAuthenticated()

  return useQuery<ServiceLineResponse[]>({
    queryKey: ['serviceLines', queryParams],
    queryFn: async () => {
      return await getServiceLines(queryParams)
    },
    enabled: enabled && authenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
