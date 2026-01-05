/**
 * Purchase Response
 */

import type { BaseResponse } from '@/types/responses/common'
import type {
  PurchaseType,
  PurchaseStatus,
} from '@/../client/common/api/gen/ourbride-api'
import type { TenantScopeLevel } from '@/types/responses/common'
import type { ProductHeaderResponse } from './product-header-response'
import type { ServiceHeaderResponse } from './service-header-response'
import type { ReservationResponse } from './reservation-response'

export interface PurchaseResponse {
  id: number
  type: PurchaseType
  status: PurchaseStatus
  price: number | null
  totalPrice: number | null
  buyDate: string | null // ISO DateTime string
  startDate: string | null // ISO DateTime string
  endDate: string | null // ISO DateTime string
  quantity: number
  comment: string | null
  cartId: number

  // Display properties (stored directly in Purchase for performance)
  nameAr: string | null
  nameEn: string | null
  name: string | null // Computed property based on culture
  imageUrl: string | null

  productId: number | null // ulong
  product: ProductHeaderResponse | null
  serviceId: number | null
  providerId: number | null

  // Item IDs for different purchase types
  membershipId: number | null
  giftCardId: number | null

  depositAmount: number | null
  isDepositRefunded: boolean | null

  // Service reservations
  reservationId: string | null

  isDeleted: boolean
  creationDate: string // ISO DateTime string
  lastModifiedDate: string // ISO DateTime string
  slug: string | null

  // Additional purchase type information
  service: ServiceHeaderResponse | null
  reservation: ReservationResponse | null

  // Multi-tenant information
  branchId: number | null
  providerUserId: string | null // Guid
  clientId: string | null // Guid
  providerNotes: string | null
  providerName: string | null
  branchName: string | null
  isUrgent: boolean
  requireClientConfirmation: boolean
  preferredDeliveryDate: string | null // ISO DateTime string
  sendNotificationToClient: boolean
  scopeLevel: TenantScopeLevel | null
}
