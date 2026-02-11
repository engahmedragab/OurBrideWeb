import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
  getAllWishlists,
  getWishlistById,
  createWishlist,
  updateWishlist,
  deleteWishlist,
  checkWishlistExists,
} from '@/services/api/wishlistApi'
import type { WishlistResponse, WishlistIdItem } from '@/types/responses'
import type {
  CreateWishlistRequest,
  UpdateWishlistRequest,
} from '@/../client/common/api/gen/ourbride-api'
import { Source } from '@/../client/common/api/gen/ourbride-api'
import { useToast } from '@/components/ui/Toaster'
import { handleApiResponseForToast } from '@/utils/api-response.utils'
import { useMainIds } from '@/hooks/home'
import { useI18nTranslations } from '@/i18n'

/**
 * Hook to fetch all wishlists
 */
export const useWishlists = (query?: {
  providerId?: number
  branchId?: number
  staffId?: string
  userId?: string
  page?: number
  pageSize?: number
  enabled?: boolean
}) => {
  const { enabled = true, ...queryParams } = query || {}
  return useQuery({
    queryKey: ['wishlists', queryParams],
    queryFn: async () => {
      return await getAllWishlists(queryParams)
    },
    enabled,
    staleTime: Infinity, // Never consider data stale - no auto refetch
    refetchOnMount: false, // Don't refetch on mount
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on reconnect
    refetchInterval: false, // Don't refetch on interval
  })
}

/**
 * Hook to fetch a single wishlist by ID
 */
export const useWishlist = (
  id: number,
  query?: {
    providerId?: number
    branchId?: number
    staffId?: string
    userId?: string
  },
  enabled = true
) => {
  return useQuery({
    queryKey: ['wishlist', id, query],
    queryFn: async () => {
      const wishlist = await getWishlistById(id, query)
      return wishlist
    },
    enabled: enabled && !!id,
    staleTime: Infinity, // Never consider data stale - no auto refetch
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}

/**
 * Hook to check if wishlist exists
 */
export const useWishlistExists = (
  id: number,
  query?: {
    providerId?: number
    branchId?: number
    staffId?: string
    userId?: string
  },
  enabled = true
) => {
  return useQuery({
    queryKey: ['wishlist-exists', id, query],
    queryFn: async () => {
      const exists = await checkWishlistExists(id, query)
      return exists
    },
    enabled: enabled && !!id,
    staleTime: Infinity, // Never consider data stale - no auto refetch
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}

/**
 * Hook to create a wishlist
 */
export const useCreateWishlist = () => {
  const t = useI18nTranslations('alert')
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async (data: {
      data: CreateWishlistRequest
      query?: { userId?: string }
    }): Promise<WishlistResponse> => {
      return await createWishlist(data.data, data.query)
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] })
      queryClient.invalidateQueries({ queryKey: ['main-ids'] })
      const { message, type } = handleApiResponseForToast(
        response,
        t('wishlistCreatedSuccess'),
        t('wishlistCreatedError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : t('wishlistCreatedError')
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to update a wishlist
 */
export const useUpdateWishlist = () => {
  const t = useI18nTranslations('alert')
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async (data: {
      id: number
      data: UpdateWishlistRequest
      query?: { userId?: string }
    }): Promise<WishlistResponse> => {
      return await updateWishlist(data.id, data.data, data.query)
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] })
      queryClient.invalidateQueries({ queryKey: ['wishlist', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['main-ids'] })
      const { message, type } = handleApiResponseForToast(
        response,
        t('wishlistUpdatedSuccess'),
        t('wishlistUpdatedError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : t('wishlistUpdatedError')
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to delete a wishlist
 */
export const useDeleteWishlist = () => {
  const t = useI18nTranslations('alert')
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async (data: {
      id: number
      query?: { userId?: string }
    }): Promise<void> => {
      return await deleteWishlist(data.id, data.query)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] })
      queryClient.invalidateQueries({ queryKey: ['wishlist', variables.id] })
      queryClient.removeQueries({ queryKey: ['wishlist', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['main-ids'] })
      addToast(t('wishlistDeletedSuccess'), 'success')
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : t('wishlistDeletedError')
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to check if items are in wishlists
 * Returns helper functions to check wishlist status
 * 
 * Note: This hook fetches all wishlists and extracts product/service IDs
 * from the sourceId field. Since the API doesn't expose wishlist items directly,
 * we rely on the sourceId matching the product/service ID.
 */
export const useWishlistItems = (enabled = true) => {
  const { data: mainIds, isLoading } = useMainIds(
    {
      page: 1,
      pageSize: 1000,
    },
    enabled
  )

  // Extract all wishlists from response (direct array, not paginated)
  const wishlists = useMemo(() => {
    return mainIds?.wishlists || []
  }, [mainIds])

  // Extract product IDs from wishlists
  const productIds = useMemo(() => {
    return new Set<number>(
      wishlists
        .filter((wishlist: WishlistIdItem) => String(wishlist.source) === Source.Product)
        .map((wishlist: WishlistIdItem) => wishlist.sourceId)
    )
  }, [wishlists])

  // Extract service IDs from wishlists
  const serviceIds = useMemo(() => {
    return new Set<number>(
      wishlists
        .filter((wishlist: WishlistIdItem) => String(wishlist.source) === Source.Service)
        .map((wishlist: WishlistIdItem) => wishlist.sourceId)
    )
  }, [wishlists])

  /**
   * Check if a product is in any wishlist
   */
  const isProductInWishlist = useMemo(() => {
    return (productId: number): boolean => {
      return productIds.has(productId)
    }
  }, [productIds])

  /**
   * Check if a service is in any wishlist
   */
  const isServiceInWishlist = useMemo(() => {
    return (serviceId: number): boolean => {
      return serviceIds.has(serviceId)
    }
  }, [serviceIds])

  /**
   * Get wishlist IDs that contain a product
   */
  const getProductWishlistIds = useMemo(() => {
    return (productId: number): number[] => {
      return wishlists
        .filter(
          (wishlist: WishlistIdItem) =>
            String(wishlist.source) === Source.Product && wishlist.sourceId === productId
        )
        .map((wishlist: WishlistIdItem) => wishlist.id)
    }
  }, [wishlists])

  /**
   * Get wishlist IDs that contain a service
   */
  const getServiceWishlistIds = useMemo(() => {
    return (serviceId: number): number[] => {
      return wishlists
        .filter(
          (wishlist: WishlistIdItem) =>
            String(wishlist.source) === Source.Service && wishlist.sourceId === serviceId
        )
        .map((wishlist: WishlistIdItem) => wishlist.id)
    }
  }, [wishlists])

  return {
    isProductInWishlist,
    isServiceInWishlist,
    getProductWishlistIds,
    getServiceWishlistIds,
    isLoading,
    wishlists,
  }
}
