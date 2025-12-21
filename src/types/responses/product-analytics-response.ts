/**
 * Product Analytics Response
 */

export interface ProductAnalyticsResponse {
  productId: number
  productName: string | null
  sku: string | null
  totalViews: number
  totalSales: number
  totalRevenue: number // decimal
  averageRating: number // decimal
  totalReviews: number
  totalWishlistAdds: number
  totalCartAdds: number
  conversionRate: number // decimal
  startDate: string // ISO DateTime string
  endDate: string // ISO DateTime string
  generatedAt: string // ISO DateTime string

  // Daily breakdown
  dailyBreakdown: DailyAnalytics[]
}

export interface DailyAnalytics {
  date: string // ISO DateTime string
  views: number
  sales: number
  revenue: number // decimal
  reviews: number
  wishlistAdds: number
  cartAdds: number
}
