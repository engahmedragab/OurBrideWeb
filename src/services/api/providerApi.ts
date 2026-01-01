// Provider API service functions

import { apiClient } from '@/services/api/apiClient'
import type { UpdateProviderPublicProfileSettingsRequest } from '@/../client/common/api/gen/ourbride-api'
import type { ApiResult, MediaResponse, ProviderResponse, FeaturedProviderResponse } from '@/types/responses'
import type { ReviewRequest } from '@/../client/common/api/gen/ourbride-api'
import { ProviderStatus } from '@/types/responses/common'
import { getToken } from '@/auth/utils/token'
import { getApiLanguage } from '@/utils/language'

/**
 * Map ProviderResponse to FeaturedProviderResponse
 */
const mapProviderToFeatured = (provider: ProviderResponse): FeaturedProviderResponse => {
  return {
    id: provider.id,
    nameEn: provider.nameEn || '',
    nameAr: provider.nameAr || '',
    descriptionEn: provider.descriptionEn || '',
    descriptionAr: provider.descriptionAr || '',
    publicLogoImageUrl: provider.profileURL || '',
    publicBannerImageUrl: provider.profileURL || '', // Use same as logo if banner not available
    rate: provider.rate,
    totalReviews: provider.reviews?.length || 0,
    isVerified: provider.providerStatus === ProviderStatus.Active,
    totalServices: 0, // Not available in ProviderResponse
    totalProducts: 0, // Not available in ProviderResponse
    shortAddress: provider.shortAddress || '',
    publicProfileSlug: `/provider/${provider.id}`,
    uniqueCode: provider.slug || `provider-${provider.id}`,
    topRatedService: null,
  }
}

/**
 * Get provider details by ID
 * GET /api/v1/services/providers/{providerId}
 */
export const getProviderById = async (
  providerId: number
): Promise<ProviderResponse> => {
  try {
    const response = await apiClient.api.getProviderGetById(providerId)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as ProviderResponse
    }
    if (responseAny?.data) {
      return responseAny.data as ProviderResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as ProviderResponse
    }
    
    throw new Error('Invalid response structure')
  } catch (error: unknown) {
    console.error('Error fetching provider:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch provider details'
    )
  }
}

/**
 * Toggle follow for a provider
 * POST /api/v1/services/providers/follow/{providerId}
 */
export const toggleProviderFollow = async (
  providerId: number
): Promise<boolean> => {
  try {
    await apiClient.api.postProviderToggleFollow(providerId)
    // The API might return the new follow status, but we'll need to check separately
    return true
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
    await apiClient.api.postProviderToggleFavorite(providerId)
    // The API might return the new favorite status, but we'll need to check separately
    return true
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
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data && typeof responseAny.data.data === 'object' && 'success' in responseAny.data.data) {
      return responseAny.data.data as ApiResult<unknown>
    }
    if (responseAny?.data && typeof responseAny.data === 'object' && 'success' in responseAny.data) {
      return responseAny.data as ApiResult<unknown>
    }
    if (responseAny && typeof responseAny === 'object' && 'success' in responseAny) {
      return responseAny as ApiResult<unknown>
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
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as UpdateProviderPublicProfileSettingsRequest
    }
    if (responseAny?.data) {
      return responseAny.data as UpdateProviderPublicProfileSettingsRequest
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
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

/**
 * Get portfolio for a provider branch
 * GET /api/v1/services/provider-branches/provider/{providerId}/branches/{branchId}/portfolio
 * Note: This endpoint is not available in the generated API client, so we use fetch directly
 */
export const getProviderBranchPortfolio = async (
  providerId: number,
  branchId: number
): Promise<MediaResponse[]> => {
  try {
    const token = getToken()
    const language = getApiLanguage()
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
    
    const headers: Record<string, string> = {
      'Accept-Language': language,
      'Content-Type': 'application/json',
      'accept': '*/*',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const cleanBaseURL = baseURL.replace(/\/$/, '').replace(/\/api\/v1$/, '')
    const url = `${cleanBaseURL}/api/v1/services/provider-branches/provider/${providerId}/branches/${branchId}/portfolio?lang=${language}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch branch portfolio: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Handle different response structures
    const portfolio = data?.data?.data ?? data?.data ?? data
    
    return Array.isArray(portfolio) ? portfolio : []
  } catch (error: unknown) {
    console.error('Error fetching provider branch portfolio:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch provider branch portfolio'
    )
  }
}

/**
 * Get portfolio for a provider team member
 * GET /api/v1/services/provider-team/{providerId}/team-members/{teamMemberId}/portfolio
 * Note: This endpoint is not available in the generated API client, so we use fetch directly
 */
export const getProviderTeamMemberPortfolio = async (
  providerId: number,
  teamMemberId: string
): Promise<MediaResponse[]> => {
  try {
    const token = getToken()
    const language = getApiLanguage()
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
    
    const headers: Record<string, string> = {
      'Accept-Language': language,
      'Content-Type': 'application/json',
      'accept': '*/*',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const cleanBaseURL = baseURL.replace(/\/$/, '').replace(/\/api\/v1$/, '')
    const url = `${cleanBaseURL}/api/v1/services/provider-team/${providerId}/team-members/${teamMemberId}/portfolio?lang=${language}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch team member portfolio: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Handle different response structures
    const portfolio = data?.data?.data ?? data?.data ?? data
    
    return Array.isArray(portfolio) ? portfolio : []
  } catch (error: unknown) {
    console.error('Error fetching provider team member portfolio:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch provider team member portfolio'
    )
  }
}

/**
 * Parameters for filtering providers
 */
export interface FilterProvidersParams {
  search?: string
  serviceClass?: number
  serviceClasses?: number[]
  minRating?: number
  page?: number
  pageSize?: number
  latitude?: number
  longitude?: number
  radius?: number
  sortBy?: string
  venueType?: string
  offersDeals?: boolean
  acceptsGroups?: boolean
}

/**
 * Filter providers with advanced search and filtering options
 * GET /api/v1/services/providers/filter
 * Note: This endpoint is not available in the generated API client, so we use fetch directly
 */
export const filterProviders = async (
  params?: FilterProvidersParams
): Promise<FeaturedProviderResponse[]> => {
  try {
    const token = getToken()
    const language = getApiLanguage()
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
    
    const queryParams = new URLSearchParams()
    
    if (params?.search) {
      queryParams.append('Search', params.search)
    }
    if (params?.serviceClass !== undefined) {
      queryParams.append('ServiceClass', params.serviceClass.toString())
    }
    if (params?.serviceClasses && params.serviceClasses.length > 0) {
      params.serviceClasses.forEach(sc => {
        queryParams.append('ServiceClasses', sc.toString())
      })
    }
    if (params?.minRating !== undefined) {
      queryParams.append('MinRating', params.minRating.toString())
    }
    if (params?.page !== undefined) {
      queryParams.append('Page', params.page.toString())
    }
    if (params?.pageSize !== undefined) {
      queryParams.append('PageSize', params.pageSize.toString())
    }
    if (params?.latitude !== undefined) {
      queryParams.append('Latitude', params.latitude.toString())
    }
    if (params?.longitude !== undefined) {
      queryParams.append('Longitude', params.longitude.toString())
    }
    if (params?.radius !== undefined) {
      queryParams.append('Radius', params.radius.toString())
    }
    if (params?.sortBy) {
      queryParams.append('SortBy', params.sortBy)
    }
    if (params?.venueType) {
      queryParams.append('VenueType', params.venueType)
    }
    if (params?.offersDeals !== undefined) {
      queryParams.append('OffersDeals', params.offersDeals.toString())
    }
    if (params?.acceptsGroups !== undefined) {
      queryParams.append('AcceptsGroups', params.acceptsGroups.toString())
    }
    
    // Add language parameter
    queryParams.append('lang', language)
    
    const headers: Record<string, string> = {
      'Accept-Language': language,
      'Content-Type': 'application/json',
      'accept': '*/*',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    // Construct URL - baseURL might already include /api/v1, so we need to check
    // Remove /api/v1 from baseURL if it exists, then add the full endpoint path
    let cleanBaseURL = baseURL.replace(/\/$/, '').replace(/\/api\/v1$/, '')
    const endpoint = `/api/v1/services/providers/filter`
    const queryString = queryParams.toString()
    const fullUrl = `${cleanBaseURL}${endpoint}${queryString ? `?${queryString}` : ''}`
    
    console.log('Fetching providers filter:', fullUrl)
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers,
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Filter providers error:', response.status, errorText)
      throw new Error(`Failed to filter providers: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Handle different response structures - API returns ProviderResponse[]
    const providersData = data?.data?.data ?? data?.data ?? data
    
    if (!Array.isArray(providersData)) {
      console.warn('Providers data is not an array:', providersData)
      return []
    }
    
    // Map ProviderResponse[] to FeaturedProviderResponse[]
    const providers = providersData as ProviderResponse[]
    return providers.map(mapProviderToFeatured)
  } catch (error: unknown) {
    console.error('Error filtering providers:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to filter providers'
    )
  }
}
