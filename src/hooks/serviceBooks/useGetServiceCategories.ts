import { useQuery } from '@tanstack/react-query'
import { getServiceCategories } from '@/services/api/serviceBooksApi'
import type { ServiceLineCategoryResponse } from '@/types/responses'
import { isAuthenticated } from '@/auth/utils/token'

/**
 * Hook to fetch service categories
 */
export const useServiceCategories = (query?: {
  clientId?: string
  enabled?: boolean
}) => {
  const { enabled = true, ...queryParams } = query || {}
  const authenticated = isAuthenticated()

  return useQuery<ServiceLineCategoryResponse[]>({
    queryKey: ['serviceCategories', queryParams],
    queryFn: async () => {
      return await getServiceCategories(queryParams)
    },
    enabled: enabled && authenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
