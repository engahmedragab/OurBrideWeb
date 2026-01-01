import { useQuery } from '@tanstack/react-query'
import { filterProviders, type FilterProvidersParams } from '@/services/api/providerApi'
import type { FeaturedProviderResponse } from '@/types/responses'

/**
 * Hook to filter providers with advanced search and filtering options
 */
export const useProvidersFilter = (
  params?: FilterProvidersParams,
  options?: {
    enabled?: boolean
  }
) => {
  return useQuery<FeaturedProviderResponse[], Error>({
    queryKey: ['providers-filter', params],
    queryFn: () => filterProviders(params),
    enabled: options?.enabled !== false,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}


