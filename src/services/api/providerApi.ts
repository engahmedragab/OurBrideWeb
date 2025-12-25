// Provider API service functions

import { apiClient } from '@/services/api/apiClient'
import type { ApiResult } from '@/../client/common/api/gen/ourbride-api'
import type { ReviewRequest } from '@/../client/common/api/gen/ourbride-api'

/**
 * Toggle follow for a provider
 * POST /api/v1/services/providers/follow/{providerId}
 */
export const toggleProviderFollow = async (
  providerId: number
): Promise<boolean> => {
  try {
    const response = await apiClient.api.postProviderToggleFollow(providerId)
    const responseAny = response as any
    const result = (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as any
    // Return true if followed, false if unfollowed
    return result?.data ?? result?.success ?? true
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to toggle provider follow'
    )
  }
}

/**
 * Toggle favorite for a provider
 * POST /api/v1/services/providers/favorite/{providerId}
 */
export const toggleProviderFavorite = async (
  providerId: number
): Promise<boolean> => {
  try {
    const response = await apiClient.api.postProviderToggleFavorite(providerId)
    const responseAny = response as any
    const result = (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as any
    // Return true if favorited, false if removed
    return result?.data ?? result?.success ?? true
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to toggle provider favorite'
    )
  }
}

/**
 * Submit a review for a provider
 * POST /api/v1/services/providers/review/{providerId}
 */
export const submitProviderReview = async (
  providerId: number,
  data: ReviewRequest
): Promise<ApiResult> => {
  try {
    const response = await apiClient.api.postProviderAddReviews(providerId, data)
    const responseAny = response as any
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as ApiResult
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to submit provider review'
    )
  }
}
