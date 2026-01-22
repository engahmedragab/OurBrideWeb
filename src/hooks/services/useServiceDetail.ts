import { useQuery } from '@tanstack/react-query'
import { getServiceById, getServiceBySlug } from '@/services/api/serviceApi'
import { mapServiceResponseToService } from '@/utils/services-category.utils'
import type { Service } from '@/types/service'
import type { ServiceResponse } from '@/types/responses/service-response'
import { useLocale } from '@/i18n'

export interface ServiceDetailData {
  service: Service | null
  rawServiceResponse: ServiceResponse | null
}

// Helper function to determine if a string is a number
const isNumeric = (str: string): boolean => {
  return /^\d+$/.test(str)
}

export const useServiceDetail = (serviceId: string, enabled = true) => {
  const locale = useLocale()
  return useQuery({
    queryKey: ['service-detail', serviceId, locale],
    queryFn: async (): Promise<ServiceDetailData> => {
      try {
        let serviceResponse: ServiceResponse | null = null

        // Support both ID and slug
        if (isNumeric(serviceId)) {
          const parsedId = parseInt(serviceId, 10)
          serviceResponse = await getServiceById(parsedId)
        } else {
          serviceResponse = await getServiceBySlug(serviceId)
        }
        
        if (!serviceResponse) {
          return { service: null, rawServiceResponse: null }
        }

        // Map ServiceResponse to Service type for component usage
        const service = mapServiceResponseToService(serviceResponse, locale)
        return { service, rawServiceResponse: serviceResponse }
      } catch (error) {
        throw error
      }
    },
    enabled: enabled && !!serviceId && !!locale,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

