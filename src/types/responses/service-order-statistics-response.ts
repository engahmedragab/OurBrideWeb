/**
 * Service Order Statistics Response
 */

import type { DailyOrderStatistics } from './daily-order-statistics'
import type { MonthlyOrderStatistics } from './monthly-order-statistics'
import type { ServiceTypeStatistics } from './service-type-statistics'
import type { ProviderStatistics } from './provider-statistics'
import type { OrderPaymentStatistics } from './order-payment-statistics'

export interface ServiceOrderStatisticsResponse {
  startDate: string // ISO DateTime string
  endDate: string // ISO DateTime string
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  ordersByStatus: number
  ordersByPaymentMethod: number
  ordersByServiceType: number
  ordersByProvider: number
  dailyStatistics: DailyOrderStatistics[]
  monthlyStatistics: MonthlyOrderStatistics[]
  serviceTypeStatistics: ServiceTypeStatistics[]
  providerStatistics: ProviderStatistics[]
  paymentStatistics: OrderPaymentStatistics
}
