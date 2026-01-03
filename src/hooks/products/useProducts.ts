import { useQuery } from '@tanstack/react-query'
import { getProducts, getFilteredProducts } from '@/services/api/products.api'
import { mapProductResponsesToProducts } from '@/types/api/product.api.types'
import type { GetProductsParams } from '@/services/api/products.api'
import type { ProductResponse } from '@/types/responses'

export interface UseProductsParams extends GetProductsParams {
  enabled?: boolean
}

/**
 * Hook to fetch products list
 */
export const useProducts = (params?: UseProductsParams) => {
  const { enabled = true, ...queryParams } = params || {}

  return useQuery({
    queryKey: ['products', queryParams],
    queryFn: async () => {
      const products = await getProducts(queryParams)
      return mapProductResponsesToProducts(products)
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch filtered products
 */
export const useFilteredProducts = (params?: {
  search?: string
  categoryId?: number
  minPrice?: number
  maxPrice?: number
  rating?: number
  sortBy?: string
  enabled?: boolean
}) => {
  const { enabled = true, ...filterParams } = params || {}

  return useQuery({
    queryKey: ['filtered-products', filterParams],
    queryFn: async () => {
      try {
        const result = await getFilteredProducts(filterParams)
        
        // The filtered products endpoint returns ApiResult
        // Treat result as unknown to safely access potential data property
        const resultAny = result as unknown as Record<string, unknown>
        
        // Check if result has a data property (common API pattern)
        if (resultAny && 'data' in resultAny && resultAny.data) {
          const data = resultAny.data
          
          // If data is an array of products
          if (Array.isArray(data)) {
            return mapProductResponsesToProducts(data as ProductResponse[])
          }
          
          // If data is an object with products/items/results property
          if (typeof data === 'object' && data !== null) {
            const dataObj = data as Record<string, unknown>
            
            // Check for 'products' property
            if ('products' in dataObj && Array.isArray(dataObj.products)) {
              return mapProductResponsesToProducts(dataObj.products as ProductResponse[])
            }
            
            // Check for 'items' property
            if ('items' in dataObj && Array.isArray(dataObj.items)) {
              return mapProductResponsesToProducts(dataObj.items as ProductResponse[])
            }
            
            // Check for 'results' property
            if ('results' in dataObj && Array.isArray(dataObj.results)) {
              return mapProductResponsesToProducts(dataObj.results as ProductResponse[])
            }
            
            // Check for 'data' property (nested)
            if ('data' in dataObj && Array.isArray(dataObj.data)) {
              return mapProductResponsesToProducts(dataObj.data as ProductResponse[])
            }
          }
        }
        
        return []
      } catch (error) {
        return []
      }
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}

