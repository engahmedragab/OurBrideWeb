import { useQuery } from '@tanstack/react-query'
import { getProviderPublicStore, getProviderPublicStoreBySlug } from '@/services/api/providerApi'
import type { ProviderPublicStoreResponse } from '@/types/responses/provider-public-store-response'

// Helper function to determine if a string is a number
const isNumeric = (str: string): boolean => {
  return /^\d+$/.test(str)
}

/**
 * Hook to fetch provider public store (products) by ID or slug
 */
export const useProviderPublicStore = (
  providerIdOrSlug: string | number,
  params?: {
    page?: number
    pageSize?: number
  },
  options?: {
    enabled?: boolean
  }
) => {
  const idOrSlug = typeof providerIdOrSlug === 'number' ? String(providerIdOrSlug) : providerIdOrSlug
  
  return useQuery<ProviderPublicStoreResponse, Error>({
    queryKey: ['providerPublicStore', idOrSlug, params],
    queryFn: () => {
      if (typeof providerIdOrSlug === 'number') {
        return getProviderPublicStore(providerIdOrSlug, params)
      } else if (isNumeric(idOrSlug)) {
        return getProviderPublicStore(parseInt(idOrSlug, 10), params)
      } else {
        return getProviderPublicStoreBySlug(idOrSlug, params)
      }
    },
    enabled: options?.enabled !== false && !!idOrSlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

