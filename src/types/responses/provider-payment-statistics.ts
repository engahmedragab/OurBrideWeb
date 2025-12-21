/**
 * Provider Payment Statistics
 */

export interface ProviderPaymentStatistics {
  providerId: number
  providerName: string
  paymentCount: number
  totalAmount: number
  paidAmount: number
  pendingAmount: number
}
