/**
 * Products Home Response
 * Response model for Products Home page data
 */

import type { ProductHeaderResponse } from './product-header-response'
import type { ProductBrandResponse } from './product-brand-response'
import type { CategoryResponse } from './category-response'
import type { OrderStatisticsResponse } from './order-statistics-response'

export interface ProductsHomeResponse {
  tags: ProductHeaderResponse[]
  attributes: ProductHeaderResponse[]
  brands: ProductBrandResponse[]
  flashSaleGrouped: Record<string, ProductHeaderResponse[]> // Dictionary<DateTime, List<ProductHeaderResponse>>
  headers: ProductHeaderResponse[]
  categories: CategoryResponse[]
  statistics: OrderStatisticsResponse
}
