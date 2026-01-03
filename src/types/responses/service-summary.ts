/**
 * Service Summary Response
 * Used in ServiceHomeResponse for TopRatedServices and FlashSaleServices
 * Also used in ProviderResponse.TopRatedServices and ProviderMapItem.TopRatedServices
 */

import type { BaseLookupResponse } from '@/types/responses/common'
import type { ProviderInfoResponse } from './provider-info-response'
import type {
  ServiceStatus,
  ServiceType,
  ServiceClass,
  PriceType,
} from '@/types/responses/common'

export interface ServiceSummary extends Omit<BaseLookupResponse, 'nameAr' | 'nameEn' | 'descriptionAr' | 'descriptionEn'> {
  serviceStatus: ServiceStatus
  isOurBrideService: boolean
  rate: number | null
  likes: number | null
  buyPrice: number | null
  rentPrice: number | null
  priceType: PriceType | number // Can be enum or number (0=Buy, 1=Rent, etc.)
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
  // Additional fields from backend ServiceSummary class - override base fields as optional
  name?: string // Generic name field
  nameEn?: string
  nameAr?: string
  description?: string
  descriptionAr?: string
  descriptionEn?: string
  duration?: string | number | null // TimeSpan or number
  durationDisplay?: string // Formatted duration string (e.g., "30 min - 45 min")
  durationMin?: number
  durationMax?: number
  saleBuyPrice?: number | null
  saleRentPrice?: number | null
  hasDiscount?: boolean
  discountType?: number | null
  discountDateStart?: string | null // ISO DateTime string
  discountDateEnd?: string | null // ISO DateTime string
  flashSaleStartDate?: string | null // ISO DateTime string
  flashSaleEndDate?: string | null // ISO DateTime string
  onSale?: boolean | null
  dateOnSaleFrom?: string | null // ISO DateTime string
  dateOnSaleTo?: string | null // ISO DateTime string
}

