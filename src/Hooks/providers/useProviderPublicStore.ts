import { useQuery } from '@tanstack/react-query'
import { getProviderPublicStore } from '@/services/api/providerApi'
import type { ProviderPublicStoreResponse } from '@/types/responses/provider-public-store-response'

/**
 * Hook to fetch provider public store (products)
 */
export const useProviderPublicStore = (
  providerId: number,
  params?: {
    page?: number
    pageSize?: number
  },
  options?: {
    enabled?: boolean
  }
) => {
  return useQuery<ProviderPublicStoreResponse, Error>({
    queryKey: ['providerPublicStore', providerId, params],
    queryFn: () => getProviderPublicStore(providerId, params),
    enabled: options?.enabled !== false && !!providerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

