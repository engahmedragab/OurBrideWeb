/**
 * Provider Home Response (Main Response)
 * Generated from C# contracts
 * Note: All nested types are in separate files to avoid duplication
 */

import type { ProviderHomeFeaturedProviderResponse } from './provider-home-featured-provider-response'
import type { ProviderHomeTestimonialResponse } from './provider-home-testimonial-response'
import type { ProviderHomeStatisticsResponse } from './provider-home-statistics-response'

export interface ProviderHomeResponse {
  featuredProviders: ProviderHomeFeaturedProviderResponse[]
  topRatedProviders: ProviderHomeFeaturedProviderResponse[]
  popularProviders: ProviderHomeFeaturedProviderResponse[]
  trendingProviders: ProviderHomeFeaturedProviderResponse[]
  newProviders: ProviderHomeFeaturedProviderResponse[]
  recommendedProviders: ProviderHomeFeaturedProviderResponse[]
  recentlyViewedProviders: ProviderHomeFeaturedProviderResponse[]
  testimonials: ProviderHomeTestimonialResponse[]
  statistics: ProviderHomeStatisticsResponse
}
