import { useQuery } from '@tanstack/react-query'
import { getProductCategories } from '@/services/api/products.api'
import { mapCategoryResponseToProductCategory } from '@/types/api/product.api.types'
import type { ProductCategory } from '@/types/product'
import type { ProductCategoryLineResponse } from '@/types/responses/product-category-line-response'

/**
 * Hook to fetch product categories
 */
export const useProductCategories = (enabled = true) => {
  return useQuery({
    queryKey: ['product-categories'],
    queryFn: async (): Promise<ProductCategory[]> => {
      try {
        const result = await getProductCategories()

        // The API returns ApiResult, but the actual response may have a data property
        // Treat result as unknown to safely access potential data property
        const resultAny = result as unknown as Record<string, unknown>

        // Check if result has a data property (common API pattern)
        if (resultAny && 'data' in resultAny && resultAny.data) {
          const data = resultAny.data

          // If data is an array of categories
          if (Array.isArray(data)) {
            return (data as ProductCategoryLineResponse[]).map(
              mapCategoryResponseToProductCategory
            )
          }

          // If data is an object with categories property
          if (typeof data === 'object' && data !== null) {
            const dataObj = data as Record<string, unknown>

            // Check for 'categories' property
            if ('categories' in dataObj && Array.isArray(dataObj.categories)) {
              return (dataObj.categories as ProductCategoryLineResponse[]).map(
                mapCategoryResponseToProductCategory
              )
            }

            // Check for 'items' or 'results' property (common API patterns)
            if ('items' in dataObj && Array.isArray(dataObj.items)) {
              return (dataObj.items as ProductCategoryLineResponse[]).map(
                mapCategoryResponseToProductCategory
              )
            }

            if ('results' in dataObj && Array.isArray(dataObj.results)) {
              return (dataObj.results as ProductCategoryLineResponse[]).map(
                mapCategoryResponseToProductCategory
              )
            }
          }
        }

        // If result itself is an array (direct response)
        if (Array.isArray(resultAny)) {
          return (resultAny as ProductCategoryLineResponse[]).map(
            mapCategoryResponseToProductCategory
          )
        }

        return []
      } catch (error) {
        return []
      }
    },
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
    retry: 1, // Only retry once on failure
    retryDelay: 1000, // Wait 1 second before retry
  })
}
