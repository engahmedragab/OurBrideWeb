import { apiClient } from './apiClient'
import type { CommunityHomeResponse } from '@/types/responses/community/community-home-response'
import type { ProviderHomeResponse } from '@/types/responses/provider-home-response'

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
    // Filter out undefined values to ensure API is called with valid params
    let cleanQuery: typeof query | undefined = undefined
    if (query) {
      const filtered = Object.fromEntries(
        Object.entries(query).filter(([_, value]) => value !== undefined)
      )
      // Only use cleanQuery if there are actual values, otherwise pass undefined
      cleanQuery = Object.keys(filtered).length > 0 ? filtered : undefined
    }
    
    // Log API call for debugging
    const response = await apiClient.api.getHomeGetCommunityHome(cleanQuery)
    
    const responseAny = response as unknown as { data?: { data?: CommunityHomeResponse } | CommunityHomeResponse } | CommunityHomeResponse
    
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
  } catch (error: unknown) {
    if (error instanceof Error) {
    }
    
    // Log additional Axios error details if available
    if (error && typeof error === 'object' && 'isAxiosError' in error && error.isAxiosError) {
      const axiosError = error as {
        message?: string
        code?: string
        config?: {
          url?: string
          method?: string
          baseURL?: string
          params?: unknown
          headers?: unknown
        }
        response?: {
          status?: number
          statusText?: string
          data?: unknown
        }
      }
    }
    
    throw error instanceof Error ? error : new Error('Failed to fetch community home data')
  }
}

/**
 * Get mine info (user profile information)
 * GET /api/v1/home/mine-info
 * @returns User profile information
 */
export const getMineInfo = async (): Promise<unknown> => {
  try {
    const response = await apiClient.api.getHomemineInfo()
    const responseAny = response as unknown as Record<string, unknown>
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      return responseAny.data ?? responseAny
    }
    return responseAny
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch mine info')
  }
}

/**
 * Get provider home page data
 * GET /api/v1/home/provider
 * @returns Provider home page data including featured providers, testimonials, statistics, etc.
 */
export const getProviderHome = async (): Promise<ProviderHomeResponse> => {
  try {
    const response = await apiClient.api.getHomeGetProviderHome()
    const responseAny = response as unknown as { data?: { data?: ProviderHomeResponse } | ProviderHomeResponse } | ProviderHomeResponse
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: ProviderHomeResponse }).data
      }
      if (data && typeof data === 'object' && 'featuredProviders' in data) {
        return data as ProviderHomeResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'featuredProviders' in responseAny) {
      return responseAny as ProviderHomeResponse
    }
    throw new Error('Invalid response format from provider home endpoint')
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch provider home data')
  }
}

/**
 * Get store home page data by provider
 * GET /api/v1/home/store/provider
 * @param query Query parameters including providerId, branchId, staffId
 * @returns Store home page data including banners, testimonials, FAQs, top bar texts
 */
export const getStoreHomeByProvider = async (query?: {
  providerId?: number
  branchId?: number
  staffId?: string
}): Promise<unknown> => {
  try {
    // Clean query parameters - remove undefined values
    const cleanQuery = query
      ? Object.fromEntries(
          Object.entries(query).filter(([_, value]) => value !== undefined)
        )
      : undefined

    const response = await apiClient.api.getHomeGetStoreHomeByProvider(
      Object.keys(cleanQuery || {}).length > 0 ? cleanQuery : undefined
    )
    
    // The API endpoint returns void, any, so we need to handle the response data
    const responseData = response as { data?: unknown }
    return responseData.data ?? response
  } catch (error) {
    throw error
  }
}

