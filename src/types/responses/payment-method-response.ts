/**
 * Payment Method Response
 */

import type { BaseLookupResponse } from '@/types/responses/common'

export interface PaymentMethodResponse extends BaseLookupResponse {
  code: string
  type: number // PaymentMethodsType enum
  status: number // PaymentMethodStatus enum
  iconName: string
  colorName: string
  isActive: boolean
  iconUrl: string
  logoUrl: string
  sortOrder: number
  requiresCardInfo: boolean
  supportsInstallments: boolean
  maxInstallments: number | null
  configuration: string
}
