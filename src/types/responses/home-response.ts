/**
 * Home Response
 * Response model for Home page data
 */

import type { UserResponse } from './user-response'
import type { PreparationResponse } from './preparation-response'
import type { ProductHeaderResponse } from './product-header-response'
import type { FeatureServiceResponse } from './feature-service-response'
import type { ServiceSummary } from './service-summary'
import type { FeaturedProviderResponse } from './featured-provider-response'
import type { HomeStatisticsResponse } from './home-statistics-response'
import type { CategoryResponse } from './category-response'

// Product Category Response (alias for CategoryResponse used in home context)
export type ProductCategoryResponse = CategoryResponse

// Wallet Account Response (placeholder - adjust based on actual API response)
export interface WalletAccountResponse {
  id?: number
  balance?: number
  currency?: string
  [key: string]: unknown
}

// Banner Response (placeholder - adjust based on actual API response)
export interface BannerResponse {
  id?: number
  title?: string
  imageUrl?: string
  linkUrl?: string
  order?: number
  isActive?: boolean
  [key: string]: unknown
}

// Testimonial Response (placeholder - adjust based on actual API response)
export interface TestimonialResponse {
  id?: number
  name?: string
  content?: string
  rating?: number
  imageUrl?: string
  [key: string]: unknown
}

// Home Center Update Response (placeholder - adjust based on actual API response)
export interface HomeCenterUpdateResponse {
  id?: number
  title?: string
  content?: string
  updateDate?: string
  [key: string]: unknown
}

export interface HomeResponse {
  userInfo: UserResponse | null
  walletAccount: WalletAccountResponse | null
  banners: BannerResponse[]
  preparations: PreparationResponse[]
  categories: ProductCategoryResponse[]
  featuredServices: FeatureServiceResponse[]
  topRatedServices: ServiceSummary[]
  productsWithSale: Record<string, ProductHeaderResponse[]>
  topRelatedProducts: ProductHeaderResponse[]
  providers: FeaturedProviderResponse[]
  testimonials: TestimonialResponse[]
  statistics: HomeStatisticsResponse | null

  // User-specific data (only populated when user is authenticated)
  couponsCount: number
  couponsLastCount: number
  pointsCount: number
  wallatAmount: number
  giftsCardsCount: number
  notificationsCount: number
  notificationsUnReadCount: number
  homeCenterUpdate: HomeCenterUpdateResponse | null
}
