import { useQuery } from '@tanstack/react-query'
import { getActivePaymentMethods } from '@/services/api/paymentMethodApi'
import type { PaymentMethodResponse } from '@/types/responses'
import { isAuthenticated } from '@/auth/utils/token'

/**
 * Hook to fetch active payment methods
 * Note: Only fetches if user is authenticated since endpoint requires auth
 */
export const usePaymentMethods = () => {
  const authenticated = isAuthenticated()
  
  return useQuery<PaymentMethodResponse[]>({
    queryKey: ['paymentMethods', 'active'],
    queryFn: async () => {
      return await getActivePaymentMethods()
    },
    enabled: authenticated, // Only fetch if user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: false, // Don't retry on 403 errors
  })
}
