/**
 * Payment Response
 */

import type { BaseEntityResponse } from '@/types/responses/common'
import type {
  PaymentStatus,
  PaymentType,
  PaymentFrequency,
  PaymentPlanItemStatus,
} from '@/../client/common/api/gen/ourbride-api'
import type { ServiceOrderResponse } from './service-order-response'

export interface PaymentResponse extends BaseEntityResponse {
  status: PaymentStatus
  type: PaymentType
  amount: number
  paidAmount: number | null
  remainingAmount: number | null
  dueDate: string | null // ISO DateTime string
  paidDate: string | null // ISO DateTime string
  createdDueDate: string | null // ISO DateTime string
  paymentMethod: string
  transactionId: string
  notes: string
  orderId: number
  cartId: number
  order: ServiceOrderResponse | null
  checkoutOrderId: number | null
  checkoutOrderNumber: string
  paymentPlanItemId: number | null
  providerPaymentPlanId: number | null
  paymentPlanName: string
  paymentPlanItemNumber: number | null
  paymentPlanItemStatus: PaymentPlanItemStatus | null
  orderNumber: string
  orderTotalAmount: number
  orderPaidAmount: number
  orderRemainingAmount: number
  providerId: number | null
  providerName: string
  providerLogo: string
  serviceId: number | null
  serviceName: string
  serviceDescription: string
  userId: string // Guid
  userName: string
  userPhone: string
  userEmail: string
  daysOverdue: number
  paymentNumber: number
  totalPayments: number
  isDeposit: boolean
  isFinalPayment: boolean
  paymentFrequency: PaymentFrequency | null
  isOverdue: boolean // Computed property
  isPaid: boolean // Computed property
  isPending: boolean // Computed property
  isDueSoon: boolean // Computed property
  unpaidAmount: number // Computed property
  outstandingAmount: number // Computed property
}
