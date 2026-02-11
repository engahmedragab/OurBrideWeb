import { useCallback } from 'react'
import {
  useToggleProductFavorite,
  useToggleProductWishlist,
} from './useProductInteractions'
import { useI18nTranslations } from '@/i18n'

/**
 * Hook to get handlers for product card interactions
 * Use this hook in parent components to handle favorite and wishlist toggles
 */
export const useProductCardHandlers = (
  productId: number,
  options?: {
    onFavoriteSuccess?: (response: boolean) => void
    onFavoriteError?: (error: Error) => void
    onWishlistSuccess?: (response: boolean) => void
    onWishlistError?: (error: Error) => void
  }
) => {
  const t = useI18nTranslations('alert')
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
        options?.onFavoriteError?.(
          error instanceof Error ? error : new Error(t('favoriteToggleError'))
        )
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
        options?.onWishlistError?.(
          error instanceof Error ? error : new Error(t('wishlistToggleErrorGeneric'))
        )
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
