import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  toggleServiceFavorite,
  toggleServiceWishlist,
} from '@/services/api/serviceApi'

/**
 * Hook to toggle service favorite
 */
export const useToggleServiceFavorite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (serviceId: number) => {
      return await toggleServiceFavorite(serviceId)
    },
    onSuccess: (_, serviceId) => {
      // Invalidate service queries to refetch updated favorite status
      queryClient.invalidateQueries({ queryKey: ['service', serviceId] })
      queryClient.invalidateQueries({ queryKey: ['services'] })
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}

/**
 * Hook to toggle service wishlist
 */
export const useToggleServiceWishlist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (serviceId: number) => {
      return await toggleServiceWishlist(serviceId)
    },
    onSuccess: (_, serviceId) => {
      // Invalidate service queries to refetch updated wishlist status
      queryClient.invalidateQueries({ queryKey: ['service', serviceId] })
      queryClient.invalidateQueries({ queryKey: ['services'] })
      queryClient.invalidateQueries({ queryKey: ['wishlists'] })
    },
  })
}
