// Service API service functions

import { apiClient } from '@/services/api/apiClient'
import type { ApiResult } from '@/types/responses'
import type { ReviewRequest } from '@/../client/common/api/gen/ourbride-api'
import type { ServiceResponse } from '@/types/responses/service-response'

/**
 * Toggle favorite for a service
 * POST /api/v1/services/toggle-favorite/{serviceId}
 */
export const toggleServiceFavorite = async (
  serviceId: number
): Promise<boolean> => {
  try {
    const response = await apiClient.api.postServicesToggleFavorite(serviceId)
    const responseData = response as unknown as
      | { data?: { data?: boolean } | { success?: boolean } | boolean }
      | { success?: boolean }
      | boolean
    if (typeof responseData === 'boolean') {
      return responseData
    }
    if (responseData && typeof responseData === 'object') {
      if ('data' in responseData && responseData.data) {
        if (typeof responseData.data === 'boolean') {
          return responseData.data
        }
        if (
          typeof responseData.data === 'object' &&
          'data' in responseData.data
        ) {
          return responseData.data.data ?? true
        }
        if (
          typeof responseData.data === 'object' &&
          'success' in responseData.data
        ) {
          return responseData.data.success ?? true
        }
      }
      if ('success' in responseData) {
        return responseData.success ?? true
      }
    }
    return true
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to toggle service favorite'
    )
  }
}

/**
 * Toggle wishlist for a service
 * POST /api/v1/services/toggle-wishlist/{serviceId}
 */
export const toggleServiceWishlist = async (
  serviceId: number
): Promise<boolean> => {
  try {
    const response = await apiClient.api.postServicesToggleWishlist(serviceId)
    const responseData = response as unknown as
      | { data?: { data?: boolean } | { success?: boolean } | boolean }
      | { success?: boolean }
      | boolean
    if (typeof responseData === 'boolean') {
      return responseData
    }
    if (responseData && typeof responseData === 'object') {
      if ('data' in responseData && responseData.data) {
        if (typeof responseData.data === 'boolean') {
          return responseData.data
        }
        if (
          typeof responseData.data === 'object' &&
          'data' in responseData.data
        ) {
          return responseData.data.data ?? true
        }
        if (
          typeof responseData.data === 'object' &&
          'success' in responseData.data
        ) {
          return responseData.data.success ?? true
        }
      }
      if ('success' in responseData) {
        return responseData.success ?? true
      }
    }
    return true
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to toggle service wishlist'
    )
  }
}

/**
 * Submit a review for a service
 * POST /api/v1/services/review/{serviceId}
 */
export const submitServiceReview = async (
  serviceId: number,
  data: ReviewRequest
): Promise<ApiResult<unknown>> => {
  try {
    const response = await apiClient.api.postServicesAddReviews(serviceId, data)
    const responseData = response as unknown as
      | { data?: { data?: ApiResult<unknown> } | ApiResult<unknown> }
      | ApiResult<unknown>
    if (responseData && typeof responseData === 'object') {
      if ('data' in responseData && responseData.data) {
        if (
          typeof responseData.data === 'object' &&
          'success' in responseData.data
        ) {
          return responseData.data as ApiResult<unknown>
        }
        if (
          typeof responseData.data === 'object' &&
          'data' in responseData.data &&
          responseData.data.data
        ) {
          return responseData.data.data as ApiResult<unknown>
        }
      }
      if ('success' in responseData && 'statusCode' in responseData) {
        return responseData as ApiResult<unknown>
      }
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
      error instanceof Error ? error.message : 'Failed to submit service review'
    )
  }
}

/**
 * Get all reviews for a service
 * GET /api/v1/services/{id}/reviews
 */
export const getServiceReviews = async (
  serviceId: number,
  query?: {
    Rating?: number
    SortBy?: string
    Page?: number
    PageSize?: number
  }
): Promise<ApiResult<unknown>> => {
  try {
    const response = await apiClient.api.getServicesGetReviews(serviceId, query)
    const responseData = response as unknown as
      | { data?: { data?: ApiResult<unknown> } | ApiResult<unknown> }
      | ApiResult<unknown>
    if (responseData && typeof responseData === 'object') {
      if ('data' in responseData && responseData.data) {
        if (
          typeof responseData.data === 'object' &&
          'success' in responseData.data
        ) {
          return responseData.data as ApiResult<unknown>
        }
        if (
          typeof responseData.data === 'object' &&
          'data' in responseData.data &&
          responseData.data.data
        ) {
          return responseData.data.data as ApiResult<unknown>
        }
      }
      if ('success' in responseData && 'statusCode' in responseData) {
        return responseData as ApiResult<unknown>
      }
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
      error instanceof Error ? error.message : 'Failed to fetch service reviews'
    )
  }
}

/**
 * Get review summary for a service
 * GET /api/v1/services/{id}/reviews/summary
 */
export const getServiceReviewSummary = async (
  serviceId: number
): Promise<ApiResult<unknown>> => {
  try {
    const response = await apiClient.api.getServicesReviewSummary(serviceId)
    const responseData = response as unknown as
      | { data?: { data?: ApiResult<unknown> } | ApiResult<unknown> }
      | ApiResult<unknown>
    if (responseData && typeof responseData === 'object') {
      if ('data' in responseData && responseData.data) {
        if (
          typeof responseData.data === 'object' &&
          'success' in responseData.data
        ) {
          return responseData.data as ApiResult<unknown>
        }
        if (
          typeof responseData.data === 'object' &&
          'data' in responseData.data &&
          responseData.data.data
        ) {
          return responseData.data.data as ApiResult<unknown>
        }
      }
      if ('success' in responseData && 'statusCode' in responseData) {
        return responseData as ApiResult<unknown>
      }
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
        : 'Failed to fetch service review summary'
    )
  }
}

/**
 * Get all services preparations (categories with services)
 * GET /api/v1/services/preparations
 */
export const getServicesPreparations = async (): Promise<unknown> => {
  try {
    const response = await apiClient.api.getPreparationsGetAll()
    const responseData = response as { data?: unknown }
    return responseData.data ?? response
  } catch (error) {
    console.error('Error fetching services preparations:', error)
    throw error
  }
}

/**
 * Get services by preparation ID
 * GET /api/v1/services/preparation/{preparationId}/services
 */
export const getServicesByPreparationId = async (
  preparationId: number
): Promise<unknown> => {
  try {
    const response =
      await apiClient.api.getServicesGetByPreparationId(preparationId)
    const responseData = response as { data?: unknown }
    return responseData.data ?? response
  } catch (error) {
    console.error('Error fetching services by preparation ID:', error)
    throw error
  }
}

/**
 * Get services by provider ID
 * GET /api/v1/services/provider/{providerId}/services
 */
export const getServicesByProviderId = async (
  providerId: number
): Promise<ServiceResponse[]> => {
  try {
    // Validate providerId
    if (!providerId || isNaN(providerId) || providerId <= 0) {
      throw new Error(`Invalid providerId: ${providerId}`)
    }

    const response = await apiClient.api.getServicesGeByProviderId(providerId)
    const responseAny: any = response

    // Handle different response structures
    // Expected: ServiceResponse[] or { data: ServiceResponse[] } or { data: { data: ServiceResponse[] } }
    let services = responseAny?.data?.data ?? responseAny?.data ?? responseAny

    // Ensure it's an array
    if (!Array.isArray(services)) {
      services = []
    }

    return services as ServiceResponse[]
  } catch (error) {
    console.error('Error fetching services by provider ID:', error)
    throw error instanceof Error
      ? error
      : new Error('Failed to fetch services by provider ID')
  }
}

/**
 * Get paginated services by preparation ID
 * GET /api/v1/services/preparation/{preparationId}/paged
 */
export const getServicesByPreparationIdPaged = async (
  preparationId: number,
  query?: {
    page?: number
    pageSize?: number
    sortBy?: string
    search?: string
  }
): Promise<unknown> => {
  try {
    const response = await apiClient.api.getServicesGetByPreparationIdPaged(
      preparationId,
      query
    )
    const responseData = response as { data?: unknown }
    return responseData.data ?? response
  } catch (error) {
    console.error('Error fetching paginated services by preparation ID:', error)
    throw error
  }
}

/**
 * Get service by ID
 * GET /api/v1/services/{id}
 */
export const getServiceById = async (
  serviceId: number
): Promise<ServiceResponse | null> => {
  try {
    const response = await apiClient.api.getServicesGet(serviceId)
    const responseData = response as unknown as
      | { data?: { data?: ServiceResponse } | ServiceResponse }
      | ServiceResponse

    // Handle different response structures
    if (
      responseData &&
      typeof responseData === 'object' &&
      'data' in responseData &&
      responseData.data
    ) {
      const data = responseData.data
      if (typeof data === 'object' && 'data' in data && data.data) {
        return data.data
      }
      if (typeof data === 'object' && 'id' in data) {
        return data as ServiceResponse
      }
    }
    if (
      responseData &&
      typeof responseData === 'object' &&
      'id' in responseData
    ) {
      return responseData as ServiceResponse
    }

    return null
  } catch (error) {
    console.error('Error fetching service by ID:', error)
    throw error
  }
}

/**
 * Search and filter services
 * GET /api/v1/services
 */
export const searchServices = async (query?: {
  Search?: string
  ServiceClass?: number
  ServiceType?: number
  MinPrice?: number
  MaxPrice?: number
  MinRating?: number
  IsOurBrideService?: boolean
  HasPackages?: boolean
  HasInstallment?: boolean
  Page?: number
  PageSize?: number
}): Promise<unknown> => {
  try {
    const response = await apiClient.api.getServicesSearch(query)
    const responseData = response as { data?: unknown }
    return responseData.data ?? response
  } catch (error) {
    console.error('Error searching services:', error)
    throw error
  }
}

/**
 * Get all services with pagination
 * GET /api/v1/services/all
 */
export const getAllServices = async (query?: {
  page?: number
  pageSize?: number
}): Promise<unknown> => {
  try {
    const response = await apiClient.api.getServicesGetAll(query)
    const responseData = response as { data?: unknown }
    return responseData.data ?? response
  } catch (error) {
    console.error('Error fetching all services:', error)
    throw error
  }
}

/**
 * Search services by term
 * GET /api/v1/services/search
 */
export const searchServicesByTerm = async (query?: {
  term?: string
  page?: number
  pageSize?: number
}): Promise<unknown> => {
  try {
    const response = await apiClient.api.getServicesSearchByTerm(query)
    const responseData = response as { data?: unknown }
    return responseData.data ?? response
  } catch (error) {
    console.error('Error searching services by term:', error)
    throw error
  }
}

/**
 * Get service packages
 * GET /api/v1/services/{id}/packages
 */
export const getServicePackages = async (
  serviceId: number
): Promise<unknown> => {
  try {
    const response = await apiClient.api.getServicesPackages(serviceId)
    const responseData = response as { data?: unknown }
    return responseData.data ?? response
  } catch (error) {
    console.error('Error fetching service packages:', error)
    throw error
  }
}
