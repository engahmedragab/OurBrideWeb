import type { FeaturedProviderResponse } from '@/types/responses'
import type { ServiceSummary } from '@/types/responses/service-summary'
import type { MediaResponse } from '@/types/responses/media-response'
import { apiClient } from '@/services/api/apiClient'

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
 * Provider Map Response - matches C# ProviderMapItem structure
 */
export interface ProviderMapResponse {
  id: number
  name: string
  latitude: number
  longitude: number
  address: string
  rate: number | null
  // Additional fields for provider card display
  topRatedServices: ServiceSummary[]
  totalServicesCount: number
  reviewCount: number
  images: MediaResponse[]
}

/**
 * Map ProviderMapResponse to FeaturedProviderResponse
 * Also attach coordinates and services as custom properties for map display
 */
const mapProviderMapToFeatured = (
  provider: ProviderMapResponse
): FeaturedProviderResponse & {
  latitude?: number
  longitude?: number
  topRatedServices?: ServiceSummary[]
} => {
  console.log('[mapProviderMapToFeatured] Mapping provider:', {
    id: provider.id,
    name: provider.name,
    latitude: provider.latitude,
    longitude: provider.longitude,
    address: provider.address,
    rate: provider.rate,
    topRatedServicesCount: provider.topRatedServices?.length || 0,
    totalServicesCount: provider.totalServicesCount,
    reviewCount: provider.reviewCount,
    imagesCount: provider.images?.length || 0,
  })

  // Get first image from images array for banner/logo
  const firstImage =
    provider.images && provider.images.length > 0 ? provider.images[0] : null

  // Get banner image (prefer featured or first image)
  const bannerImage = provider.images?.find(img => img.isFeatured) || firstImage
  const logoImage =
    provider.images?.find(img => img.mediaType === 1) || firstImage // Assuming 1 is image type

  const mapped = {
    id: provider.id,
    nameEn: provider.name || '',
    nameAr: provider.name || '',
    descriptionEn: '',
    descriptionAr: '',
    publicLogoImageUrl: logoImage?.url || logoImage?.thumbnailUrl || '',
    publicBannerImageUrl: bannerImage?.url || bannerImage?.thumbnailUrl || '',
    rate: provider.rate,
    totalReviews: provider.reviewCount || 0,
    isVerified: false,
    totalServices: provider.totalServicesCount || 0,
    totalProducts: 0,
    shortAddress: provider.address || '',
    publicProfileSlug: `/provider/${provider.id}`,
    uniqueCode: `provider-${provider.id}`,
    topRatedService:
      provider.topRatedServices && provider.topRatedServices.length > 0
        ? provider.topRatedServices[0]
        : null,
    // Add coordinates for map display - these are critical for map markers
    latitude: provider.latitude,
    longitude: provider.longitude,
    // Add topRatedServices for ProviderSearchCard
    topRatedServices: provider.topRatedServices || [],
  }

  console.log('[mapProviderMapToFeatured] Mapped result:', {
    id: mapped.id,
    nameEn: mapped.nameEn,
    latitude: mapped.latitude,
    longitude: mapped.longitude,
    topRatedServicesCount: mapped.topRatedServices?.length || 0,
  })

  return mapped
}

/**
 * Get providers for map view with location-based filtering
 * GET /api/v1/services/providers/map
 */
export const getProvidersMap = async (
  params?: GetProvidersMapParams
): Promise<FeaturedProviderResponse[]> => {
  try {
    // Build query object matching the generated API client signature
    const query = params
      ? {
          Latitude: params.latitude,
          Longitude: params.longitude,
          Radius: params.radius,
          SortBy: params.sortBy,
          VenueType: params.venueType,
          ServiceClasses: params.serviceClasses,
          MinRating: params.minRating,
          OffersDeals: params.offersDeals,
          AcceptsGroups: params.acceptsGroups,
        }
      : undefined

    // Remove undefined values from query
    const cleanQuery = query
      ? Object.fromEntries(
          Object.entries(query).filter(([_, value]) => value !== undefined)
        )
      : undefined

    const response = await apiClient.api.getProviderMap(cleanQuery)
    const responseAny: any = response

    console.log(
      '[getProvidersMap] Raw API response:',
      JSON.stringify(responseAny, null, 2)
    )
    console.log('[getProvidersMap] Response type:', typeof responseAny)
    console.log(
      '[getProvidersMap] Response keys:',
      responseAny ? Object.keys(responseAny) : []
    )

    // Handle different response structures
    // Expected structure from API: { data: { providers: [...] }, success: true, ... }
    // API client may return: response.data = { data: { providers: [...] }, ... }
    let providersData: unknown = null

    // First, check if response has a .data property (API client wrapper)
    const actualResponse = responseAny?.data || responseAny

    console.log(
      '[getProvidersMap] Actual response after unwrapping:',
      JSON.stringify(actualResponse, null, 2)
    )
    console.log(
      '[getProvidersMap] Actual response keys:',
      actualResponse ? Object.keys(actualResponse) : []
    )

    if (actualResponse && typeof actualResponse === 'object') {
      // Check for { data: { providers: [...] } } structure
      if ('data' in actualResponse && actualResponse.data) {
        const dataObj = actualResponse.data
        console.log('[getProvidersMap] Found data.data:', dataObj)
        console.log('[getProvidersMap] data.data type:', typeof dataObj)
        console.log(
          '[getProvidersMap] data.data keys:',
          typeof dataObj === 'object' ? Object.keys(dataObj) : []
        )

        if (typeof dataObj === 'object') {
          if ('providers' in dataObj && Array.isArray(dataObj.providers)) {
            providersData = dataObj.providers
            console.log(
              '[getProvidersMap] ✓ Found providers in data.data.providers, count:',
              (providersData as any[]).length
            )
          } else if (Array.isArray(dataObj)) {
            providersData = dataObj
            console.log(
              '[getProvidersMap] ✓ Found providers in data.data (array), count:',
              (providersData as any[]).length
            )
          } else if ('data' in dataObj && Array.isArray(dataObj.data)) {
            providersData = dataObj.data
            console.log(
              '[getProvidersMap] ✓ Found providers in data.data.data, count:',
              (providersData as any[]).length
            )
          } else if ('items' in dataObj && Array.isArray(dataObj.items)) {
            providersData = dataObj.items
            console.log(
              '[getProvidersMap] ✓ Found providers in data.data.items, count:',
              (providersData as any[]).length
            )
          }
        }
      }
      // Check for direct { providers: [...] } in actual response
      else if (
        'providers' in actualResponse &&
        Array.isArray(actualResponse.providers)
      ) {
        providersData = actualResponse.providers
        console.log(
          '[getProvidersMap] ✓ Found providers in root providers, count:',
          (providersData as any[]).length
        )
      }
      // Check if actual response is directly an array
      else if (Array.isArray(actualResponse)) {
        providersData = actualResponse
        console.log(
          '[getProvidersMap] ✓ Response is directly an array, count:',
          (providersData as any[]).length
        )
      }
    }

    // Ensure we have an array
    if (!Array.isArray(providersData)) {
      console.warn(
        '[getProvidersMap] Providers data is not an array. Response structure:',
        {
          responseAny,
          hasData: 'data' in (responseAny || {}),
          dataType: typeof responseAny?.data,
          dataKeys: responseAny?.data ? Object.keys(responseAny.data) : [],
        }
      )
      return []
    }

    console.log(
      '[getProvidersMap] Extracted providers count:',
      providersData.length
    )
    console.log('[getProvidersMap] Sample provider:', providersData[0])

    // Map ProviderMapResponse[] to FeaturedProviderResponse[]
    const providers = providersData as ProviderMapResponse[]
    const mappedProviders = providers.map(mapProviderMapToFeatured)

    console.log(
      '[getProvidersMap] Mapped providers count:',
      mappedProviders.length
    )
    console.log('[getProvidersMap] Sample mapped provider:', mappedProviders[0])

    return mappedProviders
  } catch (error: unknown) {
    console.error('Error fetching providers map:', error)
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch providers for map'
    )
  }
}

/**
 * Get nearby providers for a specific provider
 * GET /api/v1/services/providers/{providerId}/nearby
 */
export const getNearbyProviders = async (
  providerId: number,
  params?: {
    radius?: number
    sortBy?: string
  }
): Promise<ProviderMapResponse[]> => {
  try {
    // Validate providerId
    if (!providerId || isNaN(providerId) || providerId <= 0) {
      throw new Error(`Invalid providerId: ${providerId}`)
    }

    // Clean query parameters - remove undefined values
    const cleanQuery = params
      ? Object.fromEntries(
          Object.entries(params).filter(([_, value]) => value !== undefined)
        )
      : undefined

    console.log(
      '[getNearbyProviders] Calling API with providerId:',
      providerId,
      'query:',
      cleanQuery
    )

    const response = await apiClient.api.getProviderGetNearbyProviders(
      providerId,
      Object.keys(cleanQuery || {}).length > 0 ? cleanQuery : undefined
    )

    console.log('[getNearbyProviders] API response received:', response)

    const responseAny: any = response

    // Handle different response structures
    let providersData: unknown = null

    // First, check if response has a .data property (API client wrapper)
    const actualResponse = responseAny?.data || responseAny

    console.log(
      '[getNearbyProviders] Actual response after unwrapping:',
      JSON.stringify(actualResponse, null, 2)
    )

    if (actualResponse && typeof actualResponse === 'object') {
      // Check for { data: { providers: [...] } } structure
      if ('data' in actualResponse && actualResponse.data) {
        const dataObj = actualResponse.data
        if (typeof dataObj === 'object') {
          if ('providers' in dataObj && Array.isArray(dataObj.providers)) {
            providersData = dataObj.providers
          } else if (Array.isArray(dataObj)) {
            providersData = dataObj
          } else if ('data' in dataObj && Array.isArray(dataObj.data)) {
            providersData = dataObj.data
          } else if ('items' in dataObj && Array.isArray(dataObj.items)) {
            providersData = dataObj.items
          }
        }
      }
      // Check for direct { providers: [...] } in actual response
      else if (
        'providers' in actualResponse &&
        Array.isArray(actualResponse.providers)
      ) {
        providersData = actualResponse.providers
      }
      // Check if actual response is directly an array
      else if (Array.isArray(actualResponse)) {
        providersData = actualResponse
      }
    }

    // Ensure we have an array
    if (!Array.isArray(providersData)) {
      console.warn(
        '[getNearbyProviders] Providers data is not an array. Response structure:',
        {
          responseAny,
          hasData: 'data' in (responseAny || {}),
          dataType: typeof responseAny?.data,
        }
      )
      return []
    }

    console.log(
      '[getNearbyProviders] Extracted providers count:',
      providersData.length
    )

    // Return as ProviderMapResponse[]
    return providersData as ProviderMapResponse[]
  } catch (error: unknown) {
    console.error(
      '[getNearbyProviders] Error fetching nearby providers:',
      error
    )
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch nearby providers'
    )
  }
}
