/**
 * Payment Plan Item Summary Response
 */

export interface PaymentPlanItemSummaryResponse {
  totalItems: number
  paidItems: number
  pendingItems: number
  overdueItems: number
  customizedItems: number
  totalAmount: number
  totalPaidAmount: number
  totalRemainingAmount: number
  paymentProgressPercentage: number
  hasOverdueItems: boolean
  isFullyPaid: boolean
  nextPaymentDate: string | null // ISO DateTime string
  nextPaymentAmount: number | null
}
