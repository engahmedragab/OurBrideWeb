/**
 * Testimonial Response for Provider Home
 */

import type { BaseLookupResponse } from './common/base'

export interface ProviderHomeTestimonialResponse extends BaseLookupResponse {
  customerName?: string
  customerNameAr?: string
  customerNameEn?: string
  rating: number
  comment?: string
  commentAr?: string
  commentEn?: string
  product?: string
  productAr?: string
  productEn?: string
  imageUrl?: string
  isVerified: boolean
  isActive: boolean
  order: number
  verifiedDate?: string // ISO 8601 date string
  verifiedBy?: string // Guid
  orderId?: number // ulong
  productId?: number
}
