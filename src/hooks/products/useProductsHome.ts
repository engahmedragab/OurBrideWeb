import { useQuery } from '@tanstack/react-query'
import { getProductsHome } from '@/services/api/products.api'
import type { ProductsHomeResponse } from '@/types/responses/products-home-response'

/**
 * Hook to fetch products home data
 */
export const useProductsHome = (enabled: boolean = true) => {
  return useQuery<ProductsHomeResponse | null, Error>({
    queryKey: ['productsHome'],
    queryFn: async () => {
      const result = await getProductsHome()
      return result.success && result.data ? result.data : null
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
