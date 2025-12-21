/**
 * Provider Payment Method Response
 */

import type { BaseResponse } from '@/types/responses/common'
import type { ProviderInfoResponse } from './provider-info-response'
import type { PaymentMethodResponse } from './payment-method-response'

export interface ProviderPaymentMethodResponse extends BaseResponse {
  id: number
  providerId: number
  paymentMethodId: number
  provider: ProviderInfoResponse | null
  paymentMethod: PaymentMethodResponse | null
  instalmentTypes: number | null // InstalmentType enum
  status: number // PaymentMethodStatus enum
  statusDisplayName: string
  instalmentTypeDisplayName: string
  isActive: boolean // Computed property
}
