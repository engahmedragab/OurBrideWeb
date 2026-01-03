/**
 * Provider Response
 */

import type { BaseLookupResponse } from '@/types/responses/common'
import type { OwnerResponse } from './owner-response'
import type { ReviewResponse } from './review-response'
import type { LinkResponse } from './link-response'
import type { MediaResponse } from './media-response'
import type { FollowResponse } from './follow-response'
import type { ViewResponse } from './view-response'
import type { FavoriteResponse } from './favorite-response'
import type { AddressResponse } from './address-response'
import type { PlaceResponse } from './place-response'
import type { ResourceResponse } from './resource-response'
import type { ProviderPaymentMethodResponse } from './provider-payment-method-response'
import type { WorkingTimeResponse } from './working-time-response'
import type { BlockedWorkingTimeResponse } from './blocked-working-time-response'
import type { ProviderStatus, ProviderRate } from '@/types/responses/common'
import type { ServiceSummary } from './service-summary'

export interface ProviderResponse extends BaseLookupResponse {
  phoneNumber: string
  phoneNumber2: string
  profileURL: string
  address: AddressResponse | null
  shortAddress: string
  providerStatus: ProviderStatus
  rate: number | null
  likes: number | null
  serviceClasses: string
  providerRate: ProviderRate
  reviews: ReviewResponse[]
  follows: FollowResponse[]
  views: ViewResponse[]
  favorites: FavoriteResponse[]
  links: LinkResponse[]
  media: MediaResponse[]
  ownerId: string // Guid
  owner: OwnerResponse | null
  providerPaymentMethods: ProviderPaymentMethodResponse[]
  workingTimes: WorkingTimeResponse[]
  blockedWorkingTimes: BlockedWorkingTimeResponse[]
  serviceClassIds: number[]
  placeId: number | null
  place: PlaceResponse | null
  localGuiderId: string // Guid
  providersAreaId: number | null
  providersArea: unknown // ProvidersArea type - to be defined when type is available
  branches: PlaceResponse[]
  isFavorite: boolean
  isFollowed: boolean
  currentUserId: string // Guid
  providerUserAssignments: unknown[] // ProviderUserAssignment[] - to be defined when type is available
  resources: ResourceResponse[]
  isProfileComplete: boolean
  profileCompletionPercentage: number
  // Additional fields for provider card display (same as ProviderMapItem)
  topRatedServices?: ServiceSummary[]
  totalServicesCount?: number
  reviewCount?: number
  images?: MediaResponse[]
}
