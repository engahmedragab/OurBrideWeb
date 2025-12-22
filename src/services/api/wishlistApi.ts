// Wishlist API service functions

import { apiClient } from '@/services/api/apiClient'
import type {
  CreateWishlistRequest,
  UpdateWishlistRequest,
} from '@/../client/common/api/gen/ourbride-api'
import type {
  PaginatedList,
  WishlistResponse,
} from '@/types/responses'

/**
 * Get wishlist by ID
 */
export const getWishlistById = async (
  id: number,
  query?: {
    providerId?: number
    branchId?: number
    staffId?: string
    userId?: string
  }
): Promise<WishlistResponse> => {
  try {
    const response = await apiClient.api.getWishlistGetById(id, query)
    return (response?.data ?? response) as unknown as WishlistResponse
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch wishlist'
    )
  }
}

/**
 * Update wishlist
 */
export const updateWishlist = async (
  id: number,
  data: UpdateWishlistRequest,
  query?: {
    userId?: string
  }
): Promise<WishlistResponse> => {
  try {
    const response = await apiClient.api.putWishlistUpdate(id, data, query)
    return (response?.data ?? response) as unknown as WishlistResponse
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to update wishlist'
    )
  }
}

/**
 * Delete wishlist
 */
export const deleteWishlist = async (
  id: number,
  query?: {
    userId?: string
  }
): Promise<void> => {
  try {
    await apiClient.api.deleteWishlistDelete(id, query)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to delete wishlist'
    )
  }
}

/**
 * Check if wishlist exists
 */
export const checkWishlistExists = async (
  id: number,
  query?: {
    providerId?: number
    branchId?: number
    staffId?: string
    userId?: string
  }
): Promise<boolean> => {
  try {
    const response = await apiClient.api.headWishlistExists(id, query)
    // HEAD request returns 200 if exists, 404 if not
    return response?.status === 200 || response?.status === 204
  } catch (error: unknown) {
    // If error is 404, wishlist doesn't exist
    if (error && typeof error === 'object' && 'status' in error) {
      return (error as { status: number }).status !== 404
    }
    throw new Error(
      error instanceof Error ? error.message : 'Failed to check wishlist existence'
    )
  }
}

/**
 * Get all wishlists (paginated)
 */
export const getAllWishlists = async (query?: {
  providerId?: number
  branchId?: number
  staffId?: string
  userId?: string
  page?: number
  pageSize?: number
}): Promise<PaginatedList<WishlistResponse>> => {
  try {
    const response = await apiClient.api.getWishlistGetAll(query)
    return (response?.data ?? response) as unknown as PaginatedList<WishlistResponse>
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch wishlists'
    )
  }
}

/**
 * Create wishlist
 */
export const createWishlist = async (
  data: CreateWishlistRequest,
  query?: {
    userId?: string
  }
): Promise<WishlistResponse> => {
  try {
    const response = await apiClient.api.postWishlistCreate(data, query)
    return (response?.data ?? response) as unknown as WishlistResponse
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to create wishlist'
    )
  }
}
