import { useQuery } from '@tanstack/react-query'
import { getServicesPreparations } from '@/services/api/serviceApi'
import { extractServicesCategoryData } from '@/utils/services-category.utils'
import type { Service } from '@/types/service'
import type { ProductCategory } from '@/types/product'
import { useI18nLocale } from '@/i18n'

export interface ServicesPreparationsData {
  services: Service[]
  categories: ProductCategory[]
}

export const useServicesPreparations = (enabled = true) => {
  const locale = useI18nLocale()

  return useQuery({
    queryKey: ['services-preparations', locale],
    queryFn: async (): Promise<ServicesPreparationsData> => {
      const result = await getServicesPreparations()
      const extractedData = extractServicesCategoryData(result, locale)

      return {
        services: extractedData.services || [],
        categories: extractedData.categories || [],
      }
    },
    enabled: enabled && !!locale,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
