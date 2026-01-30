import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  toggleServiceFavorite,
  toggleServiceWishlist,
} from '@/services/api/serviceApi'
import { useToast } from '@/components/ui/Toaster'
import { handleApiResponseForToast } from '@/utils/api-response.utils'
import { useI18nTranslations } from '@/i18n/hooks'

/**
 * Hook to toggle service favorite
 */
export const useToggleServiceFavorite = () => {
   const t = useI18nTranslations('services')
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
          t('toast.favoriteToggleSuccess'),
        t('toast.favoriteToggleFail')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message :  t('toast.favoriteToggleFail')
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to toggle service wishlist
 */
export const useToggleServiceWishlist = () => {
     const t = useI18nTranslations('services')

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
         t('toast.wishlistToggleSuccess'),
        t('toast.wishlistToggleFail')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : t('toast.wishlistToggleFail')
      addToast(errorMessage, 'error')
    },
  })
}
