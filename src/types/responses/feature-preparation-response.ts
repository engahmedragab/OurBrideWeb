/**
 * Feature Preparation Response
 */

import type { ServiceType, ServiceClass } from '@/types/responses/common'
import type { ServiceHeaderResponse } from './service-header-response'

export interface FeaturePreparationResponse {
  id: number
  nameAr: string
  nameEn: string
  bioAr: string
  bioEn: string
  isActive: boolean
  type: ServiceType
  class: ServiceClass
  iconName: string | null
  colorName: string | null
  services: ServiceHeaderResponse[] | null
}
