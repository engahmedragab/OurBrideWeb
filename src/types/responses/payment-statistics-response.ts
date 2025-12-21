/**
 * Payment Statistics Response
 */

import type { PaymentMethodStatistics } from './payment-method-statistics'
import type { MonthlyPaymentStatistics } from './monthly-payment-statistics'
import type { ProviderPaymentStatistics } from './provider-payment-statistics'

export interface PaymentStatisticsResponse {
  startDate: string // ISO DateTime string
  endDate: string // ISO DateTime string
  totalPayments: number
  paidPayments: number
  pendingPayments: number
  overduePayments: number
  failedPayments: number
  totalAmount: number
  totalPaidAmount: number
  totalPendingAmount: number
  totalOverdueAmount: number
  totalRemainingAmount: number
  paymentMethodBreakdown: { [key: string]: PaymentMethodStatistics }
  statusBreakdown: { [key: string]: number }
  monthlyBreakdown: MonthlyPaymentStatistics[]
  topProviders: ProviderPaymentStatistics[]
}
