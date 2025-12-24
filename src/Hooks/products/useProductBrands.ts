import { useQuery } from '@tanstack/react-query'
import { getProductBrands } from '@/services/api/products.api'
import type { ProductBrandResponse } from '@/../client/common/api/gen/ourbride-api'

/**
 * Hook to fetch all product brands
 */
export const useProductBrands = (params?: {
  providerId?: number
  branchId?: number
  staffId?: string
  enabled?: boolean
}) => {
  const { enabled = true, ...brandParams } = params || {}

  return useQuery({
    queryKey: ['product-brands', brandParams],
    queryFn: async (): Promise<ProductBrandResponse[]> => {
      return await getProductBrands(brandParams)
    },
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes - brands don't change often
  })
}

