/**
 * Service Summary for Provider Home
 * Note: Uses number types for enums to match C# contracts
 */

import type { ProviderHomeProviderInfoResponse } from './provider-home-provider-info-response'

export interface ProviderHomeServiceSummary {
  id: number
  name: string
  description: string
  imageUrl: string
  price: number
  saleBuyPrice?: number
  saleRentPrice?: number
  priceType: number // PriceType enum as number (0=Fixed, 1=Free, 2=From)
  rating?: number
  location: string
  isFavorite: boolean
  deposit?: number
  providerId?: number
  provider?: ProviderHomeProviderInfoResponse
  hasDiscount: boolean
  discountType?: number // DiscountType enum as number (0=FixedAmount, 1=Percentage, 2=Number, 3=BuyAndGet)
  discountDateStart?: string // ISO 8601 date string
  discountDateEnd?: string // ISO 8601 date string
  flashSaleStartDate?: string // ISO 8601 date string
  flashSaleEndDate?: string // ISO 8601 date string
  onSale?: boolean
  dateOnSaleFrom?: string // ISO 8601 date string
  dateOnSaleTo?: string // ISO 8601 date string
  startDate?: string // ISO 8601 date string
  endDate?: string // ISO 8601 date string
  availableDaysOfWeek?: number
  availableStartTime?: string // TimeSpan as string (e.g., "HH:mm:ss")
  availableEndTime?: string // TimeSpan as string (e.g., "HH:mm:ss")
}



