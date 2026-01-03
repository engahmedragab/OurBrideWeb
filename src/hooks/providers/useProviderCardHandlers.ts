import { useCallback } from 'react'
import {
  useToggleProviderFollow,
  useToggleProviderFavorite,
} from './useProviderInteractions'

/**
 * Hook to get handlers for provider card interactions
 * Use this hook in parent components to handle follow and favorite toggles
 */
export const useProviderCardHandlers = (providerId: number) => {
  const toggleFollow = useToggleProviderFollow()
  const toggleFavorite = useToggleProviderFavorite()

  const handleFollowToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      toggleFollow.mutate(providerId)
    },
    [providerId, toggleFollow]
  )

  const handleFavoriteToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      toggleFavorite.mutate(providerId)
    },
    [providerId, toggleFavorite]
  )

  return {
    handleFollowToggle,
    handleFavoriteToggle,
    isLoadingFollow: toggleFollow.isPending,
    isLoadingFavorite: toggleFavorite.isPending,
  }
}
