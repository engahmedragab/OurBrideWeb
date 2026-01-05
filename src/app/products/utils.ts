/**
 * Utility functions for product pages
 */

import type { ProductFilter } from '@/types/product'
import { SORT_MAP } from './constants'

/**
 * Build API query parameters from filters and sort
 */
export const buildProductQueryParams = (
  filters: ProductFilter,
  sortBy: string
) => {
  const params: {
    categoryId?: number
    minPrice?: number
    maxPrice?: number
    rating?: number
    sortBy?: string
  } = {}

  if (filters.category && filters.category.length > 0) {
    const categoryId = parseInt(filters.category[0], 10)
    if (!isNaN(categoryId)) {
      params.categoryId = categoryId
    }
  }

  if (filters.priceRange) {
    params.minPrice = filters.priceRange.min
    params.maxPrice = filters.priceRange.max
  }

  if (filters.rating) {
    params.rating = filters.rating
  }

  if (sortBy !== 'default') {
    params.sortBy = SORT_MAP[sortBy] || sortBy
  }

  return params
}

/**
 * Apply client-side filtering and sorting
 */
export const applyClientSideFilters = <
  T extends {
    inStock: boolean
    price: { discounted: number }
    rating: { value: number; count: number }
  },
>(
  products: T[],
  filters: ProductFilter,
  sortBy: string
): T[] => {
  let result = [...products]

  // Apply inStock filter
  if (filters.inStock !== undefined) {
    result = result.filter(p => p.inStock === filters.inStock)
  }

  // Apply client-side sorting
  switch (sortBy) {
    case 'price-low':
      result.sort((a, b) => a.price.discounted - b.price.discounted)
      break
    case 'price-high':
      result.sort((a, b) => b.price.discounted - a.price.discounted)
      break
    case 'rating':
      result.sort((a, b) => b.rating.value - a.rating.value)
      break
    case 'popular':
      result.sort((a, b) => b.rating.count - a.rating.count)
      break
    default:
      // Keep API order
      break
  }

  return result
}

/**
 * Parse product ID from string
 */
export const parseProductId = (id: string | number | null): number | null => {
  if (!id) return null
  const parsed = typeof id === 'string' ? parseInt(id, 10) : id
  return isNaN(parsed) ? null : parsed
}
