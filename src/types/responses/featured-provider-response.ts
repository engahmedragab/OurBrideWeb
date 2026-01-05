/**
 * Featured Provider Response
 * Response for featured/top-rated/popular providers
 */

import type { ServiceSummary } from './service-summary'

export interface FeaturedProviderResponse {
  id: number
  nameEn: string
  nameAr: string
  descriptionEn: string
  descriptionAr: string
  publicLogoImageUrl: string
  publicBannerImageUrl: string
  rate: number | null
  totalReviews: number
  isVerified: boolean
  totalServices: number
  totalProducts: number
  shortAddress: string
  publicProfileSlug: string
  uniqueCode: string
  topRatedService: ServiceSummary | null
  // Additional fields for provider card display with multiple services
  topRatedServices?: ServiceSummary[]
}
