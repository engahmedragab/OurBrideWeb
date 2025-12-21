/**
 * Service Order Details Response
 */

import type { OrderResponse } from './order-response'
import type { CartResponse } from './cart-response'
import type { PaymentPlanItemResponse } from './payment-plan-item-response'
import type { PaymentResponse } from './payment-response'
import type { PaymentPlanResponse } from './payment-plan-response'
import type { PaymentPlanItemSummaryResponse } from './payment-plan-item-summary-response'

export interface ServiceOrderDetailsResponse {
  order: OrderResponse
  cart: CartResponse | null
  paymentPlanItems: PaymentPlanItemResponse[]
  payments: PaymentResponse[]
  paymentPlan: PaymentPlanResponse | null
  totalAmount: number
  totalPaidAmount: number
  totalRemainingAmount: number
  paymentProgress: number
  paymentPlanSummary: PaymentPlanItemSummaryResponse | null
  isFullyPaid: boolean // Computed property
  hasOverduePayments: boolean // Computed property
  hasPendingPayments: boolean // Computed property
  nextPaymentDate: string | null // ISO DateTime string (computed)
  nextPaymentAmount: number | null // Computed property
}
