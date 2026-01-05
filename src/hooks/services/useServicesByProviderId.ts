import { useQuery } from '@tanstack/react-query'
import { getServicesByProviderId } from '@/services/api/serviceApi'
import type { ServiceResponse } from '@/types/responses'

/**
 * Hook to fetch services by provider ID
 * Returns ServiceResponse[] directly from the API
 */
export const useServicesByProviderId = (
  providerId: number,
  options?: {
    enabled?: boolean
  }
) => {
  return useQuery<ServiceResponse[], Error>({
    queryKey: ['services', 'provider', providerId],
    queryFn: () => getServicesByProviderId(providerId),
    enabled: options?.enabled !== false && !!providerId && providerId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
