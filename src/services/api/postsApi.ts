// Community Posts API service functions

import { apiClient } from '@/services/api/apiClient'
import type { PostResponse, SharePostResponse } from '@/types/responses/community'
import type { CreatePostRequest, UpdatePostRequest, AddReviewRequest } from '@/../client/common/api/gen/ourbride-api'

/**
 * Get all posts
 */
export const getAllPosts = async (params?: {
  page?: number
  pageSize?: number
}): Promise<PostResponse[]> => {
  try {
    const response = await apiClient.api.getPostsGetAll(params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as PostResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as PostResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as PostResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as PostResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch posts')
  }
}

/**
 * Get post by ID
 */
export const getPostById = async (id: number): Promise<PostResponse | null> => {
  try {
    const response = await apiClient.api.getPostsGetById(id)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as PostResponse
    }
    if (responseAny?.data) {
      return responseAny.data as PostResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as PostResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch post')
  }
}

/**
 * Get post by slug
 */
export const getPostBySlug = async (slug: string): Promise<PostResponse | null> => {
  try {
    // Try to use slug endpoint if available
    const api: any = apiClient.api
    if (api.getPostsGetBySlug) {
      const response = await api.getPostsGetBySlug(slug)
      const responseAny: any = response
      
      // Handle different response structures
      if (responseAny?.data?.data) {
        return responseAny.data.data as PostResponse
      }
      if (responseAny?.data) {
        return responseAny.data as PostResponse
      }
      if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
        return responseAny as PostResponse
      }
      
      return null
    } else {
      throw new Error('Slug endpoint not available. The backend endpoint /api/v1/community/posts/slug/{slug} needs to be implemented.')
    }
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch post by slug')
  }
}

/**
 * Get published posts
 */
export const getPublishedPosts = async (params?: {
  page?: number
  pageSize?: number
}): Promise<PostResponse[]> => {
  try {
    const response = await apiClient.api.getPostsGetPublished(params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as PostResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as PostResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as PostResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as PostResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch published posts')
  }
}

/**
 * Get featured posts
 */
export const getFeaturedPosts = async (params?: {
  page?: number
  pageSize?: number
}): Promise<PostResponse[]> => {
  try {
    const response = await apiClient.api.getPostsGetFeatured(params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as PostResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as PostResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as PostResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as PostResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch featured posts')
  }
}

/**
 * Get posts by user ID
 */
export const getPostsByUserId = async (userId: string): Promise<PostResponse[]> => {
  try {
    const response = await apiClient.api.getPostsGetByUserId(userId)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as PostResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as PostResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as PostResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as PostResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch posts by user')
  }
}

/**
 * Get posts by category ID
 */
export const getPostsByCategoryId = async (
  categoryId: number,
  params?: {
    page?: number
    pageSize?: number
  }
): Promise<PostResponse[]> => {
  try {
    const response = await apiClient.api.getPostsGetByCategory(categoryId, params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as PostResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as PostResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as PostResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as PostResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch posts by category')
  }
}

/**
 * Get posts by item ID
 */
export const getPostsByItemId = async (
  itemId: number,
  params?: {
    page?: number
    pageSize?: number
  }
): Promise<PostResponse[]> => {
  try {
    const response = await apiClient.api.getPostsGetByItem(itemId, params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as PostResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as PostResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as PostResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as PostResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch posts by item')
  }
}

/**
 * Get posts by preparation ID
 */
export const getPostsByPreparationId = async (
  preparationId: number,
  params?: {
    page?: number
    pageSize?: number
  }
): Promise<PostResponse[]> => {
  try {
    const response = await apiClient.api.getPostsGetByPreparation(preparationId, params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as PostResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as PostResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as PostResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as PostResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch posts by preparation')
  }
}

/**
 * Get posts by tag ID
 */
export const getPostsByTagId = async (
  tagId: number,
  params?: {
    page?: number
    pageSize?: number
  }
): Promise<PostResponse[]> => {
  try {
    const response = await apiClient.api.getPostsGetByTag(tagId, params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as PostResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as PostResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as PostResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as PostResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch posts by tag')
  }
}

/**
 * Search posts
 */
export const searchPosts = async (params?: {
  searchTerm?: string
  page?: number
  pageSize?: number
}): Promise<PostResponse[]> => {
  try {
    const response = await apiClient.api.getPostsSearch(params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as PostResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as PostResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as PostResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as PostResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to search posts')
  }
}

/**
 * Create a new post
 */
export const createPost = async (data: CreatePostRequest): Promise<PostResponse | null> => {
  try {
    const response = await apiClient.api.postPostsCreate(data)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as PostResponse
    }
    if (responseAny?.data) {
      return responseAny.data as PostResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as PostResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create post')
  }
}

/**
 * Update a post
 */
export const updatePost = async (id: number, data: UpdatePostRequest): Promise<PostResponse | null> => {
  try {
    const response = await apiClient.api.putPostsUpdate(id, data)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as PostResponse
    }
    if (responseAny?.data) {
      return responseAny.data as PostResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as PostResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update post')
  }
}

/**
 * Delete a post
 */
export const deletePost = async (id: number): Promise<boolean> => {
  try {
    await apiClient.api.deletePostsDelete(id)
    return true
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete post')
  }
}

/**
 * Add review to a post
 */
export const addReview = async (id: number, data: AddReviewRequest): Promise<void> => {
  try {
    await apiClient.api.postPostsAddReview(id, data)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to add review')
  }
}

/**
 * Toggle like on a post
 */
export const toggleLike = async (id: number): Promise<boolean> => {
  try {
    await apiClient.api.postPostsToggleLike(id)
    // The API might return the new like status, but we'll need to check separately
    return true
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to toggle like')
  }
}

/**
 * Check if post is liked
 */
export const isLiked = async (id: number): Promise<boolean> => {
  try {
    const response = await apiClient.api.getPostsIsLiked(id)
    const responseAny: any = response
    
    // Handle different response structures
    if (typeof responseAny?.data === 'boolean') {
      return responseAny.data
    }
    if (typeof responseAny?.data?.data === 'boolean') {
      return responseAny.data.data
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
 * Toggle favorite on a post
 */
export const toggleFavorite = async (id: number): Promise<boolean> => {
  try {
    await apiClient.api.postPostsToggleFavorite(id)
    // The API might return the new favorite status, but we'll need to check separately
    return true
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to toggle favorite')
  }
}

/**
 * Check if post is favorited
 */
export const isFavorite = async (id: number): Promise<boolean> => {
  try {
    const response = await apiClient.api.getPostsIsFavorite(id)
    const responseAny: any = response
    
    // Handle different response structures
    if (typeof responseAny?.data === 'boolean') {
      return responseAny.data
    }
    if (typeof responseAny?.data?.data === 'boolean') {
      return responseAny.data.data
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
 * Add media to a post
 */
export const addMedia = async (id: number, mediaId: number): Promise<void> => {
  try {
    await apiClient.api.postPostsAddMedia(id, mediaId)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to add media')
  }
}

/**
 * Remove media from a post
 */
export const removeMedia = async (id: number, mediaId: number): Promise<void> => {
  try {
    await apiClient.api.deletePostsRemoveMedia(id, mediaId)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to remove media')
  }
}

/**
 * Get media IDs for a post
 */
export const getMediaIds = async (id: number): Promise<number[]> => {
  try {
    const response = await apiClient.api.getPostsGetMedia(id)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as number[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as number[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as number[]
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
 * Increment view count for a post
 */
export const incrementViewCount = async (id: number): Promise<void> => {
  try {
    await apiClient.api.postPostsIncrementView(id)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to increment view count')
  }
}

/**
 * Share a post
 * POST /api/v1/community/posts/{id}/share
 */
export const sharePost = async (
  id: number,
  shareSource?: string
): Promise<SharePostResponse | null> => {
  try {
    const response = await apiClient.api.postPostsShare(id, { shareSource })
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = (responseAny as { data?: unknown }).data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: SharePostResponse }).data
      }
      if (data && typeof data === 'object' && 'postId' in data) {
        return data as SharePostResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'postId' in responseAny) {
      return responseAny as SharePostResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to share post')
  }
}





