import { useQuery } from '@tanstack/react-query'
import { getProviderPublicProfileById } from '@/services/api/providerApi'
import type { ProviderPublicProfileResponse } from '@/types/responses/provider-public-profile-response'

/**
 * Hook to fetch provider public profile by ID
 */
export const useProviderPublicProfile = (
  providerId: number,
  options?: {
    enabled?: boolean
  }
) => {
  return useQuery<ProviderPublicProfileResponse, Error>({
    queryKey: ['providerPublicProfile', providerId],
    queryFn: () => getProviderPublicProfileById(providerId),
    enabled: options?.enabled !== false && !!providerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
