// Community Articles API service functions

import { apiClient } from '@/services/api/apiClient'
import type { ArticleResponse, ShareArticleResponse } from '@/types/responses/community'
import type { CreateArticleRequest, UpdateArticleRequest, AddReviewRequest } from '@/../client/common/api/gen/ourbride-api'

/**
 * Get all articles
 */
export const getAllArticles = async (params?: {
  page?: number
  pageSize?: number
}): Promise<ArticleResponse[]> => {
  try {
    const response = await apiClient.api.getArticlesGetAll(params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as ArticleResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as ArticleResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as ArticleResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as ArticleResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch articles')
  }
}

/**
 * Get article by ID
 */
export const getArticleById = async (id: number): Promise<ArticleResponse | null> => {
  try {
    const response = await apiClient.api.getArticlesGetById(id)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as ArticleResponse
    }
    if (responseAny?.data) {
      return responseAny.data as ArticleResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as ArticleResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch article')
  }
}

/**
 * Get published articles
 */
export const getPublishedArticles = async (params?: {
  page?: number
  pageSize?: number
}): Promise<ArticleResponse[]> => {
  try {
    const response = await apiClient.api.getArticlesGetPublished(params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as ArticleResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as ArticleResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as ArticleResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as ArticleResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch published articles')
  }
}

/**
 * Get featured articles
 */
export const getFeaturedArticles = async (params?: {
  page?: number
  pageSize?: number
}): Promise<ArticleResponse[]> => {
  try {
    const response = await apiClient.api.getArticlesGetFeatured(params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as ArticleResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as ArticleResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as ArticleResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as ArticleResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch featured articles')
  }
}

/**
 * Get approved articles
 */
export const getApprovedArticles = async (params?: {
  page?: number
  pageSize?: number
}): Promise<ArticleResponse[]> => {
  try {
    const response = await apiClient.api.getArticlesGetApproved(params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as ArticleResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as ArticleResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as ArticleResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as ArticleResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch approved articles')
  }
}

/**
 * Get pending approval articles
 */
export const getPendingApprovalArticles = async (params?: {
  page?: number
  pageSize?: number
}): Promise<ArticleResponse[]> => {
  try {
    const response = await apiClient.api.getArticlesGetPending(params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as ArticleResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as ArticleResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as ArticleResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as ArticleResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch pending approval articles')
  }
}

/**
 * Get articles by user ID
 */
export const getArticlesByUserId = async (userId: string): Promise<ArticleResponse[]> => {
  try {
    const response = await apiClient.api.getArticlesGetByUserId(userId)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as ArticleResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as ArticleResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as ArticleResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as ArticleResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch articles by user')
  }
}

/**
 * Get article by slug
 */
export const getArticleBySlug = async (slug: string): Promise<ArticleResponse | null> => {
  try {
    const response = await apiClient.api.getArticlesGetBySlug(slug)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as ArticleResponse
    }
    if (responseAny?.data) {
      return responseAny.data as ArticleResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as ArticleResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch article by slug')
  }
}

/**
 * Search articles
 */
export const searchArticles = async (params?: {
  searchTerm?: string
}): Promise<ArticleResponse[]> => {
  try {
    const response = await apiClient.api.getArticlesSearch(params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as ArticleResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as ArticleResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as ArticleResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as ArticleResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to search articles')
  }
}

/**
 * Create a new article
 */
export const createArticle = async (data: CreateArticleRequest): Promise<ArticleResponse | null> => {
  try {
    const response = await apiClient.api.postArticlesCreate(data)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as ArticleResponse
    }
    if (responseAny?.data) {
      return responseAny.data as ArticleResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as ArticleResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create article')
  }
}

/**
 * Update an article
 */
export const updateArticle = async (id: number, data: UpdateArticleRequest): Promise<ArticleResponse | null> => {
  try {
    const response = await apiClient.api.putArticlesUpdate(id, data)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as ArticleResponse
    }
    if (responseAny?.data) {
      return responseAny.data as ArticleResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as ArticleResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update article')
  }
}

/**
 * Delete an article
 */
export const deleteArticle = async (id: number): Promise<boolean> => {
  try {
    await apiClient.api.deleteArticlesDelete(id)
    return true
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete article')
  }
}

/**
 * Approve an article
 */
export const approveArticle = async (id: number): Promise<boolean> => {
  try {
    await apiClient.api.postArticlesApprove(id)
    return true
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to approve article')
  }
}

/**
 * Add review to an article
 */
export const addReview = async (id: number, data: AddReviewRequest): Promise<void> => {
  try {
    await apiClient.api.postArticlesAddReview(id, data)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to add review')
  }
}

/**
 * Toggle like on an article
 */
export const toggleLike = async (id: number): Promise<boolean> => {
  try {
    await apiClient.api.postArticlesToggleLike(id)
    // The API might return the new like status, but we'll need to check separately
    return true
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to toggle like')
  }
}

/**
 * Check if article is liked
 */
export const isLiked = async (id: number): Promise<boolean> => {
  try {
    const response = await apiClient.api.getArticlesIsLiked(id)
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
 * Toggle favorite on an article
 */
export const toggleFavorite = async (id: number): Promise<boolean> => {
  try {
    await apiClient.api.postArticlesToggleFavorite(id)
    // The API might return the new favorite status, but we'll need to check separately
    return true
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to toggle favorite')
  }
}

/**
 * Check if article is favorited
 */
export const isFavorite = async (id: number): Promise<boolean> => {
  try {
    const response = await apiClient.api.getArticlesIsFavorite(id)
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
 * Add media to an article
 */
export const addMedia = async (id: number, mediaId: number): Promise<void> => {
  try {
    await apiClient.api.postArticlesAddMedia(id, mediaId)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to add media')
  }
}

/**
 * Remove media from an article
 */
export const removeMedia = async (id: number, mediaId: number): Promise<void> => {
  try {
    await apiClient.api.deleteArticlesRemoveMedia(id, mediaId)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to remove media')
  }
}

/**
 * Get media IDs for an article
 */
export const getMediaIds = async (id: number): Promise<number[]> => {
  try {
    const response = await apiClient.api.getArticlesGetMedia(id)
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
 * Increment view count for an article
 */
export const incrementViewCount = async (id: number): Promise<void> => {
  try {
    await apiClient.api.postArticlesIncrementView(id)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to increment view count')
  }
}

/**
 * Share an article
 * POST /api/v1/community/articles/{id}/share
 */
export const shareArticle = async (
  id: number,
  shareSource?: string
): Promise<ShareArticleResponse | null> => {
  try {
    const response = await apiClient.api.postArticlesShare(id, { shareSource })
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = (responseAny as { data?: unknown }).data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: ShareArticleResponse }).data
      }
      if (data && typeof data === 'object' && 'articleId' in data) {
        return data as ShareArticleResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'articleId' in responseAny) {
      return responseAny as ShareArticleResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to share article')
  }
}









