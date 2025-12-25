// Payment Method API service functions

import { apiClient } from '@/services/api/apiClient'
import type { PaymentMethodResponse } from '@/types/responses'
import { getToken } from '@/auth/utils/token'

/**
 * Get active payment methods
 * Endpoint: GET /payment-methods/active
 * Note: This endpoint requires authentication. If user is not authenticated,
 * returns empty array instead of throwing error.
 */
export const getActivePaymentMethods = async (): Promise<PaymentMethodResponse[]> => {
  try {
    const token = getToken()
    if (!token) {
      return []
    }

    const response = await apiClient.api.getPaymentMethodGetActive()
    const responseAny = response as any
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as PaymentMethodResponse[]
  } catch (error: unknown) {
    // Handle 403 Forbidden - user might not have permission or not authenticated
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } }
      if (axiosError.response?.status === 403 || axiosError.response?.status === 401) {
        return []
      }
    }
    
    // For other errors, return empty array to allow checkout to continue
    return []
  }
}
