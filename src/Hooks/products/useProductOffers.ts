import { useQuery } from '@tanstack/react-query'
import {
  getProductOffers,
  getProductsByCategory,
  getRelatedProducts,
} from '@/services/api/products.api'
import { mapProductResponsesToProducts } from '@/types/api/product.api.types'
import type { Product } from '@/types/product'

/**
 * Hook to fetch product offers
 */
export const useProductOffers = (enabled = true) => {
  return useQuery({
    queryKey: ['product-offers'],
    queryFn: async (): Promise<Product[]> => {
      const result = await getProductOffers()
      
      // The API returns ApiResult, extract products from data
      // Adjust this based on actual API response structure
      if (result.data) {
        if (Array.isArray(result.data)) {
          return mapProductResponsesToProducts(result.data as any[])
        }
        
        if (typeof result.data === 'object' && 'products' in result.data) {
          const products = (result.data as any).products
          if (Array.isArray(products)) {
            return mapProductResponsesToProducts(products)
          }
        }
      }
      
      return []
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
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

