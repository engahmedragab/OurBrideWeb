/**
 * Featured Provider Response for Provider Home
 */

import type { ProviderHomeServiceSummary } from './provider-home-service-summary'

export interface ProviderHomeFeaturedProviderResponse {
  id: number
  nameEn?: string
  nameAr?: string
  descriptionEn?: string
  descriptionAr?: string
  publicLogoImageUrl?: string
  publicBannerImageUrl?: string
  rate?: number
  totalReviews: number
  isVerified: boolean
  totalServices: number
  totalProducts: number
  shortAddress?: string
  publicProfileSlug?: string
  uniqueCode?: string
  topRatedService?: ProviderHomeServiceSummary
}



