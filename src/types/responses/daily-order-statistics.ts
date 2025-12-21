/**
 * Daily Order Statistics
 */

export interface DailyOrderStatistics {
  date: string // ISO DateTime string
  orderCount: number
  revenue: number
  completedOrders: number
  cancelledOrders: number
}
