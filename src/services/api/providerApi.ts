// Provider API service functions

import { apiClient } from '@/services/api/apiClient'
import type { ApiResult, UpdateProviderPublicProfileSettingsRequest } from '@/../client/common/api/gen/ourbride-api'
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
    const responseAny: any = response
    const result = (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as { data?: boolean; success?: boolean } | boolean
    // Return true if followed, false if unfollowed
    if (typeof result === 'boolean') return result
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
    const responseAny: any = response
    const result = (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as { data?: boolean; success?: boolean } | boolean
    // Return true if favorited, false if removed
    if (typeof result === 'boolean') return result
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
    const responseAny: any = response
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as ApiResult
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to submit provider review'
    )
  }
}

/**
 * Get public profile settings for a provider
 * GET /api/v1/services/providers/{providerId}/public-profile/settings
 */
export const getProviderPublicProfileSettings = async (
  providerId: number
): Promise<UpdateProviderPublicProfileSettingsRequest | null> => {
  try {
    const response = await apiClient.api.getProviderGetPublicProfileSettings(providerId)
    const responseAny: any = response
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = (responseAny as { data?: unknown }).data
      if (data && typeof data === 'object') {
        return data as UpdateProviderPublicProfileSettingsRequest
      }
    }
    if (responseAny && typeof responseAny === 'object') {
      return responseAny as UpdateProviderPublicProfileSettingsRequest
    }
    return null
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch public profile settings'
    )
  }
}

/**
 * Update public profile settings for a provider
 * PUT /api/v1/services/providers/{providerId}/public-profile/settings
 */
export const updateProviderPublicProfileSettings = async (
  providerId: number,
  data: UpdateProviderPublicProfileSettingsRequest
): Promise<void> => {
  try {
    await apiClient.api.putProviderUpdatePublicProfileSettings(providerId, data)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to update public profile settings'
    )
  }
}
