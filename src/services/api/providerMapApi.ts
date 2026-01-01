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
 * Provider Map Response - simplified response from map endpoint
 */
export interface ProviderMapResponse {
  id: number
  name: string
  latitude: number
  longitude: number
  address: string
  rate: number | null
}

/**
 * Map ProviderMapResponse to FeaturedProviderResponse
 * Also attach coordinates as a custom property for map display
 */
const mapProviderMapToFeatured = (provider: ProviderMapResponse): FeaturedProviderResponse & { latitude?: number; longitude?: number } => {
  return {
    id: provider.id,
    nameEn: provider.name,
    nameAr: provider.name,
    descriptionEn: '',
    descriptionAr: '',
    publicLogoImageUrl: '',
    publicBannerImageUrl: '',
    rate: provider.rate,
    totalReviews: 0,
    isVerified: false,
    totalServices: 0,
    totalProducts: 0,
    shortAddress: provider.address || '',
    publicProfileSlug: `/provider/${provider.id}`,
    uniqueCode: `provider-${provider.id}`,
    topRatedService: null,
    // Add coordinates for map display
    latitude: provider.latitude,
    longitude: provider.longitude,
  }
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

    // Add language parameter
    queryParams.append('lang', getApiLanguage())
    
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
    
    // Construct URL - remove /api/v1 from baseURL if it exists to avoid duplication
    const cleanBaseURL = baseURL.replace(/\/$/, '').replace(/\/api\/v1$/, '')
    const endpoint = `/api/v1/services/providers/map`
    const queryString = queryParams.toString()
    const fullUrl = `${cleanBaseURL}${endpoint}${queryString ? `?${queryString}` : ''}`
    
    console.log('Fetching providers map:', fullUrl)
    
    const fetchResponse = await fetch(fullUrl, {
      method: 'GET',
      headers,
    })
    
    if (!fetchResponse.ok) {
      throw new Error(`HTTP error! status: ${fetchResponse.status}`)
    }
    
    const responseData = await fetchResponse.json() as Record<string, unknown>
    
    console.log('Map API response:', responseData)
    
    // Handle response structure: { data: { providers: [...] } }
    let providersData: unknown = responseData
    
    if (responseData && typeof responseData === 'object') {
      if ('data' in responseData) {
        const nestedData = responseData.data
        if (Array.isArray(nestedData)) {
          providersData = nestedData
        } else if (nestedData && typeof nestedData === 'object') {
          if ('providers' in nestedData && Array.isArray(nestedData.providers)) {
            providersData = nestedData.providers
          } else if ('data' in nestedData && Array.isArray(nestedData.data)) {
            providersData = nestedData.data
          } else if ('items' in nestedData && Array.isArray(nestedData.items)) {
            providersData = nestedData.items
          }
        }
      } else if ('providers' in responseData && Array.isArray(responseData.providers)) {
        providersData = responseData.providers
      }
    }
    
    // Ensure we have an array
    if (!Array.isArray(providersData)) {
      console.warn('Providers data is not an array:', providersData)
      return []
    }
    
    // Map ProviderMapResponse[] to FeaturedProviderResponse[]
    const providers = providersData as ProviderMapResponse[]
    return providers.map(mapProviderMapToFeatured)
  } catch (error: unknown) {
    console.error('Error fetching providers map:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch providers for map'
    )
  }
}

