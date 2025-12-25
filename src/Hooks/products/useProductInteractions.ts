import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  toggleProductFavorite,
  toggleProductWishlist,
} from '@/services/api/products.api'

/**
 * Hook to toggle product favorite
 */
export const useToggleProductFavorite = () => {
  const queryClient = useQueryClient()

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
    onSuccess: (_, variables) => {
      // Invalidate product queries to refetch updated favorite status
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}

/**
 * Hook to toggle product wishlist
 */
export const useToggleProductWishlist = () => {
  const queryClient = useQueryClient()

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
    onSuccess: (_, variables) => {
      // Invalidate product queries to refetch updated wishlist status
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['wishlists'] })
    },
  })
}
