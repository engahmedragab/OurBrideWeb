import { useQuery } from '@tanstack/react-query'
import { getServicesPreparations } from '@/services/api/serviceApi'
import { extractServicesCategoryData } from '@/utils/services-category.utils'
import type { Service } from '@/types/service'
import type { ProductCategory } from '@/types/product'

export interface ServicesPreparationsData {
  services: Service[]
  categories: ProductCategory[]
}

export const useServicesPreparations = (enabled = true) => {
  return useQuery({
    queryKey: ['services-preparations'],
    queryFn: async (): Promise<ServicesPreparationsData> => {
      try {
        const result = await getServicesPreparations()
        const extractedData = extractServicesCategoryData(result)

        return {
          services: extractedData.services || [],
          categories: extractedData.categories || [],
        }
      } catch (error) {
        console.error('Error fetching services preparations:', error)
        throw error
      }
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}


