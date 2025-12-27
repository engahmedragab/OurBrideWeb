import { apiClient } from './apiClient'
import type { CommunityHomeResponse } from '@/types/responses/community/community-home-response'

/**
 * Home API endpoints
 */

/**
 * Get home page data
 * GET /api/v1/home
 * @returns Home page data including products, services, testimonials, etc.
 */
export const getHomeData = async (): Promise<unknown> => {
  try {
    const response = await apiClient.api.getHomeGetHomeData()
    // The API endpoint returns void, any, so we need to handle the response data
    // The actual data might be in response.data or directly in response
    const responseData = response as { data?: unknown }
    return responseData.data ?? response
  } catch (error) {
    console.error('Error fetching home data:', error)
    throw error
  }
}

/**
 * Get store home page data
 * @returns Store home page data including products, categories, offers, etc.
 */
export const getStoreHomeData = async (): Promise<unknown> => {
  try {
    const response = await apiClient.api.getHomeGetStoreHome()
    // The API endpoint returns void, any, so we need to handle the response data
    // The actual data might be in response.data or directly in response
    const responseData = response as { data?: unknown }
    return responseData.data ?? response
  } catch (error) {
    console.error('Error fetching store home data:', error)
    throw error
  }
}

/**
 * Get services home page data
 * @returns Services home page data including services, categories, banners, providers, hero slides, etc.
 */
export const getServicesHome = async (): Promise<unknown> => {
  try {
    const response = await apiClient.api.getHomeGetServiceHome()
    // The API endpoint returns void, any, so we need to handle the response data
    // The actual data might be in response.data or directly in response
    const responseData = response as { data?: unknown }
    return responseData.data ?? response
  } catch (error) {
    console.error('Error fetching services home data:', error)
    throw error
  }
}

/**
 * Get community home page data
 * GET /api/v1/home/community
 * @param query Optional query parameters for filtering and pagination
 * @returns Community home page data including posts, articles, suggested users, providers, and tags
 */
export const getCommunityHome = async (query?: {
  postsCount?: number
  articlesCount?: number
  suggestedUsersCount?: number
  topProvidersCount?: number
  tagIds?: string
  tagsCount?: number
}): Promise<CommunityHomeResponse> => {
  try {
    const response = await apiClient.api.getHomeGetCommunityHome(query)
    const responseAny: any = response as { data?: { data?: CommunityHomeResponse } | CommunityHomeResponse } | CommunityHomeResponse
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: CommunityHomeResponse }).data
      }
      if (data && typeof data === 'object' && 'recentPosts' in data) {
        return data as CommunityHomeResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'recentPosts' in responseAny) {
      return responseAny as CommunityHomeResponse
    }
    throw new Error('Invalid response format from community home endpoint')
  } catch (error) {
    console.error('Error fetching community home data:', error)
    throw error instanceof Error ? error : new Error('Failed to fetch community home data')
  }
}

