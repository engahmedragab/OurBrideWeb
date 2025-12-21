/**
 * Payment Plan Response
 */

import type { BaseEntityResponse } from '@/types/responses/common'
import type {
  PaymentType,
  PaymentFrequency,
} from '@/../client/common/api/gen/ourbride-api'
// Note: PaymentPlanStatus doesn't exist in the generated API
import type { PaymentResponse } from './payment-response'

export interface PaymentPlanResponse extends BaseEntityResponse {
  orderId: number
  cartId: number
  totalAmount: number
  totalPaidAmount: number
  remainingAmount: number
  numberOfPayments: number
  paidPaymentsCount: number
  pendingPaymentsCount: number
  overduePaymentsCount: number
  paymentType: PaymentType
  paymentFrequency: PaymentFrequency
  status: string // PaymentPlanStatus enum - not available in generated API
  isFullyPaid: boolean
  isActive: boolean
  isCompleted: boolean
  isCancelled: boolean
  startDate: string | null // ISO DateTime string
  endDate: string | null // ISO DateTime string
  firstDueDate: string | null // ISO DateTime string
  lastDueDate: string | null // ISO DateTime string
  notes: string
  payments: PaymentResponse[]
  paymentProgressPercentage: number // Computed property
  hasOverduePayments: boolean // Computed property
  isOnTrack: boolean // Computed property
}
