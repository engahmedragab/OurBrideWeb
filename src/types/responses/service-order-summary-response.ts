/**
 * Service Order Summary Response
 */

export interface ServiceOrderSummaryResponse {
  totalOrders: number
  activeOrders: number
  completedOrders: number
  cancelledOrders: number
  pendingOrders: number
  totalRevenue: number
  totalPaidAmount: number
  totalPendingAmount: number
  averageOrderValue: number
  ordersThisMonth: number
  ordersThisWeek: number
  ordersToday: number
  revenueThisMonth: number
  revenueThisWeek: number
  revenueToday: number
  overdueOrders: number
  urgentOrders: number
  paymentProgressPercentage: number
  hasOverdueItems: boolean
  isFullyPaid: boolean
}
