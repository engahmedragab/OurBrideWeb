import { useQuery } from '@tanstack/react-query'
import { getServiceById } from '@/services/api/serviceApi'
import { mapServiceResponseToService } from '@/utils/services-category.utils'
import type { Service } from '@/types/service'
import type { ServiceResponse } from '@/types/responses/service-response'

export interface ServiceDetailData {
  service: Service | null
}

export const useServiceDetail = (serviceId: string, enabled = true) => {
  return useQuery({
    queryKey: ['service-detail', serviceId],
    queryFn: async (): Promise<ServiceDetailData> => {
      try {
        const parsedId = parseInt(serviceId, 10)
        if (isNaN(parsedId)) {
          throw new Error('Invalid service ID')
        }

        // Fetch ServiceResponse from API
        const serviceResponse: ServiceResponse | null = await getServiceById(parsedId)
        
        if (!serviceResponse) {
          return { service: null }
        }

        // Map ServiceResponse to Service type for component usage
        const service = mapServiceResponseToService(serviceResponse)
        return { service }
      } catch (error) {
        throw error
      }
    },
    enabled: enabled && !!serviceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

