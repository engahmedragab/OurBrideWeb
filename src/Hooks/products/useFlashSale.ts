import { useQuery } from '@tanstack/react-query'
import { getFlashSaleGrouped } from '@/services/api/products.api'
import { mapProductResponsesToProducts } from '@/types/api/product.api.types'
import type { Product } from '@/types/product'
import type { ProductResponse } from '@/types/responses'

/**
 * Hook to fetch flash sale grouped products
 */
export const useFlashSaleGrouped = (params?: {
  providerId?: number
  branchId?: number
  staffId?: string
  enabled?: boolean
}) => {
  const { enabled = true, ...flashSaleParams } = params || {}

  return useQuery({
    queryKey: ['flash-sale-grouped', flashSaleParams],
    queryFn: async (): Promise<Product[]> => {
      try {
        const result = await getFlashSaleGrouped(flashSaleParams)
        
        // Handle ApiResult response structure
        const resultAny = result as unknown as Record<string, unknown>
        
        if (resultAny && 'data' in resultAny && resultAny.data) {
          const data = resultAny.data
          
          if (Array.isArray(data)) {
            return mapProductResponsesToProducts(data as ProductResponse[])
          }
          
          if (typeof data === 'object' && data !== null) {
            const dataObj = data as Record<string, unknown>
            
            if ('products' in dataObj && Array.isArray(dataObj.products)) {
              return mapProductResponsesToProducts(dataObj.products as ProductResponse[])
            }
            
            if ('items' in dataObj && Array.isArray(dataObj.items)) {
              return mapProductResponsesToProducts(dataObj.items as ProductResponse[])
            }
            
            if ('results' in dataObj && Array.isArray(dataObj.results)) {
              return mapProductResponsesToProducts(dataObj.results as ProductResponse[])
            }
          }
        }
        
        return []
      } catch (error) {
        return []
      }
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

