import { useCallback } from 'react'
import {
  useToggleServiceFavorite,
  useToggleServiceWishlist,
} from './useServiceInteractions'

/**
 * Hook to get handlers for service card interactions
 * Use this hook in parent components to handle favorite and wishlist toggles
 */
export const useServiceCardHandlers = (
  serviceId: number,
  options?: {
    onFavoriteSuccess?: (response: boolean) => void
    onFavoriteError?: (error: Error) => void
    onWishlistSuccess?: (response: boolean) => void
    onWishlistError?: (error: Error) => void
  }
) => {
  const toggleFavorite = useToggleServiceFavorite()
  const toggleWishlist = useToggleServiceWishlist()

  const handleFavoriteToggle = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      try {
        const response = await toggleFavorite.mutateAsync(serviceId)
        options?.onFavoriteSuccess?.(response)
      } catch (error) {
        options?.onFavoriteError?.(error instanceof Error ? error : new Error('Failed to toggle favorite'))
      }
    },
    [serviceId, toggleFavorite, options]
  )

  const handleWishlistToggle = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      try {
        const response = await toggleWishlist.mutateAsync(serviceId)
        options?.onWishlistSuccess?.(response)
      } catch (error) {
        options?.onWishlistError?.(error instanceof Error ? error : new Error('Failed to toggle wishlist'))
      }
    },
    [serviceId, toggleWishlist, options]
  )

  return {
    handleFavoriteToggle,
    handleWishlistToggle,
    isLoadingFavorite: toggleFavorite.isPending,
    isLoadingWishlist: toggleWishlist.isPending,
  }
}
