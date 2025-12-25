import { useQuery } from '@tanstack/react-query'
import { getServiceById } from '@/services/api/serviceApi'
import { mapServiceResponseToService } from '@/utils/services-category.utils'
import type { Service } from '@/types/service'
import type { ServiceResponse } from '@/types/responses/service-response'
import { isObject } from '@/utils/home-data.utils'

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

        const result = await getServiceById(parsedId)
        const responseObj = isObject(result) ? result : {}
        const data = (isObject(responseObj.data)
          ? responseObj.data
          : responseObj) as ServiceResponse | Record<string, unknown>

        if (!data || !isObject(data)) {
          return { service: null }
        }

        const service = mapServiceResponseToService(data as unknown as ServiceResponse)
        return { service }
      } catch (error) {
        console.error('Error fetching service detail:', error)
        throw error
      }
    },
    enabled: enabled && !!serviceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

