import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllWishlists,
  getWishlistById,
  createWishlist,
  updateWishlist,
  deleteWishlist,
  checkWishlistExists,
} from '@/services/api/wishlistApi'
import type { WishlistResponse, PaginatedList } from '@/types/responses'
import type {
  CreateWishlistRequest,
  UpdateWishlistRequest,
} from '@/../client/common/api/gen/ourbride-api'

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
      const wishlists = await getAllWishlists(queryParams)
      return wishlists
    },
    enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
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
    staleTime: 1 * 60 * 1000, // 1 minute
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
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to create a wishlist
 */
export const useCreateWishlist = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      data: CreateWishlistRequest
      query?: { userId?: string }
    }): Promise<WishlistResponse> => {
      return await createWishlist(data.data, data.query)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] })
    },
  })
}

/**
 * Hook to update a wishlist
 */
export const useUpdateWishlist = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      id: number
      data: UpdateWishlistRequest
      query?: { userId?: string }
    }): Promise<WishlistResponse> => {
      return await updateWishlist(data.id, data.data, data.query)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] })
      queryClient.invalidateQueries({ queryKey: ['wishlist', variables.id] })
    },
  })
}

/**
 * Hook to delete a wishlist
 */
export const useDeleteWishlist = () => {
  const queryClient = useQueryClient()
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
    },
  })
}
