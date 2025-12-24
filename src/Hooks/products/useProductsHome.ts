import { useQuery } from '@tanstack/react-query'
import { getProductsHome } from '@/services/api/products.api'
import { extractProductsHomeData } from '@/utils/home-data.utils'
import type { Product } from '@/types/product'

export interface ProductsHomeData {
  products: Product[]
  categories: Array<{ id: number; name: string; slug?: string }>
}

/**
 * Hook to fetch products home data
 */
export const useProductsHome = (enabled = true) => {
  return useQuery({
    queryKey: ['products-home'],
    queryFn: async (): Promise<ProductsHomeData> => {
      try {
        const result = await getProductsHome()
        const extractedData = extractProductsHomeData(result)
        
        return {
          products: extractedData.products || [],
          categories: extractedData.categories || [],
        }
      } catch (error) {
        console.error('Error fetching products home:', error)
        throw error
      }
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

