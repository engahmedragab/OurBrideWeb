/**
 * Service Header Response
 */

import type { BaseLookupResponse } from '@/types/responses/common'
import type { ProviderResponse } from './provider-response'
import type { ReviewResponse } from './review-response'
import type { LinkResponse } from './link-response'
import type { WishlistResponse } from './wishlist-response'
import type { ViewResponse } from './view-response'
import type {
  ServiceStatus,
  ServiceType,
  ServiceClass,
  PriceType,
} from '@/types/responses/common'

export interface ServiceHeaderResponse extends BaseLookupResponse {
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
  provider: ProviderResponse | null
  shortAddress: string
  startDate: string | null // ISO DateTime string
  endDate: string | null // ISO DateTime string
  availableDaysOfWeek: number | null
  availableStartTime: string | null // TimeSpan as string
  availableEndTime: string | null // TimeSpan as string
  preparationId: number
  reviews: ReviewResponse[]
  links: LinkResponse[]
  wishlists: WishlistResponse[]
  views: ViewResponse[]
  deposit: number | null
}
