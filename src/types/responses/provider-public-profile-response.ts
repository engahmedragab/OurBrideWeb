/**
 * Provider Public Profile Response (Main Response)
 * Generated from IProvidersService.cs
 * Note: All nested types are in separate files to avoid duplication
 */

import type { ProductHeaderResponse } from './product-header-response'
import type { AddressResponse } from './address-response'
import type { PlaceResponse } from './place-response'
import type { ServicePublicResponse } from './service-public-response'
import type { ReviewResponse } from './review-response'
import type { LinkResponse } from './link-response'
import type { MediaResponse } from './media-response'
import type { WorkingTimeResponse } from './working-time-response'
import type { ProviderPaymentMethodResponse } from './provider-payment-method-response'
import type { ProviderUserAssignmentResponse } from './provider-user-assignment-response'
import type { MembershipPlanResponse } from './membership-plan-response'
import type { GiftCardTemplateResponse } from './gift-card-template-response'
import type { ProviderStatus } from './common'

export interface ProviderPublicProfileResponse {
  id: number
  nameAr: string | null
  nameEn: string | null
  descriptionAr: string | null
  descriptionEn: string | null
  phoneNumber: string | null
  shortAddress: string | null
  profileURL: string | null
  publicProfileSlug: string | null
  uniqueCode: string | null
  qrCodeData: string | null
  isVerified: boolean
  providerStatus: ProviderStatus
  rate: number | null
  likes: number | null
  publicBannerImageUrl: string | null
  publicLogoImageUrl: string | null
  address: AddressResponse | null
  branches: PlaceResponse[]
  services: ServicePublicResponse[]
  reviews: ReviewResponse[]
  totalReviews: number
  products: ProductHeaderResponse[]
  averageRating: number | null
  links: LinkResponse[]
  media: MediaResponse[]
  workingTimes: WorkingTimeResponse[]
  paymentMethods: ProviderPaymentMethodResponse[]
  teamMembers: ProviderUserAssignmentResponse[]
  memberships: MembershipPlanResponse[]
  giftCards: GiftCardTemplateResponse[]
  totalProducts: number
  totalServices: number
  totalFollowers: number
  totalFavorites: number
  totalViews: number
  seoMetaTitle: string | null
  seoMetaDescription: string | null
  
}
