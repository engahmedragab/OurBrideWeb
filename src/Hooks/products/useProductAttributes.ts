import { useQuery } from '@tanstack/react-query'
import { getProductAttributes } from '@/services/api/products.api'
import type { ProductAttributeResponse } from '@/../client/common/api/gen/ourbride-api'

/**
 * Hook to fetch product attributes
 */
export const useProductAttributes = (
  productId: number | null,
  params?: {
    providerId?: number
    branchId?: number
    staffId?: string
    enabled?: boolean
  }
) => {
  const { enabled = true, ...attributeParams } = params || {}

  return useQuery({
    queryKey: ['product-attributes', productId, attributeParams],
    queryFn: async (): Promise<ProductAttributeResponse[]> => {
      if (!productId) {
        return []
      }

      return await getProductAttributes(productId, attributeParams)
    },
    enabled: enabled && !!productId,
    staleTime: 10 * 60 * 1000, // 10 minutes - attributes don't change often
  })
}

