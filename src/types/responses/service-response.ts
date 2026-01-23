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
  DiscountType,
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
  nameAr: string
  nameEn: string
  name?: string
  // Service Status
  serviceStatus: ServiceStatus

  // Flags
  isOurBrideService: boolean

  // Ratings and Pricing
  rate: number | null
  likes: number | null
  buyPrice: number | null
  rentPrice: number | null
  saleBuyPrice: number | null
  saleRentPrice: number | null
  deposit: number | null
  priceType: PriceType

  // Sale/Discount properties
  hasDiscount: boolean
  discountType: DiscountType | null
  discountDateStart: string | null // ISO date string
  discountDateEnd: string | null // ISO date string
  flashSaleStartDate: string | null // ISO date string
  flashSaleEndDate: string | null // ISO date string
  onSale: boolean | null
  dateOnSaleFrom: string | null // ISO date string
  dateOnSaleTo: string | null // ISO date string

  // Basic Information
  url: string | null
  type: ServiceType
  class: ServiceClass
  imageUrl: string | null

  // Availability Limitations
  startDate: string | null // ISO date string
  endDate: string | null // ISO date string
  availableDaysOfWeek: number | null // Bitmask: 0=Sunday, 1=Monday, etc.
  availableStartTime: string | null // Time string (HH:mm:ss)
  availableEndTime: string | null // Time string (HH:mm:ss)

  // Features
  hasInstallment: boolean
  hasPackages: boolean

  // Aftercare and Reminders
  aftercareInstructions: string | null
  rebookReminderDelayValue: number | null
  rebookReminderInterval: ReminderInterval | null

  // Sales Tax Settings
  salesTaxIncludedInPrice: boolean
  hasCustomSalesTaxSettings: boolean

  // Cost of Service
  costOfService: number | null // decimal in C# -> number in TS
  costOfServiceType: CostType | null

  // SKU
  sku: string | null

  // Relations
  providerId: number | null
  provider: ProviderResponse | null

  address: AddressResponse | null
  shortAddress: string | null

  preparationId: number

  // Collections
  reviews: ReviewResponse[]
  medias: MediaResponse[]
  links: LinkResponse[]
  wishlists: WishlistResponse[]
  views: ViewResponse[]
  favorites: FavoriteResponse[]

  // Computed Properties (boolean flags for current user interactions)
  isFavorite: boolean
  isWishlist: boolean
  isFollowed: boolean

  // Current User Context
  currentUserId: string // Guid in C# -> string in TS

  // Service-specific Collections
  servicePaymentMethods: ServicePaymentMethodResponse[]
  packages: ServicePackageResponse[]
  timeSlots: TimeSlotResponse[]
  serviceInfos: ServiceInfoResponse[]

  // Time Slot Configuration
  separatorIntervalMinutes: number
  slotIntervalTicks: number // long in C# -> number in TS
  slotInterval: string // TimeSpan in C# -> string in TS

  // Product Details
  hasProductDetails: boolean // Computed: type == ServiceType.Buy
  productId: number | null
  product: ProductResponse | null

  // Assignments
  servicePlaceAssignments: ServicePlaceAssignmentResponse[]
  serviceStaffAssignments: ServiceStaffAssignmentResponse[]
}
