// Community Decision Groups API service functions

import { apiClient } from '@/services/api/apiClient'
import type {
  DecisionGroupResponse,
  DecisionOptionResponse,
  DecisionVoteResponse,
  ShareDecisionGroupResponse,
} from '@/types/responses/community'
import type {
  CreateDecisionGroupRequest,
  UpdateDecisionGroupRequest,
  DecisionOptionRequest,
  CastVoteRequest,
  AddReviewRequest,
} from '@/../client/common/api/gen/ourbride-api'

/**
 * Get all decision groups
 */
export const getAllDecisionGroups = async (params?: {
  page?: number
  pageSize?: number
}): Promise<DecisionGroupResponse[]> => {
  try {
    const response = await apiClient.api.getDecisionGroupsGetAll(params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as DecisionGroupResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as DecisionGroupResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as DecisionGroupResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as DecisionGroupResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch decision groups')
  }
}

/**
 * Get decision group by ID
 */
export const getDecisionGroupById = async (id: number): Promise<DecisionGroupResponse | null> => {
  try {
    const response = await apiClient.api.getDecisionGroupsGetById(id)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as DecisionGroupResponse
    }
    if (responseAny?.data) {
      return responseAny.data as DecisionGroupResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as DecisionGroupResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch decision group')
  }
}

/**
 * Get decision group with options
 */
export const getDecisionGroupWithOptions = async (id: number): Promise<DecisionGroupResponse | null> => {
  try {
    const response = await apiClient.api.getDecisionGroupsGetWithOptions(id)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as DecisionGroupResponse
    }
    if (responseAny?.data) {
      return responseAny.data as DecisionGroupResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as DecisionGroupResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch decision group with options')
  }
}

/**
 * Get published decision groups
 */
export const getPublishedDecisionGroups = async (params?: {
  page?: number
  pageSize?: number
}): Promise<DecisionGroupResponse[]> => {
  try {
    const response = await apiClient.api.getDecisionGroupsGetPublished(params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as DecisionGroupResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as DecisionGroupResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as DecisionGroupResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as DecisionGroupResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch published decision groups')
  }
}

/**
 * Get active decision groups
 */
export const getActiveDecisionGroups = async (params?: {
  page?: number
  pageSize?: number
}): Promise<DecisionGroupResponse[]> => {
  try {
    const response = await apiClient.api.getDecisionGroupsGetActive(params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as DecisionGroupResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as DecisionGroupResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as DecisionGroupResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as DecisionGroupResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch active decision groups')
  }
}

/**
 * Get decision groups by user ID
 */
export const getDecisionGroupsByUserId = async (userId: string): Promise<DecisionGroupResponse[]> => {
  try {
    const response = await apiClient.api.getDecisionGroupsGetByUserId(userId)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as DecisionGroupResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as DecisionGroupResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as DecisionGroupResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as DecisionGroupResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch decision groups by user')
  }
}

/**
 * Search decision groups
 */
export const searchDecisionGroups = async (params?: {
  searchTerm?: string
}): Promise<DecisionGroupResponse[]> => {
  try {
    const response = await apiClient.api.getDecisionGroupsSearch(params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as DecisionGroupResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as DecisionGroupResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as DecisionGroupResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as DecisionGroupResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to search decision groups')
  }
}

/**
 * Create a new decision group
 */
export const createDecisionGroup = async (data: CreateDecisionGroupRequest): Promise<DecisionGroupResponse | null> => {
  try {
    const response = await apiClient.api.postDecisionGroupsCreate(data)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as DecisionGroupResponse
    }
    if (responseAny?.data) {
      return responseAny.data as DecisionGroupResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as DecisionGroupResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create decision group')
  }
}

/**
 * Update a decision group
 */
export const updateDecisionGroup = async (id: number, data: UpdateDecisionGroupRequest): Promise<DecisionGroupResponse | null> => {
  try {
    const response = await apiClient.api.putDecisionGroupsUpdate(id, data)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as DecisionGroupResponse
    }
    if (responseAny?.data) {
      return responseAny.data as DecisionGroupResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as DecisionGroupResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update decision group')
  }
}

/**
 * Delete a decision group
 */
export const deleteDecisionGroup = async (id: number): Promise<boolean> => {
  try {
    await apiClient.api.deleteDecisionGroupsDelete(id)
    return true
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete decision group')
  }
}

/**
 * Add decision option to a decision group
 */
export const addDecisionOption = async (id: number, data: DecisionOptionRequest): Promise<DecisionOptionResponse | null> => {
  try {
    const response = await apiClient.api.postDecisionGroupsAddOption(id, data)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as DecisionOptionResponse
    }
    if (responseAny?.data) {
      return responseAny.data as DecisionOptionResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as DecisionOptionResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to add decision option')
  }
}

/**
 * Cast a vote on a decision group
 */
export const castVote = async (id: string, data: CastVoteRequest): Promise<DecisionVoteResponse | null> => {
  try {
    const response = await apiClient.api.postDecisionGroupsCastVote(id, data)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as DecisionVoteResponse
    }
    if (responseAny?.data) {
      return responseAny.data as DecisionVoteResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as DecisionVoteResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to cast vote')
  }
}

/**
 * Add review to a decision group
 */
export const addReview = async (id: number, data: AddReviewRequest): Promise<void> => {
  try {
    await apiClient.api.postDecisionGroupsAddReview(id, data)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to add review')
  }
}

/**
 * Toggle like on a decision group
 */
export const toggleLike = async (id: number): Promise<boolean> => {
  try {
    await apiClient.api.postDecisionGroupsToggleLike(id)
    // The API might return the new like status, but we'll need to check separately
    return true
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to toggle like')
  }
}

/**
 * Check if decision group is liked
 */
export const isLiked = async (id: number): Promise<boolean> => {
  try {
    const response = await apiClient.api.getDecisionGroupsIsLiked(id)
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
 * Toggle favorite on a decision group
 */
export const toggleFavorite = async (id: number): Promise<boolean> => {
  try {
    await apiClient.api.postDecisionGroupsToggleFavorite(id)
    // The API might return the new favorite status, but we'll need to check separately
    return true
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to toggle favorite')
  }
}

/**
 * Check if decision group is favorited
 */
export const isFavorite = async (id: number): Promise<boolean> => {
  try {
    const response = await apiClient.api.getDecisionGroupsIsFavorite(id)
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
 * Add media to a decision group
 */
export const addMedia = async (id: number, mediaId: number): Promise<void> => {
  try {
    await apiClient.api.postDecisionGroupsAddMedia(id, mediaId)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to add media')
  }
}

/**
 * Remove media from a decision group
 */
export const removeMedia = async (id: number, mediaId: number): Promise<void> => {
  try {
    await apiClient.api.deleteDecisionGroupsRemoveMedia(id, mediaId)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to remove media')
  }
}

/**
 * Get media IDs for a decision group
 */
export const getMediaIds = async (id: number): Promise<number[]> => {
  try {
    const response = await apiClient.api.getDecisionGroupsGetMedia(id)
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
 * Increment view count for a decision group
 */
export const incrementViewCount = async (id: number): Promise<void> => {
  try {
    await apiClient.api.postDecisionGroupsIncrementView(id)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to increment view count')
  }
}

/**
 * Share a decision group
 * POST /api/v1/community/decision-groups/{id}/share
 */
export const shareDecisionGroup = async (
  id: number,
  shareSource?: string
): Promise<ShareDecisionGroupResponse | null> => {
  try {
    const response = await apiClient.api.postDecisionGroupsShare(id, { shareSource })
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = (responseAny as { data?: unknown }).data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: ShareDecisionGroupResponse }).data
      }
      if (data && typeof data === 'object' && 'decisionGroupId' in data) {
        return data as ShareDecisionGroupResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'decisionGroupId' in responseAny) {
      return responseAny as ShareDecisionGroupResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to share decision group')
  }
}





