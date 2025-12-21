/**
 * Monthly Payment Statistics
 */

export interface MonthlyPaymentStatistics {
  year: number
  month: number
  paymentCount: number
  totalAmount: number
  paidAmount: number
  pendingAmount: number
}
