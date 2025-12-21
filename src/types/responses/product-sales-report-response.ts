/**
 * Product Sales Report Response
 */

export interface TopProduct {
  productId: number
  productName: string | null
  sku: string | null
  unitsSold: number
  revenue: number // decimal
}

export interface CategorySales {
  categoryId: number
  categoryName: string | null
  unitsSold: number
  revenue: number // decimal
}

export interface DailySales {
  date: string // ISO DateTime string
  unitsSold: number
  revenue: number // decimal
}

export interface ProductSalesReportResponse {
  startDate: string // ISO DateTime string
  endDate: string // ISO DateTime string
  totalProducts: number
  productsWithSales: number
  totalRevenue: number // decimal
  totalUnitsSold: number
  averageOrderValue: number // decimal
  generatedAt: string // ISO DateTime string
  topProducts: TopProduct[] | null
  salesByCategory: CategorySales[] | null
  dailySales: DailySales[] | null
}
