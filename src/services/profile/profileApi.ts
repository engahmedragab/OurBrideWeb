// Profile API service functions

import { apiClient } from '@/services/api/apiClient'
import type { UserPlanningPreferenceRequest, Preparation } from '@/../client/common/api/gen/ourbride-api'

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
 * Get user's planning preference init status
 */
export const getPlanningPreferenceInit = async (): Promise<boolean> => {
  try {
    // The GET endpoint will likely return the user's preferences/ids or an isInit field
    const response = await apiClient.api.getProfileGetPlanningPreferences()
    const data = response?.data ?? response

    // Several possible patterns depending on backend:
    if (typeof data === 'object' && data !== null) {
      // Pattern 1: Has an explicit field for init status
      if ('isPreferenceInit' in data) return !!data.isPreferenceInit
      if ('isInit' in data) return !!data.isInit
      // Pattern 2: User has actual preferences (array), treat as init if not empty
      if ('planningPreferenceIds' in data && Array.isArray(data.planningPreferenceIds)) {
        return data.planningPreferenceIds.length > 0
      }
      if ('preferences' in data && Array.isArray(data.preferences)) {
        return data.preferences.length > 0
      }
    }
    // Pattern 3: Array means already set (legacy)
    if (Array.isArray(data)) {
      return data.length > 0
    }
    // Fallback: treat unknown responses as not-init
    return false
  } catch (error) {
    console.error('Error fetching planning preferences init status:', error)
    // For safety, if the API fails, treat as not initialized
    return false
  }
}

// ...existing exports

export const getPlanningPreferences = async (): Promise<PlanningPreference[]> => {
  try {
    const response = await apiClient.api.getPreparationsGetAll();

    // The response is an AxiosResponse, so the actual data is in response.data 
    let preparations: Preparation[] = [];
    const responseData = (response as { data?: unknown })?.data;

    // Check if responseData is directly an array
    if (Array.isArray(responseData)) {
      preparations = responseData as Preparation[];
    } else if (responseData && typeof responseData === 'object') {
      const dataObj = responseData as Record<string, unknown>;
      if (Array.isArray(dataObj.data)) {
        preparations = dataObj.data as Preparation[];
      } else if (Array.isArray(dataObj.items)) {
        preparations = dataObj.items as Preparation[];
      } else if (Array.isArray(dataObj.result)) {
        preparations = dataObj.result as Preparation[];
      } else if (Array.isArray(dataObj.results)) {
        preparations = dataObj.results as Preparation[];
      } else if (Array.isArray(dataObj.content)) {
        preparations = dataObj.content as Preparation[];
      }
    } else if (Array.isArray(response)) {
      preparations = response as Preparation[];
    }
    // Map preparations to PlanningPreference type
    return preparations.map((prep) => ({
      id: prep.id,
      name: prep.nameEn || prep.nameAr || 'Unknown',
      nameEn: prep.nameEn,
      nameAr: prep.nameAr,
      description: prep.descriptionEn || prep.descriptionAr || prep.bioEn || prep.bioAr,
      descriptionEn: prep.descriptionEn || prep.bioEn,
      descriptionAr: prep.descriptionAr || prep.bioAr,
      imageUrl: prep.image?.url || prep.image?.thumbnailUrl || prep.image?.previewUrl || undefined,
      iconName: prep.iconName ?? undefined,
      colorName: prep.colorName ?? undefined,
    }));
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch planning preferences');
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
    const errorMessage = error instanceof Error ? error.message : 'Failed to set planning preferences'
    throw new Error(errorMessage)
  }
}
