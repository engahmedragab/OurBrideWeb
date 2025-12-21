/**
 * Payment Plan Item Response
 */

import type { BaseEntityResponse } from '@/types/responses/common'
import type {
  PaymentType,
  PaymentFrequency,
  PaymentPlanItemStatus,
} from '@/../client/common/api/gen/ourbride-api'

export interface PaymentPlanItemResponse extends BaseEntityResponse {
  providerPaymentPlanId: number
  orderId: number | null
  cartId: number | null
  checkoutOrderId: number | null
  paymentNumber: number
  totalPayments: number
  amount: number
  paidAmount: number | null
  remainingAmount: number | null
  dueDate: string // ISO DateTime string
  createdDueDate: string | null // ISO DateTime string
  paidDate: string | null // ISO DateTime string
  status: PaymentPlanItemStatus
  statusDisplay: string
  paymentMethod: string
  transactionId: string
  type: PaymentType
  typeDisplay: string
  paymentFrequency: PaymentFrequency | null
  paymentFrequencyDisplay: string
  isDeposit: boolean
  isFinalPayment: boolean
  isCustomized: boolean
  customAmount: number | null
  customDueDate: string | null // ISO DateTime string
  notes: string
  effectiveAmount: number // Computed property
  effectiveDueDate: string // Computed property (ISO DateTime string)
  isOverdue: boolean // Computed property
  daysOverdue: number // Computed property
  paymentProgress: number // Computed property
  isFullyPaid: boolean // Computed property
  remainingAmountCalculated: number // Computed property
}
