import { useQuery } from '@tanstack/react-query'
import { getProviderById } from '@/services/api/providerApi'
import type { ProviderResponse } from '@/types/responses'

/**
 * Hook to fetch provider details by ID
 */
export const useProviderDetail = (
  providerId: number,
  options?: {
    enabled?: boolean
  }
) => {
  return useQuery<ProviderResponse, Error>({
    queryKey: ['provider', providerId],
    queryFn: () => getProviderById(providerId),
    enabled: options?.enabled !== false && !!providerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}


