import { useQuery } from '@tanstack/react-query'
import { getProductVariations } from '@/services/api/products.api'
import type { ProductVariationResponse } from '@/types/responses'

/**
 * Hook to fetch product variations
 */
export const useProductVariations = (
  productId: number | string | null,
  params?: {
    providerId?: number
    branchId?: number
    staffId?: string
    enabled?: boolean
  }
) => {
  const { enabled = true, ...variationParams } = params || {}

  return useQuery({
    queryKey: ['product-variations', productId, variationParams],
    queryFn: async (): Promise<ProductVariationResponse[]> => {
      if (!productId) {
        return []
      }

      return await getProductVariations(productId, variationParams)
    },
    enabled: enabled && !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

