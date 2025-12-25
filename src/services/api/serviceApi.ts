// Service API service functions

import { apiClient } from '@/services/api/apiClient'
import type { ApiResult } from '@/../client/common/api/gen/ourbride-api'
import type { ReviewRequest } from '@/../client/common/api/gen/ourbride-api'

/**
 * Toggle favorite for a service
 * POST /api/v1/services/toggle-favorite/{serviceId}
 */
export const toggleServiceFavorite = async (
  serviceId: number
): Promise<boolean> => {
  try {
    const response = await apiClient.api.postServicesToggleFavorite(serviceId)
    const responseAny = response as unknown
    const result = (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as { data?: boolean; success?: boolean } | boolean
    // Return true if favorited, false if removed
    if (typeof result === 'boolean') return result
    return result?.data ?? result?.success ?? true
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to toggle service favorite'
    )
  }
}

/**
 * Toggle wishlist for a service
 * POST /api/v1/services/toggle-wishlist/{serviceId}
 */
export const toggleServiceWishlist = async (
  serviceId: number
): Promise<boolean> => {
  try {
    const response = await apiClient.api.postServicesToggleWishlist(serviceId)
    const responseAny = response as unknown
    const result = (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as { data?: boolean; success?: boolean } | boolean
    // Return true if added, false if removed
    if (typeof result === 'boolean') return result
    return result?.data ?? result?.success ?? true
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to toggle service wishlist'
    )
  }
}

/**
 * Submit a review for a service
 * POST /api/v1/services/review/{serviceId}
 */
export const submitServiceReview = async (
  serviceId: number,
  data: ReviewRequest
): Promise<ApiResult> => {
  try {
    const response = await apiClient.api.postServicesAddReviews(serviceId, data)
    const responseAny = response as unknown
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as ApiResult
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to submit service review'
    )
  }
}

/**
 * Get all reviews for a service
 * GET /api/v1/services/{id}/reviews
 */
export const getServiceReviews = async (
  serviceId: number,
  query?: {
    Rating?: number
    SortBy?: string
    Page?: number
    PageSize?: number
  }
): Promise<ApiResult> => {
  try {
    const response = await apiClient.api.getServicesGetReviews(serviceId, query)
    const responseAny = response as unknown
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as ApiResult
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch service reviews'
    )
  }
}

/**
 * Get review summary for a service
 * GET /api/v1/services/{id}/reviews/summary
 */
export const getServiceReviewSummary = async (
  serviceId: number
): Promise<ApiResult> => {
  try {
    const response = await apiClient.api.getServicesReviewSummary(serviceId)
    const responseAny = response as unknown
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as ApiResult
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch service review summary'
    )
  }
}
