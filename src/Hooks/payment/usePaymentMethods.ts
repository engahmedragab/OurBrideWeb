import { useQuery } from '@tanstack/react-query'
import { getActivePaymentMethods } from '@/services/api/paymentMethodApi'
import type { PaymentMethodResponse } from '@/types/responses'

/**
 * Hook to fetch active payment methods
 */
export const usePaymentMethods = () => {
  return useQuery<PaymentMethodResponse[]>({
    queryKey: ['paymentMethods', 'active'],
    queryFn: async () => {
      return await getActivePaymentMethods()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
