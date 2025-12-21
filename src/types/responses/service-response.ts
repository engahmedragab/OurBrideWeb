/**
 * Service Response
 */

import type { BaseLookupResponse } from '@/types/responses/common'
import type {
  ServiceStatus,
  ServiceType,
  ServiceClass,
  PriceType,
  ReminderInterval,
  CostType,
} from '@/types/responses/common'
import type { ProviderResponse } from './provider-response'
import type { AddressResponse } from './address-response'
import type { ReviewResponse } from './review-response'
import type { MediaResponse } from './media-response'
import type { LinkResponse } from './link-response'
import type { WishlistResponse } from './wishlist-response'
import type { ViewResponse } from './view-response'
import type { FavoriteResponse } from './favorite-response'
import type { ServicePaymentMethodResponse } from './service-payment-method-response'
import type { ServicePackageResponse } from './service-package-response'
import type { TimeSlotResponse } from './time-slot-response'
import type { ProductResponse } from './product-response'
import { ServiceInfoResponse } from './service-info-response'
import { ServicePlaceAssignmentResponse } from './service-place-assignment-response'
import { ServiceStaffAssignmentResponse } from './service-staff-assignment-response'

export interface ServiceResponse extends BaseLookupResponse {
  serviceStatus: ServiceStatus
  isOurBrideService: boolean
  rate: number | null
  likes: number | null
  buyPrice: number | null
  rentPrice: number | null
  deposit: number | null
  priceType: PriceType
  url: string | null
  type: ServiceType
  class: ServiceClass
  imageUrl: string | null

  // Availability Limitations
  startDate: string | null // ISO DateTime string
  endDate: string | null // ISO DateTime string
  availableDaysOfWeek: number | null
  availableStartTime: string | null // TimeSpan as string
  availableEndTime: string | null // TimeSpan as string

  hasInstallment: boolean
  hasPackages: boolean

  // Aftercare instructions
  aftercareInstructions: string | null

  // Reminder to rebook notifications
  rebookReminderDelayValue: number | null
  rebookReminderInterval: ReminderInterval | null

  // Sales tax settings
  salesTaxIncludedInPrice: boolean
  hasCustomSalesTaxSettings: boolean

  // Cost of service
  costOfService: number | null // decimal?
  costOfServiceType: CostType | null

  // SKU
  sku: string | null

  providerId: number | null
  provider: ProviderResponse | null

  address: AddressResponse | null
  shortAddress: string | null

  preparationId: number

  reviews: ReviewResponse[] | null
  medias: MediaResponse[] | null
  links: LinkResponse[] | null
  wishlists: WishlistResponse[] | null
  views: ViewResponse[] | null
  favorites: FavoriteResponse[] | null

  // Boolean flags for current user interactions
  isFavorite: boolean
  isWishlist: boolean
  isFollowed: boolean

  currentUserId: string // Guid

  servicePaymentMethods: ServicePaymentMethodResponse[] | null
  packages: ServicePackageResponse[] | null
  timeSlots: TimeSlotResponse[] | null
  serviceInfos: ServiceInfoResponse[] | null

  separatorIntervalMinutes: number
  slotIntervalTicks: number
  slotInterval: string // TimeSpan as string

  hasProductDetails: boolean
  productId: number | null
  product: ProductResponse | null

  servicePlaceAssignments: ServicePlaceAssignmentResponse[] | null
  serviceStaffAssignments: ServiceStaffAssignmentResponse[] | null
}
