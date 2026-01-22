// Community Reels API service functions

import { apiClient } from '@/services/api/apiClient'
import type { ReelResponse, ShareReelResponse } from '@/types/responses/community'
import type { CreateReelRequest, UpdateReelRequest, AddReviewRequest } from '@/../client/common/api/gen/ourbride-api'

/**
 * Get all reels
 */
export const getAllReels = async (params?: {
  page?: number
  pageSize?: number
}): Promise<ReelResponse[]> => {
  try {
    const response = await apiClient.api.getReelsGetAll(params)
    const responseAny = response as unknown as Record<string, unknown>
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (Array.isArray(data)) {
        return data as ReelResponse[]
      }
      if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
        return data.data as ReelResponse[]
      }
      if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) {
        return data.items as ReelResponse[]
      }
    }
    if (Array.isArray(responseAny)) {
      return responseAny as ReelResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch reels')
  }
}

/**
 * Get reel by ID
 */
export const getReelById = async (id: number): Promise<ReelResponse | null> => {
  try {
    const response = await apiClient.api.getReelsGetById(id)
    const responseAny = response as unknown as Record<string, unknown>
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return data.data as unknown as ReelResponse
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as unknown as ReelResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as unknown as ReelResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch reel')
  }
}

/**
 * Get reel by slug
 */
export const getReelBySlug = async (slug: string): Promise<ReelResponse | null> => {
  try {
    // Try to use slug endpoint if available
    const api = apiClient.api as Record<string, unknown>
    if (typeof api.getReelsGetBySlug === 'function') {
      const response = await (api.getReelsGetBySlug as (slug: string) => Promise<unknown>)(slug)
      const responseAny = response as unknown as Record<string, unknown>
      
      // Handle different response structures
      if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
        const data = responseAny.data
        if (data && typeof data === 'object' && 'data' in data) {
          return data.data as unknown as ReelResponse
        }
        if (data && typeof data === 'object' && 'id' in data) {
          return data as unknown as ReelResponse
        }
      }
      if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
        return responseAny as unknown as ReelResponse
      }
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch reel by slug')
  }
}

/**
 * Get published reels
 */
export const getPublishedReels = async (params?: {
  page?: number
  pageSize?: number
}): Promise<ReelResponse[]> => {
  try {
    const response = await apiClient.api.getReelsGetPublished(params)
    const responseAny = response as unknown as Record<string, unknown>
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (Array.isArray(data)) {
        return data as ReelResponse[]
      }
      if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
        return data.data as ReelResponse[]
      }
      if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) {
        return data.items as ReelResponse[]
      }
    }
    if (Array.isArray(responseAny)) {
      return responseAny as ReelResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch published reels')
  }
}

/**
 * Get featured reels
 */
export const getFeaturedReels = async (params?: {
  page?: number
  pageSize?: number
}): Promise<ReelResponse[]> => {
  try {
    const response = await apiClient.api.getReelsGetFeatured(params)
    const responseAny = response as unknown as Record<string, unknown>
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (Array.isArray(data)) {
        return data as ReelResponse[]
      }
      if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
        return data.data as ReelResponse[]
      }
      if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) {
        return data.items as ReelResponse[]
      }
    }
    if (Array.isArray(responseAny)) {
      return responseAny as ReelResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch featured reels')
  }
}

/**
 * Get trending reels
 */
export const getTrendingReels = async (params?: {
  page?: number
  pageSize?: number
}): Promise<ReelResponse[]> => {
  try {
    const response = await apiClient.api.getReelsGetTrending(params)
    const responseAny = response as unknown as Record<string, unknown>
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (Array.isArray(data)) {
        return data as ReelResponse[]
      }
      if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
        return data.data as ReelResponse[]
      }
      if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) {
        return data.items as ReelResponse[]
      }
    }
    if (Array.isArray(responseAny)) {
      return responseAny as ReelResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch trending reels')
  }
}

/**
 * Get reels by user ID
 */
export const getReelsByUserId = async (userId: string): Promise<ReelResponse[]> => {
  try {
    const response = await apiClient.api.getReelsGetByUserId(userId)
    const responseAny = response as unknown as Record<string, unknown>
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (Array.isArray(data)) {
        return data as ReelResponse[]
      }
      if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
        return data.data as ReelResponse[]
      }
      if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) {
        return data.items as ReelResponse[]
      }
    }
    if (Array.isArray(responseAny)) {
      return responseAny as ReelResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch reels by user')
  }
}

/**
 * Search reels
 */
export const searchReels = async (params?: {
  searchTerm?: string
}): Promise<ReelResponse[]> => {
  try {
    const response = await apiClient.api.getReelsSearch(params)
    const responseAny = response as unknown as Record<string, unknown>
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (Array.isArray(data)) {
        return data as ReelResponse[]
      }
      if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
        return data.data as ReelResponse[]
      }
      if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) {
        return data.items as ReelResponse[]
      }
    }
    if (Array.isArray(responseAny)) {
      return responseAny as ReelResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to search reels')
  }
}

/**
 * Create a new reel
 */
export const createReel = async (data: CreateReelRequest): Promise<ReelResponse | null> => {
  try {
    const response = await apiClient.api.postReelsCreate(data)
    const responseAny = response as unknown as Record<string, unknown>
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return data.data as unknown as ReelResponse
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as unknown as ReelResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as unknown as ReelResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create reel')
  }
}

/**
 * Update a reel
 */
export const updateReel = async (id: number, data: UpdateReelRequest): Promise<ReelResponse | null> => {
  try {
    const response = await apiClient.api.putReelsUpdate(id, data)
    const responseAny = response as unknown as Record<string, unknown>
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return data.data as unknown as ReelResponse
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as unknown as ReelResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as unknown as ReelResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update reel')
  }
}

/**
 * Delete a reel
 */
export const deleteReel = async (id: number): Promise<boolean> => {
  try {
    await apiClient.api.deleteReelsDelete(id)
    return true
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete reel')
  }
}

/**
 * Approve a reel
 */
export const approveReel = async (id: number): Promise<boolean> => {
  try {
    await apiClient.api.postReelsApprove(id)
    return true
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to approve reel')
  }
}

/**
 * Add review to a reel
 */
export const addReview = async (id: number, data: AddReviewRequest): Promise<void> => {
  try {
    await apiClient.api.postReelsAddReview(id, data)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to add review')
  }
}

/**
 * Toggle like on a reel
 */
export const toggleLike = async (id: number): Promise<boolean> => {
  try {
    await apiClient.api.postReelsToggleLike(id)
    // The API might return the new like status, but we'll need to check separately
    return true
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to toggle like')
  }
}

/**
 * Check if reel is liked
 */
export const isLiked = async (id: number): Promise<boolean> => {
  try {
    const response = await apiClient.api.getReelsIsLiked(id)
    const responseAny = response as unknown as Record<string, unknown>
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (typeof data === 'boolean') {
        return data
      }
      if (data && typeof data === 'object' && 'data' in data && typeof data.data === 'boolean') {
        return data.data
      }
    }
    if (typeof responseAny === 'boolean') {
      return responseAny
    }
    
    return false
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to check like status')
  }
}

/**
 * Toggle favorite on a reel
 */
export const toggleFavorite = async (id: number): Promise<boolean> => {
  try {
    await apiClient.api.postReelsToggleFavorite(id)
    // The API might return the new favorite status, but we'll need to check separately
    return true
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to toggle favorite')
  }
}

/**
 * Check if reel is favorited
 */
export const isFavorite = async (id: number): Promise<boolean> => {
  try {
    const response = await apiClient.api.getReelsIsFavorite(id)
    const responseAny = response as unknown as Record<string, unknown>
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (typeof data === 'boolean') {
        return data
      }
      if (data && typeof data === 'object' && 'data' in data && typeof data.data === 'boolean') {
        return data.data
      }
    }
    if (typeof responseAny === 'boolean') {
      return responseAny
    }
    
    return false
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to check favorite status')
  }
}

/**
 * Add media to a reel
 */
export const addMedia = async (id: number, mediaId: number): Promise<void> => {
  try {
    await apiClient.api.postReelsAddMedia(id, mediaId)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to add media')
  }
}

/**
 * Remove media from a reel
 */
export const removeMedia = async (id: number, mediaId: number): Promise<void> => {
  try {
    await apiClient.api.deleteReelsRemoveMedia(id, mediaId)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to remove media')
  }
}

/**
 * Get media IDs for a reel
 */
export const getMediaIds = async (id: number): Promise<number[]> => {
  try {
    const response = await apiClient.api.getReelsGetMedia(id)
    const responseAny = response as unknown as Record<string, unknown>
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (Array.isArray(data)) {
        return data as number[]
      }
      if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
        return data.data as number[]
      }
      if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) {
        return data.items as number[]
      }
    }
    if (Array.isArray(responseAny)) {
      return responseAny as number[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch media IDs')
  }
}

/**
 * Increment view count for a reel
 */
export const incrementViewCount = async (id: number): Promise<void> => {
  try {
    await apiClient.api.postReelsIncrementView(id)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to increment view count')
  }
}

/**
 * Share a reel
 * POST /api/v1/community/reels/{id}/share
 */
export const shareReel = async (
  id: number,
  shareSource?: string
): Promise<ShareReelResponse | null> => {
  try {
    const response = await apiClient.api.postReelsShare(id, { shareSource })
    const responseAny = response as unknown as Record<string, unknown>
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = (responseAny as { data?: unknown }).data
      if (data && typeof data === 'object' && data !== null && 'data' in data) {
        return (data as { data: ShareReelResponse }).data
      }
      if (data && typeof data === 'object' && data !== null && 'reelId' in data) {
        return data as unknown as ShareReelResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'reelId' in responseAny) {
      return responseAny as unknown as ShareReelResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to share reel')
  }
}


















