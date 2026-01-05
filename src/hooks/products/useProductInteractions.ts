import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  toggleProductFavorite,
  toggleProductWishlist,
} from '@/services/api/products.api'
import { useToast } from '@/components/ui/Toaster'
import { handleApiResponseForToast } from '@/utils/api-response.utils'

/**
 * Hook to toggle product favorite
 */
export const useToggleProductFavorite = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async (data: {
      productId: number
      query?: {
        providerId?: number
        branchId?: number
        staffId?: string
      }
    }) => {
      return await toggleProductFavorite(data.productId, data.query)
    },
    onSuccess: (response, variables) => {
      // Invalidate product queries to refetch updated favorite status
      queryClient.invalidateQueries({
        queryKey: ['product', variables.productId],
      })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['favorites'] })

      const { message, type } = handleApiResponseForToast(
        response,
        'Product favorite toggled successfully',
        'Failed to toggle product favorite'
      )
      addToast(message, type)
    },
    onError: error => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to toggle product favorite'
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to toggle product wishlist
 */
export const useToggleProductWishlist = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async (data: {
      productId: number
      query?: {
        providerId?: number
        branchId?: number
        staffId?: string
      }
    }) => {
      return await toggleProductWishlist(data.productId, data.query)
    },
    onSuccess: (response, variables) => {
      // Invalidate product queries to refetch updated wishlist status
      queryClient.invalidateQueries({
        queryKey: ['product', variables.productId],
      })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      // Invalidate wishlist items to update card indicators
      queryClient.invalidateQueries({ queryKey: ['wishlists'] })

      const { message, type } = handleApiResponseForToast(
        response,
        'Product wishlist toggled successfully',
        'Failed to toggle product wishlist'
      )
      addToast(message, type)
    },
    onError: error => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to toggle product wishlist'
      addToast(errorMessage, 'error')
    },
  })
}
