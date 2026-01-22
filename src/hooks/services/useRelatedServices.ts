'use client'

import { useQuery } from '@tanstack/react-query'
import {
  getServicesByPreparationId,
  getServicesByProviderId,
} from '@/services/api/serviceApi'
import { extractServicesCategoryData } from '@/utils/services-category.utils'
import type { Service } from '@/types/service'
import { useI18nLocale } from '@/i18n/hooks'

export interface RelatedServicesData {
  services: Service[]
}

export const useRelatedServicesByPreparation = (
  preparationId: number | null,
  enabled = true
) => {
  const locale = useI18nLocale()

  return useQuery({
    queryKey: ['related-services-preparation', preparationId, locale],
    queryFn: async (): Promise<RelatedServicesData> => {
      if (!preparationId) return { services: [] }

      const result = await getServicesByPreparationId(preparationId)
      const extractedData = extractServicesCategoryData(result, locale)

      return { services: extractedData.services || [] }
    },
    enabled: enabled && !!preparationId && !!locale,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useRelatedServicesByProvider = (
  providerId: number | null,
  enabled = true
) => {
  const locale = useI18nLocale()

  return useQuery({
    queryKey: ['related-services-provider', providerId, locale],
    queryFn: async (): Promise<RelatedServicesData> => {
      if (!providerId) return { services: [] }

      const result = await getServicesByProviderId(providerId)
      const extractedData = extractServicesCategoryData(result, locale)

      return { services: extractedData.services || [] }
    },
    enabled: enabled && !!providerId && !!locale,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
