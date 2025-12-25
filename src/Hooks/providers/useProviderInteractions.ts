import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  toggleProviderFollow,
  toggleProviderFavorite,
} from '@/services/api/providerApi'

/**
 * Hook to toggle provider follow
 */
export const useToggleProviderFollow = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (providerId: number) => {
      return await toggleProviderFollow(providerId)
    },
    onSuccess: (_, providerId) => {
      // Invalidate provider queries to refetch updated follow status
      queryClient.invalidateQueries({ queryKey: ['provider', providerId] })
      queryClient.invalidateQueries({ queryKey: ['providers'] })
      queryClient.invalidateQueries({ queryKey: ['follows'] })
    },
  })
}

/**
 * Hook to toggle provider favorite
 */
export const useToggleProviderFavorite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (providerId: number) => {
      return await toggleProviderFavorite(providerId)
    },
    onSuccess: (_, providerId) => {
      // Invalidate provider queries to refetch updated favorite status
      queryClient.invalidateQueries({ queryKey: ['provider', providerId] })
      queryClient.invalidateQueries({ queryKey: ['providers'] })
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}
