import { useQuery } from '@tanstack/react-query'
import { getProductBySku } from '@/services/api/products.api'
import { mapProductResponseToProduct } from '@/types/api/product.api.types'
import type { Product } from '@/types/product'

/**
 * Hook to fetch product by SKU
 */
export const useProductBySku = (
  sku: string | null,
  params?: {
    providerId?: number
    branchId?: number
    staffId?: string
    enabled?: boolean
  }
) => {
  const { enabled = true, ...skuParams } = params || {}

  return useQuery({
    queryKey: ['product-sku', sku, skuParams],
    queryFn: async (): Promise<Product | null> => {
      if (!sku || sku.trim().length === 0) {
        return null
      }

      const product = await getProductBySku(sku, skuParams)
      if (!product) {
        return null
      }

      return mapProductResponseToProduct(product)
    },
    enabled: enabled && !!sku && sku.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
