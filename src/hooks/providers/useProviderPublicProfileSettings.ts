/**
 * Provider Public Profile Settings Hooks
 * React Query hooks for managing provider public profile settings
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProviderPublicProfileSettings,
  updateProviderPublicProfileSettings,
} from '@/services/api/providerApi'
import type { UpdateProviderPublicProfileSettingsRequest } from '@/../client/common/api/gen/ourbride-api'
import { useToast } from '@/components/ui/Toaster'
import { handleApiResponseForToast } from '@/utils/api-response.utils'
import { useI18nTranslations } from '@/i18n'

/**
 * Hook to fetch provider public profile settings
 */
export const useProviderPublicProfileSettings = (
  providerId: number | null,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['providerPublicProfileSettings', providerId],
    queryFn: async () => {
      if (!providerId) return null
      return await getProviderPublicProfileSettings(providerId)
    },
    enabled: enabled && providerId !== null,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to update provider public profile settings
 */
export const useUpdateProviderPublicProfileSettings = () => {
  const t = useI18nTranslations('alert')
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async ({
      providerId,
      data,
    }: {
      providerId: number
      data: UpdateProviderPublicProfileSettingsRequest
    }) => {
      await updateProviderPublicProfileSettings(providerId, data)
    },
    onSuccess: (response, variables) => {
      // Invalidate the settings query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ['providerPublicProfileSettings', variables.providerId],
      })

      const { message, type } = handleApiResponseForToast(
        response,
        t('providerSettingsUpdatedSuccess'),
        t('providerSettingsUpdatedError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : t('providerSettingsUpdatedError')
      addToast(errorMessage, 'error')
    },
  })
}
