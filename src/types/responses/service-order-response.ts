/**
 * Service Order Response
 */

import type {
  OrderStatus,
  PaymentStatus,
} from '@/../client/common/api/gen/ourbride-api'

export interface ServiceOrderResponse {
  id: number
  orderNumber: string
  totalAmount: number
  discountAmount: number
  finalAmount: number
  status: OrderStatus
  statusDisplayName: string
  orderDate: string // ISO DateTime string
  completionDate: string | null // ISO DateTime string
  cancellationDate: string | null // ISO DateTime string
  cancellationReason: string
  notes: string
  couponCode: string
  couponDiscount: number
  providerId: number | null
  provider: any // ProviderInfoResponse | null
  service: any // ServiceHeaderResponse | null
  providerName: string
  providerLogo: string
  providerPhone: string
  providerEmail: string
  serviceId: number | null
  serviceName: string
  serviceDescription: string
  serviceImage: string
  servicePrice: number
  paymentStatus: PaymentStatus
  paymentStatusDisplayName: string
  paidAmount: number
  remainingAmount: number
  nextPaymentDueDate: string | null // ISO DateTime string
  userId: string // Guid
  userName: string
  userPhone: string
  userEmail: string
  creationDate: string // ISO DateTime string
  lastModifiedDate: string // ISO DateTime string
  createdBy: string
  lastModifiedBy: string
  reservation: any // ReservationResponse | null
}
