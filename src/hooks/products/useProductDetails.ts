import { useQuery } from '@tanstack/react-query'
import { getProductById, getProductBySlug } from '@/services/api/products.api'
import { mapProductResponseToProduct } from '@/types/api/product.api.types'
import type { Product } from '@/types/product'

// Helper function to determine if a string is a number
const isNumeric = (str: string): boolean => {
  return /^\d+$/.test(str)
}

/**
 * Hook to fetch product by ID or slug
 */
export const useProductDetails = (id: string | number | null, enabled = true) => {
  const idString = typeof id === 'number' ? String(id) : id

  return useQuery({
    queryKey: ['product', idString],
    queryFn: async (): Promise<Product | null> => {
      if (!idString) {
        return null
      }

      let product = null
      
      // Support both ID and slug
      if (typeof id === 'number') {
        product = await getProductById(id)
      } else if (isNumeric(idString)) {
        const productId = parseInt(idString, 10)
        if (!isNaN(productId)) {
          product = await getProductById(productId)
        }
      } else {
        product = await getProductBySlug(idString)
      }

      if (!product) {
        return null
      }

      return mapProductResponseToProduct(product)
    },
    enabled: enabled && !!idString,
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

