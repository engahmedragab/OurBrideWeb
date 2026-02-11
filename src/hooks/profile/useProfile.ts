import { useI18nTranslations } from '@/i18n/hooks';
/**
 * Profile React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserProfile, updateUserProfile } from '@/services/profile/profileApi'
import type { UserRequest } from '@/../client/common/api/gen/ourbride-api'
import { useToast } from '@/components/ui/Toaster'
import { handleApiResponseForToast } from '@/utils/api-response.utils'
import { isAuthenticated } from '@/auth/utils/token'

/**
 * Hook to fetch user profile
 */
export const useUserProfileData = (enabled: boolean = true) => {
  const authenticated = isAuthenticated()

  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      return await getUserProfile()
    },
    enabled: enabled && authenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to update user profile
 */
export const useUpdateUserProfile = () => {
  const t = useI18nTranslations('alert')
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async (data: UserRequest) => {
      await updateUserProfile(data)
    },
    onSuccess: (response) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      queryClient.invalidateQueries({ queryKey: ['mine-info'] })

      const { message, type } = handleApiResponseForToast(
        response,
        t('profileUpdatedSuccess'),
        t('profileUpdatedError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : t('profileUpdatedError')
      addToast(errorMessage, 'error')
    },
  })
}
