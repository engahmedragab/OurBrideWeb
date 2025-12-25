/**
 * Payment Method Response
 */

import type { BaseLookupResponse } from '@/types/responses/common'

export interface PaymentMethodResponse extends Omit<BaseLookupResponse, 'lastModifiedDate'> {
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
  creationDate: string // ISO DateTime string (overrides base)
  lastModifiedDate: string | null // ISO DateTime string (overrides base)
}
