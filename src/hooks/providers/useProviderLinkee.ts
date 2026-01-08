import { useQuery } from '@tanstack/react-query'
import { getProviderLinkee, getProviderLinkeeBySlug } from '@/services/api/providerApi'
import type { ProviderLinkeeResponse } from '@/types/responses/provider-linkee-response'

// Helper function to determine if a string is a number
const isNumeric = (str: string): boolean => {
  return /^\d+$/.test(str)
}

/**
 * Hook to fetch provider Linkee-style public page by ID or slug
 */
export const useProviderLinkee = (
  providerIdOrSlug: string | number,
  options?: {
    enabled?: boolean
  }
) => {
  const idOrSlug = typeof providerIdOrSlug === 'number' ? String(providerIdOrSlug) : providerIdOrSlug
  
  return useQuery<ProviderLinkeeResponse, Error>({
    queryKey: ['providerLinkee', idOrSlug],
    queryFn: () => {
      if (typeof providerIdOrSlug === 'number') {
        return getProviderLinkee(providerIdOrSlug)
      } else if (isNumeric(idOrSlug)) {
        return getProviderLinkee(parseInt(idOrSlug, 10))
      } else {
        return getProviderLinkeeBySlug(idOrSlug)
      }
    },
    enabled: options?.enabled !== false && !!idOrSlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}



