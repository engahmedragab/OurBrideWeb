import { useCallback } from 'react'
import {
  useToggleServiceFavorite,
  useToggleServiceWishlist,
} from './useServiceInteractions'

/**
 * Hook to get handlers for service card interactions
 * Use this hook in parent components to handle favorite and wishlist toggles
 */
export const useServiceCardHandlers = (serviceId: number) => {
  const toggleFavorite = useToggleServiceFavorite()
  const toggleWishlist = useToggleServiceWishlist()

  const handleFavoriteToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      toggleFavorite.mutate(serviceId)
    },
    [serviceId, toggleFavorite]
  )

  const handleWishlistToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      toggleWishlist.mutate(serviceId)
    },
    [serviceId, toggleWishlist]
  )

  return {
    handleFavoriteToggle,
    handleWishlistToggle,
    isLoadingFavorite: toggleFavorite.isPending,
    isLoadingWishlist: toggleWishlist.isPending,
  }
}
