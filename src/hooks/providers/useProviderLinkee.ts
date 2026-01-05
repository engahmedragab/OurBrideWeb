import { useQuery } from '@tanstack/react-query'
import { getProviderLinkee } from '@/services/api/providerApi'
import type { ProviderLinkeeResponse } from '@/types/responses/provider-linkee-response'

/**
 * Hook to fetch provider Linkee-style public page
 */
export const useProviderLinkee = (
  providerId: number,
  options?: {
    enabled?: boolean
  }
) => {
  return useQuery<ProviderLinkeeResponse, Error>({
    queryKey: ['providerLinkee', providerId],
    queryFn: () => getProviderLinkee(providerId),
    enabled: options?.enabled !== false && !!providerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
