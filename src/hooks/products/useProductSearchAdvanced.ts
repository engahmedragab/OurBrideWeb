import { useQuery } from '@tanstack/react-query'
import { searchProductsAdvanced } from '@/services/api/products.api'
import { mapProductResponsesToProducts } from '@/types/api/product.api.types'
import type { Product } from '@/types/product'
import type { ProductResponse } from '@/types/responses'
import type { SearchProductsRequest } from '@/../client/common/api/gen/ourbride-api'

export interface UseProductSearchAdvancedParams extends SearchProductsRequest {
  providerId?: number
  branchId?: number
  staffId?: string
  enabled?: boolean
}

/**
 * Hook for advanced product search (POST)
 * POST /api/v1/products/search
 */
export const useProductSearchAdvanced = (
  params?: UseProductSearchAdvancedParams
) => {
  const {
    enabled = true,
    providerId,
    branchId,
    staffId,
    ...searchParams
  } = params || {}

  return useQuery({
    queryKey: [
      'product-search-advanced',
      searchParams,
      { providerId, branchId, staffId },
    ],
    queryFn: async (): Promise<Product[]> => {
      try {
        const result = await searchProductsAdvanced(
          searchParams as SearchProductsRequest,
          { providerId, branchId, staffId }
        )

        const resultAny = result as any

        // Extract products from response
        if (resultAny && 'data' in resultAny && resultAny.data) {
          const data = resultAny.data

          if (Array.isArray(data)) {
            return mapProductResponsesToProducts(data as ProductResponse[])
          }

          if (typeof data === 'object' && data !== null) {
            const dataObj = data as Record<string, unknown>

            if ('products' in dataObj && Array.isArray(dataObj.products)) {
              return mapProductResponsesToProducts(
                dataObj.products as ProductResponse[]
              )
            }

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

            if ('data' in dataObj && Array.isArray(dataObj.data)) {
              return mapProductResponsesToProducts(
                dataObj.data as ProductResponse[]
              )
            }
          }
        }

        return []
      } catch (error) {
        return []
      }
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}
