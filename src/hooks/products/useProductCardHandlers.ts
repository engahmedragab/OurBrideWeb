import { useCallback } from 'react'
import {
  useToggleProductFavorite,
  useToggleProductWishlist,
} from './useProductInteractions'

/**
 * Hook to get handlers for product card interactions
 * Use this hook in parent components to handle favorite and wishlist toggles
 */
export const useProductCardHandlers = (
  productId: number,
  options?: {
    onFavoriteSuccess?: (response: any) => void
    onFavoriteError?: (error: Error) => void
    onWishlistSuccess?: (response: any) => void
    onWishlistError?: (error: Error) => void
  }
) => {
  const toggleFavorite = useToggleProductFavorite()
  const toggleWishlist = useToggleProductWishlist()

  const handleFavoriteToggle = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      try {
        const response = await toggleFavorite.mutateAsync({ productId })
        options?.onFavoriteSuccess?.(response)
      } catch (error) {
        options?.onFavoriteError?.(error instanceof Error ? error : new Error('Failed to toggle favorite'))
      }
    },
    [productId, toggleFavorite, options]
  )

  const handleWishlistToggle = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      try {
        const response = await toggleWishlist.mutateAsync({ productId })
        options?.onWishlistSuccess?.(response)
      } catch (error) {
        options?.onWishlistError?.(error instanceof Error ? error : new Error('Failed to toggle wishlist'))
      }
    },
    [productId, toggleWishlist, options]
  )

  return {
    handleFavoriteToggle,
    handleWishlistToggle,
    isLoadingFavorite: toggleFavorite.isPending,
    isLoadingWishlist: toggleWishlist.isPending,
  }
}
