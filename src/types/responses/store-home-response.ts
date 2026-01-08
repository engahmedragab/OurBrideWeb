/**
 * Store Home Response
 * Response model for Store Home page data by provider
 */

import type { BannerResponse } from './home-response'
import type { TestimonialResponse } from './home-response'
import type { TopBarTextResponse } from './top-bar-text-response'
import type { FAQResponse } from './faq-response'

/**
 * Store Home Response
 */
export interface StoreHomeResponse {
  topBarTexts: TopBarTextResponse[]
  banners: BannerResponse[]
  testimonials: TestimonialResponse[]
  faQs: FAQResponse[]
}

