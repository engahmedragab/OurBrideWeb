// Profile API service functions

import { apiClient } from '@/services/api/apiClient'
import type {
  UserPlanningPreferenceRequest,
  Preparation,
  UserRequest,
} from '@/../client/common/api/gen/ourbride-api'
import type { UserResponse } from '@/types/responses'

export interface PlanningPreference {
  id: number
  name: string
  nameEn?: string
  nameAr?: string
  description?: string
  descriptionEn?: string
  descriptionAr?: string
  imageUrl?: string
  iconName?: string | null
  colorName?: string | null
}

/**
 * Get user's planning preference init status from profile endpoint
 */
export const getPlanningPreferenceInit = async (): Promise<boolean> => {
  try {
    // Use profile endpoint to get user profile which includes isInit field
    const response = await apiClient.api.getProfileGet()
    const responseData = response as { data?: unknown }
    const data = responseData?.data ?? response

    // Handle different response structures
    if (typeof data === 'object' && data !== null) {
      const dataObj = data as Record<string, unknown>

      // Check for isInit field (from UserResponse type)
      if ('isInit' in dataObj) {
        return !!dataObj.isInit
      }

      // If data has a nested user object
      if (
        'user' in dataObj &&
        typeof dataObj.user === 'object' &&
        dataObj.user !== null
      ) {
        const userObj = dataObj.user as Record<string, unknown>
        if ('isInit' in userObj) {
          return !!userObj.isInit
        }
      }
    }

    // Fallback: treat unknown responses as not-init
    return false
  } catch (error) {
    console.error(
      'Error fetching planning preferences init status from profile:',
      error
    )
    // For safety, if the API fails, treat as not initialized
    return false
  }
}

// ...existing exports

export const getPlanningPreferences = async (): Promise<
  PlanningPreference[]
> => {
  try {
    const response = await apiClient.api.getPreparationsGetAll()

    // The response is an AxiosResponse, so the actual data is in response.data
    let preparations: Preparation[] = []
    const responseData = (response as { data?: unknown })?.data

    // Check if responseData is directly an array
    if (Array.isArray(responseData)) {
      preparations = responseData as Preparation[]
    } else if (responseData && typeof responseData === 'object') {
      const dataObj = responseData as Record<string, unknown>
      if (Array.isArray(dataObj.data)) {
        preparations = dataObj.data as Preparation[]
      } else if (Array.isArray(dataObj.items)) {
        preparations = dataObj.items as Preparation[]
      } else if (Array.isArray(dataObj.result)) {
        preparations = dataObj.result as Preparation[]
      } else if (Array.isArray(dataObj.results)) {
        preparations = dataObj.results as Preparation[]
      } else if (Array.isArray(dataObj.content)) {
        preparations = dataObj.content as Preparation[]
      }
    } else if (Array.isArray(response)) {
      preparations = response as Preparation[]
    }
    // Map preparations to PlanningPreference type
    return preparations.map(prep => ({
      id: prep.id,
      name: prep.nameEn || prep.nameAr || 'Unknown',
      nameEn: prep.nameEn,
      nameAr: prep.nameAr,
      description:
        prep.descriptionEn || prep.descriptionAr || prep.bioEn || prep.bioAr,
      descriptionEn: prep.descriptionEn || prep.bioEn,
      descriptionAr: prep.descriptionAr || prep.bioAr,
      imageUrl:
        prep.image?.url ||
        prep.image?.thumbnailUrl ||
        prep.image?.previewUrl ||
        undefined,
      iconName: prep.iconName ?? undefined,
      colorName: prep.colorName ?? undefined,
    }))
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch planning preferences'
    )
  }
}

/**
 * Set user planning preferences
 */
export const setPlanningPreferences = async (
  preparationIds: number[]
): Promise<void> => {
  try {
    const request: UserPlanningPreferenceRequest = {
      preparationIds,
    }
    await apiClient.api.postProfileSetPlanningPreferences(request)
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to set planning preferences'
    throw new Error(errorMessage)
  }
}

/**
 * Get user profile
 */
export const getUserProfile = async (): Promise<UserResponse | null> => {
  try {
    const response = await apiClient.api.getProfileGet()
    const responseAny: any = response as { data?: unknown } | unknown

    // Handle different response structures
    const data = responseAny?.data ?? responseAny

    if (data && typeof data === 'object' && 'id' in data) {
      return data as UserResponse
    }

    return null
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch user profile'
    )
  }
}

/**
 * Update user profile
 */
export const updateUserProfile = async (data: UserRequest): Promise<void> => {
  try {
    await apiClient.api.postProfileUpdate(data)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to update user profile'
    )
  }
}
