import type { FeaturedProviderResponse } from '@/types/responses'
import { getToken } from '@/auth/utils/token'
import { getApiLanguage } from '@/utils/language'

export interface GetProvidersMapParams {
  latitude?: number
  longitude?: number
  radius?: number
  sortBy?: string
  venueType?: string
  serviceClasses?: number[]
  minRating?: number
  offersDeals?: boolean
  acceptsGroups?: boolean
}

/**
 * Get providers for map view with location-based filtering
 * GET /api/v1/services/providers/map
 */
export const getProvidersMap = async (
  params?: GetProvidersMapParams
): Promise<FeaturedProviderResponse[]> => {
  try {
    const queryParams = new URLSearchParams()
    
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
    if (params?.serviceClasses && params.serviceClasses.length > 0) {
      params.serviceClasses.forEach(sc => {
        queryParams.append('ServiceClasses', sc.toString())
      })
    }
    if (params?.minRating !== undefined) {
      queryParams.append('MinRating', params.minRating.toString())
    }
    if (params?.offersDeals !== undefined) {
      queryParams.append('OffersDeals', params.offersDeals.toString())
    }
    if (params?.acceptsGroups !== undefined) {
      queryParams.append('AcceptsGroups', params.acceptsGroups.toString())
    }

    const url = `/api/v1/services/providers/map${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    // Use fetch API with proper headers
    const token = getToken()
    const language = getApiLanguage()
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
    
    const headers: Record<string, string> = {
      'Accept-Language': language,
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const fullUrl = `${baseURL.replace(/\/$/, '')}${url}&lang=${language}`
    const fetchResponse = await fetch(fullUrl, {
      method: 'GET',
      headers,
    })
    
    if (!fetchResponse.ok) {
      throw new Error(`HTTP error! status: ${fetchResponse.status}`)
    }
    
    const responseData = await fetchResponse.json() as Record<string, unknown>
    
    // Handle different response structures
    let data: unknown = responseData
    
    if (responseData && typeof responseData === 'object') {
      if ('data' in responseData) {
        const nestedData = responseData.data
        if (Array.isArray(nestedData)) {
          data = nestedData
        } else if (nestedData && typeof nestedData === 'object') {
          if ('data' in nestedData && Array.isArray(nestedData.data)) {
            data = nestedData.data
          } else if ('providers' in nestedData && Array.isArray(nestedData.providers)) {
            data = nestedData.providers
          } else if ('items' in nestedData && Array.isArray(nestedData.items)) {
            data = nestedData.items
          }
        }
      } else if ('providers' in responseData && Array.isArray(responseData.providers)) {
        data = responseData.providers
      } else if ('items' in responseData && Array.isArray(responseData.items)) {
        data = responseData.items
      }
    }
    
    // Ensure we return an array
    if (Array.isArray(data)) {
      return data as FeaturedProviderResponse[]
    }
    
    return []
  } catch (error: unknown) {
    console.error('Error fetching providers map:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch providers for map'
    )
  }
}

