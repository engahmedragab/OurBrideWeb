/**
 * Order Payment Statistics
 */

export interface OrderPaymentStatistics {
  totalPaidAmount: number
  totalPendingAmount: number
  totalRefundedAmount: number
  paymentPlanOrders: number
  fullPaymentOrders: number
  paymentSuccessRate: number
}
