/**
 * Payment Summary Response
 */

export interface PaymentSummaryResponse {
  totalPayments: number
  paidPayments: number
  pendingPayments: number
  overduePayments: number
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  paymentProgressPercentage: number
  nextPaymentDate: string | null // ISO DateTime string
  nextPaymentAmount: number | null
  isFullyPaid: boolean
  hasOverduePayments: boolean
}
