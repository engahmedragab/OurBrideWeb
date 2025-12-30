// Provider API service functions

import { apiClient } from '@/services/api/apiClient'
import type { UpdateProviderPublicProfileSettingsRequest } from '@/../client/common/api/gen/ourbride-api'
import type { ApiResult } from '@/types/responses'
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
    const responseData = response as unknown as { data?: { data?: boolean } | { success?: boolean } | boolean } | { success?: boolean } | boolean
    let result: boolean
    if (typeof responseData === 'boolean') {
      result = responseData
    } else if (responseData && typeof responseData === 'object') {
      if ('data' in responseData && responseData.data) {
        if (typeof responseData.data === 'boolean') {
          result = responseData.data
        } else if (typeof responseData.data === 'object' && 'data' in responseData.data) {
          result = responseData.data.data ?? true
        } else if (typeof responseData.data === 'object' && 'success' in responseData.data) {
          result = responseData.data.success ?? true
        } else {
          result = true
        }
      } else if ('success' in responseData) {
        result = responseData.success ?? true
      } else {
        result = true
      }
    } else {
      result = true
    }
    const resultObj = result as { data?: boolean; success?: boolean } | boolean
    // Return true if followed, false if unfollowed
    if (typeof resultObj === 'boolean') return resultObj
    return resultObj?.data ?? resultObj?.success ?? true
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
    const responseData = response as unknown as { data?: { data?: boolean } | { success?: boolean } | boolean } | { success?: boolean } | boolean
    let result: boolean
    if (typeof responseData === 'boolean') {
      result = responseData
    } else if (responseData && typeof responseData === 'object') {
      if ('data' in responseData && responseData.data) {
        if (typeof responseData.data === 'boolean') {
          result = responseData.data
        } else if (typeof responseData.data === 'object' && 'data' in responseData.data) {
          result = responseData.data.data ?? true
        } else if (typeof responseData.data === 'object' && 'success' in responseData.data) {
          result = responseData.data.success ?? true
        } else {
          result = true
        }
      } else if ('success' in responseData) {
        result = responseData.success ?? true
      } else {
        result = true
      }
    } else {
      result = true
    }
    // Return true if favorited, false if removed
    return result
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
): Promise<ApiResult<unknown>> => {
  try {
    const response = await apiClient.api.postProviderAddReviews(providerId, data)
    const responseData = response as unknown as { data?: { data?: ApiResult<unknown> } | ApiResult<unknown> } | ApiResult<unknown>
    if (responseData && typeof responseData === 'object') {
      if ('data' in responseData && responseData.data) {
        if (typeof responseData.data === 'object' && 'success' in responseData.data) {
          return responseData.data as ApiResult<unknown>
        }
        if (typeof responseData.data === 'object' && 'data' in responseData.data && responseData.data.data) {
          return responseData.data.data as ApiResult<unknown>
        }
      }
      if ('success' in responseData) {
        return responseData as ApiResult<unknown>
      }
    }
    const defaultResult: ApiResult<unknown> = { data: null, success: false, statusCode: 0, message: '' }
    return defaultResult
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
    const responseData = response as unknown as { data?: UpdateProviderPublicProfileSettingsRequest } | UpdateProviderPublicProfileSettingsRequest
    // Handle different response structures
    if (responseData && typeof responseData === 'object' && 'data' in responseData && responseData.data) {
      return responseData.data
    }
    if (responseData && typeof responseData === 'object' && 'id' in responseData) {
      return responseData as UpdateProviderPublicProfileSettingsRequest
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
