import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  toggleServiceFavorite,
  toggleServiceWishlist,
} from '@/services/api/serviceApi'
import { useToast } from '@/components/ui/Toaster'
import { handleApiResponseForToast } from '@/utils/api-response.utils'

/**
 * Hook to toggle service favorite
 */
export const useToggleServiceFavorite = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async (serviceId: number) => {
      return await toggleServiceFavorite(serviceId)
    },
    onSuccess: (response, serviceId) => {
      // Invalidate service queries to refetch updated favorite status
      queryClient.invalidateQueries({ queryKey: ['service', serviceId] })
      queryClient.invalidateQueries({ queryKey: ['services'] })
      queryClient.invalidateQueries({ queryKey: ['favorites'] })

      const { message, type } = handleApiResponseForToast(
        response,
        'Service favorite toggled successfully',
        'Failed to toggle service favorite'
      )
      addToast(message, type)
    },
    onError: error => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to toggle service favorite'
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to toggle service wishlist
 */
export const useToggleServiceWishlist = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async (serviceId: number) => {
      return await toggleServiceWishlist(serviceId)
    },
    onSuccess: async (response, serviceId) => {
      // Invalidate service queries to refetch updated wishlist status
      await queryClient.invalidateQueries({ queryKey: ['service', serviceId] })
      await queryClient.invalidateQueries({ queryKey: ['services'] })
      // Invalidate and refetch all wishlist queries to update card indicators and wishlist pages
      // Since useWishlists has staleTime: Infinity, we need to explicitly refetch
      await queryClient.invalidateQueries({ queryKey: ['wishlists'] })
      await queryClient.refetchQueries({ queryKey: ['wishlists'] })

      const { message, type } = handleApiResponseForToast(
        response,
        'Service wishlist toggled successfully',
        'Failed to toggle service wishlist'
      )
      addToast(message, type)
    },
    onError: error => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to toggle service wishlist'
      addToast(errorMessage, 'error')
    },
  })
}
