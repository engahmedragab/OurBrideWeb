import { useQuery } from '@tanstack/react-query'
import { getProviderPublicProfileById, getProviderPublicProfileBySlug } from '@/services/api/providerApi'
import type { ProviderPublicProfileResponse } from '@/types/responses/provider-public-profile-response'

// Helper function to determine if a string is a number
const isNumeric = (str: string): boolean => {
  return /^\d+$/.test(str)
}

/**
 * Hook to fetch provider public profile by ID or slug
 */
export const useProviderPublicProfile = (
  providerIdOrSlug: string | number,
  options?: {
    enabled?: boolean
  }
) => {
  const idOrSlug = typeof providerIdOrSlug === 'number' ? String(providerIdOrSlug) : providerIdOrSlug
  
  return useQuery<ProviderPublicProfileResponse, Error>({
    queryKey: ['providerPublicProfile', idOrSlug],
    queryFn: () => {
      if (typeof providerIdOrSlug === 'number') {
        return getProviderPublicProfileById(providerIdOrSlug)
      } else if (isNumeric(idOrSlug)) {
        return getProviderPublicProfileById(parseInt(idOrSlug, 10))
      } else {
        return getProviderPublicProfileBySlug(idOrSlug)
      }
    },
    enabled: options?.enabled !== false && !!idOrSlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}



