/**
 * Purchase Response
 */

import type { BaseResponse } from '@/types/responses/common'
import type { PurchaseType, PurchaseStatus } from '@/../client/common/api/gen/ourbride-api'
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
  comment: string
  cartId: number
  productId: number | null // ulong
  product: ProductHeaderResponse | null
  isDeleted: boolean
  creationDate: string // ISO DateTime string
  lastModifiedDate: string // ISO DateTime string
  slug: string
  serviceId: number | null
  providerId: number | null
  membershipId: number | null
  giftCardId: number | null
  depositAmount: number | null
  isDepositRefunded: boolean | null
  reservationId: string
  service: ServiceHeaderResponse | null
  reservation: ReservationResponse | null
  branchId: number | null
  providerUserId: string | null // Guid
  clientId: string | null // Guid
  providerNotes: string
  providerName: string
  branchName: string
  isUrgent: boolean
  requireClientConfirmation: boolean
  preferredDeliveryDate: string | null // ISO DateTime string
  sendNotificationToClient: boolean
  scopeLevel: TenantScopeLevel | null
}
