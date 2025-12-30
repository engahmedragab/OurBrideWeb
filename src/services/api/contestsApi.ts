// Community Contests API service functions

import { apiClient } from '@/services/api/apiClient'
import type {
  LeaderboardContestResponse,
  ContestParticipantResponse,
  ContestLeaderboardResponse,
  ShareLeaderboardContestResponse,
} from '@/types/responses/community'
import type {
  CreateLeaderboardContestRequest,
  UpdateLeaderboardContestRequest,
  RegisterContestParticipantRequest,
  SubmitContestEntryRequest,
  AddReviewRequest,
} from '@/../client/common/api/gen/ourbride-api'

/**
 * Get all contests
 */
export const getAllContests = async (params?: {
  page?: number
  pageSize?: number
}): Promise<LeaderboardContestResponse[]> => {
  try {
    const response = await apiClient.api.getContestsGetAll(params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as LeaderboardContestResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as LeaderboardContestResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as LeaderboardContestResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as LeaderboardContestResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch contests')
  }
}

/**
 * Get contest by ID
 */
export const getContestById = async (id: number): Promise<LeaderboardContestResponse | null> => {
  try {
    const response = await apiClient.api.getContestsGetById(id)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as LeaderboardContestResponse
    }
    if (responseAny?.data) {
      return responseAny.data as LeaderboardContestResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as LeaderboardContestResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch contest')
  }
}

/**
 * Get contest with leaderboard
 */
export const getContestWithLeaderboard = async (id: number): Promise<LeaderboardContestResponse | null> => {
  try {
    const response = await apiClient.api.getContestsGetWithLeaderboard(id)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as LeaderboardContestResponse
    }
    if (responseAny?.data) {
      return responseAny.data as LeaderboardContestResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as LeaderboardContestResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch contest with leaderboard')
  }
}

/**
 * Get published contests
 */
export const getPublishedContests = async (params?: {
  page?: number
  pageSize?: number
}): Promise<LeaderboardContestResponse[]> => {
  try {
    const response = await apiClient.api.getContestsGetPublished(params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as LeaderboardContestResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as LeaderboardContestResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as LeaderboardContestResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as LeaderboardContestResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch published contests')
  }
}

/**
 * Get active contests
 */
export const getActiveContests = async (params?: {
  page?: number
  pageSize?: number
}): Promise<LeaderboardContestResponse[]> => {
  try {
    const response = await apiClient.api.getContestsGetActive(params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as LeaderboardContestResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as LeaderboardContestResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as LeaderboardContestResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as LeaderboardContestResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch active contests')
  }
}

/**
 * Get contests by user ID
 */
export const getContestsByUserId = async (userId: string): Promise<LeaderboardContestResponse[]> => {
  try {
    const response = await apiClient.api.getContestsGetByUserId(userId)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as LeaderboardContestResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as LeaderboardContestResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as LeaderboardContestResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as LeaderboardContestResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch contests by user')
  }
}

/**
 * Search contests
 */
export const searchContests = async (params?: {
  searchTerm?: string
}): Promise<LeaderboardContestResponse[]> => {
  try {
    const response = await apiClient.api.getContestsSearch(params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as LeaderboardContestResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as LeaderboardContestResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as LeaderboardContestResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as LeaderboardContestResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to search contests')
  }
}

/**
 * Create a new contest
 */
export const createContest = async (data: CreateLeaderboardContestRequest): Promise<LeaderboardContestResponse | null> => {
  try {
    const response = await apiClient.api.postContestsCreate(data)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as LeaderboardContestResponse
    }
    if (responseAny?.data) {
      return responseAny.data as LeaderboardContestResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as LeaderboardContestResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create contest')
  }
}

/**
 * Update a contest
 */
export const updateContest = async (id: number, data: UpdateLeaderboardContestRequest): Promise<LeaderboardContestResponse | null> => {
  try {
    const response = await apiClient.api.putContestsUpdate(id, data)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as LeaderboardContestResponse
    }
    if (responseAny?.data) {
      return responseAny.data as LeaderboardContestResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as LeaderboardContestResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update contest')
  }
}

/**
 * Delete a contest
 */
export const deleteContest = async (id: number): Promise<boolean> => {
  try {
    await apiClient.api.deleteContestsDelete(id)
    return true
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete contest')
  }
}

/**
 * Approve a contest
 */
export const approveContest = async (id: number): Promise<boolean> => {
  try {
    await apiClient.api.postContestsApprove(id)
    return true
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to approve contest')
  }
}

/**
 * Register participant in a contest
 */
export const registerParticipant = async (id: string, data: RegisterContestParticipantRequest): Promise<ContestParticipantResponse | null> => {
  try {
    const response = await apiClient.api.postContestsRegister(id, data)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as ContestParticipantResponse
    }
    if (responseAny?.data) {
      return responseAny.data as ContestParticipantResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as ContestParticipantResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to register participant')
  }
}

/**
 * Submit contest entry
 */
export const submitContestEntry = async (id: string, data: SubmitContestEntryRequest): Promise<ContestParticipantResponse | null> => {
  try {
    const response = await apiClient.api.postContestsSubmitEntry(id, data)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as ContestParticipantResponse
    }
    if (responseAny?.data) {
      return responseAny.data as ContestParticipantResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as ContestParticipantResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to submit contest entry')
  }
}

/**
 * Get leaderboard for a contest
 */
export const getLeaderboard = async (id: number, params?: {
  topCount?: number
}): Promise<ContestLeaderboardResponse[]> => {
  try {
    const response = await apiClient.api.getContestsGetLeaderboard(id, params)
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as ContestLeaderboardResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as ContestLeaderboardResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as ContestLeaderboardResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as ContestLeaderboardResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch leaderboard')
  }
}

/**
 * Add review to a contest
 */
export const addReview = async (id: number, data: AddReviewRequest): Promise<void> => {
  try {
    await apiClient.api.postContestsAddReview(id, data)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to add review')
  }
}

/**
 * Toggle like on a contest
 */
export const toggleLike = async (id: number): Promise<boolean> => {
  try {
    await apiClient.api.postContestsToggleLike(id)
    // The API might return the new like status, but we'll need to check separately
    return true
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to toggle like')
  }
}

/**
 * Check if contest is liked
 */
export const isLiked = async (id: number): Promise<boolean> => {
  try {
    const response = await apiClient.api.getContestsIsLiked(id)
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
 * Toggle favorite on a contest
 */
export const toggleFavorite = async (id: number): Promise<boolean> => {
  try {
    await apiClient.api.postContestsToggleFavorite(id)
    // The API might return the new favorite status, but we'll need to check separately
    return true
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to toggle favorite')
  }
}

/**
 * Check if contest is favorited
 */
export const isFavorite = async (id: number): Promise<boolean> => {
  try {
    const response = await apiClient.api.getContestsIsFavorite(id)
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
 * Add media to a contest
 */
export const addMedia = async (id: number, mediaId: number): Promise<void> => {
  try {
    await apiClient.api.postContestsAddMedia(id, mediaId)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to add media')
  }
}

/**
 * Remove media from a contest
 */
export const removeMedia = async (id: number, mediaId: number): Promise<void> => {
  try {
    await apiClient.api.deleteContestsRemoveMedia(id, mediaId)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to remove media')
  }
}

/**
 * Get media IDs for a contest
 */
export const getMediaIds = async (id: number): Promise<number[]> => {
  try {
    const response = await apiClient.api.getContestsGetMedia(id)
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
 * Increment view count for a contest
 */
export const incrementViewCount = async (id: number): Promise<void> => {
  try {
    await apiClient.api.postContestsIncrementView(id)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to increment view count')
  }
}

/**
 * Share a contest
 * POST /api/v1/community/contests/{id}/share
 */
export const shareContest = async (
  id: number,
  shareSource?: string
): Promise<ShareLeaderboardContestResponse | null> => {
  try {
    const response = await apiClient.api.postContestsShare(id, { shareSource })
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = (responseAny as { data?: unknown }).data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: ShareLeaderboardContestResponse }).data
      }
      if (data && typeof data === 'object' && 'contestId' in data) {
        return data as ShareLeaderboardContestResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'contestId' in responseAny) {
      return responseAny as ShareLeaderboardContestResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to share contest')
  }
}









