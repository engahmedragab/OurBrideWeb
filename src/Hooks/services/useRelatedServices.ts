import { useQuery } from '@tanstack/react-query'
import {
  getServicesByPreparationId,
  getServicesByProviderId,
} from '@/services/api/serviceApi'
import { extractServicesCategoryData } from '@/utils/services-category.utils'
import type { Service } from '@/types/service'

export interface RelatedServicesData {
  services: Service[]
}

export const useRelatedServicesByPreparation = (
  preparationId: number | null,
  enabled = true
) => {
  return useQuery({
    queryKey: ['related-services-preparation', preparationId],
    queryFn: async (): Promise<RelatedServicesData> => {
      try {
        if (!preparationId) {
          return { services: [] }
        }

        const result = await getServicesByPreparationId(preparationId)
        const extractedData = extractServicesCategoryData(result)

        return {
          services: extractedData.services || [],
        }
      } catch (error) {
        console.error('Error fetching related services by preparation:', error)
        throw error
      }
    },
    enabled: enabled && !!preparationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

export const useRelatedServicesByProvider = (
  providerId: number | null,
  enabled = true
) => {
  return useQuery({
    queryKey: ['related-services-provider', providerId],
    queryFn: async (): Promise<RelatedServicesData> => {
      try {
        if (!providerId) {
          return { services: [] }
        }

        const result = await getServicesByProviderId(providerId)
        const extractedData = extractServicesCategoryData(result)

        return {
          services: extractedData.services || [],
        }
      } catch (error) {
        console.error('Error fetching related services by provider:', error)
        throw error
      }
    },
    enabled: enabled && !!providerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

