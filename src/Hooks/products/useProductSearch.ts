import { useQuery } from '@tanstack/react-query'
import { searchProducts } from '@/services/api/products.api'
import { mapProductResponsesToProducts } from '@/types/api/product.api.types'
import type { Product } from '@/types/product'

/**
 * Hook to search products
 */
export const useProductSearch = (
  query: string | null,
  params?: {
    providerId?: number
    branchId?: number
    staffId?: string
    enabled?: boolean
  }
) => {
  const { enabled = true, ...searchParams } = params || {}

  return useQuery({
    queryKey: ['product-search', query, searchParams],
    queryFn: async (): Promise<Product[]> => {
      if (!query || query.trim().length === 0) {
        return []
      }

      const products = await searchProducts(query, searchParams)
      return mapProductResponsesToProducts(products)
    },
    enabled: enabled && !!query && query.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

