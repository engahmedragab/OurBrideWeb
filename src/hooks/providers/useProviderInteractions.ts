import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  toggleProviderFollow,
  toggleProviderFavorite,
} from '@/services/api/providerApi'
import { useToast } from '@/components/ui/Toaster'
import { handleApiResponseForToast } from '@/utils/api-response.utils'

/**
 * Hook to toggle provider follow
 */
export const useToggleProviderFollow = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async (providerId: number) => {
      return await toggleProviderFollow(providerId)
    },
    onSuccess: (response, providerId) => {
      // Invalidate provider queries to refetch updated follow status
      queryClient.invalidateQueries({ queryKey: ['provider', providerId] })
      queryClient.invalidateQueries({ queryKey: ['providers'] })
      queryClient.invalidateQueries({ queryKey: ['follows'] })

      const { message, type } = handleApiResponseForToast(
        response,
        'Provider follow toggled successfully',
        'Failed to toggle provider follow'
      )
      addToast(message, type)
    },
    onError: error => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to toggle provider follow'
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to toggle provider favorite
 */
export const useToggleProviderFavorite = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async (providerId: number) => {
      return await toggleProviderFavorite(providerId)
    },
    onSuccess: (response, providerId) => {
      // Invalidate provider queries to refetch updated favorite status
      queryClient.invalidateQueries({ queryKey: ['provider', providerId] })
      queryClient.invalidateQueries({ queryKey: ['providers'] })
      queryClient.invalidateQueries({ queryKey: ['favorites'] })

      const { message, type } = handleApiResponseForToast(
        response,
        'Provider favorite toggled successfully',
        'Failed to toggle provider favorite'
      )
      addToast(message, type)
    },
    onError: error => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to toggle provider favorite'
      addToast(errorMessage, 'error')
    },
  })
}
