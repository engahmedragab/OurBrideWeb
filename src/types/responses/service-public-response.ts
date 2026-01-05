/**
 * Service Public Response
 * Public-facing service information for provider profiles
 */

import type { DiscountType } from './common'

export interface ServicePublicResponse {
  id: number
  nameAr: string | null
  nameEn: string | null
  descriptionAr: string | null
  descriptionEn: string | null
  image: string | null
  price: number | null
  saleBuyPrice: number | null
  saleRentPrice: number | null
  rate: number | null
  hasDiscount: boolean
  discountType: DiscountType | null
  discountDateStart: string | null // ISO 8601 date string
  discountDateEnd: string | null // ISO 8601 date string
  flashSaleStartDate: string | null // ISO 8601 date string
  flashSaleEndDate: string | null // ISO 8601 date string
  onSale: boolean | null
  dateOnSaleFrom: string | null // ISO 8601 date string
  dateOnSaleTo: string | null // ISO 8601 date string
  startDate: string | null // ISO 8601 date string
  endDate: string | null // ISO 8601 date string
  availableDaysOfWeek: number | null
  availableStartTime: string | null // TimeSpan as string (e.g., "HH:mm:ss")
  availableEndTime: string | null // TimeSpan as string (e.g., "HH:mm:ss")
}
