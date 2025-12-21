/**
 * Preparation Response
 */

import type { BaseLookupResponse } from '@/types/responses/common'
import type { ServiceType, ServiceClass } from '@/types/responses/common'
import type { ServiceResponse } from './service-response'

export interface PreparationResponse extends BaseLookupResponse {
  id: number
  bioAr: string
  bioEn: string
  isActive: boolean
  type: ServiceType
  class: ServiceClass
  imageUrl: string | null
  startDate: string | null // ISO DateTime string
  endDate: string | null // ISO DateTime string
  iconName: string | null
  colorName: string | null
  isFeatured: boolean
  isAvailable: boolean
  services: ServiceResponse[] | null
}
