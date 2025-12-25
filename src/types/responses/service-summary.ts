/**
 * Service Summary Response
 * Used in ServiceHomeResponse for TopRatedServices and FlashSaleServices
 */

import type { BaseLookupResponse } from '@/types/responses/common'
import type { ProviderInfoResponse } from './provider-info-response'
import type {
  ServiceStatus,
  ServiceType,
  ServiceClass,
  PriceType,
} from '@/types/responses/common'

export interface ServiceSummary extends BaseLookupResponse {
  serviceStatus: ServiceStatus
  isOurBrideService: boolean
  rate: number | null
  likes: number | null
  buyPrice: number | null
  rentPrice: number | null
  priceType: PriceType
  url: string
  type: ServiceType
  class: ServiceClass
  imageUrl: string
  hasInstallment: boolean
  providerId: number | null
  provider: ProviderInfoResponse | null
  shortAddress: string
  startDate: string | null // ISO DateTime string
  endDate: string | null // ISO DateTime string
  availableDaysOfWeek: number | null
  availableStartTime: string | null // TimeSpan as string
  availableEndTime: string | null // TimeSpan as string
  preparationId: number
  deposit: number | null
}

