// Community Blogs API service functions

import { apiClient } from '@/services/api/apiClient'
import type { BlogResponse, ShareBlogResponse } from '@/types/responses/community'
import type { CreateBlogRequest, UpdateBlogRequest, AddReviewRequest } from '@/../client/common/api/gen/ourbride-api'

/**
 * Get all blogs
 */
export const getAllBlogs = async (params?: {
  page?: number
  pageSize?: number
}): Promise<BlogResponse[]> => {
  try {
    const response = await apiClient.api.getBlogsGetAll(params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as BlogResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as BlogResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as BlogResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as BlogResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch blogs')
  }
}

/**
 * Get blog by ID
 */
export const getBlogById = async (id: number): Promise<BlogResponse | null> => {
  try {
    const response = await apiClient.api.getBlogsGetById(id)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as BlogResponse
    }
    if (responseAny?.data) {
      return responseAny.data as BlogResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as BlogResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch blog')
  }
}

/**
 * Get published blogs
 */
export const getPublishedBlogs = async (params?: {
  page?: number
  pageSize?: number
}): Promise<BlogResponse[]> => {
  try {
    const response = await apiClient.api.getBlogsGetPublished(params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as BlogResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as BlogResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as BlogResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as BlogResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch published blogs')
  }
}

/**
 * Get featured blogs
 */
export const getFeaturedBlogs = async (params?: {
  page?: number
  pageSize?: number
}): Promise<BlogResponse[]> => {
  try {
    const response = await apiClient.api.getBlogsGetFeatured(params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as BlogResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as BlogResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as BlogResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as BlogResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch featured blogs')
  }
}

/**
 * Get blogs by user ID
 */
export const getBlogsByUserId = async (userId: string): Promise<BlogResponse[]> => {
  try {
    const response = await apiClient.api.getBlogsGetByUserId(userId)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as BlogResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as BlogResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as BlogResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as BlogResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch blogs by user')
  }
}

/**
 * Get blog by slug
 */
export const getBlogBySlug = async (slug: string): Promise<BlogResponse | null> => {
  try {
    const response = await apiClient.api.getBlogsGetBySlug(slug)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as BlogResponse
    }
    if (responseAny?.data) {
      return responseAny.data as BlogResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as BlogResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch blog by slug')
  }
}

/**
 * Search blogs
 */
export const searchBlogs = async (params?: {
  searchTerm?: string
}): Promise<BlogResponse[]> => {
  try {
    const response = await apiClient.api.getBlogsSearch(params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as BlogResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as BlogResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as BlogResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as BlogResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to search blogs')
  }
}

/**
 * Create a new blog
 */
export const createBlog = async (data: CreateBlogRequest): Promise<BlogResponse | null> => {
  try {
    const response = await apiClient.api.postBlogsCreate(data)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as BlogResponse
    }
    if (responseAny?.data) {
      return responseAny.data as BlogResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as BlogResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create blog')
  }
}

/**
 * Update a blog
 */
export const updateBlog = async (id: number, data: UpdateBlogRequest): Promise<BlogResponse | null> => {
  try {
    const response = await apiClient.api.putBlogsUpdate(id, data)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as BlogResponse
    }
    if (responseAny?.data) {
      return responseAny.data as BlogResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as BlogResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update blog')
  }
}

/**
 * Delete a blog
 */
export const deleteBlog = async (id: number): Promise<boolean> => {
  try {
    await apiClient.api.deleteBlogsDelete(id)
    return true
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete blog')
  }
}

/**
 * Add review to a blog
 */
export const addReview = async (id: number, data: AddReviewRequest): Promise<void> => {
  try {
    await apiClient.api.postBlogsAddReview(id, data)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to add review')
  }
}

/**
 * Toggle like on a blog
 */
export const toggleLike = async (id: number): Promise<boolean> => {
  try {
    await apiClient.api.postBlogsToggleLike(id)
    // The API might return the new like status, but we'll need to check separately
    return true
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to toggle like')
  }
}

/**
 * Check if blog is liked
 */
export const isLiked = async (id: number): Promise<boolean> => {
  try {
    const response = await apiClient.api.getBlogsIsLiked(id)
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
 * Toggle favorite on a blog
 */
export const toggleFavorite = async (id: number): Promise<boolean> => {
  try {
    await apiClient.api.postBlogsToggleFavorite(id)
    // The API might return the new favorite status, but we'll need to check separately
    return true
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to toggle favorite')
  }
}

/**
 * Check if blog is favorited
 */
export const isFavorite = async (id: number): Promise<boolean> => {
  try {
    const response = await apiClient.api.getBlogsIsFavorite(id)
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
 * Add media to a blog
 */
export const addMedia = async (id: number, mediaId: number): Promise<void> => {
  try {
    await apiClient.api.postBlogsAddMedia(id, mediaId)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to add media')
  }
}

/**
 * Remove media from a blog
 */
export const removeMedia = async (id: number, mediaId: number): Promise<void> => {
  try {
    await apiClient.api.deleteBlogsRemoveMedia(id, mediaId)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to remove media')
  }
}

/**
 * Get media IDs for a blog
 */
export const getMediaIds = async (id: number): Promise<number[]> => {
  try {
    const response = await apiClient.api.getBlogsGetMedia(id)
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
 * Increment view count for a blog
 */
export const incrementViewCount = async (id: number): Promise<void> => {
  try {
    await apiClient.api.postBlogsIncrementView(id)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to increment view count')
  }
}

/**
 * Share a blog
 * POST /api/v1/community/blogs/{id}/share
 */
export const shareBlog = async (
  id: number,
  shareSource?: string
): Promise<ShareBlogResponse | null> => {
  try {
    const response = await apiClient.api.postBlogsShare(id, { shareSource })
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = (responseAny as { data?: unknown }).data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: ShareBlogResponse }).data
      }
      if (data && typeof data === 'object' && 'blogId' in data) {
        return data as ShareBlogResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'blogId' in responseAny) {
      return responseAny as ShareBlogResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to share blog')
  }
}




