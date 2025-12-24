/**
 * Feature Service Response
 * Used in ServiceHomeResponse for AllFeatureServices
 */

import type { BaseLookupResponse } from '@/types/responses/common'
import type { ProviderInfoResponse } from './provider-info-response'
import type { ServiceType, ServiceClass } from '@/types/responses/common'

export interface FeatureServiceResponse extends BaseLookupResponse {
  nameAr: string
  nameEn: string
  title: string | null
  subTitle: string | null
  icon: string | null
  color: string | null
  type: ServiceType
  class: ServiceClass
  providerId: number | null
  provider: ProviderInfoResponse | null
}

