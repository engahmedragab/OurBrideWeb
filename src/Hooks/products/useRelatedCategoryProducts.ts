import { useQuery } from '@tanstack/react-query'
import { getRelatedCategoryProducts } from '@/services/api/products.api'
import { mapProductResponsesToProducts } from '@/types/api/product.api.types'
import type { Product } from '@/types/product'

/**
 * Hook to fetch related category products
 */
export const useRelatedCategoryProducts = (
  productId: number | string | null,
  categoryId: number | string | null,
  params?: {
    providerId?: number
    branchId?: number
    staffId?: string
    enabled?: boolean
  }
) => {
  const { enabled = true, ...relatedParams } = params || {}
  const prodId = typeof productId === 'string' ? parseInt(productId, 10) : productId
  const catId = typeof categoryId === 'string' ? parseInt(categoryId, 10) : categoryId

  return useQuery({
    queryKey: ['related-category-products', prodId, catId, relatedParams],
    queryFn: async (): Promise<Product[]> => {
      if (!prodId || !catId || isNaN(prodId) || isNaN(catId)) {
        return []
      }

      const products = await getRelatedCategoryProducts(prodId, catId, relatedParams)
      return mapProductResponsesToProducts(products)
    },
    enabled: enabled && !!prodId && !!catId && !isNaN(prodId) && !isNaN(catId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

