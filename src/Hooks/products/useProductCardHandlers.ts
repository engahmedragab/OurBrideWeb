import { useCallback } from 'react'
import {
  useToggleProductFavorite,
  useToggleProductWishlist,
} from './useProductInteractions'

/**
 * Hook to get handlers for product card interactions
 * Use this hook in parent components to handle favorite and wishlist toggles
 */
export const useProductCardHandlers = (productId: number) => {
  const toggleFavorite = useToggleProductFavorite()
  const toggleWishlist = useToggleProductWishlist()

  const handleFavoriteToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      toggleFavorite.mutate({ productId })
    },
    [productId, toggleFavorite]
  )

  const handleWishlistToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      toggleWishlist.mutate({ productId })
    },
    [productId, toggleWishlist]
  )

  return {
    handleFavoriteToggle,
    handleWishlistToggle,
    isLoadingFavorite: toggleFavorite.isPending,
    isLoadingWishlist: toggleWishlist.isPending,
  }
}
