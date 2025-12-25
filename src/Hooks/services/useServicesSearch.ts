import { useQuery } from '@tanstack/react-query'
import { searchServices } from '@/services/api/serviceApi'
import { extractServicesCategoryData } from '@/utils/services-category.utils'
import type { Service, ServiceCategory } from '@/types/service'

export interface ServicesSearchData {
  services: Service[]
  categories?: ServiceCategory[]
  totalCount?: number
  page?: number
  pageSize?: number
}

export interface ServicesSearchParams {
  search?: string
  serviceClass?: number
  serviceType?: number
  minPrice?: number
  maxPrice?: number
  minRating?: number
  isOurBrideService?: boolean
  hasPackages?: boolean
  hasInstallment?: boolean
  page?: number
  pageSize?: number
}

export const useServicesSearch = (
  params?: ServicesSearchParams,
  enabled = true
) => {
  return useQuery({
    queryKey: ['services-search', params],
    queryFn: async (): Promise<ServicesSearchData> => {
      try {
        const query = {
          Search: params?.search,
          ServiceClass: params?.serviceClass,
          ServiceType: params?.serviceType,
          MinPrice: params?.minPrice,
          MaxPrice: params?.maxPrice,
          MinRating: params?.minRating,
          IsOurBrideService: params?.isOurBrideService,
          HasPackages: params?.hasPackages,
          HasInstallment: params?.hasInstallment,
          Page: params?.page,
          PageSize: params?.pageSize,
        }

        const result = await searchServices(query)
        
        // Try to extract data from different response structures
        const extractedData = extractServicesCategoryData(result)
        
        return {
          services: extractedData.services || [],
          categories: extractedData.categories,
          totalCount: (result as any)?.totalCount || (result as any)?.total || extractedData.services?.length || 0,
          page: params?.page || 1,
          pageSize: params?.pageSize || 10,
        }
      } catch (error) {
        console.error('Error searching services:', error)
        throw error
      }
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

