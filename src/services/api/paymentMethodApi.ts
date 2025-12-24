// Payment Method API service functions

import { apiClient } from '@/services/api/apiClient'
import type { PaymentMethodResponse } from '@/types/responses'

/**
 * Get active payment methods
 * Endpoint: GET /payment-methods/active
 */
export const getActivePaymentMethods = async (): Promise<PaymentMethodResponse[]> => {
  try {
    const response = await apiClient.api.getPaymentMethodGetActive()
    const responseAny = response as any
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as PaymentMethodResponse[]
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch active payment methods')
  }
}
