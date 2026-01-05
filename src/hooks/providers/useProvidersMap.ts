import { useQuery } from '@tanstack/react-query'
import {
  getProvidersMap,
  type GetProvidersMapParams,
} from '@/services/api/providerMapApi'
import type { FeaturedProviderResponse } from '@/types/responses'

export interface UseProvidersMapParams extends GetProvidersMapParams {
  enabled?: boolean
}

/**
 * Hook to fetch providers for map view with location-based filtering
 */
export const useProvidersMap = (params?: UseProvidersMapParams) => {
  const { enabled = true, ...queryParams } = params || {}

  return useQuery<FeaturedProviderResponse[]>({
    queryKey: ['providers-map', queryParams],
    queryFn: async () => {
      return await getProvidersMap(queryParams)
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}
