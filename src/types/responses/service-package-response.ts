/**
 * Service Package Response
 */

import type { BaseLookupResponse } from '@/types/responses/common'

export interface ServicePackageResponse extends BaseLookupResponse {
  price: number
  serviceId: number
  duration: number | null // Duration in minutes or days
  isActive: boolean
  originalPrice?: number | null
  currency?: string
  features?: string[]
  images?: string[]
}
