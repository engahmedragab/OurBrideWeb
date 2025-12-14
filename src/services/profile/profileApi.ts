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
 * Get list of available planning preferences from /preparations endpoint
 */
export const getPlanningPreferences = async (): Promise<PlanningPreference[]> => {
  try {
    const response = await apiClient.api.getPreparationsGetAll()
    
    // The response is an AxiosResponse, so the actual data is in response.data
    // Debug: Log the response structure
    console.log('Preparations API Response:', response)
    console.log('Response.data:', (response as { data?: unknown })?.data)
    
    // Handle different response structures
    let preparations: Preparation[] = []
    
    // Axios response structure: response.data contains the actual API response
    const responseData = (response as { data?: unknown })?.data
    
    // Check if responseData is directly an array (most common case)
    if (Array.isArray(responseData)) {
      preparations = responseData as Preparation[]
    }
    // Check if responseData has a nested data/items/result property
    else if (responseData && typeof responseData === 'object' && responseData !== null) {
      const dataObj = responseData as Record<string, unknown>
      
      // Try common property names
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
    }
    // Fallback: check if response itself is an array (shouldn't happen with axios, but just in case)
    else if (Array.isArray(response)) {
      preparations = response as Preparation[]
    }
    
    console.log('Extracted preparations count:', preparations.length)
    console.log('First preparation:', preparations[0])
    
    if (preparations.length === 0) {
      console.warn('No preparations found in response.')
      console.warn('Response type:', typeof response)
      console.warn('Response.data type:', typeof responseData)
      console.warn('Full response:', JSON.stringify(response, null, 2))
    }
    
    return mapPreparationsToPreferences(preparations)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch planning preferences'
    console.error('Error fetching planning preferences:', error)
    throw new Error(errorMessage)
  }
}

/**
 * Map Preparation objects to PlanningPreference format
 */
function mapPreparationsToPreferences(preparations: Preparation[]): PlanningPreference[] {
  return preparations.map((prep) => {
    // Get image URL, handling null values
    const imageUrl = prep.image?.url || prep.image?.thumbnailUrl || prep.image?.previewUrl
    const iconName = prep.iconName
    const colorName = prep.colorName
    
    return {
      id: prep.id,
      name: prep.nameEn || prep.nameAr || 'Unknown',
      nameEn: prep.nameEn,
      nameAr: prep.nameAr,
      description: prep.descriptionEn || prep.descriptionAr || prep.bioEn || prep.bioAr,
      descriptionEn: prep.descriptionEn || prep.bioEn,
      descriptionAr: prep.descriptionAr || prep.bioAr,
      imageUrl: imageUrl ?? undefined,
      iconName: iconName ?? undefined,
      colorName: colorName ?? undefined,
    }
  })
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

