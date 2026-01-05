// Provider API service functions

import { apiClient } from '@/services/api/apiClient'
import type { UpdateProviderPublicProfileSettingsRequest } from '@/../client/common/api/gen/ourbride-api'
import type {
  ApiResult,
  MediaResponse,
  ProviderResponse,
  FeaturedProviderResponse,
  BranchPortfolioResponse,
  PlaceResponse,
} from '@/types/responses'
import type { ReviewRequest } from '@/../client/common/api/gen/ourbride-api'
import { ProviderStatus } from '@/types/responses/common'
import type { ProviderLinkeeResponse } from '@/types/responses/provider-linkee-response'
import type { ProviderPublicProfileResponse } from '@/types/responses/provider-public-profile-response'
import type { ProviderPublicStoreResponse } from '@/types/responses/provider-public-store-response'
import { getToken } from '@/auth/utils/token'
import { getApiLanguage } from '@/utils/language'

/**
 * Map ProviderResponse to FeaturedProviderResponse
 */
const mapProviderToFeatured = (
  provider: ProviderResponse
): FeaturedProviderResponse => {
  // Get banner and logo images from images array or media array
  const images = provider.images || provider.media || []
  const bannerImage =
    images.find((img: MediaResponse) => img.isFeatured) || images[0]
  const logoImage =
    images.find((img: MediaResponse) => img.mediaType === 1) || images[0] // Assuming 1 is image type

  return {
    id: provider.id,
    nameEn: provider.nameEn || '',
    nameAr: provider.nameAr || '',
    descriptionEn: provider.descriptionEn || '',
    descriptionAr: provider.descriptionAr || '',
    publicLogoImageUrl:
      logoImage?.url || logoImage?.thumbnailUrl || provider.profileURL || '',
    publicBannerImageUrl:
      bannerImage?.url ||
      bannerImage?.thumbnailUrl ||
      provider.profileURL ||
      '',
    rate: provider.rate,
    totalReviews: provider.reviewCount ?? provider.reviews?.length ?? 0,
    isVerified: provider.providerStatus === ProviderStatus.Active,
    totalServices: provider.totalServicesCount ?? 0,
    totalProducts: 0, // Not available in ProviderResponse
    shortAddress: provider.shortAddress || '',
    publicProfileSlug: `/provider/${provider.id}`,
    uniqueCode: provider.slug || `provider-${provider.id}`,
    topRatedService:
      provider.topRatedServices && provider.topRatedServices.length > 0
        ? provider.topRatedServices[0]
        : null,
    topRatedServices: provider.topRatedServices || [],
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
      error instanceof Error
        ? error.message
        : 'Failed to fetch provider details'
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
      error instanceof Error
        ? error.message
        : 'Failed to toggle provider follow'
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
      error instanceof Error
        ? error.message
        : 'Failed to toggle provider favorite'
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
    const response = await apiClient.api.postProviderAddReviews(
      providerId,
      data
    )
    const responseAny: any = response

    // Handle different response structures
    if (
      responseAny?.data?.data &&
      typeof responseAny.data.data === 'object' &&
      'success' in responseAny.data.data
    ) {
      return responseAny.data.data as ApiResult<unknown>
    }
    if (
      responseAny?.data &&
      typeof responseAny.data === 'object' &&
      'success' in responseAny.data
    ) {
      return responseAny.data as ApiResult<unknown>
    }
    if (
      responseAny &&
      typeof responseAny === 'object' &&
      'success' in responseAny
    ) {
      return responseAny as ApiResult<unknown>
    }

    const defaultResult: ApiResult<unknown> = {
      data: null,
      success: false,
      statusCode: 0,
      message: '',
    }
    return defaultResult
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to submit provider review'
    )
  }
}

/**
 * Get provider public profile by ID
 * GET /api/v1/services/marketplace/providers/{providerId}
 */
export const getProviderPublicProfileById = async (
  providerId: number
): Promise<ProviderPublicProfileResponse> => {
  try {
    // Validate providerId
    if (!providerId || isNaN(providerId) || providerId <= 0) {
      throw new Error(`Invalid providerId: ${providerId}`)
    }

    const response =
      await apiClient.api.getProviderGetPublicProfileById(providerId)
    const responseAny: any = response

    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as ProviderPublicProfileResponse
    }
    if (responseAny?.data) {
      return responseAny.data as ProviderPublicProfileResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as ProviderPublicProfileResponse
    }

    throw new Error('Invalid response structure')
  } catch (error: unknown) {
    console.error('Error fetching provider public profile:', error)

    // Handle Axios errors with more detail
    const axiosError = error as {
      response?: {
        status?: number
        data?: unknown
        statusText?: string
      }
      message?: string
      code?: string
      request?: unknown
    }

    if (axiosError.response) {
      // Server responded with error status
      const status = axiosError.response.status
      const statusText = axiosError.response.statusText
      console.error(
        `API Error ${status}: ${statusText}`,
        axiosError.response.data
      )
      throw new Error(
        `Failed to fetch provider public profile: ${status} ${statusText}`
      )
    } else if (axiosError.request) {
      // Request was made but no response received (network error, timeout, etc.)
      console.error(
        'Network error - no response received:',
        axiosError.message || axiosError.code
      )
      throw new Error(
        `Network error: Unable to reach the server. ${axiosError.message || axiosError.code || 'Please check your connection and try again.'}`
      )
    } else if (error instanceof Error) {
      // Other error
      console.error('Error message:', error.message)
      throw error
    }

    throw new Error('Failed to fetch provider public profile')
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
    const response =
      await apiClient.api.getProviderGetPublicProfileSettings(providerId)
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
      error instanceof Error
        ? error.message
        : 'Failed to fetch public profile settings'
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
      error instanceof Error
        ? error.message
        : 'Failed to update public profile settings'
    )
  }
}

/**
 * Get portfolio for a provider branch
 * GET /api/v1/services/provider-branches/provider/{providerId}/branches/{branchId}/portfolio
 */
export const getProviderBranchPortfolio = async (
  providerId: number,
  branchId: number
): Promise<BranchPortfolioResponse> => {
  try {
    // Validate inputs
    if (!providerId || isNaN(providerId) || providerId <= 0) {
      throw new Error(`Invalid providerId: ${providerId}`)
    }
    if (!branchId || isNaN(branchId) || branchId <= 0) {
      throw new Error(`Invalid branchId: ${branchId}`)
    }

    const response = await apiClient.api.getProviderBranchGetPortfolio(
      providerId,
      branchId
    )
    const responseAny: any = response

    // Handle different response structures
    // Expected: { data: { about, services, portfolio, reviews, statistics }, success, ... }
    const portfolioData =
      responseAny?.data?.data ?? responseAny?.data ?? responseAny

    // Ensure we have the expected structure
    if (!portfolioData || typeof portfolioData !== 'object') {
      throw new Error('Invalid response structure')
    }

    return portfolioData as BranchPortfolioResponse
  } catch (error: unknown) {
    console.error('Error fetching provider branch portfolio:', error)
    throw error instanceof Error
      ? error
      : new Error('Failed to fetch provider branch portfolio')
  }
}

/**
 * Get portfolio for a provider team member
 * GET /api/v1/services/provider-team/{providerId}/team-members/{userId}/portfolio
 */
export const getProviderTeamMemberPortfolio = async (
  providerId: number,
  teamMemberId: string
): Promise<BranchPortfolioResponse> => {
  try {
    // Validate inputs
    if (!providerId || isNaN(providerId) || providerId <= 0) {
      throw new Error(`Invalid providerId: ${providerId}`)
    }
    if (!teamMemberId || teamMemberId.trim() === '') {
      throw new Error(`Invalid teamMemberId: ${teamMemberId}`)
    }

    const response = await apiClient.api.getProviderTeamGetTeamMemberPortfolio(
      providerId,
      teamMemberId
    )
    const responseAny: any = response

    // Handle different response structures
    // Expected: { data: { about, services, portfolio, reviews, statistics }, success, ... }
    const portfolioData =
      responseAny?.data?.data ?? responseAny?.data ?? responseAny

    // Ensure we have the expected structure
    if (!portfolioData || typeof portfolioData !== 'object') {
      throw new Error('Invalid response structure')
    }

    // Map the team member about structure to match BranchPortfolioAbout
    if (portfolioData.about) {
      const about = portfolioData.about
      // Handle both team member structure (with userId, firstName, lastName) and branch structure
      if (about.userId || about.firstName !== undefined) {
        portfolioData.about = {
          id: about.userId
            ? parseInt(about.userId.split('-')[0], 16) || 0
            : about.id || 0,
          name:
            about.fullName ||
            `${about.firstName || ''} ${about.lastName || ''}`.trim() ||
            about.name ||
            'Team Member',
          description: about.description || '',
          phoneNumber: about.phoneNumber || '',
          phoneNumber2: about.phoneNumber2 || '',
          imageUrl: about.imageUrl || '',
          address: about.address || (null as any), // Team members might not have address
          isMain: about.isMain || false,
          isActive: about.isActive !== undefined ? about.isActive : true,
        }
      }
    }

    // Ensure statistics structure matches (team members might have languages array)
    if (
      portfolioData.statistics &&
      Array.isArray(portfolioData.statistics.languages)
    ) {
      // Statistics already has the right structure, just ensure it exists
      portfolioData.statistics = {
        appointmentsCompleted:
          portfolioData.statistics.appointmentsCompleted || 0,
        clientsServed: portfolioData.statistics.clientsServed || 0,
        ...(portfolioData.statistics.languages && {
          languages: portfolioData.statistics.languages,
        }),
      } as any
    }

    return portfolioData as BranchPortfolioResponse
  } catch (error: unknown) {
    console.error('Error fetching provider team member portfolio:', error)
    throw error instanceof Error
      ? error
      : new Error('Failed to fetch provider team member portfolio')
  }
}

/**
 * Get portfolio for a provider team member by assignment ID
 * GET /api/v1/services/provider-team/{providerId}/team-members/{assignmentId}/portfolio
 */
export const getProviderTeamMemberPortfolioByAssignmentId = async (
  providerId: number,
  assignmentId: number
): Promise<MediaResponse[]> => {
  try {
    // Validate inputs
    if (!providerId || isNaN(providerId) || providerId <= 0) {
      throw new Error(`Invalid providerId: ${providerId}`)
    }
    if (!assignmentId || isNaN(assignmentId) || assignmentId <= 0) {
      throw new Error(`Invalid assignmentId: ${assignmentId}`)
    }

    const response = await apiClient.api.getProviderTeamGetTeamMemberPortfolio(
      providerId,
      assignmentId.toString()
    )
    const responseAny: any = response

    // Handle different response structures
    const portfolio =
      responseAny?.data?.data ?? responseAny?.data ?? responseAny

    return Array.isArray(portfolio) ? portfolio : []
  } catch (error: unknown) {
    console.error(
      'Error fetching provider team member portfolio by assignment ID:',
      error
    )
    throw error instanceof Error
      ? error
      : new Error(
          'Failed to fetch provider team member portfolio by assignment ID'
        )
  }
}

/**
 * Get all provider team users/staff members
 * GET /api/v1/services/provider-team/{providerId}/users
 */
export const getProviderTeamUsers = async (
  providerId: number
): Promise<any[]> => {
  try {
    // Validate inputs
    if (!providerId || isNaN(providerId) || providerId <= 0) {
      throw new Error(`Invalid providerId: ${providerId}`)
    }

    const response =
      await apiClient.api.getProviderTeamGetAllProviderUsers(providerId)
    const responseAny: any = response

    // Handle different response structures
    // Expected: ProviderUserAssignmentResponse[] or { data: ProviderUserAssignmentResponse[] }
    const users = responseAny?.data?.data ?? responseAny?.data ?? responseAny

    return Array.isArray(users) ? users : []
  } catch (error: unknown) {
    console.error('Error fetching provider team users:', error)
    throw error instanceof Error
      ? error
      : new Error('Failed to fetch provider team users')
  }
}

/**
 * Get all provider branches
 * GET /api/v1/services/provider-branch/{providerId}
 */
export const getProviderBranches = async (
  providerId: number
): Promise<PlaceResponse[]> => {
  try {
    // Validate inputs
    if (!providerId || isNaN(providerId) || providerId <= 0) {
      throw new Error(`Invalid providerId: ${providerId}`)
    }

    const response = await apiClient.api.getProviderBranchGetAll(providerId)
    const responseAny: any = response

    // Handle different response structures
    // Expected: PlaceResponse[] or { data: PlaceResponse[] }
    const branches = responseAny?.data?.data ?? responseAny?.data ?? responseAny

    return Array.isArray(branches) ? branches : []
  } catch (error: unknown) {
    console.error('Error fetching provider branches:', error)
    throw error instanceof Error
      ? error
      : new Error('Failed to fetch provider branches')
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
 */
export const filterProviders = async (
  params?: FilterProvidersParams
): Promise<FeaturedProviderResponse[]> => {
  try {
    // Build query object matching the generated API client signature
    const query = params
      ? {
          Search: params.search,
          ServiceClass: params.serviceClass,
          ServiceClasses: params.serviceClasses,
          MinRating: params.minRating,
          Page: params.page,
          PageSize: params.pageSize,
          Latitude: params.latitude,
          Longitude: params.longitude,
          Radius: params.radius,
          SortBy: params.sortBy,
          VenueType: params.venueType,
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

    const response = await apiClient.api.getProviderFilter(cleanQuery)
    const responseAny: any = response

    // Handle different response structures - API returns ProviderResponse[]
    const providersData =
      responseAny?.data?.data ?? responseAny?.data ?? responseAny

    if (!Array.isArray(providersData)) {
      console.warn('Providers data is not an array:', providersData)
      return []
    }

    // Map ProviderResponse[] to FeaturedProviderResponse[]
    const providers = providersData as ProviderResponse[]
    return providers.map(mapProviderToFeatured)
  } catch (error: unknown) {
    console.error('Error filtering providers:', error)
    throw error instanceof Error
      ? error
      : new Error('Failed to filter providers')
  }
}

/**
 * Get provider public store
 * GET /api/v1/services/marketplace/providers/{providerId}/store
 */
export const getProviderPublicStore = async (
  providerId: number,
  query?: {
    page?: number
    pageSize?: number
  }
): Promise<ProviderPublicStoreResponse> => {
  try {
    // Validate providerId
    if (!providerId || isNaN(providerId) || providerId <= 0) {
      throw new Error(`Invalid providerId: ${providerId}`)
    }

    // Clean query parameters - remove undefined values
    const cleanQuery = query
      ? Object.fromEntries(
          Object.entries(query).filter(([_, value]) => value !== undefined)
        )
      : {}

    console.log(
      '[getProviderPublicStore] Calling API with providerId:',
      providerId,
      'query:',
      cleanQuery
    )

    // Only pass query if it has values, otherwise pass undefined to use defaults
    // Note: Accept-Language header is already added by the API client interceptor
    const response = await apiClient.api.getProviderGetPublicStore(
      providerId,
      Object.keys(cleanQuery).length > 0 ? cleanQuery : undefined
    )

    console.log('[getProviderPublicStore] API response received:', response)

    const responseAny: any = response

    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as ProviderPublicStoreResponse
    }
    if (responseAny?.data) {
      return responseAny.data as ProviderPublicStoreResponse
    }
    if (
      responseAny &&
      typeof responseAny === 'object' &&
      'providerId' in responseAny
    ) {
      return responseAny as ProviderPublicStoreResponse
    }

    throw new Error('Invalid response structure')
  } catch (error: unknown) {
    console.error(
      '[getProviderPublicStore] Error fetching provider public store:',
      error
    )
    if (error instanceof Error) {
      console.error('[getProviderPublicStore] Error message:', error.message)
      console.error('[getProviderPublicStore] Error stack:', error.stack)
    }
    // Re-throw the original error to preserve status code and details
    throw error
  }
}

/**
 * Get provider Linkee-style public page
 * GET /api/v1/services/marketplace/providers/{providerId}/linkee
 */
export const getProviderLinkee = async (
  providerId: number
): Promise<ProviderLinkeeResponse> => {
  try {
    const response = await apiClient.api.getProviderGetPublicLinkee(providerId)
    const responseAny: any = response

    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as ProviderLinkeeResponse
    }
    if (responseAny?.data) {
      return responseAny.data as ProviderLinkeeResponse
    }
    if (
      responseAny &&
      typeof responseAny === 'object' &&
      'providerId' in responseAny
    ) {
      return responseAny as ProviderLinkeeResponse
    }

    throw new Error('Invalid response structure')
  } catch (error: unknown) {
    console.error('Error fetching provider linkee:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch provider linkee'
    )
  }
}
