import { useQuery } from '@tanstack/react-query'
import {
  getProductOffers,
  getProductsByCategory,
  getRelatedProducts,
} from '@/services/api/products.api'
import { mapProductResponsesToProducts } from '@/types/api/product.api.types'
import type { Product } from '@/types/product'
import type { ProductResponse } from '@/types/responses'

/**
 * Hook to fetch product offers
 */
export const useProductOffers = (enabled = true) => {
  return useQuery({
    queryKey: ['product-offers'],
    queryFn: async (): Promise<Product[]> => {
      try {
        const result = await getProductOffers()

        // The API returns ApiResult, but the actual response may have a data property
        // Treat result as unknown to safely access potential data property
        const resultAny = result as unknown as Record<string, unknown>

        // Check if result has a data property (common API pattern)
        if (resultAny && 'data' in resultAny && resultAny.data) {
          const data = resultAny.data

          // If data is an array of products
          if (Array.isArray(data)) {
            return mapProductResponsesToProducts(data as ProductResponse[])
          }

          // If data is an object with products property
          if (typeof data === 'object' && data !== null) {
            const dataObj = data as Record<string, unknown>

            // Check for 'products' property
            if ('products' in dataObj && Array.isArray(dataObj.products)) {
              return mapProductResponsesToProducts(
                dataObj.products as ProductResponse[]
              )
            }

            // Check for 'items' or 'results' property (common API patterns)
            if ('items' in dataObj && Array.isArray(dataObj.items)) {
              return mapProductResponsesToProducts(
                dataObj.items as ProductResponse[]
              )
            }

            if ('results' in dataObj && Array.isArray(dataObj.results)) {
              return mapProductResponsesToProducts(
                dataObj.results as ProductResponse[]
              )
            }
          }
        }

        // If result itself is an array (direct response)
        if (Array.isArray(resultAny)) {
          return mapProductResponsesToProducts(resultAny as ProductResponse[])
        }

        return []
      } catch (error) {
        // Return empty array on error to prevent app from breaking
        return []
      }
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once on failure
    retryDelay: 1000, // Wait 1 second before retry
  })
}

/**
 * Hook to fetch products by category
 */
export const useProductsByCategory = (
  categoryId: number | null,
  params?: {
    page?: number
    pageSize?: number
    enabled?: boolean
  }
) => {
  const { enabled = true, ...queryParams } = params || {}

  return useQuery({
    queryKey: ['products-by-category', categoryId, queryParams],
    queryFn: async (): Promise<Product[]> => {
      if (!categoryId) {
        return []
      }

      const products = await getProductsByCategory(categoryId, queryParams)
      return mapProductResponsesToProducts(products)
    },
    enabled: enabled && !!categoryId,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook to fetch related products
 */
export const useRelatedProducts = (
  productId: number | string | null,
  limit?: number,
  enabled = true
) => {
  const id = typeof productId === 'string' ? parseInt(productId, 10) : productId

  return useQuery({
    queryKey: ['related-products', id, limit],
    queryFn: async (): Promise<Product[]> => {
      if (!id || isNaN(id)) {
        return []
      }

      const products = await getRelatedProducts(id, limit)
      return mapProductResponsesToProducts(products)
    },
    enabled: enabled && !!id && !isNaN(id),
    staleTime: 5 * 60 * 1000,
  })
}
