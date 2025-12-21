/**
 * Payment Method Statistics
 */

export interface PaymentMethodStatistics {
  paymentMethod: string
  count: number
  totalAmount: number
  paidAmount: number
  pendingAmount: number
}
