// Community Profiles API service functions

import { apiClient } from '@/services/api/apiClient'
import type { CommunityProfileResponse } from '@/types/responses/community'

/**
 * Get user profile
 */
export const getUserProfile = async (userId: string): Promise<CommunityProfileResponse | null> => {
  try {
    const response = await apiClient.api.getCommunityProfileGetUserProfile(userId)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as CommunityProfileResponse
    }
    if (responseAny?.data) {
      return responseAny.data as CommunityProfileResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as CommunityProfileResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch user profile')
  }
}

/**
 * Get provider profile
 */
export const getProviderProfile = async (providerId: number): Promise<CommunityProfileResponse | null> => {
  try {
    const response = await apiClient.api.getCommunityProfileGetProviderProfile(providerId)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as CommunityProfileResponse
    }
    if (responseAny?.data) {
      return responseAny.data as CommunityProfileResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as CommunityProfileResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch provider profile')
  }
}

/**
 * Get bazaar event profile
 */
export const getBazaarEventProfile = async (bazaarEventId: number): Promise<CommunityProfileResponse | null> => {
  try {
    const response = await apiClient.api.getCommunityProfileGetBazaarEventProfile(bazaarEventId)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as CommunityProfileResponse
    }
    if (responseAny?.data) {
      return responseAny.data as CommunityProfileResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as CommunityProfileResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch bazaar event profile')
  }
}

/**
 * Toggle like on a profile
 */
export const toggleLike = async (params: {
  profileType?: string
  profileId?: number
  profileUserId?: string
}): Promise<void> => {
  try {
    await apiClient.api.postCommunityProfileToggleLike(params)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to toggle like')
  }
}

/**
 * Check if profile is liked
 */
export const isLiked = async (params: {
  profileType?: string
  profileId?: number
  profileUserId?: string
}): Promise<boolean> => {
  try {
    const response = await apiClient.api.getCommunityProfileIsLiked(params)
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
 * Toggle follow on a profile
 */
export const toggleFollow = async (params: {
  profileType?: string
  profileId?: number
  profileUserId?: string
}): Promise<void> => {
  try {
    await apiClient.api.postCommunityProfileToggleFollow(params)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to toggle follow')
  }
}

/**
 * Check if profile is being followed
 */
export const isFollowing = async (params: {
  profileType?: string
  profileId?: number
  profileUserId?: string
}): Promise<boolean> => {
  try {
    const response = await apiClient.api.getCommunityProfileIsFollowing(params)
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
    throw new Error(error instanceof Error ? error.message : 'Failed to check follow status')
  }
}

/**
 * Toggle favorite on a profile
 */
export const toggleFavorite = async (params: {
  profileType?: string
  profileId?: number
  profileUserId?: string
}): Promise<void> => {
  try {
    await apiClient.api.postCommunityProfileToggleFavorite(params)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to toggle favorite')
  }
}

/**
 * Check if profile is favorited
 */
export const isFavorited = async (params: {
  profileType?: string
  profileId?: number
  profileUserId?: string
}): Promise<boolean> => {
  try {
    const response = await apiClient.api.getCommunityProfileIsFavorited(params)
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


















