import { useQuery } from '@tanstack/react-query'
import { getProductById, getProductBySlug } from '@/services/api/products.api'
import { mapProductResponseToProduct } from '@/types/api/product.api.types'
import type { Product } from '@/types/product'

/**
 * Hook to fetch product by ID
 */
export const useProductDetails = (
  id: string | number | null,
  enabled = true
) => {
  const productId = typeof id === 'string' ? parseInt(id, 10) : id

  return useQuery({
    queryKey: ['product', productId],
    queryFn: async (): Promise<Product | null> => {
      if (!productId || isNaN(productId)) {
        return null
      }

      const product = await getProductById(productId)
      if (!product) {
        return null
      }

      return mapProductResponseToProduct(product)
    },
    enabled: enabled && !!productId && !isNaN(productId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch product by slug
 */
export const useProductBySlug = (slug: string | null, enabled = true) => {
  return useQuery({
    queryKey: ['product-slug', slug],
    queryFn: async (): Promise<Product | null> => {
      if (!slug) {
        return null
      }

      const product = await getProductBySlug(slug)
      if (!product) {
        return null
      }

      return mapProductResponseToProduct(product)
    },
    enabled: enabled && !!slug,
    staleTime: 5 * 60 * 1000,
  })
}
